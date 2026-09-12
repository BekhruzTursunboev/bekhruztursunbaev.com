// Measures Core Web Vitals and checks text contrast against WCAG, on the real
// deployed site. Numbers beat assumptions -- "it's static so it must be fast"
// is not a measurement.
import { chromium } from "playwright-core";

const target = process.argv[2] ?? "https://bekhruztursunbaev.com/";
const pinnedIp = process.argv[3];
const origin = new URL(target).host;

const browser = await chromium.launch({
  args: pinnedIp ? [`--host-resolver-rules=MAP ${origin} ${pinnedIp}`, "--no-proxy-server"] : [],
});

for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(target, { waitUntil: "load" });
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  await page.waitForTimeout(2500);

  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const bytes = performance
      .getEntriesByType("resource")
      .reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);

    // Relative luminance per WCAG 2.1
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const parse = (c) => (c.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const bgOf = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const c = getComputedStyle(n).backgroundColor;
        const p = parse(c);
        if (p.length === 3 && !c.includes("rgba(0, 0, 0, 0)")) return p;
      }
      return parse(getComputedStyle(document.body).backgroundColor);
    };

    const low = [];
    for (const el of document.querySelectorAll("p,span,a,li,h1,h2,h3,h4,dt,dd,button")) {
      const text = (el.textContent ?? "").trim();
      if (!text || el.children.length) continue;
      const st = getComputedStyle(el);
      if (st.visibility === "hidden" || st.display === "none" || +st.opacity === 0) continue;
      const size = parseFloat(st.fontSize);
      const weight = +st.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const a = lum(parse(st.color));
      const b = lum(bgOf(el));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const need = large ? 3 : 4.5;
      if (ratio < need) {
        low.push({ text: text.slice(0, 40), size: Math.round(size), ratio: +ratio.toFixed(2), need });
      }
    }
    return {
      lcp: Math.round(window.__lcp),
      cls: +window.__cls.toFixed(4),
      ttfb: Math.round(nav.responseStart),
      domInteractive: Math.round(nav.domInteractive),
      transferredKB: Math.round(bytes / 1024),
      requests: performance.getEntriesByType("resource").length,
      lowContrast: low,
    };
  });

  console.log(`\n── ${theme} ──`);
  console.log(`  LCP ${m.lcp}ms   CLS ${m.cls}   TTFB ${m.ttfb}ms   interactive ${m.domInteractive}ms`);
  console.log(`  ${m.requests} requests, ${m.transferredKB} KB transferred`);
  if (m.lowContrast.length) {
    console.log(`  ${m.lowContrast.length} low-contrast text nodes:`);
    for (const n of m.lowContrast.slice(0, 12)) {
      console.log(`    ${n.ratio}:1 (needs ${n.need}) ${n.size}px  "${n.text}"`);
    }
  } else {
    console.log("  contrast: all text passes WCAG AA");
  }
  await ctx.close();
}

await browser.close();
