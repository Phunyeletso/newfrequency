-- Run after investment-database.test.sql in the same disposable nf_capital_test DB.
\set ON_ERROR_STOP on
DO $$ BEGIN IF current_database() !~ '^nf_capital_test' THEN RAISE EXCEPTION 'Disposable nf_capital_test database required'; END IF; END $$;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_moderator boolean NOT NULL DEFAULT false;
CREATE FUNCTION public.is_moderator() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT COALESCE((SELECT is_moderator FROM public.users WHERE id=auth.uid() AND deleted_at IS NULL AND deletion_requested_at IS NULL),false);
$$;
\ir ../../newFrequency/migration_v97_project_contributions.sql

SET ROLE anon;
SELECT public.test_assert(jsonb_array_length(public.funding_project_catalog())=1,'known direct support project is public');
SELECT public.test_assert((public.funding_project_catalog()->0->>'goal_minor') IS NULL,'no invented funding goal');
SELECT public.test_raises('SELECT * FROM public.project_contributions','permission denied');
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',false);
SELECT public.test_raises('SELECT public.save_funding_project(NULL,''{}'')','project_admin_forbidden');
SELECT public.test_raises('INSERT INTO public.project_contribution_ledger(contribution_id,project_id,entry_type,amount_minor,currency) VALUES(gen_random_uuid(),gen_random_uuid(),''contribution_received'',100,''ZAR'')','permission denied');
SELECT public.test_raises($case$SELECT public.prepare_project_contribution('f0000000-0000-4000-8000-000000000001',auth.uid(),10000,'nf-project-00000000000000000000000000000001','project-f0000000-0000-4000-8000-000000000001-00000000000000000000000000000001')$case$,'permission denied');
RESET ROLE;

SET ROLE service_role;
SELECT public.test_assert((public.prepare_project_contribution('f0000000-0000-4000-8000-000000000001','10000000-0000-0000-0000-000000000001',10000,'nf-project-00000000000000000000000000000001','project-f0000000-0000-4000-8000-000000000001-00000000000000000000000000000001')->>'init_claimed')::boolean,'first checkout claims reference');
SELECT set_config('test.contribution_id',(SELECT id::text FROM public.project_contributions WHERE provider_reference='nf-project-00000000000000000000000000000001'),false);
SELECT public.test_assert(NOT (public.prepare_project_contribution('f0000000-0000-4000-8000-000000000001','10000000-0000-0000-0000-000000000001',10000,'nf-project-00000000000000000000000000000002','project-f0000000-0000-4000-8000-000000000001-00000000000000000000000000000001')->>'init_claimed')::boolean,'duplicate submit cannot create checkout');
SELECT public.test_raises($case$SELECT public.prepare_project_contribution('f0000000-0000-4000-8000-000000000001','10000000-0000-0000-0000-000000000001',50000,'nf-project-00000000000000000000000000000002','project-f0000000-0000-4000-8000-000000000001-00000000000000000000000000000002')$case$,'pending_contribution_amount_conflict');
SELECT public.test_assert(public.store_project_contribution_checkout('nf-project-00000000000000000000000000000001','https://checkout.paystack.com/test123'),'checkout stored');
SELECT public.test_assert((public.settle_project_contribution('nf-project-00000000000000000000000000000001',10001,'ZAR','success')->>'status')='mismatched','verified amount mismatch cannot credit');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger)=0,'mismatch has no ledger credit');
SELECT public.test_assert((public.settle_project_contribution('nf-project-00000000000000000000000000000001',10000,'USD','success')->>'status')='mismatched','currency mismatch cannot credit');
SELECT public.test_assert((public.settle_project_contribution('nf-project-00000000000000000000000000000001',10000,'ZAR','success')->>'status')='funded','matched verification credits');
SELECT public.test_assert((public.settle_project_contribution('nf-project-00000000000000000000000000000001',10000,'ZAR','success')->>'status')='already_settled','webhook replay idempotent');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger)=1,'exactly one contribution ledger credit');
RESET ROLE;
SET ROLE anon;
SELECT public.test_assert((public.funding_project_catalog()->0->>'raised_minor')::bigint=10000,'public amount derives from verified ledger');
RESET ROLE;

SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',false);
SELECT public.test_assert((SELECT count(*) FROM public.project_contributions)=0,'other account cannot read contribution');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger)=0,'other account cannot read ledger');
SELECT public.test_raises('SELECT public.request_project_contribution_refund(current_setting(''test.contribution_id'')::uuid,''Please refund my contribution.'')','contribution_not_found');
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001',false);
SELECT public.test_assert((SELECT count(*) FROM public.project_contributions)=1,'owner sees payment and receipt');
SELECT public.test_assert((public.request_project_contribution_refund(current_setting('test.contribution_id')::uuid,'Please refund my contribution.')).state='requested','owner requests refund');
SELECT set_config('test.refund_id',(SELECT id::text FROM public.project_contribution_refund_requests),false);
SELECT public.test_assert((public.request_project_contribution_refund(current_setting('test.contribution_id')::uuid,'Please refund my contribution.')).state='requested','refund request retry idempotent');
RESET ROLE;
SET ROLE service_role;
SELECT public.test_raises('SELECT public.prepare_project_contribution_refund(current_setting(''test.contribution_id'')::uuid,''10000000-0000-0000-0000-000000000001'')','project_admin_forbidden');
SELECT public.test_assert((public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000003')->>'init_claimed')::boolean,'operator claims full refund once');
SELECT public.test_assert(NOT (public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000003')->>'init_claimed')::boolean,'processing retry cannot charge refund twice');
SELECT public.test_assert((public.store_project_contribution_refund(current_setting('test.refund_id')::uuid,'12345','processed')->>'status')='refund_processing','store alone never finalizes refund');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger)=1,'no refund ledger before verified amount and currency');
SELECT public.test_assert((public.settle_project_contribution_refund('nf-project-00000000000000000000000000000001','12345','processed',10001,'ZAR')->>'status')='mismatched','wrong refund amount cannot reverse ledger');
SELECT public.test_assert((public.settle_project_contribution_refund('nf-project-00000000000000000000000000000001','99999','processed',10000,'ZAR')->>'status')='mismatched','wrong provider refund ID cannot reverse ledger');
SELECT public.test_assert((public.settle_project_contribution_refund('nf-project-00000000000000000000000000000001','12345','failed',10000,'ZAR')->>'status')='refund_failed','known failed refund recorded');
SELECT public.test_assert(NOT (public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000003')->>'init_claimed')::boolean,'failed existing refund ID is rechecked without new refund');
SELECT public.test_assert((public.settle_project_contribution_refund('nf-project-00000000000000000000000000000001','12345','processed',10000,'ZAR')->>'status')='refunded','verified full refund reverses ledger');
SELECT public.test_assert((public.settle_project_contribution_refund('nf-project-00000000000000000000000000000001','12345','processed',10000,'ZAR')->>'status')='already_settled','refund replay idempotent');
SELECT public.test_assert((SELECT sum(amount_minor) FROM public.project_contribution_ledger)=0,'fully refunded project net is zero');
SELECT public.test_assert((public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000003')->>'status')='refunded','completed refund replay returns final status');

SELECT public.prepare_project_contribution('f0000000-0000-4000-8000-000000000001','10000000-0000-0000-0000-000000000001',10000,'nf-project-00000000000000000000000000000003','project-f0000000-0000-4000-8000-000000000001-00000000000000000000000000000003');
SELECT public.store_project_contribution_checkout('nf-project-00000000000000000000000000000003','https://checkout.paystack.com/test456');
SELECT public.test_assert(public.fail_project_contribution_payment('nf-project-00000000000000000000000000000003','abandoned'),'early abandoned status recorded');
SELECT public.test_assert((public.settle_project_contribution('nf-project-00000000000000000000000000000003',10000,'ZAR','success')->>'status')='funded','later verified success recovers early failure');
SELECT public.test_assert((SELECT count(*) FROM public.project_contribution_ledger WHERE entry_type='contribution_received')=2,'late success credited exactly once');
RESET ROLE;
-- Keep each operator's role present while proving profile inactivity revokes
-- both browser admin access and service-side refund approval.
UPDATE public.users SET is_moderator=true WHERE id='10000000-0000-0000-0000-000000000002';
CREATE FUNCTION public.test_inactive_funding_operator(p_user_id uuid,p_flag text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF p_flag NOT IN ('deleted_at','deletion_requested_at') THEN RAISE EXCEPTION 'invalid_test_flag'; END IF;
  EXECUTE format('UPDATE public.users SET %I=now() WHERE id=%L::uuid',p_flag,p_user_id);
  PERFORM set_config('request.jwt.claim.sub',p_user_id::text,false);
  SET LOCAL ROLE authenticated;
  PERFORM public.test_assert(NOT public.can_manage_funding_projects(),'inactive project admin permission denied');
  PERFORM public.test_raises('SELECT public.funding_project_admin_workspace()','project_admin_forbidden');
  PERFORM public.test_raises('SELECT public.save_funding_project(NULL,''{}'')','project_admin_forbidden');
  SET LOCAL ROLE service_role;
  PERFORM public.test_assert(NOT public._funding_operator(p_user_id),'inactive refund operator denied');
  PERFORM public.test_raises(format('SELECT public.prepare_project_contribution_refund(current_setting(''test.contribution_id'')::uuid,%L::uuid)',p_user_id),'project_admin_forbidden');
  RESET ROLE;
  EXECUTE format('UPDATE public.users SET %I=NULL WHERE id=%L::uuid',p_flag,p_user_id);
END;
$$;
SELECT public.test_inactive_funding_operator('10000000-0000-0000-0000-000000000002','deletion_requested_at');
SELECT public.test_inactive_funding_operator('10000000-0000-0000-0000-000000000002','deleted_at');
SELECT public.test_inactive_funding_operator('10000000-0000-0000-0000-000000000003','deletion_requested_at');
SELECT public.test_inactive_funding_operator('10000000-0000-0000-0000-000000000003','deleted_at');
SELECT public.test_assert((SELECT is_moderator FROM public.users WHERE id='10000000-0000-0000-0000-000000000002'),'moderator role retained through inactive checks');
SELECT public.test_assert((SELECT enabled FROM public.capital_interest_reviewers WHERE user_id='10000000-0000-0000-0000-000000000003'),'reviewer role retained through inactive funding checks');
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000002',false);
SELECT public.test_assert(public.can_manage_funding_projects(),'active moderator admin permission restored');
SELECT public.test_assert(public.funding_project_admin_workspace() ? 'projects','active moderator can read project admin queue');
SELECT set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000003',false);
SELECT public.test_assert(public.can_manage_funding_projects(),'active reviewer project admin permission restored');
SELECT public.test_assert(public.funding_project_admin_workspace() ? 'refunds','active reviewer can read project refund queue');
SET ROLE service_role;
SELECT public.test_assert(public._funding_operator('10000000-0000-0000-0000-000000000002'),'active moderator refund permission restored');
SELECT public.test_assert(public._funding_operator('10000000-0000-0000-0000-000000000003'),'active reviewer refund permission restored');
SELECT public.test_assert((public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000002')->>'status')='refunded','active moderator may check completed refund');
SELECT public.test_assert((public.prepare_project_contribution_refund(current_setting('test.contribution_id')::uuid,'10000000-0000-0000-0000-000000000003')->>'status')='refunded','active reviewer may check completed refund');
RESET ROLE;
SELECT 'Project SQL ownership, frozen checkout, settlement replay, refunds and recovery checks passed.' AS result;
