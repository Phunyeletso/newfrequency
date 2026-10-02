import { isAppBackendConfigured, supabase } from "./supabaseClient";
import { createCapitalService } from "./capitalServiceCore";

// Investment conversations and the app share one authenticated Supabase project.
export const investmentService = createCapitalService(supabase, isAppBackendConfigured);

const request = investmentService.request;

export const capitalUpdateService = {
  status: (userId) => request(() => supabase
    .from("capital_update_signups")
    .select("user_id,consent_version,consented_at")
    .eq("user_id", userId)
    .maybeSingle()),
  join: () => request(() => supabase.rpc("join_capital_update_list", {
    p_consent_version: "capital-updates-v1",
  })),
  withdraw: (userId) => request(() => supabase
    .from("capital_update_signups")
    .delete()
    .eq("user_id", userId)),
};
