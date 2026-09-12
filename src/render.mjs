/**
 * Renders the whole site to a single HTML string at build time.
 *
 * There is no framework here. The page has no interactive state — it is type,
 * links and images — so shipping a client-side runtime to reproduce markup the
 * build already knows would cost readers ~170 KB gzipped for nothing, and would
 * leave the page blank on a slow connection until that runtime hydrated.
 */

import {
  person,
  intro,
  availability,
  currently,
  projects,
  experience,
  community,
  awards,
  toolkit,
  education,
  languages,
  links,
  sections,
} from "./site.mjs";

/* -------------------------------------------------------------------------- */
/* helpers                                                                     */
/* -------------------------------------------------------------------------- */

/** Escapes text destined for element content or a quoted attribute. */
const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Typographic pass: real apostrophes and en dashes, applied after escaping. */
const type = (value) =>
  esc(value)
    .replace(/(\w)'(\w)/g, "$1’$2")
    .replace(/ - /g, " – ");

const pad = (n) => String(n).padStart(2, "0");
const ext = (href) => (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "");
const i = (n) => `style="--i:${n}"`;

/* -------------------------------------------------------------------------- */
/* icons                                                                       */
/* -------------------------------------------------------------------------- */

const S = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const icon = {
  arrowUpRight: (c = "size-4") =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M7 17 17 7M9 7h8v8"/></svg>`,
  arrowDown: (c = "size-4") =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M12 5v14M6 13l6 6 6-6"/></svg>`,
  arrowRight: (c = "size-4") =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  pin: (c = "size-3.5") =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.25"/></svg>`,
  sun: (c) =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><circle cx="12" cy="12" r="4.25"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>`,
  menu: (c) =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  close: (c) =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  moon: (c) =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z"/></svg>`,
  GitHub: (c) =>
    `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2.2c-3.2.7-3.8-1.4-3.8-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.6 11.6 0 0 1 6 0C18.6 4.3 19.6 4.6 19.6 4.6c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.6-1.5 7.8-5.8 7.8-10.8C23.5 5.7 18.3.5 12 .5Z"/></svg>`,
  LinkedIn: (c) =>
    `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.25h4v11.25H3V9.25Zm6.5 0h3.83v1.54h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12v5.67h-4v-5.03c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65v5.12h-3.85V9.25Z"/></svg>`,
  Telegram: (c) =>
    `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}" aria-hidden="true"><path d="M21.9 4.3 19 19.1c-.2 1-.8 1.2-1.6.75l-4.4-3.25-2.13 2.05c-.24.24-.44.44-.88.44l.31-4.45 8.1-7.32c.35-.31-.08-.49-.54-.18L6.85 13.4l-4.3-1.35c-.93-.29-.95-.93.2-1.38l16.8-6.47c.78-.28 1.46.18 1.2 1.4Z"/></svg>`,
  YouTube: (c) =>
    `<svg viewBox="0 0 24 24" fill="currentColor" class="${c}" aria-hidden="true"><path d="M22.5 7.2c-.25-1.9-1.03-2.62-2.9-2.79A62 62 0 0 0 12 4c-4.1 0-6.3.13-7.6.41C2.53 4.78 1.75 5.5 1.5 7.4A34 34 0 0 0 1.3 12c0 1.7.07 3.2.2 4.6.25 1.9 1.03 2.62 2.9 2.79 1.3.28 3.5.41 7.6.41s6.3-.13 7.6-.41c1.87-.17 2.65-.89 2.9-2.79.13-1.4.2-2.9.2-4.6 0-1.7-.07-3.2-.2-4.8ZM9.75 15.5v-7l6 3.5-6 3.5Z"/></svg>`,
  Email: (c) =>
    `<svg viewBox="0 0 24 24" ${S} class="${c}"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.8 7 7.3 5.4a1.5 1.5 0 0 0 1.8 0L20.2 7"/></svg>`,
};

/** Responsive product screenshot for a project, or nothing if none exists. */
const shot = (slug, sizes, priority = false, alt = "") => `
  <div class="shot">
    <picture>
      <source type="image/avif" srcset="/shots/${slug}-520.avif 520w, /shots/${slug}-900.avif 900w, /shots/${slug}-1300.avif 1300w" sizes="${sizes}">
      <img src="/shots/${slug}-900.webp"
        srcset="/shots/${slug}-520.webp 520w, /shots/${slug}-900.webp 900w, /shots/${slug}-1300.webp 1300w"
        sizes="${sizes}" width="1440" height="900" alt="${esc(alt)}"
        loading="${priority ? "eager" : "lazy"}" decoding="async"
        class="aspect-[16/10] w-full object-cover object-top">
    </picture>
  </div>`;

/** Wordmark. A drawn mark rather than plain text, so the brand has a shape. */
const monogram = `
  <svg viewBox="0 0 40 40" class="size-7 shrink-0" aria-hidden="true">
    <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.28"/>
    <path d="M11 29V11h7.4c3.9 0 6.2 1.8 6.2 4.8 0 2-1.1 3.5-3 4.1 2.4.6 3.8 2.2 3.8 4.5 0 3.1-2.4 4.6-6.6 4.6H11Zm4.3-10.9h2.6c1.6 0 2.5-.7 2.5-2s-.9-2-2.5-2h-2.6v4Zm0 7.6h3c1.8 0 2.7-.8 2.7-2.2s-.9-2.2-2.7-2.2h-3v4.4Z" fill="currentColor"/>
    <circle cx="30.5" cy="27.5" r="2.6" fill="var(--accent)"/>
  </svg>`;

/**
 * One education row: institution logo on a dark plate, then the details.
 * The plate is dark in both themes because both logos are white-on-dark
 * variants -- the Target mark is white and red, and would vanish against the
 * light theme's cream background.
 */
const eduEntry = ({ school, note, period, logo, points }) => `
  <div class="edu-row flex items-start gap-4 border-b border-line py-5">
    <span class="logo-plate">
      <img src="${esc(logo.src)}" width="${logo.width}" height="${logo.height}"
        alt="${esc(school)} logo" loading="lazy" decoding="async">
    </span>
    <div class="min-w-0 flex-1">
      <p class="font-display text-[1.25rem] leading-tight font-bold tracking-tight">${esc(school)}</p>
      <p class="mt-1 text-[0.9375rem] text-ink-2">${esc(note)}</p>
      <p class="mono mt-2 text-[0.75rem] text-ink-3">${esc(period)}</p>
      ${
        points
          ? `<ul class="mt-3.5 flex flex-wrap gap-x-2 gap-y-2">
        ${points
          .map(
            (pt) =>
              `<li class="mono rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-ink-3">${esc(pt)}</li>`
          )
          .join("")}
      </ul>`
          : ""
      }
    </div>
  </div>`;

const stackList = (items) => `
  <ul class="flex flex-wrap gap-x-2 gap-y-2">
    ${items
      .map(
        (item) =>
          `<li class="mono rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-ink-3">${esc(item)}</li>`
      )
      .join("")}
  </ul>`;

/* -------------------------------------------------------------------------- */
/* sections                                                                    */
/* -------------------------------------------------------------------------- */

const nav = () => `
<div class="progress" data-progress aria-hidden="true"></div>
<a href="#work" class="skip-link">Skip to content</a>
<header class="nav fixed inset-x-0 top-0 z-50" data-nav>
  <div class="shell flex h-16 items-center justify-between gap-6">
    <a href="#top" class="tap flex items-center gap-2.5 text-ink" aria-label="Bekhruz Tursunboev, back to top">
      ${monogram}
      <span class="font-display text-[1.0625rem] font-bold tracking-tight whitespace-nowrap">Bekhruz</span>
    </a>
    <nav aria-label="Sections" class="hidden md:block">
      <ul class="flex items-center gap-8 text-[0.9375rem]">
        ${sections
          .map(
            (s) =>
              `<li><a href="#${s.id}" class="nav-link" data-spy="${s.id}">${esc(s.label)}</a></li>`
          )
          .join("")}
      </ul>
    </nav>
    <div class="flex items-center gap-1">
      <a href="${esc(person.cv)}" class="tap text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-ink"><span class="link-draw">CV</span></a>
      <button type="button" id="theme-toggle" aria-label="Switch between light and dark theme" class="icon-btn">
        ${icon.sun("size-[1.05rem] icon-sun")}
        ${icon.moon("size-[1.05rem] icon-moon")}
      </button>
      <button type="button" id="menu-toggle" class="icon-btn md:hidden"
        aria-label="Open section menu" aria-expanded="false" aria-controls="menu-panel">
        ${icon.menu("size-[1.15rem]")}
      </button>
    </div>
  </div>
</header>

<!-- Mobile section menu. A drawer rather than a full-screen takeover, so the
     page stays visible behind it and the reader keeps their place. -->
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<div id="menu-panel" class="menu-panel" data-menu-panel hidden aria-label="Sections">
  <div class="flex h-16 items-center justify-between pr-1 pl-6">
    <span class="eyebrow eyebrow-plain">Sections</span>
    <button type="button" id="menu-close" class="icon-btn" aria-label="Close section menu">
      ${icon.close("size-[1.15rem]")}
    </button>
  </div>
  <nav aria-label="Sections">
    <ul class="border-t border-line">
      ${sections
        .map(
          (sec, n) =>
            `<li style="--i:${n}"><a href="#${sec.id}" class="menu-link" data-menu-link data-spy="${sec.id}">
        <span>${esc(sec.label)}</span>${icon.arrowRight("size-[1.1rem] text-ink-3")}
      </a></li>`
        )
        .join("")}
    </ul>
  </nav>
  <div class="mt-8 px-6">
    <a href="${esc(person.cv)}" class="btn btn-ghost w-full justify-center" target="_blank" rel="noopener">
      <span>Curriculum vitae</span>${icon.arrowUpRight("size-4")}
    </a>
  </div>
</div>`;

const hero = () => `
<section id="top" class="relative pt-28 pb-20 md:pt-32 md:pb-28">
  <div class="shell">
    <div class="reveal flex flex-wrap items-center gap-x-6 gap-y-3">
      <span class="eyebrow inline-flex items-center gap-2">${icon.pin()}${esc(person.based)} · UTC+8</span>
    </div>

    <h1 class="mt-8 font-display font-extrabold" style="font-size:var(--text-hero);line-height:0.86">
      <span class="line-mask" style="--i:0"><span>Bekhruz</span></span>
      <span class="line-mask" style="--i:1"><span class="hero-serif text-ink-2">Tursunboev</span></span>
    </h1>

    <p class="reveal mono mt-6 text-[0.8125rem] text-ink-3" style="--i:3">
      <span lang="uz">${esc(person.nameUz)}</span><span class="mx-2.5 text-ink-3">/</span>${esc(person.pronunciation)}
    </p>

    <div class="mt-12 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-10">
      <div class="md:col-span-7 lg:col-span-6">
        <p class="reveal lead text-ink" style="--i:0">${type(intro.lead)}</p>
        <p class="reveal prose-measure mt-6 text-ink-2" style="--i:1">${type(intro.body)}</p>
        <div class="reveal mt-10 flex flex-wrap items-center gap-3" style="--i:2">
          <a href="#work" class="btn btn-primary magnetic" data-magnet="0.16"><span>See the work</span>${icon.arrowDown()}</a>
          <a href="${esc(person.cv)}" class="btn btn-ghost magnetic" data-magnet="0.16" target="_blank" rel="noopener"><span>Curriculum vitae</span>${icon.arrowUpRight()}</a>
        </div>
      </div>

      <div class="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
        <figure class="wipe portrait-frame mx-auto max-w-xs md:-mt-10 md:max-w-none lg:-mt-20" data-parallax>
          <picture>
            <source type="image/avif" srcset="/img/portrait-420.avif 420w, /img/portrait-640.avif 640w, /img/portrait-880.avif 880w" sizes="(min-width:1024px) 22rem, (min-width:768px) 32vw, 18rem">
            <img src="/img/portrait-640.webp"
              srcset="/img/portrait-420.webp 420w, /img/portrait-640.webp 640w, /img/portrait-880.webp 880w"
              sizes="(min-width:1024px) 22rem, (min-width:768px) 32vw, 18rem"
              width="1456" height="1820" fetchpriority="high" decoding="async"
              alt="${esc(person.name)}, photographed on the Duke Kunshan University campus"
              class="aspect-[4/5] w-full object-cover">
          </picture>
        </figure>
      </div>
    </div>
  </div>

  <div class="shell mt-24 md:mt-32">
    <h2 class="eyebrow reveal">Currently</h2>
    <dl class="mt-7 border-t border-line">
      ${currently
        .map(
          (item, n) => `
        <div class="reveal grid gap-1.5 border-b border-line py-5 sm:grid-cols-12 sm:gap-6" ${i(n)}>
          <dt class="mono text-[0.8125rem] tracking-wide text-accent-ink sm:col-span-3 sm:pt-1">${esc(item.label)}</dt>
          <dd class="prose-measure text-ink-2 sm:col-span-9">${type(item.text)}</dd>
        </div>`
        )
        .join("")}
    </dl>
    <p class="reveal mt-5 text-[0.9375rem] text-ink-3">${type(availability.detail)}</p>
  </div>
</section>`;

const work = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return `
<section id="work" class="scroll-mt-24 py-24 md:py-32">
  <div class="shell">
    <h2 class="eyebrow reveal">Selected work</h2>
    <p class="reveal display mt-6">Four of these are <span class="accent-word">live</span>.</p>
    <p class="reveal lead mt-6" style="--i:1">Two written up properly. The rest with links to the code.</p>
  </div>

  <div class="shell mt-16 space-y-24 md:mt-20 md:space-y-32">
    ${featured
      .map((p, n) => {
        const flip = n % 2 === 1;
        return `
    <article class="grid items-start gap-8 md:grid-cols-12 md:gap-10">
      <div class="${flip ? "md:col-span-7 md:col-start-6" : "md:col-span-7"}">
        <a href="${esc(p.live ?? p.repo)}" target="_blank" rel="noopener" class="shot-link spotlight block" aria-label="Open ${esc(p.name)}, ${esc(p.kind)}">
          ${shot(p.slug, "(min-width:768px) 56vw, 92vw", n === 0, `${p.name} screenshot — ${p.kind} built by ${person.name}`)}
        </a>
      </div>

      <div class="${flip ? "md:col-span-5 md:row-start-1 md:pr-4" : "md:col-span-5 md:pl-4"}">
        <p class="mono text-[0.8125rem] text-ink-3">${pad(n + 1)} / ${esc(p.year)}</p>
        <h3 class="reveal display mt-3" style="font-size:var(--text-title)">${esc(p.name)}</h3>
        <p class="mt-2 font-medium text-accent-ink">${esc(p.kind)}</p>
        <p class="reveal mt-5 text-ink-2" style="--i:1">${type(p.summary)}</p>

        ${
          p.metrics
            ? `<dl class="reveal mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-6" style="--i:2">
          ${p.metrics
            .map(
              (m) => `<div>
            <dt class="sr-only">${esc(m.label)}</dt>
            <dd><span class="mono block text-[1.875rem] leading-none font-medium text-ink">${esc(m.value)}</span><span class="mt-2 block text-[0.8125rem] text-ink-3">${esc(m.label)}</span></dd>
          </div>`
            )
            .join("")}
        </dl>`
            : ""
        }

        ${
          p.detail
            ? `<ol class="reveal mt-8 space-y-4" style="--i:3">
          ${p.detail
            .map(
              (d, dn) => `<li class="flex gap-4">
            <span class="mono shrink-0 pt-1 text-[0.75rem] text-accent-ink">${pad(dn + 1)}</span>
            <p class="text-[1.0625rem] text-ink-2">${type(d)}</p>
          </li>`
            )
            .join("")}
        </ol>`
            : ""
        }

        <div class="reveal mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" style="--i:4">
          ${
            p.live
              ? `<a href="${esc(p.live)}" target="_blank" rel="noopener" class="tap inline-flex items-center gap-1.5 font-medium text-ink transition-colors duration-300 hover:text-accent-ink"><span class="link-draw">Live site</span>${icon.arrowUpRight()}</a>`
              : ""
          }
          ${
            p.repo
              ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener" class="tap inline-flex items-center gap-1.5 text-ink-2 transition-colors duration-300 hover:text-accent-ink">${icon.GitHub("size-[1.0625rem]")}<span class="link-draw">Source</span></a>`
              : ""
          }
        </div>

        <div class="reveal mt-6">${stackList(p.stack)}</div>
      </div>
    </article>`;
      })
      .join("")}
  </div>

  <div class="shell mt-24 md:mt-32">
    <h3 class="eyebrow reveal">Also built</h3>
    <div class="mt-8 grid gap-6 sm:grid-cols-2">
      ${rest
        .map((p, n) => {
          const href = p.live ?? p.repo;
          const media = p.live
            ? `<a href="${esc(href)}" target="_blank" rel="noopener" class="shot-link block" aria-label="Open ${esc(p.name)}, ${esc(p.kind)}" tabindex="-1">${shot(p.slug, "(min-width:640px) 44vw, 92vw", false, `${p.name} screenshot — ${p.kind}`)}</a>`
            : `<div class="shot shot-blank"><span class="mono text-[0.75rem] text-ink-3">SKILL.md</span></div>`;
          return `
      <article class="reveal spotlight card" ${i(n)}>
        ${media}
        <div class="p-5">
          <div class="flex items-baseline justify-between gap-4">
            <h4 class="font-display text-[1.375rem] font-bold tracking-tight">${esc(p.name)}</h4>
            <a href="${esc(href)}" target="_blank" rel="noopener" class="tap shrink-0 text-ink-3 transition-colors duration-300 hover:text-accent-ink" aria-label="${esc(p.name)} — open">${icon.arrowUpRight("size-[1.125rem]")}</a>
          </div>
          <p class="mono mt-1.5 text-[0.75rem] text-ink-3">${esc(p.kind)} · ${esc(p.year)}</p>
          <p class="mt-3 text-[1rem] text-ink-2">${type(p.summary)}</p>
          <div class="mt-4">${stackList(p.stack.slice(0, 3))}</div>
          <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4">
            ${
              p.live
                ? `<a href="${esc(p.live)}" target="_blank" rel="noopener" class="tap inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-ink transition-colors duration-300 hover:text-accent-ink"><span class="link-draw">Live</span>${icon.arrowUpRight("size-[0.875rem]")}</a>`
                : ""
            }
            ${
              p.repo
                ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener" class="tap inline-flex items-center gap-1.5 text-[0.9375rem] text-ink-2 transition-colors duration-300 hover:text-accent-ink">${icon.GitHub("size-[0.9375rem]")}<span class="link-draw">Source</span></a>`
                : ""
            }
          </div>
        </div>
      </article>`;
        })
        .join("")}
    </div>

    <p class="reveal mt-8 text-ink-3">30-odd more on <a href="https://github.com/BekhruzTursunboev?tab=repositories" target="_blank" rel="noopener" class="tap text-ink transition-colors duration-300 hover:text-accent-ink"><span class="link-draw">GitHub</span></a> — games, Telegram bots, experiments.</p>
  </div>
</section>`;
};

