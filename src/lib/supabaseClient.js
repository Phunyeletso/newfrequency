import { createClient } from "@supabase/supabase-js";
import publicAppBackend from "./publicAppBackend.json";
import { resolvePublicBackendConfig } from "./publicBackendConfig";

const backend = resolvePublicBackendConfig(import.meta.env, publicAppBackend);
export const appBackendUrl = backend.url;
export const appPublicKey = backend.key;

export const isAppBackendConfigured = Boolean(appBackendUrl && appPublicKey);
export const supabase = isAppBackendConfigured
  ? createClient(appBackendUrl, appPublicKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: { headers: { "X-Client-Info": "newfrequency-website" } },
    })
  : null;
