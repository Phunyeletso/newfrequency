# newFrequency website implementation audit

> **30 September 2026 update:** The report below is the historical 26 September
> baseline, not the current feature state. Missions now have the full local
> lifecycle, server-priced checkout, review, launch, judging, reward release,
> cancellation and refunds. Project contributions now have a published catalog,
> shared-account checkout, verified ledger, receipts, refund requests and operator
> controls. Shared account settings/deletion and a protected team inbox are also
> implemented. The homepage now uses shorter animated story chapters. Current
> configuration, validation and hosted-deployment limitations are documented in
> [HANDOVER.md](HANDOVER.md) and [PROJECT_CONTRIBUTIONS.md](PROJECT_CONTRIBUTIONS.md).
> Hosted migrations and payment activation remain pending: the authenticated
> Supabase deployment connection failed with a transport error during this work.

**Reviewed:** 2026-09-26  
**Scope:** website source and configuration in this repository, plus a read-only source audit of the adjacent `newFrequency` app repository. This document describes source-level findings; deployed Supabase policies, production secrets, provider dashboards, and device release behavior were not independently inspected unless stated below.

## Current architecture

| Area | Implementation |
|---|---|
| Frontend | React 18, React Router 7, Vite 6, Tailwind CSS 3; Vercel deployment configuration. |
| Rendering | Client app with build-time pre-rendered HTML for public routes, route-specific metadata, canonical URLs and sitemap. Private workspace routes are marked `noindex`. |
| Shared UI | Responsive header/footer, product phone preview, Tune network illustration, scroll-driven product story, scroll reveals and reduced-motion styles. Product motion uses CSS and a passive animation-frame-throttled scroll tracker; no animation library or third-party analytics is added. |
| App connection | Optional Supabase JS client uses the existing app project URL and public anon/publishable key. It is only instantiated when both are configured. No service-role key belongs in a `VITE_` variable. |
| Feedback | Existing REST submissions for feedback, contact enquiries and invite requests. `supabase/setup.sql` says these tables are in the app Supabase project and grants anonymous insert only with RLS. The public client key is not a secret; the policies are the boundary. |
| Android access | `/api/android-download` checks the server-only `ANDROID_APK_URL` with a HEAD request before returning availability or redirecting. Vercel serves pre-rendered `.html` files with clean URLs, without a catch-all rewrite that could shadow the API. |

## Routes and user journeys

| Route | Purpose and status |
|---|---|
| `/` | Product story and current testing state. |
| `/creators` | Creator workflow and qualified monetisation explanation. |
| `/for-artists` | Tunes and music use; does not promise licensing or reuse royalties. |
| `/business` | Business product and gated Mission lifecycle overview. |
| `/business/create`, `/business/missions` | Authenticated workspace using the existing app account and Mission data when configured. Drafting and review calls use existing database RPC/RLS boundaries. |
| `/invest` | Company/product overview, risks, and roadmap checkpoints. No offering, price, return or investment payment is open. |
| `/invest/dashboard` | Closed state only; there is no investor identity flow, ledger, KYC process or transaction history. |
| `/get-the-app` | Platform-aware test access status, Android availability, iOS invite state and concise install help. No app-store listing is claimed. |
| `/company`, `/feedback`, `/contact` | Company information and existing feedback/contact submissions. |
| `/privacy`, `/terms`, `/delete-account`, `/child-safety` | Required policy, account-deletion and safety routes retained. |
| `/auth/confirmed` | Receipt page for app sign-up confirmation redirects; it does not validate tokens itself or load Supabase. |

## Product and backend audit

Findings below reflect the adjacent app repository's local source and migrations. Its working tree contains unrelated local edits, so no files there were changed. Production database migration state and provider configuration remain unverified.

| Capability | Source-level status | Website treatment |
|---|---|---|
| Reels, Snaps, Chat, Tunes | Core post types and creator/feed code exist. Tunes are uploaded audio that creators can select for posts. | Described as product formats; no claim that reuse generates music royalties. |
| Frequency Trails | Local data/service plus create and browse flows support response, remix, sample and continuation relationships. Staging migration and release-device checks remain open. | Included in the product story with a clear note that attribution does not grant rights, imply endorsement or promise earnings. |
| Gifts, tips and paid-scroll support | App code and payment-related paths exist, with release/provider/device checks still pending. | Described cautiously; no guaranteed or automatic earnings claims. |
| Frequency Coins / wallets | Purchased Coins are store-billed, non-withdrawable and separate from eligible ZAR creator earnings. Store verification and full database/release checks remain. | Explains the distinction between Coins and creator earnings; no web wallet top-up is offered. |
| Ads and ad revenue share | Gated, not established as generally available. | Not marketed as active. |
| Live streaming | Foundation exists, but provider setup and native-device broadcast/playback validation remain. | Marked pre-release, not advertised as ready. |
| Marketplace | Implemented in app source; legal and operational release checks remain. | Not represented as generally available. |
| Frequency SOS | Source includes native detector/services and a delivery worker, but staging configuration, consented pilot and real-device delivery checks remain. | Marked as staging; live dispatch is stated as closed. |
| Missions | App migrations and authenticated RPCs support private brand drafts and owner-scoped submission review. Local verification is partial; database deployment and release checks remain. The site uses `create_brand_mission_draft`, `save_mission_wizard_draft`, `mission_submission_inbox_details` and `review_mission_submission`. | Draft creation and submission review can connect to the existing app backend. Verification, campaign funding, public launch, payments, payout and end-to-end campaign operations remain gated. |
| Paystack and coins | Consumer coin purchase is tied to app-store billing. A legacy ZAR deposit function is gated by `ALLOW_ZAR_DEPOSITS=false`; no active website investment checkout was found. | No web wallet top-up or investor checkout. Do not turn on legacy deposit paths as an investment flow. |
| Payouts / withdrawals | Provider, legal and release checks remain; not ready for a public promise. | No payout availability claim. |
| Investment offering | No investment instrument, offering/account data model, investor ledger, protected admin flow, or approved documents were found. | Feature flag defaults off; dashboard explains that it is closed. The flag is not a substitute for backend/legal controls. |
| Security boundary | App code includes authenticated/RLS access and auth-guarded RPCs. Source review cannot establish production policy state or deployment parity. | Browser uses only the public key and calls existing boundaries. It adds no service-role access or payment authority. |