const experienceSection = () => `
<section id="experience" class="scroll-mt-24 py-24 md:py-32">
  <div class="shell">
    <header class="max-w-3xl">
      <h2 class="eyebrow reveal">Experience</h2>
      <p class="reveal display mt-5">Paid engineering work <span class="accent-word">since</span> 2022.</p>
    </header>
    <ol class="mt-16 border-t border-line md:mt-20">
      ${experience
        .map(
          (role, n) => `
      <li class="reveal grid gap-5 border-b border-line py-10 md:grid-cols-12 md:gap-10" ${i(n)}>
        <div class="md:col-span-4">
          <h3 class="font-display text-[1.5rem] leading-tight font-bold tracking-tight">${esc(role.org)}</h3>
          ${role.orgNote ? `<p class="mt-1.5 text-[0.9375rem] text-ink-3">${esc(role.orgNote)}</p>` : ""}
          <p class="mono mt-4 text-[0.75rem] tracking-wide text-ink-3">${esc(role.period)}</p>
        </div>
        <div class="md:col-span-8">
          <p class="text-[1.0625rem] font-medium text-accent-ink">${esc(role.role)}</p>
          <ul class="mt-4 space-y-3">
            ${role.points
              .map(
                (point) => `<li class="flex gap-3.5">
              <span class="mt-2.5 size-1 shrink-0 rounded-full bg-line-strong" aria-hidden="true"></span>
              <p class="prose-measure text-ink-2">${type(point)}</p>
            </li>`
              )
              .join("")}
          </ul>
        </div>
      </li>`
        )
        .join("")}
    </ol>
  </div>
</section>`;

