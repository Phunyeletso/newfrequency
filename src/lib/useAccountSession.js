import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export function useAccountSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!supabase) { setLoading(false); return undefined; }
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) { setSession(next); setLoading(false); setError(""); }
    });
    supabase.auth.getSession().then(({ data, error: failure }) => {
      if (!active) return;
      setSession(data?.session ?? null);
      setError(failure ? "Could not check your account. Refresh to retry." : "");
      setLoading(false);
    }).catch(() => {
      if (active) { setError("Could not reach your account. Check your connection and refresh."); setLoading(false); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  return { session, loading, error };
}
