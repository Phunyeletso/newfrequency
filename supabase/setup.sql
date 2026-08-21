-- ============================================================================
-- newFrequency website — database setup
--
-- Run this in the SQL editor of the WEBSITE's Supabase project.
--
-- ⚠ NOT THE APP'S PROJECT. The app's project holds accounts, wallets and a
--   money ledger. This one holds messages typed by strangers on a public page,
--   and its anon key is published in the website's JavaScript bundle where
--   anybody can read it. Those two things do not belong behind the same key.
--   If the URL you are about to paste this into is the one in the app's .env,
--   stop.
--
-- WHAT IT SETS UP
--   1. Three tables: feedback, enquiries, invite_requests.
--   2. Row level security: anonymous visitors may INSERT and nothing else.
--   3. A trigger on each table that calls the `notify-submission` edge
--      function, which emails you the message.
--
-- Sections 1 and 2 are safe to run on their own. Section 3 needs the edge
-- function deployed first and two values filled in at the top of it.
--
-- SAFE TO RE-RUN.
-- ============================================================================


-- ############################################################################
-- 1. THE TABLES
-- ############################################################################

create table if not exists public.feedback (
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

create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  topic          text        not null,
  message        text        not null,
  submitted_at   timestamptz not null default now(),
  referring_page text,
  created_at     timestamptz not null default now()
);

create table if not exists public.invite_requests (
  id             uuid primary key default gen_random_uuid(),
  email          text        not null,
  platform       text        not null default 'ios',
  submitted_at   timestamptz not null default now(),
  referring_page text,
  created_at     timestamptz not null default now()
);

-- Newest first is the only order anybody reads these in.
create index if not exists idx_feedback_submitted        on public.feedback (submitted_at desc);
create index if not exists idx_enquiries_submitted       on public.enquiries (submitted_at desc);
create index if not exists idx_invite_requests_submitted on public.invite_requests (submitted_at desc);


-- ############################################################################
-- 2. ROW LEVEL SECURITY: WRITE ONLY
-- ############################################################################
--
-- The anon key is in the website's JavaScript, so treat it as published. These
-- policies are what makes that safe: a visitor may add a row and can never read
-- one. There is deliberately NO select, update or delete policy, so with RLS on
-- the anon key cannot fetch a single message back, not even its own. Read the
-- data in the Supabase dashboard, or with the service key from the edge
-- function. Never from the browser.

alter table public.feedback        enable row level security;
alter table public.enquiries       enable row level security;
alter table public.invite_requests enable row level security;

drop policy if exists "anon inserts feedback"        on public.feedback;
drop policy if exists "anon inserts enquiries"       on public.enquiries;
drop policy if exists "anon inserts invite requests" on public.invite_requests;

create policy "anon inserts feedback"
  on public.feedback for insert to anon with check (true);

create policy "anon inserts enquiries"
  on public.enquiries for insert to anon with check (true);

create policy "anon inserts invite requests"
  on public.invite_requests for insert to anon with check (true);


-- ############################################################################
-- 3. EMAIL ME EACH ONE
-- ############################################################################
--
-- BEFORE RUNNING THIS SECTION:
--   a. Deploy the function:
--        supabase functions deploy notify-submission --no-verify-jwt
--   b. Set its secrets:
--        supabase secrets set RESEND_API_KEY=re_xxx \
--                             NOTIFY_TO=bookingbreakthrough@gmail.com \
--                             WEBHOOK_SECRET=<a long random string>
--   c. Replace the two placeholders below.
--
-- --no-verify-jwt is required: the caller is Postgres, not a signed in user.
-- WEBHOOK_SECRET is what actually holds the door shut, so make it long and
-- random. It is stored in the trigger definition below, which means anyone with
-- database access can read it. That is the standard Supabase webhook shape and
-- it is acceptable here: the worst it buys is the ability to send yourself an
-- email. Do not reuse it anywhere that matters.
--
-- pg_net is what performs the call. It ships enabled on Supabase; the line
-- below is here for a project where it is not.

create extension if not exists pg_net with schema extensions;

do $wire$
declare
  -- ⚠ FILL IN BOTH OF THESE.
  v_url    text := 'https://YOUR-WEBSITE-PROJECT.supabase.co/functions/v1/notify-submission';
  v_secret text := 'PASTE-THE-SAME-WEBHOOK_SECRET-HERE';
  v_headers text;
  v_table  text;
begin
  if v_url like '%YOUR-WEBSITE-PROJECT%' or v_secret like 'PASTE-%' then
    raise exception
      'fill in v_url and v_secret at the top of section 3 before running it — the triggers would call nowhere and every message would arrive unnoticed';
  end if;

  v_headers := json_build_object(
    'Content-Type',      'application/json',
    'x-webhook-secret',  v_secret
  )::text;

  -- One trigger per table, all identical. AFTER INSERT so a failed call can
  -- never roll back the message: pg_net queues the request and returns at once,
  -- which is also why a slow or dead endpoint does not make the website's form
  -- hang.
  foreach v_table in array array['feedback', 'enquiries', 'invite_requests'] loop
    execute format('drop trigger if exists trg_notify_%1$s on public.%1$I', v_table);
    execute format(
      'create trigger trg_notify_%1$s after insert on public.%1$I
         for each row execute function supabase_functions.http_request(%2$L, %3$L, %4$L, %5$L, %6$L)',
      v_table, v_url, 'POST', v_headers, '{}', '5000'
    );
  end loop;
end
$wire$;


-- ############################################################################
-- READING THE MESSAGES BY HAND
-- ############################################################################
-- The email is the doorbell; this is the record. Paste either into the SQL
-- editor whenever you want the lot.
--
--   select submitted_at, rating, would_keep_using, liked, disliked, device, email
--     from public.feedback order by submitted_at desc;
--
--   select submitted_at, topic, email, message
--     from public.enquiries order by submitted_at desc;
--
--   select submitted_at, email from public.invite_requests order by submitted_at desc;
--
-- Checking the notifications are actually wired:
--
--   select tgname, tgrelid::regclass from pg_trigger
--    where tgname like 'trg_notify_%';
--
-- Every call pg_net has made, newest first. A `status_code` of 403 means the
-- secret in the trigger and the secret in the function do not match:
--
--   select created, status_code, content from net._http_response
--    order by created desc limit 20;
--
-- Confirming the write only rule still holds. Signed in as anon this must
-- return no rows, and must NOT return an error:
--
--   select count(*) from public.feedback;