const beyond = () => `
<section id="beyond" class="scroll-mt-24 py-24 md:py-32">
  <div class="shell">
    <header class="max-w-3xl">
      <h2 class="eyebrow reveal">Beyond the code</h2>
      <p class="reveal display mt-5">Teaching is how I <span class="accent-word">learned</span>.</p>
      <p class="reveal lead mt-6" style="--i:1">Two communities, one channel, 1,500+ people taught.</p>
    </header>

    <div class="mt-16 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-12">
      <div class="md:col-span-7">
        <ul class="border-t border-line">
          ${community
            .map((entry, n) => {
              const tag = entry.href ? "a" : "div";
              const attrs = entry.href ? ` href="${esc(entry.href)}"${ext(entry.href)}` : "";
              return `
          <li class="reveal border-b border-line" ${i(n)}>
            <${tag}${attrs} class="row block py-7 hover:bg-surface-1">
              <div class="row-shift">
                <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 class="font-display text-[1.375rem] font-bold tracking-tight">${esc(entry.name)}</h3>
                  ${entry.href ? icon.arrowUpRight("row-arrow size-4 shrink-0 text-accent-ink") : ""}
                </div>
                <p class="mono mt-1.5 text-[0.75rem] text-ink-3">${esc(entry.role)} · ${esc(entry.period)}</p>
                <p class="prose-measure mt-3 text-[0.9375rem] text-ink-2">${type(entry.text)}</p>
              </div>
            </${tag}>
          </li>`;
            })
            .join("")}
        </ul>
      </div>

      <div class="md:col-span-5 md:col-start-8">
        <h3 class="eyebrow reveal">Recognition</h3>
        <ul class="mt-7 border-t border-line">
          ${awards
            .map(
              (a, n) => `
          <li class="reveal grid grid-cols-[3.75rem_1fr] gap-4 border-b border-line py-4" ${i(n)}>
            <span class="mono pt-0.5 text-[0.75rem] text-ink-3">${esc(a.year)}</span>
            <div>
              <p class="text-[0.9375rem] font-medium text-ink">${esc(a.name)}</p>
              <p class="mt-1 text-[0.875rem] text-ink-3">${type(a.detail)}</p>
            </div>
          </li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
  </div>

  <div class="mt-28 md:mt-36">
    <div class="shell">
      <h3 class="eyebrow reveal">Toolkit</h3>
      <p class="reveal mt-4 text-ink-3">No proficiency bars. Shipped production code in all of it.</p>
    </div>
    <div class="shell mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      ${toolkit
        .map(
          (group, n) => `
      <div class="reveal border-t border-line pt-5" ${i(n)}>
        <h4 class="mono text-[0.75rem] tracking-widest text-accent-ink uppercase">${esc(group.group)}</h4>
        <ul class="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
          ${group.items.map((it) => `<li class="text-[0.9375rem] text-ink-2">${esc(it)}</li>`).join("")}
        </ul>
      </div>`
        )
        .join("")}
    </div>
  </div>
