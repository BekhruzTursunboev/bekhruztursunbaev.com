// Minimal static server for previewing the built `dist/` directory.
// Exists because the build has to be checked with the same MIME types, status
// codes and not-found behaviour a CDN would give it -- AVIF, WOFF2 and the
// per-language 404 pages in particular.
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

/**
 * Mirrors Cloudflare's `not_found_handling: "404-page"`: the nearest 404.html
 * walking up from the requested path. Serving the root one for every miss, as
 * this used to, made a missing /uz/404.html invisible until production.
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
  if (!normalize(path).startsWith(normalize(ROOT))) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
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
    res.writeHead(status, { "Content-Type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`serving ./${ROOT} on http://localhost:${PORT}`));
