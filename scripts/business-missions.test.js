import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

async function serviceWith(client) {
  const source = await fs.readFile(new URL("../src/lib/businessMissionService.js", import.meta.url), "utf8");
  const key = `missionTest${Math.random()}`;
  globalThis[key] = client;
  try {
    const isolated = source.replace(/^import[^\n]+\n/, `const supabase = globalThis[${JSON.stringify(key)}]; const isAppBackendConfigured = true;\n`);
    return (await import(`data:text/javascript;base64,${Buffer.from(isolated).toString("base64")}`)).businessMissionService;
  } finally { delete globalThis[key]; }
}

test("business reads use owner-scoped RPC without trusting a browser user ID", async () => {
  const calls = [];
  const service = await serviceWith({ rpc: async (...args) => { calls.push(args); return { data: [], error: null }; } });
  await service.list("another-account");
  await service.get(12);
  assert.deepEqual(calls, [["owned_business_missions", { p_mission_id: null }], ["owned_business_missions", { p_mission_id: 12 }]]);
});

test("missing v94 RPC falls back to a session-owned Mission read", async () => {
  const calls = [];
  const request = {
    select: (...args) => { calls.push(["select", ...args]); return request; },
    eq: (...args) => { calls.push(["eq", ...args]); return request; },
    order: () => request, limit: () => request,
    then: resolve => resolve({ data: [{ id: 12 }], error: null }),
  };
  const service = await serviceWith({
    rpc: async () => ({ error: { code: "PGRST202" } }),
    auth: { getSession: async () => ({ data: { session: { user: { id: "session-owner" } } } }) },
    from: name => { calls.push(["from", name]); return request; },
  });
  assert.equal((await service.list("spoofed-owner")).ok, true);
  assert.ok(calls.some(call => call[0] === "eq" && call[1] === "brand_id" && call[2] === "session-owner"));
  assert.ok(!calls.some(call => call.includes("spoofed-owner")));
});

test("funding declarations contain no client fee, tax or provider amount", async () => {
  let call;
  const service = await serviceWith({ rpc: async (...args) => { call = args; return { data: { id: 12 }, error: null }; } });
  await service.submitForFunding(12);
  assert.equal(call[0], "submit_website_mission_for_funding");
  assert.deepEqual(Object.keys(call[1]).sort(), ["p_declarations", "p_mission_id", "p_terms_version"]);
  assert.equal(call[1].p_declarations.platform_fees_separate, true);
});

test("reward release sends winner order while server owns payout amounts", async () => {
  let call;
  const service = await serviceWith({ rpc: async (...args) => { call = args; return { data: { status: "completed" }, error: null }; } });
  assert.equal((await service.settle(12, [9, 8])).ok, true);
  assert.deepEqual(call, ["settle_brand_mission_rewards", { p_mission_id: 12, p_winner_ids: [9, 8] }]);
});

test("refund creation and checks always go through authenticated Edge function", async () => {
  const calls = [];
  const service = await serviceWith({ functions: { invoke: async (...args) => { calls.push(args); return { data: { status: "refunding" }, error: null }; } } });
  await service.refund(12);
  await service.refund(12, true);
  assert.deepEqual(calls, [["mission-payment-refund", { body: { mission_id: 12, check_only: false } }], ["mission-payment-refund", { body: { mission_id: 12, check_only: true } }]]);
});

test("structured provider errors remain actionable and network failures recover", async () => {
  const service = await serviceWith({ functions: { invoke: async () => ({ data: null, error: { context: { json: async () => ({ error: "mission_refund_not_allowed" }) } } }) } });
  assert.deepEqual(await service.refund(12), { ok: false, code: "mission_refund_not_allowed", message: "mission_refund_not_allowed" });
  const disconnected = await serviceWith({ rpc: async () => { throw new Error("offline"); } });
  assert.equal((await disconnected.list()).code, "network_error");
});
