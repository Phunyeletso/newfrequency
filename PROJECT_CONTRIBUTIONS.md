# Project contributions

The website uses the app's existing Supabase project and accounts. `/invest` shows
published projects; `/invest/dashboard` handles contributions, payment history,
downloadable receipts, refund requests and protected project controls. Optional
non-binding introductions remain at `/invest/conversation`.

Apply the shared app migrations in order, including
`migration_v95_capital_interest_workspace.sql` and
`migration_v97_project_contributions.sql` and
`migration_v99_website_account_cleanup.sql`. The v97 migration creates the known
direct-support project **Contribute to newFrequency** with no funding goal. A
moderator can edit, pause or close it in the website dashboard and publish other
projects. A contribution creates no equity, wallet balance or financial return.

Deploy these app Edge Functions along with the updated payment webhook:

- `contribution-payment-init`
- `contribution-payment-verify`
- `contribution-payment-refund`
- `paystack-webhook` (deploy with `--no-verify-jwt`; it verifies the Paystack signature)

Keep account JWT verification enabled on the three contribution functions.
Configure the existing server-only `SERVICE_ROLE_KEY` (or platform
`SUPABASE_SERVICE_ROLE_KEY`), `PAYSTACK_SECRET_KEY`, `PROJECT_CONTRIBUTIONS_ENABLED=true` and
`PROJECT_CONTRIBUTION_RETURN_URL=https://www.newfrequency.co.za/invest/dashboard`.
Checkout requires a stable request key, authenticated app account and a published
project. The browser supplies the user's chosen amount in integer minor units;
the database validates project limits and freezes that amount before checkout.
Server-side provider verification must match the reference, amount and currency
before a contribution or refund changes the ledger. Retries reuse stored
references and provider refund IDs.

Existing app moderators receive project controls through `is_moderator()`.
Additional operators can be explicitly provisioned in
`public.capital_interest_reviewers` through a trusted database/admin connection;
website accounts cannot grant that permission. Applicants' drafts and financial
history remain private to their own account. Admin RPCs and refund Edge Functions
check operator authorization independently of the UI.

The v99 trigger removes introduction contact details, conversation history,
company update preferences and capital operator grants when the app's existing
account purge first marks a profile deleted. It preserves contribution and
refund records for financial audit and does not initiate a refund.

Refunds are full-contribution requests reviewed by the team. A request is not a
promise of an approved refund. Processing requests with an interrupted provider
response can be reconciled by entering the numeric Paystack refund ID in the
operator queue; the server verifies the associated transaction, currency and
amount before recording a refund. It does not create another refund when a
provider ID is already attached to the request.

Verification:

```powershell
node --test scripts/investment-workspace.test.js scripts/project-funding.test.js
```

The two SQL suites require an **empty, disposable local PostgreSQL cluster** and
a database whose name begins `nf_capital_test`. They build minimal app/auth
fixtures; they must never be run against the hosted app database. Run
`scripts/investment-database.test.sql`, then
`scripts/project-contributions.test.sql` in the same disposable database. They
cover ownership, direct-write denial, consent, state transitions, optimistic
editing, immutable checkout amounts, settlement replay, refund verification and
late payment-status recovery.
Then run `scripts/website-account-cleanup.test.sql` to verify account purge removes
personal introductions while preserving the verified contribution ledger.

Local tests do not establish hosted migration deployment, Paystack credentials,
production provider readiness or real-payment verification. Keep operator logs
and check the hosted checkout/return/webhook/refund path after deployment.
