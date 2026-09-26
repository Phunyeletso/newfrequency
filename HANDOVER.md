# newFrequency website handover

**Current as of 2026-09-26.** Read [IMPLEMENTATION_AUDIT.md](IMPLEMENTATION_AUDIT.md) for the source audit, feature-status table, security boundaries, and verification record. This file is the operator checklist.

## Product-story update

- The homepage now follows the real feed story through Reels, Snaps, Chats, Tunes, Frequency Trails and creator support. Its compact app view is explicitly labeled illustrative, and the scene follows the chapter at the viewport center without taking over browser scrolling.
- Website palette and surfaces follow the app's `#0A0A0B` / `#141416` / `#1C1C1F` / `#22C55E` identity. Motion respects reduced-motion preferences and remains CSS/React only; there is no animation runtime dependency.
- Live streaming, Marketplace and Frequency SOS are described with their current release gates. Coins and eligible creator earnings are shown as separate balances; purchased Coins are not described as cash.
- UI/UX Pro Max guidance is documented in `design-system/newfrequency/MASTER.md`. 21st.dev was reviewed; no catalog component was installed, so the site has no external component dependency.

## Architecture

- React 18, React Router 7, Vite 6, Tailwind CSS 3, Supabase JS v2.
- Public routes are pre-rendered as route `.html` files with page-specific metadata. Vercel `cleanUrls` serves them without extensions; the custom `404.html` handles missing routes.
- `api/android-download.js` is a Vercel serverless function. Do not add a catch-all rewrite that shadows `/api/`.
- `npm run preview` starts a local production-style server for route HTML and the Android function. `npm run dev` is the Vite development server.
- Business pages reuse the app Supabase project and existing account/RLS/RPC boundaries. No second identity, wallet, payment service, or website database was introduced.

## Routes and current state

- Public story: `/`, `/creators`, `/for-artists`, `/business`, `/company`, `/invest`.
- App access and contact: `/get-the-app`, `/feedback`, `/contact`, `/auth/confirmed`.
- Business workspace: `/business/create`, `/business/missions`. With app Supabase configured, users can sign in using the existing app account, create/save private Mission drafts, and review submissions through existing RPCs. The workspace shows an honest unavailable state when the backend is not configured.
- Legal and safety: `/privacy`, `/terms`, `/delete-account`, `/child-safety`.
- `/invest/dashboard` is intentionally closed. There is no investment offering, payment flow, investor account, KYC, protected ledger, receipt system, or admin workflow.

## Configuration

Copy `.env.example` to `.env.local` for local work. Keep secrets in ignored local files or the hosting provider; never commit `.env.local`.

- `VITE_APP_SUPABASE_URL` and `VITE_APP_SUPABASE_ANON_KEY`: existing app Supabase project. Verify deployed migrations, RPC grants, RLS, and Auth redirect allowlist before enabling Business access. Never use a service-role key in a browser variable.
- `VITE_FEEDBACK_API_BASE` and `VITE_FEEDBACK_ANON_KEY`: existing app project's REST endpoint and public key. `supabase/setup.sql` specifies anonymous insert-only policies; verify deployed RLS before launch.
- `ANDROID_APK_URL` and `ANDROID_APP_VERSION`: server-side hosting variables only. Set these after a current APK is built and tested. The known EAS artifact returned 404; the app currently reports unavailable.
- `VITE_IOS_TESTFLIGHT_LIVE` and `VITE_IOS_TESTFLIGHT_URL`: leave disabled unless the invite is confirmed active.
- `VITE_INVESTMENTS_ENABLED`: keep `false`. A frontend flag does not provide legal approval, payment verification, server authorization, or a ledger.
- `VITE_COMPANY_LEGAL_NAME` and `VITE_SUPPORT_EMAIL`: confirm against current company details before publishing legal pages.

## Deployment checklist

1. Configure the environment values above in the correct Vercel scope. Do not put the Android APK URL in a `VITE_` variable.
2. Confirm the app Supabase migrations/RPCs, RLS policies, feedback tables, and Auth callback URL are deployed in the existing app project.
3. Build and verify with `npm run check`, `npm run build`, and `npm audit`.
4. Deploy to a preview URL. Verify clean URLs, the custom 404, `/api/android-download`, legal links, and configured form/auth flows.
5. Set an Android artifact only after a current APK passes device installation and handoff checks. No replacement artifact or Play Store listing is currently verified.
6. Keep Mission funding/launch and all investor actions closed until the required backend, payment, legal, identity, ledger, receipt, refund/reversal, and admin controls are implemented and reviewed.
7. Have the current privacy policy, terms, support contact, and deletion instructions reviewed against actual company operations before public release.

## Commands and verification

```bash
npm run dev
npm run check
npm run build
npm run preview
npm audit
```

The current verification record is in `IMPLEMENTATION_AUDIT.md`. Browser checks covered 320, 360, 390, 412, 768, 1024, 1366, and 1920 px; automated checks cover route rendering, unsupported claims, lint, and Android endpoint behavior. Production deployment, real device installation, production Supabase state, Core Web Vitals, legal review, and external security testing remain unverified.

## Product and security guardrails

- Describe Reels, Snaps, Chat and Tunes as product formats. Tunes do not currently imply music licensing or creator royalties for reuse.
- Do not promise earnings, availability, investor returns, licensing rights, Play Store listing, or general availability for gated features.
- Client filters do not replace server-side RLS/RPC authorization. Do not expose service-role credentials or trust client-supplied payment values.
- Do not add web payments, investment records, new Supabase tables, or migrations without a verified product and security design. No database migrations were made for this site rebuild.
