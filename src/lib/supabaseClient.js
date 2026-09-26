import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_APP_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY?.trim();

export const isAppBackendConfigured = Boolean(url && anonKey);
export const supabase = isAppBackendConfigured
  ? createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: { headers: { "X-Client-Info": "newfrequency-website" } },
    })
  : null;
