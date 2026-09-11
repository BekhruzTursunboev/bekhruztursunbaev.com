// Minimal static server for previewing the exported `out/` directory.
// Exists because the export has to be checked with the same MIME types a CDN
// would send -- AVIF and WOFF2 in particular.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const ROOT = "dist";
const PORT = Number(process.env.PORT ?? 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
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
  try {
    if ((await stat(path)).isDirectory()) path = join(path, "index.html");
  } catch {
    path = join(ROOT, "404.html");
  }
  try {
    const body = await readFile(path);
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(PORT, () => console.log(`serving ./${ROOT} on http://localhost:${PORT}`));
