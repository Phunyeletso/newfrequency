import test from "node:test";
import assert from "node:assert/strict";
import { amountToMinor, createProjectFundingService, fundingError, isContributionRequestKey } from "../src/lib/projectFundingServiceCore.js";

test("amounts use exact integer minor units and reject floating input ambiguity", () => {
  assert.equal(amountToMinor("100"), 10000);
  assert.equal(amountToMinor("0.29"), 29);
  assert.equal(amountToMinor("250.5"), 25050);
  for (const amount of ["", "0", "-50", "1e3", "3.333", "5 000", "NaN"]) assert.equal(amountToMinor(amount), null, amount);
});
test("checkout carries a stable request key and never writes a client payment status", async () => {
  const calls = [];
  const client = { functions: { invoke: async (name, options) => { calls.push({ name, ...options }); return { data: { status: "payment_pending" } }; } }, rpc: async (name, args) => { calls.push({ name, args }); return { data: [] }; } };
  const service = createProjectFundingService(client);
  await service.startPayment("project-id", 10000, "stable-key");
  await service.startPayment("project-id", 10000, "stable-key");
  assert.deepEqual(calls[0], { name: "contribution-payment-init", body: { project_id: "project-id", amount_minor: 10000, request_key: "stable-key" } });
  assert.deepEqual(calls[0], calls[1]);
  await service.verifyPayment("contribution-id", "nf-project-abc");
  assert.equal(calls[2].name, "contribution-payment-verify");
  assert.equal("status" in calls[2].body, false);
  await service.requestRefund("contribution-id", " Please review this. ");
  assert.deepEqual(calls[3], { name: "request_project_contribution_refund", args: { p_contribution_id: "contribution-id", p_reason: "Please review this." } });
  await service.processRefund("contribution-id", "12345");
  assert.deepEqual(calls[4], { name: "contribution-payment-refund", body: { contribution_id: "contribution-id", provider_refund_id: "12345" } });
});
test("provider errors keep pending references recoverable", async () => {
  const service = createProjectFundingService({ functions: { invoke: async () => ({ error: { context: { json: async () => ({ error: "checkout_requires_reconciliation" }) } } }) } });
  const result = await service.startPayment("project", 100, "key");
  assert.equal(result.ok, false);
  assert.match(fundingError(result), /reference is saved/);
  assert.equal((await createProjectFundingService(null).catalog()).code, "not_configured");
});
test("old receipt history cannot clear a newer pending contribution request key", () => {
  const key = "10000000-0000-4000-8000-000000000001";
  const contribution = { idempotency_key: "project-f0000000-0000-4000-8000-000000000001-10000000000040008000000000000001" };
  assert.equal(isContributionRequestKey(contribution, key), true);
  assert.equal(isContributionRequestKey(contribution, "20000000-0000-4000-8000-000000000002"), false);
  assert.equal(isContributionRequestKey(contribution, null), false);
});
