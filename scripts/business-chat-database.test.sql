-- Run ONLY on a disposable local database. Bootstraps minimal shared-app fixtures.
\set ON_ERROR_STOP on
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
CREATE TABLE public.test_moderators(id uuid PRIMARY KEY);
CREATE FUNCTION public.is_moderator() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$ SELECT EXISTS(SELECT 1 FROM public.test_moderators WHERE id=auth.uid()) $$;
GRANT USAGE ON SCHEMA auth,public TO authenticated,anon;
GRANT EXECUTE ON FUNCTION auth.uid(),public.is_moderator() TO authenticated,anon;
INSERT INTO auth.users VALUES('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002'),('00000000-0000-0000-0000-000000000003');
INSERT INTO public.test_moderators VALUES('00000000-0000-0000-0000-000000000003');
CREATE PUBLICATION supabase_realtime;
\ir ../supabase/migrations/202610030001_business_sales_chat.sql

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT public.save_business_conversation('10000000-0000-0000-0000-000000000001','Launch','Private draft');
DO $$ BEGIN
  IF jsonb_array_length(public.list_business_conversations())<>1 THEN RAISE EXCEPTION 'owner list failed'; END IF;
  BEGIN PERFORM public.list_business_conversations(true); RAISE EXCEPTION 'unauthorized staff list allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'team_required' THEN RAISE; END IF; END;
  BEGIN INSERT INTO public.business_conversations(id,owner_id,title) VALUES(gen_random_uuid(),auth.uid(),'Bypass'); RAISE EXCEPTION 'direct write allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;

SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
DO $$ BEGIN
  IF jsonb_array_length(public.list_business_conversations())<>0 OR EXISTS(SELECT 1 FROM public.business_conversations) THEN RAISE EXCEPTION 'cross-account leak'; END IF;
  BEGIN PERFORM public.save_business_conversation('10000000-0000-0000-0000-000000000001','Hijack',''); RAISE EXCEPTION 'hijack allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'conversation_not_found' THEN RAISE; END IF; END;
  BEGIN PERFORM public.send_business_conversation_message('10000000-0000-0000-0000-000000000001',gen_random_uuid(),'Hijack'); RAISE EXCEPTION 'send bypass allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'conversation_not_found' THEN RAISE; END IF; END;
END $$;

SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
DO $$ BEGIN
  IF jsonb_array_length(public.list_business_conversations(true))<>0 THEN RAISE EXCEPTION 'private draft visible to staff'; END IF;
  BEGIN PERFORM public.business_conversation_messages('10000000-0000-0000-0000-000000000001'); RAISE EXCEPTION 'private draft thread visible'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'conversation_not_found' THEN RAISE; END IF; END;
END $$;

SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
SELECT public.send_business_conversation_message('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Launch in November');
SELECT public.send_business_conversation_message('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Launch in November');
SELECT public.save_business_conversation('10000000-0000-0000-0000-000000000001','Launch','Private follow-up');
DO $$ BEGIN
  IF jsonb_array_length(public.business_conversation_messages('10000000-0000-0000-0000-000000000001'))<>1 THEN RAISE EXCEPTION 'duplicate message'; END IF;
  BEGIN PERFORM public.send_business_conversation_message('10000000-0000-0000-0000-000000000001',gen_random_uuid(),' '); RAISE EXCEPTION 'empty message allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'invalid_message' THEN RAISE; END IF; END;
  BEGIN PERFORM public.send_business_conversation_message('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Changed'); RAISE EXCEPTION 'conflicting retry allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'message_conflict' THEN RAISE; END IF; END;
END $$;

SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
DO $$ BEGIN
  IF jsonb_array_length(public.list_business_conversations(true))<>1 THEN RAISE EXCEPTION 'sales queue missing'; END IF;
  IF public.list_business_conversations(true)->0->>'draft'<>'' THEN RAISE EXCEPTION 'private draft leaked through RPC'; END IF;
  IF EXISTS(SELECT 1 FROM public.business_conversation_drafts) THEN RAISE EXCEPTION 'private draft leaked through RLS'; END IF;
END $$;
SELECT public.send_business_conversation_message('10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Let us discuss your audience.');

SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
DO $$ BEGIN
  IF public.business_conversation_messages('10000000-0000-0000-0000-000000000001')->1->>'sender'<>'sales' THEN RAISE EXCEPTION 'sales attribution failed'; END IF;
  IF public.list_business_conversations()->0->>'draft'<>'Private follow-up' THEN RAISE EXCEPTION 'sales reply cleared owner draft'; END IF;
END $$;
RESET ROLE;
DELETE FROM auth.users WHERE id='00000000-0000-0000-0000-000000000001';
DO $$ BEGIN IF EXISTS(SELECT 1 FROM public.business_conversation_messages) THEN RAISE EXCEPTION 'account removal did not cascade'; END IF; END $$;
SELECT 'Business chat ownership, private drafts, team replies, validation, retries and deletion passed' AS result;
