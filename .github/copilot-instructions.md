# Copilot Instructions for newFrequency Website

This is a React + Vite marketing and tester-recruitment site for the newFrequency app. Six public pages, no app logic, no connection to the app's database.

## Build, Test & Lint

```bash
npm run dev              # Start dev server at http://localhost:5173
npm run build            # Production bundle (dist/)
npm run lint             # ESLint check
npm run check:render     # SSR build: validates every route renders without error
npm run check:claims     # Scans output for forbidden language per the brief
npm run check            # Run all checks: lint + render + claims (do this before commit)
npm run preview          # Preview production build locally
```

**After editing copy or legal text, run `npm run check:claims`** — it's a legal safeguard that scans for prohibited language like "verified authentic", cryptocurrency, specific income figures, and misleading earnings claims.

## Architecture

**Pages (8 total):**
- `/` — Home (what the app is, lead points, post types, download routes)
- `/for-artists` — Licensing model, resale royalties, fee breakdown (10% platform, 10% resale)
- `/get-the-app` — Android sideload walkthrough, iOS TestFlight invite request
- `/feedback` — Test build feedback form (Supabase write-only)
- `/contact` — General enquiries & POPIA requests (Supabase write-only)
- `/auth/confirmed` — Email confirmation landing (app signup confirmation only, no form)
- `/privacy` — POPIA policy (covers both app and website)
- `/terms` — Site and test-build terms

**Stack:**
- React 18 + React Router v6 for client-side routing
- Vite for bundling (production build: 66 kB JS + 3.7 kB CSS gzipped)
- TailwindCSS for styling
- Supabase for form storage (separate database from the app—this is critical)
- Edge functions for email notifications

**File structure:**
```
src/
  pages/          — One component per route, handle own data & validation
  components/     — Reusable UI pieces (Button, Section, ChoiceGroup, etc.)
  lib/            — Utilities: config.js (env vars), feedback.js (Supabase calls), useDocumentTitle hook
  assets/         — Logo, images
  App.jsx         — Route definitions
  main.jsx        — Entry point, mounts App to #root
  index.css       — Tailwind + base layer rules for focus rings, selection, links
```

## Key Conventions

### Tailwind Color Palette (Custom)
- **ground**: `#0A0A0B` (near-black, app-matched)
- **surface** / **raised**: UI layers
- **accent**: `#22C55E` (bright green, anything positive/monetary)
- **accent-dim**: `#16A34A` (hover/active state)
- **Identity colors** (use ONLY for naming the four content types in one place):
  - reels: `#7C3AED`, tunes: `#10B981`, snaps: `#F59E0B`, chats: `#3B82F6`
- **ink** / **muted** / **faint**: Text layers

Do not use identity colors elsewhere in the UI.

### Components

**Button** — renders as `<Link>`, `<a>`, or `<button>` depending on props:
```jsx
<Button to="/path">Internal link</Button>
<Button href="https://...">External link</Button>
<Button variant="secondary">Button (default is primary)</Button>
<Button onClick={handler}>Click handler</Button>
```

**Section** — reusable page section wrapper with title and optional className for borders:
```jsx
<Section title="How it works" className="border-t border-line">
  {/* content */}
</Section>
```

**ChoiceGroup** — fieldset wrapper for radio groups (FormField pattern):
```jsx
<ChoiceGroup
  legend="Rating"
  value={values.rating}
  onChange={set("rating")}
  options={RATINGS}
  error={errors.rating}
/>
```

**Notice** — inline callout box for disclaimers:
```jsx
<Notice>Proof of ownership required before listing.</Notice>
```

### Styling

- Mobile-first: use `sm:`, `md:`, etc. for breakpoints
- Every tap target must be at least 48 px tall (enforced in Button with `min-h-[48px]`)
- Use `text-balance` for headings and short copy
- Use `text-pretty` for body text
- All interactive elements have visible focus rings (defined in `index.css`)
- Respect `prefers-reduced-motion` (handled in base layer)

### Configuration

Environment variables (all prefixed `VITE_` for Vite):
```javascript
// src/lib/config.js imports these:
VITE_ANDROID_APK_URL          // Direct .apk link from EAS; must match app version
VITE_IOS_TESTFLIGHT_LIVE      // "true" to show TestFlight, else shows invite form
VITE_IOS_TESTFLIGHT_URL       // TestFlight link if live
VITE_SUPPORT_EMAIL            // For privacy policy, terms
VITE_COMPANY_LEGAL_NAME       // Defaults to "New Frequency"
VITE_FEEDBACK_API_BASE        // Website Supabase REST url, e.g., https://<proj>.supabase.co/rest/v1
VITE_FEEDBACK_ANON_KEY        // Website Supabase anon key (write-only, never read)
```

Do not use the app's Supabase project credentials—create a separate project for the website. The old site had app credentials hardcoded; that's gone.

### Forms & Validation

