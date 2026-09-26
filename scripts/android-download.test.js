import test from "node:test";
import assert from "node:assert/strict";
import androidDownload, { checkAndroidArtifact, getAndroidTarget } from "../api/android-download.js";

const release = "https://expo.dev/artifacts/eas/release_build-123.apk";

function responseMock() {
  return {
    headers: {},
    statusCode: 0,
    body: "",
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    end(value = "") { this.body = value; },
  };
}

test("accepts only an HTTPS Expo EAS APK artifact URL", () => {
  assert.equal(getAndroidTarget(release), release);
  assert.equal(getAndroidTarget("http://expo.dev/artifacts/eas/build.apk"), null);
  assert.equal(getAndroidTarget("https://example.com/artifacts/eas/build.apk"), null);
  assert.equal(getAndroidTarget("https://expo.dev/artifacts/eas/build.zip"), null);
  assert.equal(getAndroidTarget("https://expo.dev/artifacts/eas/build.apk?next=https://evil.test"), null);
});

test("a valid APK response is available for download", async () => {
  const result = await checkAndroidArtifact(release, async (url, options) => {
    assert.equal(url, release);
    assert.equal(options.method, "HEAD");
    assert.equal(options.redirect, "follow");
    return {
      ok: true,
      url: "https://wf-artifacts.eascdn.net/release/build.apk?sig=temporary",
      headers: new Headers({ "content-type": "application/vnd.android.package-archive" }),
    };
  });
  assert.equal(result.available, true);
});

test("a stale artifact response fails closed", async () => {
  const result = await checkAndroidArtifact(release, async () => ({
    ok: false,
    status: 404,
    url: "https://wf-artifacts.eascdn.net/release/build.apk",
    headers: new Headers({ "content-type": "text/plain" }),
  }));
  assert.deepEqual(result, { available: false });
});

test("status requests disclose only availability and stale links return to the download page", async () => {
  const stale = responseMock();
  await androidDownload({ method: "GET", url: "/api/android-download?status=1" }, stale);
  assert.equal(stale.statusCode, 503);
  assert.deepEqual(JSON.parse(stale.body), { available: false });
  assert.equal(stale.headers["cache-control"], "no-store");

  const download = responseMock();
  await androidDownload({ method: "GET", url: "/api/android-download" }, download);
  assert.equal(download.statusCode, 303);
  assert.equal(download.headers.location, "/get-the-app?download=unavailable");
});
