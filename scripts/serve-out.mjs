// Minimal static server for previewing the built `dist/` directory.
// Exists because the build has to be checked with the same MIME types, status
// codes, not-found behaviour and response headers a CDN would give it -- AVIF,
// WOFF2, the per-language 404 pages and the Content-Security-Policy in
// particular. A CSP that blocks something the page needs only shows up when the
// header is actually sent, so previewing without it would hide exactly the
// failure worth catching before deploy.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize, dirname } from "node:path";

const ROOT = "dist";
const PORT = Number(process.env.PORT ?? 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

const escapeRe = (text) => text.replace(/[.+?^${}()|[\]\\]/g, "\\$&");

/**
 * Applies dist/_headers the way Cloudflare does: every rule whose path pattern
 * matches contributes its headers. Read per request so a rebuild is picked up
 * without restarting the server.
 *
 * Two directives are dropped locally because they assume HTTPS:
 * upgrade-insecure-requests would rewrite http://localhost subresources to
 * https and break the preview, and HSTS means nothing over plain http.
 */
async function headersFor(urlPath) {
  let text;
  try {
    text = await readFile(join(ROOT, "_headers"), "utf8");
  } catch {
    return {};
  }
  const rules = [];
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    if (!raw.trim() || raw.trimStart().startsWith("#")) continue;
    if (!/^\s/.test(raw)) {
      current = { pattern: raw.trim(), headers: [] };
      rules.push(current);
      continue;
    }
    const colon = raw.indexOf(":");
    if (current && colon > 0) {
      current.headers.push([raw.slice(0, colon).trim(), raw.slice(colon + 1).trim()]);
    }
  }
  const out = {};
  for (const rule of rules) {
    const pattern = new RegExp("^" + rule.pattern.split("*").map(escapeRe).join(".*") + "$");
    if (!pattern.test(urlPath)) continue;
    for (const [name, value] of rule.headers) out[name] = value;
  }
  delete out["Strict-Transport-Security"];
  if (out["Content-Security-Policy"]) {
    out["Content-Security-Policy"] = out["Content-Security-Policy"]
      .split(";")
      .map((d) => d.trim())
      .filter((d) => d && d !== "upgrade-insecure-requests")
      .join("; ");
  }
  return out;
}

/**
 * Mirrors Cloudflare's `not_found_handling: "404-page"`: the nearest 404.html
 * walking up from the requested path.
 */
async function nearest404(urlPath) {
  let dir = dirname(normalize(urlPath));
  for (;;) {
    const candidate = join(ROOT, dir, "404.html");
    try {
      await stat(candidate);
      return candidate;
    } catch {
      const up = dirname(dir);
      if (up === dir) return join(ROOT, "404.html");
      dir = up;
    }
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  // join(ROOT, …) after normalize keeps traversal inside ROOT; anything that
  // still resolves outside it is rejected below.
  let path = join(ROOT, normalize(url));
  if (!normalize(path).startsWith(normalize(ROOT)) || url === "/_headers") {
    // Cloudflare never serves the rules file itself, so neither does this.
    res.writeHead(url === "/_headers" ? 404 : 403, { "Content-Type": "text/plain" });
    res.end(url === "/_headers" ? "Not found" : "Forbidden");
    return;
  }

  let status = 200;
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
  } catch {
    // A miss is a 404, not a 200 with error-page content -- otherwise a broken
    // link looks healthy to anything that checks status codes.
    status = 404;
    path = await nearest404(url);
  }

  try {
    const body = await readFile(path);
    const extra = await headersFor(url);
    res.writeHead(status, {
      ...extra,
      "Content-Type": TYPES[extname(path)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`serving ./${ROOT} on http://localhost:${PORT}`));
