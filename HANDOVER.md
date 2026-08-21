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
| 1 | What is the live `.apk` download link? | The Android download button. Set it from the EAS build page after every production build: the .apk url changes each time, and `APP.version` in `src/lib/config.js` has to be moved to match, or the site names a build the button does not hand over. | `VITE_ANDROID_APK_URL` |
| 2 | Is TestFlight live for iOS yet? | Currently iOS shows "request an invite" and collects an email, per the brief. Flip it when TestFlight is real. | `VITE_IOS_TESTFLIGHT_LIVE`, `VITE_IOS_TESTFLIGHT_URL` |
| 3 | ~~Which backend should the feedback form write to?~~ **Answered: a second Supabase project, and it emails you.** | Run `supabase/setup.sql` in that project, deploy the edge function, then fill in the two env vars. Until they are set both forms still show "not connected". **Must not be the app's project** — see §3. | `VITE_FEEDBACK_API_BASE`, `VITE_FEEDBACK_ANON_KEY` |
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
| Email confirmed | `/auth/confirmed` | Where the app's sign up confirmation email lands. Not linked from anywhere: the only way here is that email. See §9. |
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

Create a **second** Supabase project. Everything below now lives in
**`supabase/setup.sql`**, which is the file to actually run: it creates the
tables, sets the write only policies, and wires the email notifications in §9.
The SQL is repeated here so this document still reads on its own, but run the
file, not this block.

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

**This shipped.** The rebuild was merged to `main` and is what is live; the
`newfrequency-site` branch it was written on is kept only as history. The
paragraph that used to be here said the opposite and was true for about a day.

```bash
git log --oneline newfrequency-site   # where it was written
```

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

---

## 9. Messages reaching you, and the app's confirmation email

Two things added on 2026-08-21, both about mail.

### The forms now ring a doorbell

A row in a table nobody opens is the same as no form at all. Somebody types out
what they think of the test build, presses send, is told it went through, and it
sits there for a month. So each of the three tables has a trigger that calls an
edge function, and the function emails the message to you.

```
supabase/setup.sql                          tables, write only RLS, the triggers
supabase/functions/notify-submission/       the function that sends the email
```

**Setting it up, in order.** The steps depend on each other, so do them this way
round:

1. Create the second Supabase project, if it does not exist. **Not the app's.**
2. Run **sections 1 and 2** of `supabase/setup.sql` in its SQL editor. The forms
   work from this point, as soon as step 5 is done; everything after is
   notification.
3. Make a [Resend](https://resend.com) account and an API key. The free tier is
   3,000 emails a month, which is far more than a contact form will ever use.
4. Deploy the function and give it its secrets:
   ```
   supabase link --project-ref <the website project ref>
   supabase functions deploy notify-submission --no-verify-jwt
   supabase secrets set RESEND_API_KEY=re_xxx \
                        NOTIFY_TO=bookingbreakthrough@gmail.com \
                        WEBHOOK_SECRET=<a long random string>
   ```
   `--no-verify-jwt` is required. The caller is Postgres, not a signed in user,
   so there is no JWT to check. What holds the door shut instead is
   `WEBHOOK_SECRET`, compared against the `x-webhook-secret` header. Without it
   the function is an open endpoint that will email you anything anyone posts.
5. Fill in `.env.local` (and the same two variables in Vercel's project
   settings, or the deployed site stays unconnected while localhost works):
   ```
   VITE_FEEDBACK_API_BASE=https://<website project>.supabase.co/rest/v1
   VITE_FEEDBACK_ANON_KEY=<that project's anon key>
   ```
6. Fill in the two placeholders at the top of **section 3** of `setup.sql` and
   run it. The `WEBHOOK_SECRET` there must be the same string as in step 4.
7. Send yourself a test message through `/feedback` on the live site.

**If the email does not arrive**, the message is not lost. It is in the table,
and every call the trigger made is logged:

```sql
select created, status_code, content from net._http_response
 order by created desc limit 20;
```

`403` means the secret in the trigger and the secret in the function do not
match. No rows at all means the trigger is not attached, so section 3 did not
run. A 200 with `"sent": false` in the body means Resend refused it, and the
reason is in `content`.

**Why the table stays.** The email is the doorbell, not the record. Mail gets
filtered, deleted and lost; `select * from feedback order by submitted_at desc`
does not. The function is written so that a failure to send can never cost the
message: the row is committed before it runs, and it returns 200 even when
sending fails so the trigger log stays readable.

**One escaping rule, worth knowing.** `notify-submission` escapes every value
before putting it in the email. It is the only place in either project where
text typed by a stranger ends up inside a document, and an unescaped message
field is a link, a tracking image or a piece of markup rendered inside your own
inbox. Do not remove `escapeHtml`.

### Where the app's confirmation email lands

`/auth/confirmed` is new and is not linked from the header, the footer or any
page. The only way to it is the confirmation email the app sends when somebody
signs up.

A confirmation link is opened in a **browser**, never in the app, so the last
hop of signing up is always a web page. Without one, Supabase sends the tester
to the app project's Site URL, which on a fresh project is
`http://localhost:3000` and shows a connection error on a phone. The account is
confirmed either way, but the tester sees a failure and gives up.

The page confirms nothing itself. Supabase has already verified the token by the
time the browser arrives; this is only the receipt. It deliberately loads no
Supabase client and holds no key. It reads `error` and `error_description` off
the URL, because an expired or already used link redirects here too and deserves
to be told the truth rather than shown a tick, and it strips the token out of
the address bar afterwards so it does not sit in browser history.

The rest of that setup lives in the **app** repo, at
`supabase/email-templates/README.md`: the branded templates themselves, the
`EXPO_PUBLIC_EMAIL_CONFIRM_URL` variable that points the link here, the redirect
allow list step that is silently ignored if you miss it, and the SMTP rate limit
that makes Supabase's default mailer drop emails after a handful per hour.
