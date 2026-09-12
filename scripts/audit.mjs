// Accessibility and interaction audit against a running build.
//
//   npm run serve   (in another shell)
//   npm run audit
//
// Checks the three things that regress silently: touch target sizes on a phone,
// whether keyboard focus is visible and ordered sensibly, and whether the page
// is fully readable with prefers-reduced-motion. The 40px target threshold is
// deliberately stricter than WCAG 2.5.8's 24x24 floor.
import { chromium } from "playwright-core";
const b = await chromium.launch();

// ---- mobile: tap targets + horizontal overflow
const m = await b.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
const mp = await m.newPage();
await mp.goto("http://localhost:4321/", { waitUntil: "networkidle" });
console.log("── mobile 375px ──");
console.log(await mp.evaluate(() => {
  const small = [];
  for (const el of document.querySelectorAll("a,button,[role=button]")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (r.height < 40 || r.width < 40) small.push({ t: (el.textContent||el.ariaLabel||el.tagName).trim().slice(0,28), w: Math.round(r.width), h: Math.round(r.height) });
  }
  const over = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width>0 && (r.right > innerWidth+2 || r.left < -2); }).map(e => (e.className||e.tagName).toString().slice(0,44));
  return { docWidth: document.documentElement.scrollWidth, viewport: innerWidth,
    overflowing: [...new Set(over)].slice(0,5), smallTargets: small.slice(0,10), smallCount: small.length,
    navLinksVisible: [...document.querySelectorAll("[data-spy]")].filter(a=>a.offsetParent!==null).length };
}));

// ---- keyboard: tab order and visible focus
const d = await b.newContext({ viewport: { width: 1366, height: 900 } });
const dp = await d.newPage();
await dp.goto("http://localhost:4321/", { waitUntil: "networkidle" });
const focusReport = [];
for (let i = 0; i < 10; i++) {
  await dp.keyboard.press("Tab");
  focusReport.push(await dp.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, label: (el.textContent||el.ariaLabel||"").trim().slice(0,26),
      outline: s.outlineStyle === "none" ? "NONE" : `${s.outlineWidth} ${s.outlineColor}`,
      inViewport: r.top >= -5 && r.top < 900 };
  }));
}
console.log("\n── keyboard focus order ──");
focusReport.forEach((f, n) => console.log(`  ${n+1}. ${f.tag.padEnd(7)} ${f.label.padEnd(28)} outline:${f.outline}${f.inViewport ? "" : "  OFFSCREEN"}`));

// ---- reduced motion: is everything readable?
const r = await b.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
const rp = await r.newPage();
await rp.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await rp.waitForTimeout(900);
console.log("\n── prefers-reduced-motion: reduce ──");
console.log(await rp.evaluate(() => ({
  motionReadyClass: document.documentElement.classList.contains("motion-ready"),
  invisibleText: [...document.querySelectorAll(".reveal,.wipe,.line-mask")].filter(e => {
    const s = getComputedStyle(e); return +s.opacity < 0.9 || s.clipPath !== "none";
  }).length,
  marqueeAnimation: getComputedStyle(document.querySelector(".marquee-track")).animationName,
})));
await b.close();