## Android download finding

The configured EAS artifact URL redirected to Expo's artifact service and then returned **404**. This is a stale/deleted build artifact, not a button styling or browser-handler defect. The site now keeps the APK URL out of the bundle, checks it server-side, exposes a small availability response, and fails back to `/get-the-app?download=unavailable` when the artifact cannot be verified. The observed artifact is unavailable; no replacement APK or confirmed Play Store listing was found. A fresh EAS build and its current public APK URL are still needed before Android download can be enabled. A browser/device handoff test against a fresh artifact is still outstanding.

The iOS TestFlight link is optional and accepted only when it matches Apple's HTTPS join URL shape. The default is the invite-request state. In-app-browser detection offers an Android browser handoff; support varies by host app and must be tested on actual devices.

## Environment and release checklist

Use `.env.example` as the variable list. Keep real credentials in local ignored files and provider settings; do not commit them.

1. Confirm `VITE_APP_SUPABASE_URL` and `VITE_APP_SUPABASE_ANON_KEY` point to the existing app project. Configure its Auth redirect allowlist for the deployed `/business/missions` confirmation return. Never expose a service-role key.
2. Confirm the existing app migrations/RPCs and RLS policies are deployed before enabling Business sign-up or workspace access. Browser-side ownership filters are not an authorization boundary.
3. Confirm feedback/contact/invite tables and anonymous insert-only policies from `supabase/setup.sql` are deployed in the intended project. The file currently specifies the app project; some legacy handover/environment comments claim a separate project and are obsolete.
4. Set `ANDROID_APK_URL` and `ANDROID_APP_VERSION` only after a current APK has been built and tested. Keep `VITE_IOS_TESTFLIGHT_LIVE=false` unless a real TestFlight invite URL is available.
5. Keep `VITE_INVESTMENTS_ENABLED=false`. No code path should accept investor funds until the issuer/instrument, legal documents, identity checks, server-verified provider flow, immutable/auditable ledger, receipts, refund/reversal handling and server-side admin authorization have been implemented and reviewed.
6. Verify Vercel's `/api/android-download` function deployment and clean URL routing in the target project. Local preview and unit tests do not prove a production function was deployed.
7. Recheck privacy, terms, support contact and deletion instructions against current company operations before publishing.

## Performance and verification record

- The final production build emits **87.22 kB gzip** for the main JS chunk, **65.59 kB gzip** for the lazy Business workspace, and **13.75 kB gzip** for CSS. The logo PNG is 85 kB. No font, video or analytics payload is fetched by the page shell.
- The build pre-renders 17 configured routes plus a custom 404 page. The renderer waits for lazy workspace content before writing HTML, so extensionless clean URLs hydrate against the correct route content.
- No remote font fetch, hero video, or analytics script is loaded by the current shell. Product visuals are CSS/SVG/HTML; scroll motion respects `prefers-reduced-motion`.
- The responsive pass covered 320, 360, 390, 412, 768, 1024, 1366 and 1920 px. Key public, workspace and policy routes were checked at 320 and 1366 px; no horizontal overflow or clipped top-level headings were found.
- `npm run check` passed: lint, all 18 route renders (including the Suspense-backed workspace), the 12-page unsupported-claims scan, and all four Android endpoint tests. Browser checks on the production-style preview confirmed route-specific HTML and no hydration console errors on `/get-the-app` or `/business/create`.
- `npm run build` passed. `npm audit` reported zero vulnerabilities. `git diff --check` reported no whitespace errors.
- The Android endpoint unit tests cover the URL allowlist, valid artifact response, stale 404 and status/fallback paths. These are local handler tests, not a device installation test.
- No lab or field Core Web Vitals measurement, production deployment check, real-device APK installation, external penetration test, legal review, or app-store review was performed.

## Product-story follow-up

- A six-chapter scroll story now connects Reels, Snaps, Chats, Tunes, Frequency Trails and creator support. The responsive app illustration is labeled as illustrative; reduced-motion preferences disable its motion.
- The site palette follows the app's near-black surfaces and green action color. Live streaming, Marketplace and SOS are each labeled with their current release gates.
- The final responsive browser review covered the story at 320×800 and 390×844 as well as desktop. The local production build pre-rendered 17 routes and a custom 404 successfully.
