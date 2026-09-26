import process from "node:process";

const ALLOWED_HOST = "expo.dev";
const APK_PATH = /^\/artifacts\/eas\/[A-Za-z0-9_-]+\.apk$/;
const APK_TYPES = new Set(["application/vnd.android.package-archive", "application/octet-stream", "binary/octet-stream"]);

export function getAndroidTarget(value = process.env.ANDROID_APK_URL) {
  if (!value || value.length > 2048) return null;
  try {
    const target = new URL(value);
    if (target.protocol !== "https:" || target.hostname !== ALLOWED_HOST || target.username || target.password) return null;
    if (!APK_PATH.test(target.pathname) || target.search || target.hash) return null;
    return target.href;
  } catch {
    return null;
  }
}

export async function checkAndroidArtifact(target = getAndroidTarget(), fetcher = fetch) {
  if (!target) return { available: false };
  try {
    const response = await fetcher(target, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
    });
    const finalUrl = new URL(response.url);
    if (!response.ok || finalUrl.protocol !== "https:") return { available: false };
    const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    const disposition = response.headers.get("content-disposition") || "";
    const finalPath = finalUrl.pathname.toLowerCase();
    const looksLikeApk = APK_TYPES.has(type) || /\.apk(?:["';\s]|$)/i.test(disposition) || finalPath.endsWith(".apk");
    if (!looksLikeApk) return { available: false };
    const version = typeof process.env.ANDROID_APP_VERSION === "string" && process.env.ANDROID_APP_VERSION.length <= 30
      ? process.env.ANDROID_APP_VERSION.trim() || null
      : null;
    return { available: true, target, version };
  } catch {
    return { available: false };
  }
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.end(JSON.stringify(body));
}

function redirect(response, status, destination) {
  response.statusCode = status;
  response.setHeader("Location", destination);
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.end();
}

export default async function androidDownload(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return sendJson(res, 405, { available: false });
  }

  const requestUrl = new URL(req.url || "/", "https://www.newfrequency.co.za");
  const target = getAndroidTarget();
  const status = await checkAndroidArtifact(target);
  if (requestUrl.searchParams.get("status") === "1") {
    return sendJson(res, status.available ? 200 : 503, {
      available: status.available,
      ...(status.available && status.version ? { version: status.version } : {}),
    });
  }

  if (!status.available) return redirect(res, 303, "/get-the-app?download=unavailable");
  return redirect(res, 302, status.target);
}
