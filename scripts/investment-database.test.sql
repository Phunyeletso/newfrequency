-- Run only in a disposable local database named nf_capital_test*.
\set ON_ERROR_STOP on
DO $$ BEGIN
  IF current_database() !~ '^nf_capital_test' THEN RAISE EXCEPTION 'Disposable nf_capital_test database required'; END IF;
END $$;
CREATE SCHEMA auth;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF; END $$;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF; END $$;
CREATE TABLE auth.users(id uuid PRIMARY KEY,email text);
CREATE TABLE public.users(id uuid PRIMARY KEY,is_moderator boolean NOT NULL DEFAULT false,deleted_at timestamptz,deletion_requested_at timestamptz);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub',true),'')::uuid;
$$;
GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
CREATE TABLE public.capital_update_signups(user_id uuid PRIMARY KEY REFERENCES public.users(id),consent_version text,consented_at timestamptz DEFAULT now());
INSERT INTO auth.users VALUES
  ('10000000-0000-0000-0000-000000000001','one@example.test'),
  ('10000000-0000-0000-0000-000000000002','two@example.test'),
  ('10000000-0000-0000-0000-000000000003','reviewer@example.test');
INSERT INTO public.users(id) SELECT id FROM auth.users;
\ir ../../newFrequency/migration_v95_capital_interest_workspace.sql

CREATE FUNCTION public.test_assert(condition boolean,description text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN IF condition IS DISTINCT FROM true THEN RAISE EXCEPTION 'FAILED: %',description; END IF; END $$;
CREATE FUNCTION public.test_raises(statement text,expected text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE statement;
  EXCEPTION WHEN OTHERS THEN
    IF position(expected IN SQLERRM)>0 THEN RETURN; END IF;
    RAISE EXCEPTION 'Wrong failure: %, wanted %',SQLERRM,expected;
  END;
  RAISE EXCEPTION 'Expected failure: %',expected;
END $$;

SET ROLE anon;
SELECT public.test_raises('SELECT public.capital_interest_workspace()','permission denied');
SELECT public.test_raises('SELECT * FROM public.capital_interests','permission denied');
RESET ROLE;

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',false);
SELECT public.test_assert((public.capital_interest_workspace()->'interest')='null'::jsonb,'empty workspace');
SELECT public.test_assert((public.save_capital_interest('{}',0,false,NULL)).version=1,'save empty draft');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interests)=1,'owner reads draft');
SELECT public.test_raises('UPDATE public.capital_interests SET state=''conversation''','permission denied');
SELECT public.test_raises('INSERT INTO public.capital_interest_reviewers(user_id) VALUES(auth.uid())','permission denied');
SELECT public.test_raises($case$SELECT public.save_capital_interest('{"amount":"-1"}',1,false,NULL)$case$,'invalid_amount');
SELECT public.test_raises($case$SELECT public.save_capital_interest('{"amount":"10.999"}',1,false,NULL)$case$,'invalid_amount');
SELECT public.test_raises($case$SELECT public.save_capital_interest('{"amount":"100","full_name":"Person One","thesis":"A clear creator investment introduction."}',1,true,NULL)$case$,'consent_required');
SELECT public.test_assert((public.save_capital_interest('{"amount":"50000.25","full_name":"Person One","thesis":"A clear creator investment introduction.","updates_opt_in":true}',1,true,'capital-conversation-v1')).state='submitted','submit introduction');
SELECT public.test_raises($case$SELECT public.save_capital_interest('{}',1,false,NULL)$case$,'version_conflict');
SELECT public.test_raises($case$SELECT public.save_capital_interest('{}',2,false,NULL)$case$,'interest_not_editable');
SELECT public.test_assert(jsonb_array_length(public.capital_interest_workspace()->'history')=1,'submission history');
SELECT set_config('test.interest_id',(SELECT id::text FROM public.capital_interests),false);

SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',false);
SELECT public.test_assert((SELECT count(*) FROM public.capital_interests)=0,'other account cannot read');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interest_history)=0,'other account cannot read history');
SELECT public.test_assert((public.capital_interest_workspace()->'interest')='null'::jsonb,'other account has own workspace');
SELECT public.test_raises('SELECT public.capital_interest_review_queue()','capital_review_forbidden');
SELECT public.test_raises('SELECT public.withdraw_capital_interest(2)','interest_not_found');
RESET ROLE;
INSERT INTO public.capital_interest_reviewers(user_id) VALUES('10000000-0000-0000-0000-000000000003');

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',false);
SELECT public.test_assert(public.can_review_capital_interest(),'assigned reviewer access');
SELECT public.test_assert(jsonb_array_length(public.capital_interest_review_queue())=1,'review queue sees submissions');
SELECT public.test_raises('SELECT public.review_capital_interest(current_setting(''test.interest_id'')::uuid,2,''closed'','''')','review_note_required');
SELECT public.test_assert((public.review_capital_interest(current_setting('test.interest_id')::uuid,2,'needs_information','Please tell us more about your experience.')).version=3,'review updates version');
SELECT public.test_raises('SELECT public.review_capital_interest(current_setting(''test.interest_id'')::uuid,2,''under_review'','''')','version_conflict');

SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',false);
SELECT public.test_assert(jsonb_array_length(public.capital_interest_workspace()->'history')=2,'applicant sees reviewer reply');
SELECT public.test_assert((public.save_capital_interest('{"amount":"50000.25","full_name":"Person One","thesis":"Here is more context about my creator experience.","updates_opt_in":true}',3,true,'capital-conversation-v1')).state='submitted','applicant resubmits requested information');
SELECT public.test_assert((public.withdraw_capital_interest(4)).state='withdrawn','applicant withdraws');
RESET ROLE;
SELECT public.test_assert((SELECT count(*) FROM public.capital_update_signups)=0,'withdrawal removes updates consent');
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',false);
SELECT public.test_assert(jsonb_array_length(public.capital_interest_review_queue())=0,'withdrawn introduction leaves queue');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interests)=0,'reviewer cannot read withdrawn introduction');
SELECT public.test_raises('SELECT public.review_capital_interest(current_setting(''test.interest_id'')::uuid,5,''conversation'','''')','interest_not_reviewable');
SELECT public.test_assert((public.save_capital_interest('{"amount":"100","full_name":"Reviewer","thesis":"Reviewer personal investment introduction."}',0,true,'capital-conversation-v1')).state='submitted','reviewer personal request');
SELECT public.test_raises('SELECT public.review_capital_interest((SELECT id FROM public.capital_interests WHERE user_id=auth.uid()),1,''conversation'','''')','capital_review_forbidden');
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',false);
SELECT public.save_capital_interest('{"amount":"100","full_name":"Applicant Two","thesis":"Another private introduction for permission checks."}',0,true,'capital-conversation-v1');
SELECT set_config('test.inactive_private_interest_id',(SELECT id::text FROM public.capital_interests WHERE user_id=auth.uid()),false);
RESET ROLE;
CREATE FUNCTION public.test_inactive_capital_reviewer(p_flag text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF p_flag NOT IN ('deleted_at','deletion_requested_at') THEN RAISE EXCEPTION 'invalid_test_flag'; END IF;
  EXECUTE format('UPDATE public.users SET %I=now() WHERE id=%L::uuid',p_flag,'10000000-0000-0000-0000-000000000003');
  PERFORM set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',false);
  SET LOCAL ROLE authenticated;
  PERFORM public.test_assert(NOT public.can_review_capital_interest(),'inactive reviewer permission denied: '||p_flag);
  PERFORM public.test_raises('SELECT public.capital_interest_review_queue()','capital_review_forbidden');
  PERFORM public.test_raises('SELECT public.review_capital_interest(current_setting(''test.inactive_private_interest_id'')::uuid,1,''conversation'','''')','capital_review_forbidden');
  PERFORM public.test_assert((SELECT count(*) FROM public.capital_interests WHERE user_id<>auth.uid())=0,'inactive reviewer cannot read another introduction');
  PERFORM public.test_assert((SELECT count(*) FROM public.capital_interest_history WHERE interest_id=current_setting('test.inactive_private_interest_id')::uuid)=0,'inactive reviewer cannot read another conversation history');
  RESET ROLE;
  EXECUTE format('UPDATE public.users SET %I=NULL WHERE id=%L::uuid',p_flag,'10000000-0000-0000-0000-000000000003');
  PERFORM public.test_assert((SELECT enabled FROM public.capital_interest_reviewers WHERE user_id='10000000-0000-0000-0000-000000000003'),'reviewer role stays present during inactive test');
END;
$$;
SELECT public.test_inactive_capital_reviewer('deletion_requested_at');
SELECT public.test_inactive_capital_reviewer('deleted_at');
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',false);
SELECT public.test_assert(public.can_review_capital_interest(),'active retained reviewer permission restored');
SELECT public.test_assert(jsonb_array_length(public.capital_interest_review_queue())=1,'active reviewer sees applicant queue');
RESET ROLE;
SELECT 'Capital SQL authorization, state, consent and concurrency checks passed.' AS result;
