# newFrequency website — handover

The launch and tester-recruitment site, built to the brief. Six pages, no app
logic, no connection to the app's database.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run check    # lint + render every route + scan copy for forbidden claims
```

---

## 1. Open questions — answer these before launch

Each of these has a wrong answer that is expensive to undo, so nothing has been
guessed. Unknown details are simply left unsaid rather than shown as
placeholders, and unconfigured features render as an honest "not connected yet"
state.

| # | Question | What's blocked | Where it's set |
|---|---|---|---|
| 1 | What is the live `.apk` download link? | The Android download button. Currently shows a "link isn't set yet" notice. | `VITE_ANDROID_APK_URL` |
| 2 | Is TestFlight live for iOS yet? | Currently iOS shows "request an invite" and collects an email, per the brief. Flip it when TestFlight is real. | `VITE_IOS_TESTFLIGHT_LIVE`, `VITE_IOS_TESTFLIGHT_URL` |
| 3 | Which backend should the feedback form write to, and what are its credentials? | The feedback form and the iOS invite form. Both currently show "not connected". **Must not be the app's project** — see §3. | `VITE_FEEDBACK_API_BASE`, `VITE_FEEDBACK_ANON_KEY` |
| 4 | What is the support email address? | Privacy policy and terms. Until it's set, both point people at the feedback form to make a POPIA request. Company name is set to "New Frequency"; no trading address is shown. | `VITE_SUPPORT_EMAIL` |
| 5 | Which domain, and is the old site replaced or kept? | Deployment. See §5 — the old site is untouched on `main`. | — |
| 6 | ~~Should fees appear publicly?~~ **Answered: yes.** | `/for-artists` publishes the 10% platform fee and the 10% resale royalty. See §8. | copy on `/for-artists` |
| 7 | Any real artists or clips cleared for use? | No screenshots, no music, no faces are used anywhere. Nothing to clear yet. | — |
| 8 | Does the privacy policy match what the app actually collects? | The app sections were written from the brief, not from the app's code — see §7. | `src/pages/Privacy.jsx` |

There is also a **security question** that came out of the old codebase — see §3.

---

## 2. What was built

| Page | Route | Does |
|---|---|---|
| Home | `/` | What the app is, the three lead points, the four post types, routes to download |
| For artists | `/for-artists` | The licensing model in five steps, resale royalties, straight answers about money |
| Get the app | `/get-the-app` | Android sideload walkthrough, iOS invite request, test-build expectations |
| Feedback | `/feedback` | The test-build feedback form |
| Contact | `/contact` | General enquiries, including POPIA requests |
| Privacy | `/privacy` | POPIA policy for the website |
| Terms | `/terms` | Site and test-build terms |

**Weight:** 66 kB of JavaScript gzipped, 3.7 kB of CSS, one 85 kB image (the
logo), no video, no analytics, no third-party scripts, no web fonts beyond one
Google Fonts stylesheet. Mobile-first throughout; every tap target is at least
48 px.

**Accessibility:** real heading hierarchy, skip-to-content link, visible focus
rings on everything, radio groups in proper `fieldset`/`legend`, errors wired up
with `aria-invalid` and `aria-describedby`, `prefers-reduced-motion` respected,
alt text on images.

**Brand:** `#0A0A0B` ground, `#22C55E` accent for anything positive or monetary.
The four content colours (`#7C3AED` Reels, `#10B981` Tunes, `#F59E0B` Snaps,
`#3B82F6` Chat) appear in exactly one component — `ContentTypes.jsx`, where the
types are named — and nowhere else, per the brief.

---

## 3. The database — read this before wiring the form

### The app's Supabase project must not be used

The old site had this **hardcoded in four components** and committed to a public
repo:

```
https://dpreldjtbgpkaxivsyxi.supabase.co   + its anon key
```

It called `supabase.auth.signUp`, so the old marketing site was creating real
auth accounts in that project. None of that survives in this site — the four
components are deleted and no credential is hardcoded anywhere.

**Two things worth checking:**

1. Is `dpreldjtbgpkaxivsyxi` the app's project? If so, the old site was writing
   users into the app's own auth table from a public page.
2. That anon key is public on GitHub. A Supabase anon key is designed to be
   public *provided row-level security is tight on every table*. Worth
   confirming RLS is actually on for that project, and rotating the key if not.

### The separate website database

Create a **second** Supabase project (or any REST backend). Run this in its SQL
editor:

```sql
create table public.feedback (
  id               uuid primary key default gen_random_uuid(),
  liked            text        not null,
  disliked         text        not null,
  rating           smallint    not null check (rating between 1 and 5),
  would_keep_using text        not null check (would_keep_using in ('yes','no','unsure')),
  device           text,
  email            text,
  submitted_at     timestamptz not null default now(),
  referring_page   text,
  created_at       timestamptz not null default now()
);

create table public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  topic          text        not null,
  message        text        not null,
  submitted_at   timestamptz not null default now(),
  referring_page text,
  created_at     timestamptz not null default now()
);

create table public.invite_requests (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  platform       text        not null default 'ios',
  submitted_at   timestamptz not null default now(),
  referring_page text,
  created_at     timestamptz not null default now()
);

alter table public.feedback        enable row level security;
alter table public.enquiries       enable row level security;
alter table public.invite_requests enable row level security;

-- Anonymous visitors may INSERT and nothing else.
create policy "anon inserts feedback"
  on public.feedback for insert to anon with check (true);

create policy "anon inserts enquiries"
  on public.enquiries for insert to anon with check (true);

create policy "anon inserts invite requests"
  on public.invite_requests for insert to anon with check (true);

-- Deliberately NO select/update/delete policy. With RLS on and no read policy,
-- the anon key cannot read a single row back — not its own, not anyone else's.
-- Read the data from the Supabase dashboard or with the service key, never the
-- browser.
```

