# Copilot Instructions for the newFrequency Website

This is the current React/Vite public site for newFrequency. Read `IMPLEMENTATION_AUDIT.md` before architectural or product changes; older descriptions of this repository, its routes, Supabase projects, download flow, and product claims are stale.

## Change safety

- Inspect relevant source, existing uncommitted changes, and backend boundaries before editing.
- Preserve privacy, terms, account deletion, child safety, authentication, RLS, and payment controls.
- Reuse the adjacent app's Supabase project and existing Mission RPCs. Never create a second identity, wallet, or payment system to work around the app backend.
- Never expose service-role credentials or treat a public anon key as authorization. Server-side policy/RPC checks are the security boundary.
- Do not invent product capabilities, users, revenue, partnerships, legal approval, investment terms, or performance metrics.
- Read the actual implementation before changing behavior. Do not touch the adjacent app repository unless the user explicitly asks.

## Build and checks

```bash
npm run dev              # Local Vite server; production reference: https://www.newfrequency.co.za
npm run lint
npm run check:render     # Server-render every configured route
npm run check:claims     # Check public copy for unsupported claims
npm run check:download   # Android download handler tests
npm run check            # Lint, route render, claims and download checks
npm run build             # Client bundle and static route pre-rendering
```

The user's brief requires route, claims, download, responsive and performance verification. Report what was actually checked; SSR success alone does not verify visual layout or deployment.

## Current stack and routes

- React 18, React Router 7, Vite 6, Tailwind CSS 3, Supabase JS v2.
- Vercel serves pre-rendered route `.html` files through `cleanUrls` and the serverless `api/android-download.js`. There is no catch-all SPA rewrite; missing URLs use the custom `404.html` page.
- Public routes: `/`, `/creators`, `/for-artists`, `/business`, `/company`, `/invest`, `/get-the-app`, `/feedback`, `/contact`, `/privacy`, `/terms`, `/delete-account`, `/child-safety`, `/auth/confirmed`.
- Workspace routes: `/business/create` and `/business/missions`. These use the existing app account and database only when configured. `/invest/dashboard` is deliberately closed and has no investor identity or ledger.
- Main page components live in `src/pages/`; shared components in `src/components/`; app/config/SEO helpers in `src/lib/`.

## Product truth and backend boundaries

- Reels, Snaps, Chat and Tunes are the product's post types. Tunes are audio posts creators can select for their content; do not claim music licensing or reuse royalties.
- Creator payments, ad revenue share, Live, marketplace, and withdrawals require the release/provider/legal checks documented in `IMPLEMENTATION_AUDIT.md`. Do not describe gated features as generally available or promise earnings.
- Mission drafts and submission review call the existing auth/RLS/RPC boundary. Mission funding and launch are not available. Never imply a client-side filter replaces RLS.
- The public Invest page is informational. `VITE_INVESTMENTS_ENABLED` defaults to false; a UI flag cannot substitute for legal approval, server-verified payments, a protected ledger, receipts, or admin authorization.
- Android access checks a server-only `ANDROID_APK_URL`. The previously configured EAS artifact was stale and returned 404. Do not add an unverified APK or claim a Play Store listing.
- `supabase/setup.sql` puts feedback, enquiry, and invite tables in the existing app Supabase project and allows anonymous insert only. Some legacy comments claim a separate project; those comments are wrong. Verify deployed RLS before changing the public endpoint.

## Configuration and secrets

Use `.env.example` for the current variable list. `VITE_` values are shipped to browsers and must contain only public configuration and anon/publishable keys. The Android APK URL and version belong in server-side Vercel environment variables. Never read, print, or commit `.env.local` credentials. Investments and TestFlight remain off unless their actual prerequisites are verified.

## UI and accessibility

Keep the black, white and newFrequency-green identity, cinematic product storytelling, clear typography and useful whitespace. Prefer real app UI or clearly illustrative HTML/SVG over stock art and invented product screens. Keep motion meaningful, lightweight and respectful of `prefers-reduced-motion`. Design mobile-first; check 320, 360, 390 and 412 px, tablet, laptop, desktop and large desktop. Prevent horizontal overflow, preserve keyboard focus and semantic landmarks, label forms, and keep mobile interactions independent of hover.

## Legal and copy review

Keep the privacy policy, terms, account deletion, and child-safety pages in the route map and footer. Verify policy statements against actual collection and operations. Run `npm run check:claims` whenever public product or legal copy changes. Describe beta, gated and planned features with their real status and do not promise income, returns, rights, or availability.
