# Business sales conversations

The logged-in Business entry and `/account` open `/business/missions`, now the
sales conversation workspace. `/business/sales` is the sales-team inbox for
existing app moderators. It is linked from `/team` and the Business sidebar for
authorized users. The existing Mission builder remains at `/business/create`;
Mission management moved to `/business/campaigns`. Existing
`/business/missions?mission=…` detail links still open Mission management.

## Hosted error diagnosis

On 3 October 2026, a read-only request to the configured shared Supabase project
returned `PGRST202` for `owned_business_missions(p_mission_id)`: the function is
missing from the hosted schema cache. It is defined in the app repository's
`migration_v94_website_mission_lifecycle.sql`. The previous UI turned that
response into “We couldn’t open the Mission workspace.”

Mission reads now fall back to the app's existing `missions` table, filtered by
the current authenticated session's `brand_id`, with database RLS still enforcing
ownership. Funding and other Mission lifecycle functions still require the app's
ordered v92–v100 migrations; the fallback does not enable unavailable write RPCs.
Sales chat has no dependency on the Mission funding schema.

## Required chat integration

Apply `newFrequency/migration_v102_business_sales_chat.sql` from the **app
repository** to the **same app
Supabase project configured in `.env.local`**, using a trusted database connection
or Supabase SQL editor. The file is safe to rerun. Its prerequisite is the app's
existing `is_moderator()` helper and standard Supabase `auth.users`/`auth.uid()`.
No AI provider, new payment integration or browser secret is required.

Backend SQL is maintained only in the app repo. See its
`docs/BUSINESS_SALES_CHAT.md` for the copy-and-run instructions.

The migration creates:

- `business_conversations`: owner, title, draft/open state and timestamps.
- `business_conversation_drafts`: private unsent text, separated from published
  conversation metadata to keep it out of staff reads and Realtime events.
- `business_conversation_messages`: server-attributed business/sales messages.
- RPCs `list_business_conversations`, `business_conversation_messages`,
  `save_business_conversation`, and `send_business_conversation_message`.
- Owner/team RLS, authenticated-only RPC grants, and publication membership for
  conversation metadata and messages if `supabase_realtime` exists.

Direct writes are prohibited. The server derives ownership and sender role from
the authenticated account. Only existing app moderators can open the sales inbox
and reply; users cannot grant themselves team access. Team users see a private
draft only after its owner sends a message, and never see subsequent unsent text.
Stable message IDs make retries idempotent. Hard deletion of the owner auth
account cascades to their conversations, drafts and messages.

Ensure Auth permits `/business/missions`, `/business/campaigns`,
`/business/sales`, `/account/settings` and the existing recovery URLs for each
intended origin. Supabase Realtime must be enabled for the two published tables.
If Realtime drops, the open page refreshes messages every 20 seconds while visible.

## User behavior and current limitation

New chat creates a conversation. Unsent text is automatically saved in account-
scoped browser storage. **Save draft** syncs it to the account so it can be reopened
on another device. Failed sends retain the text and retry ID. Until the migration
is applied, local drafts still work, while sending and account sync show an explicit
unavailable state. The interface never marks a failed message as sent.

The campaign guide uses clearly labeled automated prompts for goals, audience,
budget, platforms, timing and asset links. It does not generate sales-team replies.
Business users share assets through accessible links in messages; direct file
uploads are not part of this flow. Actual sales replies are written in
`/business/sales`, then appear in the business user's conversation.

The migration was verified in a disposable local PostgreSQL database, but has
**not been applied to hosted Supabase**: this session has the public browser key
and no authenticated management connection. Live sending, account draft sync and
real-time sales replies remain unavailable there until deployment.

The website now bundles the app's public Supabase URL/publishable key as a
fallback in `src/lib/publicAppBackend.json`. Complete website environment
overrides still take precedence; partial overrides never mix project pairs.
This prevents missing hosted build environment values from disabling sign-in.
Only public browser configuration is bundled; no secret or service-role key is used.

## Checks

`node --test scripts/business-chat.test.js scripts/business-missions.test.js`
checks service authorization parameters, missing-backend handling, account-scoped
draft recovery and the legacy Mission read fallback. Run
`scripts/business-chat-database.test.sql` only on a disposable PostgreSQL database;
it installs minimal auth fixtures and verifies owner isolation, private drafts,
team access, sender attribution, duplicate protection, validation and deletion.

An isolated browser fixture with synthetic conversations verified sending, saved
draft reloads and responsive layout. It does not send messages to hosted sales.
