import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import androidDownload from "../api/android-download.js";
import { loadEnv } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localEnvironment = loadEnv("production", projectRoot, "");
for (const key of ["ANDROID_APK_URL", "ANDROID_APP_VERSION"]) {
  if (!process.env[key] && localEnvironment[key]) process.env[key] = localEnvironment[key];
}
const dist = path.join(projectRoot, "dist");
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function withinDist(candidate) {
  const resolved = path.resolve(dist, candidate);
  return resolved.startsWith(`${dist}${path.sep}`) ? resolved : null;
}

async function firstExisting(candidates) {
  for (const candidate of candidates) {
    const resolved = withinDist(candidate);
    if (!resolved) continue;
    try {
      await access(resolved);
      return resolved;
    } catch {
      // Try the next clean URL or directory-index candidate.
    }
  }
  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${host}:${port}`);
  if (url.pathname === "/api/android-download") {
    return androidDownload(request, response);
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    return response.end();
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400);
    return response.end("Bad request");
  }

  const relative = decodedPath.replace(/^\/+|\/+$/g, "");
  const hasExtension = path.extname(relative) !== "";
  const candidates = decodedPath === "/"
    ? ["index.html"]
    : hasExtension
      ? [relative]
      : [`${relative}.html`, path.join(relative, "index.html")];
  const file = await firstExisting(candidates);
  const status = file ? 200 : 404;
  const htmlFile = file || path.join(dist, "404.html");
  response.writeHead(status, {
    "Cache-Control": htmlFile.endsWith(".html") ? "no-cache" : "public, max-age=31536000, immutable",
    "Content-Type": contentTypes[path.extname(htmlFile)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") return response.end();
  return createReadStream(htmlFile).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Production preview available at http://${host}:${port}`);
});
