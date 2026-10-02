
# newFrequency website

React/Vite website with animated product stories, shared app accounts, complete
Mission workspaces and direct project contributions.

```powershell
npm install
npm run dev
npm run check
npm run build
npm run preview
```

Copy `.env.example` to `.env.local` and use the existing newFrequency app's public
Supabase URL/key. Browser configuration never contains payment or service-role
secrets. Website and app data stay in the same database.

See [HANDOVER.md](HANDOVER.md) for routes, backend migrations, deployment setup,
tests and current hosted limitations; [PROJECT_CONTRIBUTIONS.md](PROJECT_CONTRIBUTIONS.md)
describes the contribution payment and refund flow.
