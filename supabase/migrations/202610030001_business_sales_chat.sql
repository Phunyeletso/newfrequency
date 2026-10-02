-- Run in the shared app Supabase project. Independent of Mission funding migrations.
BEGIN;
CREATE TABLE IF NOT EXISTS public.business_conversations (
  id uuid PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New campaign' CHECK (length(title) BETWEEN 1 AND 140),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft','open')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_conversations_owner ON public.business_conversations(owner_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS public.business_conversation_drafts (
  conversation_id uuid PRIMARY KEY REFERENCES public.business_conversations(id) ON DELETE CASCADE,
  body text NOT NULL DEFAULT '' CHECK(length(body)<=6000)
);
CREATE TABLE IF NOT EXISTS public.business_conversation_messages (
  id uuid PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.business_conversations(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender text NOT NULL CHECK(sender IN ('business','sales')),
  body text NOT NULL CHECK(length(btrim(body)) BETWEEN 1 AND 6000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS business_messages_thread ON public.business_conversation_messages(conversation_id,created_at,id);
ALTER TABLE public.business_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_conversation_drafts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.business_conversations, public.business_conversation_messages, public.business_conversation_drafts FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.business_conversations, public.business_conversation_messages, public.business_conversation_drafts TO authenticated;
DROP POLICY IF EXISTS business_draft_read ON public.business_conversation_drafts;
CREATE POLICY business_draft_read ON public.business_conversation_drafts FOR SELECT TO authenticated
  USING (EXISTS(SELECT 1 FROM public.business_conversations c WHERE c.id=conversation_id AND c.owner_id=auth.uid()));
-- Only RPCs can write. Ownership and sender roles are always derived server-side.
DROP POLICY IF EXISTS business_chat_read ON public.business_conversations;
CREATE POLICY business_chat_read ON public.business_conversations FOR SELECT TO authenticated
  USING (owner_id=auth.uid() OR (state='open' AND public.is_moderator()));
DROP POLICY IF EXISTS business_message_read ON public.business_conversation_messages;
CREATE POLICY business_message_read ON public.business_conversation_messages FOR SELECT TO authenticated
  USING (EXISTS(SELECT 1 FROM public.business_conversations c WHERE c.id=conversation_id
    AND (c.owner_id=auth.uid() OR (c.state='open' AND public.is_moderator()))));

CREATE OR REPLACE FUNCTION public.list_business_conversations(p_team boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  IF p_team AND NOT public.is_moderator() THEN RAISE EXCEPTION 'team_required'; END IF;
  RETURN COALESCE((SELECT jsonb_agg(to_jsonb(r) ORDER BY r.updated_at DESC) FROM (
    SELECT c.id,c.title,c.state,c.created_at,c.updated_at,
      CASE WHEN c.owner_id=auth.uid() AND NOT p_team THEN COALESCE((SELECT body FROM public.business_conversation_drafts WHERE conversation_id=c.id),'') ELSE '' END AS draft,
      (SELECT left(m.body,100) FROM public.business_conversation_messages m
        WHERE m.conversation_id=c.id ORDER BY m.created_at DESC,m.id DESC LIMIT 1) AS preview
    FROM public.business_conversations c
    WHERE CASE WHEN p_team THEN c.state='open' ELSE c.owner_id=auth.uid() END
    ORDER BY c.updated_at DESC LIMIT 200
  ) r),'[]'::jsonb);
END; $$;

CREATE OR REPLACE FUNCTION public.business_conversation_messages(p_conversation_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public,pg_temp AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS(SELECT 1 FROM public.business_conversations c WHERE c.id=p_conversation_id
    AND (c.owner_id=auth.uid() OR (c.state='open' AND public.is_moderator()))) THEN RAISE EXCEPTION 'conversation_not_found'; END IF;
  RETURN COALESCE((SELECT jsonb_agg(to_jsonb(m) ORDER BY m.created_at,m.id) FROM public.business_conversation_messages m
    WHERE m.conversation_id=p_conversation_id),'[]'::jsonb);
END; $$;

CREATE OR REPLACE FUNCTION public.save_business_conversation(p_id uuid,p_title text,p_draft text DEFAULT '')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE c public.business_conversations;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  IF length(btrim(p_title)) NOT BETWEEN 1 AND 140 OR p_title IS NULL OR p_draft IS NULL OR length(p_draft)>6000 THEN RAISE EXCEPTION 'invalid_draft'; END IF;
  INSERT INTO public.business_conversations(id,owner_id,title) VALUES(p_id,auth.uid(),btrim(p_title))
  ON CONFLICT(id) DO UPDATE SET title=EXCLUDED.title,updated_at=now()
    WHERE business_conversations.owner_id=auth.uid()
  RETURNING * INTO c;
  IF c.id IS NULL THEN RAISE EXCEPTION 'conversation_not_found'; END IF;
  INSERT INTO public.business_conversation_drafts(conversation_id,body) VALUES(c.id,p_draft)
    ON CONFLICT(conversation_id) DO UPDATE SET body=EXCLUDED.body;
  RETURN to_jsonb(c)||jsonb_build_object('draft',p_draft);
END; $$;

CREATE OR REPLACE FUNCTION public.send_business_conversation_message(p_conversation_id uuid,p_message_id uuid,p_body text)
RETURNS public.business_conversation_messages LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE c public.business_conversations; m public.business_conversation_messages; role_name text;
BEGIN
  SELECT * INTO c FROM public.business_conversations WHERE id=p_conversation_id FOR UPDATE;
  IF auth.uid() IS NULL OR c.id IS NULL THEN RAISE EXCEPTION 'conversation_not_found'; END IF;
  IF c.owner_id=auth.uid() THEN role_name:='business';
  ELSIF c.state='open' AND public.is_moderator() THEN role_name:='sales';
  ELSE RAISE EXCEPTION 'conversation_not_found'; END IF;
  IF p_body IS NULL OR length(btrim(p_body)) NOT BETWEEN 1 AND 6000 THEN RAISE EXCEPTION 'invalid_message'; END IF;
  -- Retrying an uncertain request uses the same message id and cannot duplicate it.
  SELECT * INTO m FROM public.business_conversation_messages WHERE id=p_message_id;
  IF FOUND THEN
    IF m.conversation_id<>c.id OR m.author_id IS DISTINCT FROM auth.uid() OR m.body<>btrim(p_body) THEN RAISE EXCEPTION 'message_conflict'; END IF;
    RETURN m;
  END IF;
  INSERT INTO public.business_conversation_messages(id,conversation_id,author_id,sender,body)
    VALUES(p_message_id,c.id,auth.uid(),role_name,btrim(p_body)) RETURNING * INTO m;
  UPDATE public.business_conversations SET state='open',updated_at=now(),
    title=CASE WHEN title='New campaign' AND role_name='business' THEN left(btrim(p_body),80) ELSE title END WHERE id=c.id;
  IF role_name='business' THEN DELETE FROM public.business_conversation_drafts WHERE conversation_id=c.id; END IF;
  RETURN m;
END; $$;
REVOKE ALL ON FUNCTION public.list_business_conversations(boolean),public.business_conversation_messages(uuid),
  public.save_business_conversation(uuid,text,text),public.send_business_conversation_message(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.list_business_conversations(boolean),public.business_conversation_messages(uuid),
  public.save_business_conversation(uuid,text,text),public.send_business_conversation_message(uuid,uuid,text) TO authenticated;
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM pg_publication WHERE pubname='supabase_realtime') THEN
    IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='business_conversations') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.business_conversations;
    END IF;
    IF NOT EXISTS(SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='business_conversation_messages') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.business_conversation_messages;
    END IF;
  END IF;
END $$;
NOTIFY pgrst, 'reload schema';
COMMIT;
