import { isAppBackendConfigured, supabase } from "./supabaseClient";

const CONSENT_VERSION = "capital-updates-v1";

function unavailable() {
  return { ok: false, code: "not_configured" };
}

async function request(operation) {
  if (!isAppBackendConfigured || !supabase) return unavailable();
  try {
    const { data, error } = await operation();
    if (error) return { ok: false, code: error.code || "request_failed" };
    return { ok: true, data };
  } catch {
    return { ok: false, code: "network_error" };
  }
}

export const capitalUpdateService = {
  status: (userId) => request(() => supabase
    .from("capital_update_signups")
    .select("user_id,consent_version,consented_at")
    .eq("user_id", userId)
    .maybeSingle()),
  join: () => request(() => supabase.rpc("join_capital_update_list", {
    p_consent_version: CONSENT_VERSION,
  })),
  withdraw: (userId) => request(() => supabase
    .from("capital_update_signups")
    .delete()
    .eq("user_id", userId)),
};
