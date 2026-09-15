// Post-deploy smoke test. Loads the real site in a real browser and asserts the
// properties that actually matter here -- above all that the page contacts no
// host but its own, since a blocked third-party asset is the failure mode this
// site exists to avoid.
//
//   node scripts/smoke.mjs [url] [ipv4]
import { chromium } from "playwright-core";

const target = process.argv[2] ?? "https://bekhruztursunbaev.com/";
const origin = new URL(target).host;

// Some networks (including the author's) have broken IPv6, and Chromium prefers
// AAAA. Pass an IPv4 address as the second argument to pin resolution to it.
const pinnedIp = process.argv[3];
const args = [];
if (pinnedIp) {
  // Bypass any system proxy as well -- a local proxy that mishandles the domain
  // produces the same ERR_CONNECTION_CLOSED as a genuinely broken site.
  args.push(`--host-resolver-rules=MAP ${origin} ${pinnedIp}`, "--no-proxy-server");
}
const browser = await chromium.launch({ args });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();

// "Contacted" means the request completed. Something the Content-Security-Policy
// refused -- such as a script Cloudflare injects at the edge -- still surfaces
// as a request event in the browser, but it never reaches the host, so it is
// reported as blocked rather than counted against the zero-third-party rule.
const contacted = new Set();
const blocked = new Set();
const failures = [];
const isForeign = (url) => new URL(url).host !== origin;

page.on("requestfinished", (req) => {
  if (isForeign(req.url())) contacted.add(new URL(req.url()).host);
});
page.on("requestfailed", (req) => {
  const reason = req.failure()?.errorText ?? "";
  // Chromium reports a CSP refusal as "csp"; other blocks say "BLOCKED".
  if (isForeign(req.url()) && /\bcsp\b|BLOCKED/i.test(reason)) {
    blocked.add(new URL(req.url()).host);
  } else {
    failures.push(`${req.url()} :: ${reason}`);
  }
});
page.on("console", (message) => {
  // Chromium sometimes reports a CSP refusal only on the console.
  const match = /Content Security Policy[^]*?(https?:\/\/[^\s'"]+)/i.exec(message.text());
  if (match && isForeign(match[1])) blocked.add(new URL(match[1]).host);
});

const response = await page.goto(target, { waitUntil: "networkidle", timeout: 60000 });

// Walk the page so lazy images load and every scroll reveal fires.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 200));
  }
});
await page.waitForTimeout(600);

const result = await page.evaluate(() => ({
  fonts: document.fonts.status,
  theme: document.documentElement.dataset.theme ?? null,
  hidden: [...document.querySelectorAll(".reveal,.wipe,.line-mask")].filter(
    (el) => !el.classList.contains("in")
  ).length,
  brokenImages: [...document.images]
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src),
}));

await browser.close();

const problems = [];
if (response.status() !== 200) problems.push(`status ${response.status()}`);
if (contacted.size) problems.push(`third-party hosts contacted: ${[...contacted].join(", ")}`);
if (failures.length) problems.push(`failed requests:\n    ${failures.join("\n    ")}`);
if (result.brokenImages.length) problems.push(`broken images: ${result.brokenImages.join(", ")}`);
if (result.fonts !== "loaded") problems.push(`fonts: ${result.fonts}`);
// The theme is set by the inline bootstrap script; if the CSP hash drifted from
// that script, the browser would refuse it and this would be missing.
if (!result.theme) problems.push("theme never set: the inline bootstrap script did not run (CSP hash?)");
if (result.hidden) problems.push(`${result.hidden} elements never revealed`);

console.log(`${target}`);
console.log(`  status ${response.status()}  fonts ${result.fonts}  theme ${result.theme}`);
console.log(`  own-origin only: ${!contacted.size}`);
if (blocked.size) console.log(`  blocked by CSP (never contacted): ${[...blocked].join(", ")}`);
if (problems.length) {
  console.error("\nFAILED:\n  - " + problems.join("\n  - "));
  process.exit(1);
}
console.log("  all checks passed");
