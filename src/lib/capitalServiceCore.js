export const CAPITAL_CONSENT_VERSION = "capital-conversation-v1";

export function createCapitalService(client, configured = Boolean(client)) {
  async function request(operation) {
    if (!configured || !client) return { ok: false, code: "not_configured", message: "Account connection is unavailable." };
    try {
      const { data, error } = await operation();
      if (error) return { ok: false, code: error.code || "request_failed", message: error.message || "Request failed." };
      return { ok: true, data };
    } catch {
      return { ok: false, code: "network_error", message: "Check your connection and try again." };
    }
  }

  return {
    request,
    workspace: () => request(() => client.rpc("capital_interest_workspace")),
    save: (details, expectedVersion, submit = false) => request(() => client.rpc("save_capital_interest", {
      p_details: details,
      p_expected_version: expectedVersion ?? 0,
      p_submit: submit,
      p_consent_version: submit ? CAPITAL_CONSENT_VERSION : null,
    })),
    withdraw: (expectedVersion) => request(() => client.rpc("withdraw_capital_interest", {
      p_expected_version: expectedVersion,
    })),
    reviewQueue: () => request(() => client.rpc("capital_interest_review_queue")),
    review: (interestId, expectedVersion, state, note) => request(() => client.rpc("review_capital_interest", {
      p_interest_id: interestId,
      p_expected_version: expectedVersion,
      p_state: state,
      p_note: note.trim(),
    })),
  };
}
