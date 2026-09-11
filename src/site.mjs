/**
 * Single source of truth for every fact on this site.
 *
 * Nothing here is duplicated in a component, so correcting a number, a date or
 * a link means editing exactly one line. Figures are taken from the CV in the
 * repo root; where the CV disagreed with an older source the newer value wins,
 * and figures that could not be reconciled were dropped rather than guessed.
 */

export const person = {
  name: "Bekhruz Tursunboev",
  /** Uzbek spelling, for the `lang`-tagged gloss beside the display name. */
  nameUz: "Bexruz Tursunboyev",
  pronunciation: "bekh-ROOZ  tur-sun-BOH-yev",
  role: "Full-stack & AI engineer",
  based: "Kunshan, China",
  from: "Tashkent, Uzbekistan",
  /** Kunshan sits in China Standard Time year-round. */
  timeZone: "Asia/Shanghai",
  email: "tursunbaevbexruz19@gmail.com",
  phone: "+998 99 838 99 21",
  cv: "/Bekhruz-Tursunboev-CV.pdf",
  domain: "bekhruztursunbaev.com",
  url: "https://bekhruztursunbaev.com",
  repo: "https://github.com/BekhruzTursunboev/bekhruztursunbaev.com",
};

export const intro = {
  lead: "I build full-stack products with AI inside them.",
  body: "Four are live. Each one started with somebody in Tashkent stuck on a problem a spreadsheet could not fix.",
};

export const availability = {
  detail: "Taking on freelance full-stack work.",
};

/** The "what I'm doing right now" block. Keep it to four lines and keep it true. */
export const currently = [
  {
    label: "Engineering",
    text: "Software & database engineer at 55 KVARTAL, Tashkent. 430+ listings on a platform I built.",
  },
  {
    label: "Building",
    text: "ZiyoBuddy — an AI tutor. 8,000 requests a month, 125+ learners.",
  },
  {
    label: "Studying",
    text: "Undergraduate at Duke Kunshan University.",
  },
  {
    label: "Running",
    text: "Target Coders (36 members) and VocabVibe (1,500+ learners).",
  },
];

export const projects = [
  {
    slug: "ziyobuddy",
    name: "ZiyoBuddy",
    kind: "AI tutoring platform",
    year: "2025 — present",
    summary:
      "Private tutoring in Uzbekistan is in-person and expensive. This answers the questions instead, across eight subjects.",
    detail: [
      "Batched API layer instead of one request per question. That is what holds response time near two seconds under concurrent load.",
      "Accuracy came from prompt structure, not model choice — rebuilding how subject context is assembled moved it up by a third.",
      "Would rebuild: context is still assembled per request. Caching it per session cuts latency and cost.",
    ],
    metrics: [
      { value: "125+", label: "learners" },
      { value: "8,000", label: "requests / month" },
      { value: "99.7%", label: "uptime" },
      { value: "2.3s", label: "avg. response" },
    ],
    stack: ["TypeScript", "Next.js", "PostgreSQL", "AI APIs"],
    live: "https://ziyobuddy.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/ziyobuddy",
    featured: true,
  },
  {
    slug: "mulktahlilchi",
    name: "MulkTahlilchi",
    kind: "Property valuation tool",
    year: "2025 — present",
    summary:
      "Uzbekistan has no public house-price index, so buyers negotiate blind. This scrapes three marketplaces and scores a home on fourteen factors.",
    detail: [
      "Fourteen weighted factors — district, floor, age, area, renovation — because the per-square-metre average is what misleads buyers.",
      "Three marketplaces, three layouts. Scrapers are versioned separately, so a broken one degrades its source instead of the valuation.",
      "The model was never the hard part. Sellers list aspirational prices, so asking price is a signal, not truth.",
    ],
    metrics: [
      { value: "300+", label: "buyers helped" },
      { value: "400+", label: "homes valued" },
      { value: "14", label: "pricing factors" },
      { value: "3", label: "live data sources" },
    ],
    stack: ["Python", "Next.js", "TypeScript", "Web scraping"],
    live: "https://mulktahlilchi.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/mulktahlilchi",
    featured: true,
  },
  {
    slug: "revtrak",
    name: "RevTrak",
    kind: "Revenue & task tracking",
    year: "2024",
    summary:
      "Transactions, deadlines and analytics in one place, with a model that flags payments likely to slip. Won Ajou Technovate, Teenhack and Yosh Startaperlar.",
    stack: ["TypeScript", "Next.js", "Chart.js"],
    live: "https://rev-trak-flame.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/RevTrak",
    featured: false,
  },
  {
    slug: "trade-qahramon",
    name: "Trade Qahramon",
    kind: "Economics simulator",
    year: "2023 — present",
    summary:
      "Supply and demand you can push on and watch react. 15 schools, 135+ students, ~40% better retention.",
    stack: ["TypeScript", "Next.js", "AI APIs"],
    live: "https://trade-qahramon.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/TradeQahramon",
    featured: false,
  },
  {
    slug: "bexa",
    name: "Bexa",
    kind: "Design rules for AI coding agents",
    year: "2026",
    summary:
      "SKILL.md files that pull coding agents off their default look — the purple gradient, the three equal cards. My most-starred repo.",
    stack: ["Markdown", "Design systems"],
    repo:
      "https://github.com/BekhruzTursunboev/Bexa-professional-frontend-design-skills-for-ai-agents",
    featured: false,
  },
  {
    slug: "target-international-school",
    name: "Target International School",
    kind: "Trilingual school site",
    year: "2026",
    summary:
      "Three languages, five months, still the school's front door.",
    stack: ["JavaScript", "Tailwind CSS", "HTML/CSS"],
    live: "https://target-international-school.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/Target-International-School",
    featured: false,
  },
];

