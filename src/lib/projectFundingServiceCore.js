export function createProjectFundingService(client) {
  async function request(operation) {
    if (!client) return { ok: false, code: "not_configured" };
    try {
      const { data, error } = await operation();
      if (error) return { ok: false, code: error.code || "request_failed", message: error.message };
      return { ok: true, data };
    } catch { return { ok: false, code: "network_error" }; }
  }
  async function invoke(name, body) {
    if (!client) return { ok: false, code: "not_configured" };
    try {
      const { data, error } = await client.functions.invoke(name, { body });
      if (error) {
        let payload;
        try { payload = await error.context?.json(); } catch { /* transport failure */ }
        return { ok: false, code: payload?.error || error.code || "request_failed", message: payload?.error || error.message };
      }
      return data?.error ? { ok: false, code: data.error } : { ok: true, data };
    } catch { return { ok: false, code: "network_error" }; }
  }
  return {
    catalog: () => request(() => client.rpc("funding_project_catalog")),
    workspace: () => request(() => client.rpc("project_contribution_workspace")),
    startPayment: (projectId, amountMinor, requestKey) => invoke("contribution-payment-init", { project_id: projectId, amount_minor: amountMinor, request_key: requestKey }),
    verifyPayment: (contributionId, reference) => invoke("contribution-payment-verify", { contribution_id: contributionId, ...(reference ? { reference } : {}) }),
    requestRefund: (contributionId, reason) => request(() => client.rpc("request_project_contribution_refund", { p_contribution_id: contributionId, p_reason: reason.trim() })),
    adminWorkspace: () => request(() => client.rpc("funding_project_admin_workspace")),
    saveProject: (projectId, details) => request(() => client.rpc("save_funding_project", { p_project_id: projectId || null, p_details: details })),
    rejectRefund: (requestId, note) => request(() => client.rpc("reject_project_contribution_refund", { p_refund_request_id: requestId, p_note: note.trim() })),
    processRefund: (contributionId, providerRefundId) => invoke("contribution-payment-refund", { contribution_id: contributionId, ...(providerRefundId ? { provider_refund_id: providerRefundId } : {}) }),
  };
}

export function amountToMinor(value) {
  const amount = String(value ?? "").trim();
  if (!/^\d{1,8}(\.\d{1,2})?$/.test(amount)) return null;
  const [whole, decimals = ""] = amount.split(".");
  const minor = Number(whole) * 100 + Number(decimals.padEnd(2, "0"));
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
}

export function isContributionRequestKey(contribution, key) {
  return Boolean(key && contribution.idempotency_key?.endsWith(`-${key.replaceAll("-", "")}`));
}

export function fundingError(result) {
  const detail = `${result?.code || ""} ${result?.message || ""}`;
  if (/project_contributions_disabled|payment_provider_not_configured/.test(detail)) return "Checkout is currently unavailable. Retry or contact the newFrequency team for help.";
  if (/pending_contribution_amount_conflict/.test(detail)) return "This project has a pending contribution for a different amount. Continue or check that payment from your history.";
  if (/invalid_contribution_amount|invalid_contribution/.test(detail)) return "Choose an amount within this project's contribution range.";
  if (/not_payable|project_not_open/.test(detail)) return "This project cannot accept a new contribution right now. Refresh to see its current status.";
  if (/admin_forbidden|not_authorized/.test(detail)) return "This account does not have permission for that action.";
  if (/reconciliation|verification_mismatch/.test(detail)) return "This payment needs a team check. Its reference is saved in your history; please check its status before trying again.";
  if (/verification_unavailable/.test(detail)) return "Paystack could not confirm the payment yet. Check its status again in a moment.";
  if (["PGRST202", "42883", "42P01"].includes(result?.code)) return "We couldn’t open your contributions. Retry or contact the newFrequency team for help.";
  if (result?.code === "network_error") return "Check your connection and try again. Your existing payment reference is kept for a safe retry.";
  return "We could not complete that action. Please try again.";
}
