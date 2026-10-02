-- Run after both capital/contribution SQL suites in disposable nf_capital_test DB.
\set ON_ERROR_STOP on
DO $$ BEGIN IF current_database() !~ '^nf_capital_test' THEN RAISE EXCEPTION 'Disposable nf_capital_test database required'; END IF; END $$;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
\ir ../../newFrequency/migration_v99_website_account_cleanup.sql

INSERT INTO public.capital_update_signups(user_id,consent_version)
  VALUES('10000000-0000-0000-0000-000000000001','capital-updates-v1');
INSERT INTO public.capital_interest_reviewers(user_id)
  VALUES('10000000-0000-0000-0000-000000000001');
SELECT set_config('test.purge_interest_id',(SELECT id::text FROM public.capital_interests WHERE user_id='10000000-0000-0000-0000-000000000001'),false);
SELECT public.test_assert((SELECT length(full_name)>0 AND length(thesis)>0 FROM public.capital_interests WHERE id=current_setting('test.purge_interest_id')::uuid),'fixture contains personal introduction');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interest_history WHERE interest_id=current_setting('test.purge_interest_id')::uuid)>0,'fixture contains conversation history');
SELECT public.test_assert((SELECT count(*) FROM public.project_contributions WHERE user_id='10000000-0000-0000-0000-000000000001' AND status='funded')=1,'fixture contains verified contribution');
SELECT set_config('test.ledger_count',(SELECT count(*)::text FROM public.project_contribution_ledger),false);
SELECT set_config('test.ledger_total',(SELECT sum(amount_minor)::text FROM public.project_contribution_ledger),false);
SELECT set_config('test.refund_count',(SELECT count(*)::text FROM public.project_contribution_refund_requests),false);

-- This is the existing app purge boundary. Do not modify purge_account itself.
UPDATE public.users SET deleted_at=now() WHERE id='10000000-0000-0000-0000-000000000001';
SELECT public.test_assert((SELECT count(*) FROM public.capital_interests WHERE user_id='10000000-0000-0000-0000-000000000001')=0,'purge removes website contact and thesis');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interest_history WHERE interest_id=current_setting('test.purge_interest_id')::uuid)=0,'purge cascades personal conversation history');
SELECT public.test_assert((SELECT count(*) FROM public.capital_update_signups WHERE user_id='10000000-0000-0000-0000-000000000001')=0,'purge removes company updates consent');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interest_reviewers WHERE user_id='10000000-0000-0000-0000-000000000001')=0,'purge removes capital operator grant');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger)=current_setting('test.ledger_count')::bigint,'purge preserves financial ledger entries');
SELECT public.test_assert((SELECT sum(amount_minor) FROM public.project_contribution_ledger)=current_setting('test.ledger_total')::bigint,'purge does not refund or alter project funds');
SELECT public.test_assert((SELECT count(*) FROM public.project_contributions WHERE user_id='10000000-0000-0000-0000-000000000001' AND status='funded')=1,'purge preserves verified contribution');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_refund_requests)=current_setting('test.refund_count')::bigint,'purge preserves existing refund audit');
SELECT public.test_assert((SELECT count(*) FROM public.capital_interests WHERE user_id='10000000-0000-0000-0000-000000000003')=1,'other account introduction is unaffected');
SET ROLE authenticated;
SELECT public.test_raises('SELECT public.cleanup_website_account_data()','permission denied');
RESET ROLE;
SELECT 'Website account purge privacy and financial retention checks passed.' AS result;