</section>`;

let stats = { fontKB: 0, jsKB: 0 };

const about = () => `
<section id="about" class="scroll-mt-24 py-24 md:py-32">
  <div class="shell">
    <header class="max-w-3xl">
      <h2 class="eyebrow reveal">About</h2>
      <p class="reveal display mt-5">Tashkent <span class="accent-word">to</span> Kunshan.</p>
    </header>

    <div class="mt-16 grid gap-16 md:mt-20 md:grid-cols-12 md:gap-12">
      <div class="md:col-span-6">
        <div class="reveal space-y-5">
          <p class="lead">I started coding because what I wanted did not exist in Uzbek.</p>
          <p class="prose-measure text-ink-2">Everything since follows that shape: an agent drowning in spreadsheets, students priced out of tutoring, buyers guessing at house prices. First year at ${esc(education.school)}, after four years shipping from Tashkent. Full-stack because small teams cannot specialise.</p>
          <p class="prose-measure text-ink-2">Also: two district judo titles. Nothing teaches showing up like losing in front of people.</p>
        </div>
      </div>

      <div class="md:col-span-5 md:col-start-8">
        <div class="reveal">
          <h3 class="eyebrow">Education</h3>
          <div class="mt-6 border-t border-line">
            ${eduEntry(education)}
            ${eduEntry(education.prior)}
          </div>
        </div>

        <div class="reveal mt-12" style="--i:1">
          <h3 class="eyebrow">Languages</h3>
          <dl class="mt-6 border-t border-line">
            ${languages
              .map(
                (l) => `<div class="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
              <dt class="text-[0.9375rem] text-ink">${esc(l.name)}</dt>
              <dd class="mono text-[0.8125rem] text-ink-3">${esc(l.level)}</dd>
            </div>`
              )
              .join("")}
          </dl>
          <p class="mt-5 text-[0.9375rem] text-ink-3">Ask about work authorisation and I will tell you exactly where I stand.</p>
        </div>
      </div>
    </div>

    <div class="reveal mt-28 border-t border-line pt-10 md:mt-36">
      <h3 class="eyebrow">Colophon</h3>
      <div class="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-12">
        <p class="prose-measure text-ink-2 md:col-span-7">
          Hand-written, built by a Node script. No framework, no animation library &mdash; every transition is CSS, so the page reads before a single script runs. The source is public. Fonts are <em class="text-ink not-italic">self-hosted</em>: Google Fonts does not resolve from mainland China, and half my readers are there.
        </p>
        <dl class="md:col-span-4 md:col-start-9">
          <div class="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt class="text-[0.875rem] text-ink-3">Third-party requests</dt><dd class="mono text-[0.8125rem]">0</dd></div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt class="text-[0.875rem] text-ink-3">JavaScript shipped</dt><dd class="mono text-[0.8125rem]">${stats.jsKB} KB</dd></div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt class="text-[0.875rem] text-ink-3">Fonts, self-hosted</dt><dd class="mono text-[0.8125rem]">${stats.fontKB} KB</dd></div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt class="text-[0.875rem] text-ink-3">Domain</dt><dd class="mono text-[0.8125rem]">${esc(person.domain)}</dd></div>
          <div class="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt class="text-[0.875rem] text-ink-3">Source</dt><dd class="mono text-[0.8125rem]"><a href="${esc(person.repo)}" target="_blank" rel="noopener" class="tap text-ink transition-colors duration-300 hover:text-accent-ink"><span class="link-draw">on GitHub ${"↗"}</span></a></dd></div>
        </dl>
      </div>
    </div>
  </div>
