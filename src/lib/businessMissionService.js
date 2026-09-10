// Business portal API boundary. The provider/gateway implementation belongs
// server-side; the browser never decides that funds were received.
const API_BASE = import.meta.env.VITE_BUSINESS_API_BASE || null;
const request = async (path, options = {}) => {
  if (!API_BASE) return { ok: false, code: "not_configured" };
  const response = await fetch(API_BASE.replace(/\/$/, "") + path, {
    ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });
  const body = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, ...body };
};

export const businessMissionService = {
  list: () => request("/missions"),
  get: id => request("/missions/" + encodeURIComponent(id)),
  createDraft: () => request("/missions", { method: "POST", body: JSON.stringify({}) }),
  saveDraft: (id, payload) => request("/missions/" + encodeURIComponent(id) + "/draft", { method: "PATCH", body: JSON.stringify(payload) }),
  review: id => request("/missions/" + encodeURIComponent(id) + "/review", { method: "POST" }),
  createFundingIntent: (id, paymentMethod) => request("/missions/" + encodeURIComponent(id) + "/funding-intent", { method: "POST", body: JSON.stringify({ paymentMethod }) }),
  // A webhook/reconciliation worker, never this method, moves a Mission to funded.
  fundingStatus: id => request("/missions/" + encodeURIComponent(id) + "/funding"),
};
