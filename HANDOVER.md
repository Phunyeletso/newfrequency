# newFrequency website handover

**3 October 2026 Business update:** logged-in Business now opens campaign sales
conversations. See [BUSINESS_CHAT.md](BUSINESS_CHAT.md) for the confirmed hosted
RPC error, new routes, private chat migration, team reply workflow and deployment
limitation. The previous Mission manager remains at `/business/campaigns`.

Current as of **30 September 2026**. The website and app use one Supabase project,
one account identity and the app's existing creator balance. These changes are
implemented and tested locally; hosted migration and payment activation are not
confirmed. The authenticated Supabase management connection currently fails with
a transport error, so no hosted migration or Edge Function deployment was made.

## Website journeys

- `/` follows Discover → Create → Missions → Grow, with animated chapters,
  an interactive format picker, mobile layouts and reduced-motion support.
- `/account` supports shared sign-in, signup confirmation, password recovery,
  profile name and password changes. `/delete-account` requests or cancels the
  app's existing deletion process.
- `/business/create` saves private Mission drafts, submits validated campaign
  terms, opens server-priced Paystack funding, verifies the return, and manages
  launch, closing, judging, cancellation and refunds.
- `/business/missions` lists the account's campaigns and submission inbox.
  `/business/review` gives app moderators business-verification and campaign
  review controls. Reward release credits the existing app balance atomically.
- `/invest` shows published projects. `/invest/dashboard` handles direct project
  contributions, payment verification, history, text receipts, refund requests,
  and protected project/refund controls. Contributions do not create equity,
  wallet credit or a promised return. `/invest/conversation` retains optional
  non-binding introductions.
- `/contact`, `/feedback` and platform access requests submit to the same app
  database. `/team` gives moderators a private inbox with resolve/reopen actions.
- `/get-the-app` checks a server-configured Android artifact. The old artifact
  returned 404; until a current tested APK is supplied, the real access-request
  form and retry action are available. No replacement release was invented.

## Configuration and deployment

Copy `.env.example` to ignored `.env.local`. Set `VITE_APP_SUPABASE_URL` and
`VITE_APP_SUPABASE_ANON_KEY` to the existing app project's public URL/key, as done
for this local workspace. Forms default to those values. No service-role key or
Paystack secret belongs in a `VITE_` variable.

Apply the app's ordered migration history, including these new migrations:

| Migration | Purpose |
|---|---|
| v94 | Full Mission lifecycle, campaign review, frozen pricing and atomic reward release |
| v95 | Private optional capital introductions and explicit operator access |
| v96 | Anonymous insert-only website forms and authenticated moderator inbox |
| v97 | Published funding projects, contribution settlement, receipts and refund ledger |
| v98 | Paystack-compatible Mission references, preserving older reference handling |
| v99 | Remove introduction contact data when the existing app purge marks a user deleted |
| v100 | Reuse Mission checkout identity after abandonment and verify late payments without duplicate funding |

v92 and v93 are prerequisites for the website draft and Mission checkout model.
Do not run disposable test fixtures against the hosted database. v99 preserves
contribution/refund financial records; deleting an account does not refund a payment.

Deploy the app Edge Functions `mission-payment-init`, `mission-payment-verify`,
`mission-payment-refund`, `contribution-payment-init`,
`contribution-payment-verify`, `contribution-payment-refund`, and the updated
`paystack-webhook`. Keep JWT verification enabled on the six account functions.
The webhook uses `--no-verify-jwt` and validates the provider signature itself.

Configure server secrets/flags in the existing Supabase project:

```text
SERVICE_ROLE_KEY=<existing server-only key>
PAYSTACK_SECRET_KEY=<provider key for the intended environment>
MISSION_PAYMENTS_ENABLED=true
MISSION_PAYMENT_RETURN_URL=https://www.newfrequency.co.za/business/create
PROJECT_CONTRIBUTIONS_ENABLED=true
PROJECT_CONTRIBUTION_RETURN_URL=https://www.newfrequency.co.za/invest/dashboard
```

Register the updated `paystack-webhook` URL with the same provider environment.
Use test credentials first and verify hosted checkout, return, duplicate webhook
delivery and refund reconciliation before accepting live payments. The server
verifies reference, amount and currency before ledger changes. Interrupted refund
responses can be reconciled with the existing provider refund ID; no second
refund is created to resolve an uncertain response.

App moderators receive Mission review, team inbox and project management access.
Additional capital operators can be provisioned through the protected
`capital_interest_reviewers` table using a trusted admin connection. Users cannot
grant themselves operator permissions. Configure the Mission platform-fee policy
for actual operations; the existing policy defaults to zero. Publish actual
project descriptions and limits through the dashboard; the seed is only the
known direct-support project, **Contribute to newFrequency**, without an invented goal.

Allow production and intended preview Auth redirect URLs for `/account`,
`/account?recovery=1`, `/business/create`, `/business/missions`,
`/invest/dashboard`, `/invest/conversation`, `/delete-account` and `/auth/confirmed`.
Existing app confirmation redirects must continue to work.

For website hosting, run `npm run build` and retain Vercel `cleanUrls` plus the
`/api/android-download` function. Server-only `ANDROID_APK_URL` and
`ANDROID_APP_VERSION` need a current tested release artifact. iOS access uses a
validated TestFlight join URL when enabled, otherwise an access request.

## Verification

`npm run check` covers lint, 22 route renders, unsupported-claim checks, four
Android endpoint tests and fourteen workspace service tests. `npm run build`
creates the production bundle and pre-rendered pages.

Additional app checks cover the contribution Edge handlers, existing payment
webhook/CORS behavior, Mission initialization/recovery and Mission services. Real disposable PostgreSQL checks
cover Mission ownership, full lifecycle, reward accounting and concurrent winner
selection; website inbox authorization; capital introductions; contribution
settlement/refunds; and deletion cleanup. See
[PROJECT_CONTRIBUTIONS.md](PROJECT_CONTRIBUTIONS.md) for the contribution test setup.

The local PostgreSQL verification used scoped app prerequisites and minimal
capital fixtures. The entire app migration history could not run on this Windows
PostgreSQL installation because v72 requires unavailable PostGIS. Hosted state,
real provider payments, email delivery, release APK installation and production
performance remain unverified. No live charge or refund was made.

The prior 26 September audit is retained as history in
[IMPLEMENTATION_AUDIT.md](IMPLEMENTATION_AUDIT.md), beneath the current status note.