</section>`;

const contact = () => `
<div class="marquee select-none border-y border-line py-6" aria-hidden="true">
  <div class="marquee-track">
    ${Array.from({ length: 4 })
      .map(
        () =>
          `<span class="font-display leading-none font-extrabold whitespace-nowrap text-line-strong" style="font-size:clamp(2.5rem,7vw,5.5rem)">Bekhruz Tursunboev<span class="accent-word px-7">&amp;</span></span>`
      )
      .join("")}
  </div>
</div>

<section id="contact" class="scroll-mt-24 py-24 md:py-32">
  <div class="shell">
    <div class="grid gap-16 md:grid-cols-12 md:gap-12">
      <div class="md:col-span-6">
        <h2 class="eyebrow reveal">Contact</h2>
        <p class="reveal display mt-5">Say <span class="accent-word">hello</span>.</p>
        <p class="reveal prose-measure mt-6 text-ink-2" style="--i:1">${esc(availability.detail)} Telegram is fastest; email works just as well and I answer both.</p>
        <div class="reveal mt-10 flex flex-wrap gap-3" style="--i:2">
          <a href="mailto:${esc(person.email)}" class="btn btn-primary magnetic" data-magnet="0.16"><span>${esc(person.email)}</span></a>
          <a href="https://t.me/devbekhruz" target="_blank" rel="noopener" class="btn btn-ghost magnetic" data-magnet="0.16"><span>Telegram</span>${icon.arrowUpRight()}</a>
        </div>
      </div>

      <div class="md:col-span-5 md:col-start-8">
        <h3 class="eyebrow reveal">Elsewhere</h3>
        <ul class="mt-7 border-t border-line">
          ${links
            .map((link, n) => {
              const glyph = icon[link.name] ?? icon.Email;
              const rel = link.href.startsWith("http") ? ' target="_blank" rel="me noopener"' : "";
              return `
          <li class="reveal" ${i(n)}>
            <a href="${esc(link.href)}"${rel} class="row flex items-center gap-4 border-b border-line py-4 hover:bg-surface-1">
              ${glyph("size-[1.0625rem] shrink-0 text-ink-3")}
              <span class="row-shift flex min-w-0 flex-1 items-baseline gap-3">
                <span class="text-[0.9375rem] text-ink">${esc(link.name)}</span>
                <span class="mono truncate text-[0.8125rem] text-ink-3">${esc(link.handle)}</span>
              </span>
              ${icon.arrowUpRight("row-arrow size-4 shrink-0 text-accent-ink")}
            </a>
          </li>`;
            })
            .join("")}
        </ul>
      </div>
    </div>
  </div>
