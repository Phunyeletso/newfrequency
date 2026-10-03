// The shared app's publishable browser key is safe to include in the build.
// Never use a service-role/secret key here. Ownership is enforced by database RLS.
export function resolvePublicBackendConfig(environment, fallback) {
  const overrideUrl = environment.VITE_APP_SUPABASE_URL?.trim();
  const overrideKey = environment.VITE_APP_SUPABASE_ANON_KEY?.trim();
  // Use a complete pair so a partial override cannot mix two projects.
  return overrideUrl && overrideKey
    ? { url: overrideUrl, key: overrideKey }
    : { url: fallback.url, key: fallback.anonKey };
}
