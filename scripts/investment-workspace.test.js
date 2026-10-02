import test from "node:test";
import assert from "node:assert/strict";
import { createCapitalService, CAPITAL_CONSENT_VERSION } from "../src/lib/capitalServiceCore.js";
import { EMPTY_INTEREST, canEditInterest, interestToForm, investmentError, validateInterest } from "../src/lib/investmentForm.js";

const complete = { ...EMPTY_INTEREST, full_name: "Test Investor", amount: "50000.25", thesis: "I want to discuss building stronger creator communities." };

test("empty introductions can be saved, but cannot be submitted", () => {
  assert.deepEqual(validateInterest(EMPTY_INTEREST), {});
  assert.deepEqual(Object.keys(validateInterest(EMPTY_INTEREST, true)).sort(), ["amount", "full_name", "thesis"]);
  assert.deepEqual(validateInterest(complete, true), {});
});

test("amount bounds, fractional precision and contact preference are validated", () => {
  for (const amount of ["0", "-5", "1e4", "12.345", "1000000000000", "NaN", "5 000"]) {
    assert.ok(validateInterest({ ...complete, amount }, true).amount, amount);
  }
  assert.equal(validateInterest({ ...complete, amount: "999999999999.99" }, true).amount, undefined);
  assert.ok(validateInterest({ ...complete, preferred_contact: "phone" }, true).phone);
  assert.deepEqual(validateInterest({ ...complete, preferred_contact: "phone", phone: "+27 82 123 4567" }, true), {});
  assert.ok(validateInterest({ ...complete, currency: "XXX" }, true).currency);
  assert.ok(validateInterest({ ...complete, thesis: "x".repeat(3001) }, true).thesis);
});

test("server state controls when introductions are editable", () => {
  for (const state of [undefined, "draft", "needs_information", "withdrawn", "closed"]) assert.equal(canEditInterest(state), true);
  for (const state of ["submitted", "under_review", "conversation"]) assert.equal(canEditInterest(state), false);
  assert.equal(interestToForm({ ...complete, amount: 50000.25 }).amount, "50000.25");
  assert.equal(interestToForm({ ...complete, amount: null }).amount, "");
});

test("service sends ownership-free RPC payloads with consent and version", async () => {
  const calls = [];
  const service = createCapitalService({ rpc: async (name, args) => { calls.push({ name, args }); return { data: { version: 4 }, error: null }; } });
  assert.deepEqual(await service.save(complete, 3, true), { ok: true, data: { version: 4 } });
  assert.equal(calls[0].name, "save_capital_interest");
  assert.equal(calls[0].args.p_expected_version, 3);
  assert.equal(calls[0].args.p_consent_version, CAPITAL_CONSENT_VERSION);
  assert.equal("user_id" in calls[0].args, false);
  await service.save(complete, undefined, false);
  assert.equal(calls[1].args.p_consent_version, null);
  assert.equal(calls[1].args.p_expected_version, 0);
  await service.review("interest-id", 4, "needs_information", " Please share more. ");
  assert.equal(calls[2].args.p_note, "Please share more.");
  await service.withdraw(5);
  assert.deepEqual(calls[3], { name: "withdraw_capital_interest", args: { p_expected_version: 5 } });
});

test("service preserves backend failures and handles disconnected networks", async () => {
  const service = createCapitalService({ rpc: async () => ({ error: { code: "P0001", message: "version_conflict" } }) });
  const result = await service.workspace();
  assert.equal(result.ok, false);
  assert.match(investmentError(result), /another tab/);
  assert.equal((await createCapitalService(null).workspace()).code, "not_configured");
  const offline = createCapitalService({ rpc: async () => { throw new Error("Offline"); } });
  assert.equal((await offline.workspace()).code, "network_error");
});