</section>

<footer class="border-t border-line py-10">
  <div class="shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <p class="mono text-[0.75rem] text-ink-3">© ${new Date().getFullYear()} ${esc(person.name)} · ${esc(person.based)}</p>
    <p class="mono text-[0.75rem] text-ink-3">Built from scratch. No template, no page builder.</p>
  </div>
</footer>`;

/* -------------------------------------------------------------------------- */
/* document                                                                    */
/* -------------------------------------------------------------------------- */

// Kept under ~155 characters so search results show it whole, and leading with
// the name because ranking for his own name is the primary goal.
const description =
  "Bekhruz Tursunboev — full-stack and AI engineer from Tashkent, studying at Duke Kunshan University. AI tutoring, property valuation and revenue tools, live.";

const themeScript = `(function(){try{var s=localStorage.getItem("theme");var m=window.matchMedia("(prefers-color-scheme: light)").matches;document.documentElement.dataset.theme=s||(m?"light":"dark")}catch(e){document.documentElement.dataset.theme="dark"}})()`;

const personSchema = {
  "@type": "Person",
  "@id": `${person.url}/#person`,
  name: person.name,
  alternateName: person.nameUz,
  url: person.url,
  email: `mailto:${person.email}`,
  jobTitle: person.role,
  image: `${person.url}/img/portrait-880.webp`,
  description,
  knowsLanguage: ["uz", "ru", "en"],
  homeLocation: { "@type": "Place", name: person.based },
  // alumniOf is the school he finished; the university he currently attends is
  // an affiliation, not an alma mater, until he graduates.
  alumniOf: { "@type": "EducationalOrganization", name: education.prior.school },
  affiliation: { "@type": "CollegeOrUniversity", name: education.school },
  worksFor: { "@type": "Organization", name: "55 KVARTAL" },
  knowsAbout: [
    "Full-stack web development",
    "TypeScript",
    "Next.js",
    "React",
    "Python",
    "PostgreSQL",
    "AI engineering",
    "Prompt engineering",
  ],
  sameAs: links.filter((l) => l.href.startsWith("http")).map((l) => l.href),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    personSchema,
    {
      "@type": "WebSite",
      "@id": `${person.url}/#website`,
      url: `${person.url}/`,
      name: person.name,
      description,
      inLanguage: "en",
      publisher: { "@id": `${person.url}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${person.url}/#page`,
      url: `${person.url}/`,
      name: `${person.name} — ${person.role}`,
      isPartOf: { "@id": `${person.url}/#website` },
      about: { "@id": `${person.url}/#person` },
      primaryImageOfPage: `${person.url}/og.png`,
    },
  ],
};

