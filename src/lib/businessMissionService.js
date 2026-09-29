import { isAppBackendConfigured, supabase } from "./supabaseClient";

const FIELDS = "id,brand_id,title,campaign_media_url,brief,requirements,eligibility,usage_rights,mission_type,primary_objective,prize_pool_zar,winner_count,prize_split,deadline,scheduled_start_at,reward_pool_minor,platform_fee_minor,tax_minor,total_funding_minor,state,payment_state,version,created_at,updated_at";

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

async function invoke(name, body) {
  if (!isAppBackendConfigured || !supabase) return unavailable();
  try {
    const { data, error } = await supabase.functions.invoke(name, { body });
    if (error) {
      let payload;
      try { payload = await error.context?.json(); } catch { /* no structured response body */ }
      return { ok: false, code: payload?.error || error.code || "request_failed", message: payload?.error || error.message };
    }
    if (data?.error) return { ok: false, code: data.error, message: data.error };
    return { ok: true, data };
  } catch {
    return { ok: false, code: "network_error", message: "Could not reach the business service. Check your connection and try again." };
  }
}

// Campaign amounts are set and settled by database RPCs and authenticated
// Edge Functions. The browser never supplies a Paystack amount or credits funds.
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
  getBrandProfile: (ownerId) => query(() => supabase.from("brand_profiles")
    .select("id,legal_name,trading_name,country_code,registration_number,business_type,industry,website,business_email,business_phone,representative_name,representative_title,verification_status")
    .eq("owner_id", ownerId).maybeSingle()),
  saveBrandVerification: (profile) => query(() => supabase.rpc("save_brand_verification", {
    p_profile: profile,
    p_documents: [],
    p_authorised: true,
  })),
  submitForFunding: (missionId) => query(() => supabase.rpc("submit_mission_for_funding", {
    p_mission_id: missionId,
    p_terms_version: "mission-funding-v1",
    p_declarations: {
      authorised_representative: true,
      rights_confirmation: true,
      reward_pool_split_acknowledged: true,
      platform_fees_separate: true,
    },
  })),
  startPayment: (missionId) => invoke("mission-payment-init", { mission_id: missionId }),
  verifyPayment: ({ missionId, reference }) => invoke("mission-payment-verify", {
    mission_id: missionId,
    ...(reference ? { reference } : {}),
  }),
  uploadCampaignAsset: async ({ userId, missionId, file }) => {
    if (!isAppBackendConfigured || !supabase) return unavailable();
    const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-90) || "campaign-asset";
    const path = `${userId}/${missionId}/${crypto.randomUUID()}-${safeName}`;
    try {
      const { data, error } = await supabase.storage.from("uploads").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });
      if (error) return { ok: false, code: error.statusCode || "upload_failed", message: error.message };
      const { data: publicData } = supabase.storage.from("uploads").getPublicUrl(data.path);
      return { ok: true, data: { path: data.path, url: publicData.publicUrl } };
    } catch {
      return { ok: false, code: "network_error", message: "Could not upload this campaign asset. Check your connection and try again." };
    }
  },
  removeCampaignAsset: ({ userId, missionId, path }) => {
    if (!path?.startsWith(`${userId}/${missionId}/`)) return Promise.resolve({ ok: false, code: "invalid_path", message: "That asset does not belong to this Mission draft." });
    return query(() => supabase.storage.from("uploads").remove([path]));
  },
  submissions: (id) => query(() => supabase.rpc("mission_submission_inbox_details", { p_mission_id: id })),
  review: (id, state) => query(() => supabase.rpc("review_mission_submission", { p_submission_id: id, p_state: state })),
};