Then set `VITE_FEEDBACK_API_BASE` and `VITE_FEEDBACK_ANON_KEY`. Verify the
write-only rule holds by trying to read the table with the anon key — it should
return an empty set, not rows.

### Rate limiting

The form has a honeypot field and a 30-second client-side cooldown. A cooldown
in the browser is a speed bump, not a control — anyone can bypass it. If
submissions become a problem, add real server-side rate limiting (Supabase edge
function in front of the insert, or Cloudflare rate limiting on the domain).

---

## 4. Claims discipline is enforced by a test

`npm run check:claims` renders every page and scans the actual output for
language the brief forbids: per-view earnings, "verified authentic", crypto and
NFTs, store badges, instant withdrawals, advertising, investment and savings
language, and specific income figures. It currently passes on all six pages.

**Run it after any copy edit.** It's the cheapest guard against the two items in
the brief that are legal exposure rather than taste.

**One deliberate exception, decided by the product owner.** The Home page states
`Trust — a verified badge on content we can trust`, and the qualifying note that
sat under it (the in-app capture mark is a record, not proof) has been removed on
request. The brief's claims table rules out "verified authentic" style wording
because the capture mark cannot prove a post is unaltered, un-stolen or not
AI-generated. This is recorded here so it reaches whoever handles the legal
review rather than passing unnoticed. The claims script does not flag it.

Money language on the site is limited to: watching is free; you set your price;
a platform fee applies and is shown in the app before you confirm; the wallet
buys licences and tips comments; withdrawals are off by default and reviewed by
hand. No figure appears anywhere.

---

## 5. Deployment and the old site

Work is on the branch **`newfrequency-site`**. The old site is untouched on
`main`, so nothing is lost and nothing is live-changed until you choose.

```bash
git log --oneline main      # the old site, exactly as it was
git diff main --stat        # what changed
```

Nothing has been committed or pushed — review it first, then commit when you're
happy.

Vercel: `vercel.json` keeps the SPA rewrite so deep links like `/for-artists`
resolve. Set the environment variables in the Vercel project settings, not in a
committed file. The old `api/chat.js` OpenAI chatbot endpoint was removed — it
belonged to the previous product and is outside this brief's scope. It's still in
git history on `main` if you want it back.

---

## 6. Known items, none blocking

- **Logo weight.** `newFrequencyTransparentLogo.png` is 85 kB for a 32 px mark.
  An SVG version, or a resized PNG, would cut most of that. Worth doing for
  users on mobile data — send the vector file if you have it.
- **react-router 6.30.6** has two open moderate advisories. Neither applies
  here: one is an open redirect that needs user-controlled values passed to
  `Link`/`navigate` (every route on this site is a hard-coded literal), the
  other is an SSR hydration issue (this site doesn't use SSR). The fix is a
  breaking upgrade to v7, so it wasn't taken unprompted. Easy to do later.
- **No analytics.** The privacy policy currently states there are none. If you
  add any, update that section before it goes live.


---

## 7. The privacy policy covers the app — verify it

`/privacy` now covers both the app and the website, because testers download the
app from here.

The **website** half is accurate: it describes the feedback form, which I built,
so I know exactly what it collects.

The **app** half was written from the product brief, not from the app's source
code, which I have never seen. It states that the app holds account details,
posts, wallet balance and transactions, licences held, proof of ownership sent by
artists, and messages/comments/searches. Before this goes live, someone who knows
the app needs to check that list against what the app actually stores. Two things
in particular:

- **Anything collected that isn't listed.** Device identifiers, crash reporting,
  push tokens, location, contacts, or anything a third-party SDK gathers. If the
  app collects it, the policy has to say so.
- **Third parties.** The policy says data is shared only with the companies
  hosting our databases. If the app uses a payment processor, an analytics SDK or
  a push service, each is a third party that must be named.

An inaccurate privacy policy is worse than a thin one — it's a statement you can
be held to. This is the one page on the site I could not fully verify myself.


---

## 8. Published fees

The product owner decided fees go public. `/for-artists` states the 10% platform
fee and the 10% resale royalty. The worked earnings example that briefly sat
alongside them has been removed, so no income figure appears on the site.

Two things follow, neither blocking:

1. **Currency.** "Rand" was removed site-wide on the basis that the app is
   global, but the fee answer still illustrates with "a licence sold at R1 you
   keep 90c". Either make that currency-neutral or revisit the global framing —
   right now the two decisions disagree.
2. **The fees are now a published commitment.** Changing 10% later means changing
   it here too, and artists who listed under the old number will have seen it.
   Keep this page in sync with whatever the app actually charges.