/** Minimal 404. Same tokens and type as the site, no scripts, no images. */
export function render404({ cssHref }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Not found — ${esc(person.name)}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>${themeScript}</script>
<link rel="stylesheet" href="${esc(cssHref)}">
</head>
<body>
<main class="shell grid min-h-[100dvh] place-items-center py-24">
  <div class="max-w-xl">
    <p class="eyebrow">Error 404</p>
    <h1 class="display mt-6">This page does not <span class="accent-word">exist</span>.</h1>
    <p class="lead mt-6">Nothing here. The link was probably wrong, or I moved something.</p>
    <div class="mt-10 flex flex-wrap gap-3">
      <a href="/" class="btn btn-primary"><span>Back to the site</span></a>
      <a href="mailto:${esc(person.email)}" class="btn btn-ghost"><span>Tell me it is broken</span></a>
    </div>
  </div>
</main>
</body>
</html>
`;
}

export function renderPage({ cssHref, jsHref, fontKB = 0, jsKB = 0 }) {
  stats = { fontKB, jsKB };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(person.name)} — ${esc(person.role)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(person.url)}/">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="manifest" href="/site.webmanifest">
<meta name="author" content="${esc(person.name)}">
<meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f8f4ee" media="(prefers-color-scheme: light)">
<meta name="color-scheme" content="dark light">

<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(person.name)} — ${esc(person.role)}">
<meta property="og:description" content="${esc(intro.lead)}">
<meta property="og:url" content="${esc(person.url)}/">
<meta property="og:site_name" content="${esc(person.domain)}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="${esc(person.url)}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(person.name)}, ${esc(person.role)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(person.name)} — ${esc(person.role)}">
<meta name="twitter:description" content="${esc(intro.lead)}">
<meta name="twitter:image" content="${esc(person.url)}/og.png">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">

<link rel="preload" as="image" type="image/avif" fetchpriority="high"
  href="/img/portrait-640.avif"
  imagesrcset="/img/portrait-420.avif 420w, /img/portrait-640.avif 640w, /img/portrait-880.avif 880w"
  imagesizes="(min-width:1024px) 22rem, (min-width:768px) 32vw, 18rem">
<link rel="preload" href="/fonts/CabinetGrotesk-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/InstrumentSerif-italic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Satoshi-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Satoshi-500.woff2" as="font" type="font/woff2" crossorigin>

<script>${themeScript}</script>
<link rel="stylesheet" href="${esc(cssHref)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
${nav()}
<main>
${hero()}
${work()}
${experienceSection()}
${beyond()}
${about()}
${contact()}
</main>
<script src="${esc(jsHref)}" defer></script>
</body>
</html>
`;
}
