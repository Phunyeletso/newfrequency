import { isAppBackendConfigured, supabase } from "./supabaseClient";

const FIELDS = "id,brand_id,title,brief,mission_type,primary_objective,prize_pool_zar,winner_count,deadline,state,payment_state,version,created_at,updated_at";

function unavailable() {
  return { ok: false, code: "not_configured", message: "Business accounts are temporarily unavailable." };
}

async function query(operation) {
  if (!isAppBackendConfigured || !supabase) return unavailable();
  try {
    const result = await operation();
    if (result.error) return { ok: false, code: result.error.code || "request_failed", message: result.error.message };
    return { ok: true, data: result.data };
  } catch {
    return { ok: false, code: "network_error", message: "Could not reach the business service. Check your connection and try again." };
  }
}

// The client calls only the app's existing RLS and SECURITY DEFINER RPC
// boundary. There is deliberately no browser-side payment or funding method.
export const businessMissionService = {
  list: (userId) => query(() => supabase.from("missions").select(FIELDS).eq("brand_id", userId).order("updated_at", { ascending: false }).limit(50)),
  get: (id) => query(() => supabase.from("missions").select(FIELDS).eq("id", id).single()),
  getDraft: (id) => query(() => supabase.from("mission_wizard_drafts").select("mission_id,configuration,completed_steps,last_step,last_saved_at").eq("mission_id", id).single()),
  createDraft: () => query(() => supabase.rpc("create_brand_mission_draft")),
  saveDraft: ({ id, step, configuration, completedSteps }) => query(() => supabase.rpc("save_mission_wizard_draft", {
    p_mission_id: id,
    p_step: step,
    p_configuration: configuration,
    p_completed_steps: completedSteps,
  })),
  submissions: (id) => query(() => supabase.rpc("mission_submission_inbox_details", { p_mission_id: id })),
  review: (id, state) => query(() => supabase.rpc("review_mission_submission", { p_submission_id: id, p_state: state })),
};