export const experience = [
  {
    org: "55 KVARTAL",
    orgNote: "Real-estate agency, Tashkent",
    role: "Software & Database Engineer",
    period: "Feb 2024 — present",
    points: [
      "Built the full-stack platform that manages 430+ property listings, with AI automations that removed roughly 23 hours of manual data entry a week.",
      "Built the internal dashboards agents work in, and integrated REST APIs across three separate platforms.",
    ],
  },
  {
    org: "Ibrat Farzandlari",
    orgNote: "Uzbekistan Youth Agency",
    role: "Website Manager & Team Lead",
    period: "Oct 2024 — Sep 2025",
    points: [
      "Led six people building a national debate platform used by 500+ students.",
      "Built a Notion-to-website publishing pipeline that cut the time to publish content by about three quarters.",
      "Ran the sprints, the database architecture decisions and the fortnightly stakeholder reviews.",
    ],
  },
  {
    org: "Zonic.uz",
    orgNote: "",
    role: "Junior Backend Developer",
    period: "Jan 2022 — Jul 2023",
    points: [
      "Wrote a Python Telegram bot with a clean command-handling layer, and moved rendering to Next.js SSR for a ~40% improvement in load time.",
    ],
  },
];

export const community = [
  {
    name: "Target Coders",
    role: "Founder & President",
    period: "2024 — present",
    text: "36 members learning React, Next.js and AI tools. The curriculum took a team to a state competition win.",
  },
  {
    name: "VocabVibe",
    role: "Founder",
    period: "2022 — present",
    text: "1,500+ learners on Telegram and TikTok. 200+ posts, 70+ students coached to B1.",
  },
  {
    name: "YouTube",
    role: "Content creator",
    period: "2022 — present",
    text: "41 bilingual tutorials. 11,000+ views across six countries.",
    href: "https://www.youtube.com/@BexruzTursunboev",
  },
];

/**
 * Prize money is deliberately absent from Ajou Technovate and the problem count
 * from GO Code Olympiad: the CV states two different figures for each, so the
 * unambiguous part of the result is all that is claimed here.
 */
export const awards = [
  { year: "2025", name: "Ajou Technovate Hackathon", detail: "1st place — AI community-finance app, 38 teams" },
  { year: "2025", name: "ICT Week", detail: "Selected by the Ministry of Digital Technologies — AI for Social Good" },
  { year: "2024", name: "Teenhack + Yosh Startaperlar Award", detail: "For RevTrak" },
  { year: "2023", name: "GO Code Olympiad", detail: "2nd place, 86 participants" },
  { year: "2023", name: "ISIJ Cup", detail: "B group winner, 125 international participants" },
  { year: "2022—24", name: "Judo", detail: "2× district champion, 3× regional qualifier" },
];

export const toolkit = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Chart.js"] },
  { group: "Backend", items: ["Node.js", "Express", "Django", "REST API design"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Supabase", "Prisma"] },
  { group: "AI", items: ["Claude API", "OpenAI API", "Prompt engineering"] },
  { group: "Practice", items: ["Git", "CI/CD", "Agile", "Accessibility"] },
];

/**
 * Logo dimensions are the intrinsic size of the files in public/logos, set so
 * the browser reserves the right box before they load. Both are white-on-dark
 * variants because the page renders them on a constant dark plate.
 */
export const education = {
  school: "Duke Kunshan University",
  note: "Undergraduate",
  period: "2026 — 2030",
  logo: { src: "/logos/duke-kunshan.png", width: 120, height: 120 },
  prior: {
    school: "Target International School",
    note: "High school diploma, Business & IT",
    period: "2022 — 2026",
    logo: { src: "/logos/target-international-school.png", width: 120, height: 120 },
    points: ["GPA 5.0 / 5.0", "Rank 3 of 150", "SAT 1520", "IELTS 7.0"],
  },
};

export const languages = [
  { name: "Uzbek", level: "Native" },
  { name: "Russian", level: "Professional" },
  { name: "English", level: "IELTS 7.0" },
];

export const links = [
  { name: "GitHub", href: "https://github.com/BekhruzTursunboev", handle: "BekhruzTursunboev" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/bexruztursunbayev", handle: "bexruztursunbayev" },
  { name: "Telegram", href: "https://t.me/devbekhruz", handle: "@devbekhruz" },
  { name: "YouTube", href: "https://www.youtube.com/@BexruzTursunboev", handle: "@BexruzTursunboev" },
  { name: "Email", href: `mailto:${person.email}`, handle: person.email },
];

/** Powers the nav and the scroll-spy. `id` must match the section element's id. */
export const sections = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "beyond", label: "Beyond" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
