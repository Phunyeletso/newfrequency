
# newFrequency website

The public marketing and tester-recruitment website for newFrequency, a creator-focused product. It includes animated product stories, shared app accounts, mission workspaces, and project-contribution flows.

## Technology

- React 18 and React Router
- Vite 6
- Supabase JavaScript client for the shared app's public browser configuration

The browser uses only the Supabase publishable/anon key; access control belongs in database policies and server-side functions. Never put service-role or payment secrets in browser variables.

## Run locally

Requires Node.js and npm.

```powershell
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

For local backend configuration, copy `.env.example` to `.env.local` and provide the existing app's public Supabase URL and publishable/anon key. Keep server-only credentials in the Supabase Edge Function secrets store, not in this website's environment or source.

No product screenshots or benchmark results are included in this repository. The checked-in images are brand and social-preview assets.

See [HANDOVER.md](HANDOVER.md) for routes, backend migrations, deployment setup, tests, and current hosted limitations. [PROJECT_CONTRIBUTIONS.md](PROJECT_CONTRIBUTIONS.md) describes the contribution payment and refund flow.
