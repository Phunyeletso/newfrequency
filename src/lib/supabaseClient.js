import { createClient } from "@supabase/supabase-js";

export const appBackendUrl = import.meta.env.VITE_APP_SUPABASE_URL?.trim();
export const appPublicKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY?.trim();

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
