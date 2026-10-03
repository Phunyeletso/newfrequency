import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import { resolvePublicBackendConfig } from "../src/lib/publicBackendConfig.js";

const fallback = JSON.parse(await fs.readFile(new URL("../src/lib/publicAppBackend.json", import.meta.url), "utf8"));

test("a build without website env still has the shared app's public configuration", () => {
  const backend = resolvePublicBackendConfig({}, fallback);
  assert.equal(backend.url, fallback.url);
  assert.equal(backend.key, fallback.anonKey);
  assert.match(backend.url, /^https:\/\/[^/]+\.supabase\.co\/?$/);
  assert.ok(backend.key.startsWith("sb_publishable_") || JSON.parse(Buffer.from(backend.key.split(".")[1], "base64url").toString()).role === "anon");
  assert.ok(!backend.key.startsWith("sb_secret_"));
});

test("complete environment overrides take precedence without mixing projects", () => {
  assert.deepEqual(resolvePublicBackendConfig({ VITE_APP_SUPABASE_URL: " https://other.supabase.co ", VITE_APP_SUPABASE_ANON_KEY: " public-other " }, fallback), { url: "https://other.supabase.co", key: "public-other" });
  assert.deepEqual(resolvePublicBackendConfig({ VITE_APP_SUPABASE_URL: "https://other.supabase.co" }, fallback), { url: fallback.url, key: fallback.anonKey });
  assert.deepEqual(resolvePublicBackendConfig({ VITE_APP_SUPABASE_URL: " ", VITE_APP_SUPABASE_ANON_KEY: " " }, fallback), { url: fallback.url, key: fallback.anonKey });
});
