import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const source = (await fs.readFile(new URL("../src/lib/businessChatService.js", import.meta.url), "utf8")).replace(/^import[^\n]+\n/, "const supabase = null;\n");
const { createBusinessChatService, readChatDrafts, writeChatDrafts, chatError } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("chat RPCs do not accept a browser-supplied owner or sales role", async () => {
  const calls = [];
  const service = createBusinessChatService({ rpc: async (...args) => { calls.push(args); return { data: [], error: null }; } });
  await service.list(true);
  await service.save({ id: "chat-id", title: "Campaign", draft: "Unsent", owner_id: "someone-else" });
  await service.send({ conversationId: "chat-id", id: "stable-message-id", body: "Hello", sender: "sales" });
  assert.deepEqual(calls, [
    ["list_business_conversations", { p_team: true }],
    ["save_business_conversation", { p_id: "chat-id", p_title: "Campaign", p_draft: "Unsent" }],
    ["send_business_conversation_message", { p_conversation_id: "chat-id", p_message_id: "stable-message-id", p_body: "Hello" }],
  ]);
});

test("missing integration and network failures are reported without inventing messages", async () => {
  const unavailable = createBusinessChatService({ rpc: async () => ({ error: { code: "PGRST202", message: "Missing function" } }) });
  const result = await unavailable.messages("id");
  assert.equal(result.ok, false);
  assert.match(chatError(result), /drafts stay saved/);
  const offline = createBusinessChatService({ rpc: async () => { throw new Error("offline"); } });
  assert.equal((await offline.send({})).code, "network_error");
  assert.equal((await createBusinessChatService(null).list()).code, "not_configured");
});

test("message acknowledgements handle composite RPC rows and reject empty responses", async () => {
  const message = { id: "message-id", sender: "sales", body: "Reply", created_at: "2026-10-03T00:00:00Z" };
  for (const data of [message, [message]]) {
    const service = createBusinessChatService({ rpc: async () => ({ data, error: null }) });
    assert.deepEqual(await service.send({ conversationId: "chat", id: message.id, body: message.body }), { ok: true, data: message });
  }
  const empty = createBusinessChatService({ rpc: async () => ({ data: [], error: null }) });
  assert.equal((await empty.send({})).ok, false);
});

test("drafts are isolated by account and role, survive reloads, and handle unavailable storage", () => {
  const store = new Map();
  globalThis.localStorage = { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value) };
  const draft = { id: "id", title: "Launch", draft: "My unsent campaign" };
  assert.equal(writeChatDrafts("business-a", { id: draft }), true);
  assert.deepEqual(readChatDrafts("business-a"), { id: draft });
  assert.deepEqual(readChatDrafts("business-b"), {});
  assert.deepEqual(readChatDrafts("sales:business-a"), {});
  store.set("nf-business-chats:business-a", "null");
  assert.deepEqual(readChatDrafts("business-a"), {});
  store.set("nf-business-chats:business-a", "not json");
  assert.deepEqual(readChatDrafts("business-a"), {});
  globalThis.localStorage = { setItem: () => { throw new Error("storage full"); } };
  assert.equal(writeChatDrafts("business-a", {}), false);
  delete globalThis.localStorage;
});