**Pattern:** Client-side validation → honeypot check → 30-second cooldown → Supabase insert.

Honeypot field (invisible):
```jsx
<input name="verify" type="text" value={trap} onChange={(e) => setTrap(e.target.value)} style={{ display: "none" }} />
```

After submit: check `trap` is empty. Reject if filled (spam bot).

Client-side cooldown: store submission time in localStorage, block new submissions within 30 seconds. This is a speed bump, not a control—add server-side rate limiting (Cloudflare, edge function) if needed.

Error handling: `aria-invalid` + `aria-describedby` on form fields.

### Document Title & Meta

Use `useDocumentTitle` hook in every page:
```jsx
useDocumentTitle("Page Title", "Meta description for SEO and social share");
```

### Accessibility

- Real heading hierarchy (don't skip levels)
- Skip-to-content link in header
- Visible focus rings on everything (green ring, 2px, offset)
- Radio groups properly marked with `<fieldset>` and `<legend>`
- Form errors wired with `aria-invalid` and `aria-describedby`
- `prefers-reduced-motion` respected (no animations)
- Alt text on images (none are decorative)
- Tap targets at least 48 px

## Database (Supabase)

The website uses a **separate Supabase project** from the app. Three tables exist:

```sql
feedback       — test build feedback (liked, disliked, rating 1-5, would_keep_using, device, email)
enquiries      — general enquiries & POPIA requests (email, topic, message)
invite_requests — iOS TestFlight invite requests (email, platform)
```

All have write-only RLS policies for the anon key (can insert, cannot select/update/delete). The anon key can never read the data back.

Forms have client-side validation and honeypot filters before calling the API.

## Claims Check

Run `npm run check:claims` to ensure copy does not include:
- "Verified authentic" or similar verification claims
- Cryptocurrency, NFTs, blockchain language
- Specific income figures or "per-view" earnings
- Store badges
- "Instant withdrawal" or similar speed claims
- Advertising or investment language
- Savings language

**One deliberate exception:** The home page states "verified badge on content we can trust"—this was approved by the product owner and is not flagged by the check.

Money language is strictly limited to: watching is free, you set your price, platform fee applies (10%, shown before confirmation), wallet buys licences and tips, withdrawals are off by default and reviewed by hand. No figures appear anywhere else.

## Important Notes

### Version Pinning
- `APP.version` in `src/lib/config.js` must match the current app build version
- `VITE_ANDROID_APK_URL` changes with every EAS build and must be updated to match

### Email Confirmation
- `/auth/confirmed` is the landing page for the app's signup confirmation email
- Not linked from anywhere—only reachable via the email link
- Intentionally loads no Supabase client and holds no key
- Reads `error` and `error_description` from the URL (for expired/invalid links)
- Strips the token from the address bar so it doesn't sit in browser history

### Privacy Policy
The policy covers both the app and website. The website half is accurate (we built the feedback form). The app half was written from the product brief, not the app's source code. Before launch, verify it against what the app actually collects: device identifiers, crash reporting, push tokens, location, third-party SDKs, etc.

### ESLint Rules
- Apostrophes are allowed in JSX text (site copy is full of them)
- Forbidden: `>` and `}` unescaped in text (these genuinely confuse the parser)
- `react-refresh/only-export-components` is a warning; only default exports from pages
- `react/prop-types` disabled (using prop.children is fine without PropTypes)

### Router Setup
React Router v6 uses `<Routes>` and `<Route>` with a `<Layout>` wrapper. `vercel.json` includes SPA rewrite rules so deep links like `/for-artists` resolve correctly on the live site.

## Before Launch

See `HANDOVER.md` for the checklist:
1. Android `.apk` download link (from EAS, changes per build)
2. iOS TestFlight status & URL
3. Feedback Supabase project + environment variables
4. Support email address
5. Domain and old site handling
6. Privacy policy verification against actual app data
7. Copy review (run `npm run check:claims`)

## Common Tasks

**Add a new page:**
1. Create component in `src/pages/NewPage.jsx` with `useDocumentTitle`
2. Add `<Route path="/new-page" element={<NewPage />} />` in `App.jsx`
3. Add navigation link in `Header.jsx` if needed
4. Run `npm run check:render` to verify it renders

**Update copy:**
1. Edit the page component
2. Run `npm run check:claims` to validate for forbidden language
3. If using a form, test submission with honeypot empty + within cooldown

**Add a form field:**
1. Add to the state object and validation function
2. Use `ChoiceGroup` for radios, or standard `<input>` with classes from Feedback.jsx
3. Wire `aria-invalid` and `aria-describedby` for errors
4. Test honeypot and cooldown

**Styling:**
- Use Tailwind + custom colors from `tailwind.config.js`
- Check focus rings (`:focus-visible` with ring-accent)
- Test mobile first (start with base styles, add `sm:` for desktop)
- Verify at least 48 px tap targets
