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
  lead: {
    en: "I build full-stack products with AI inside them.",
    uz: "Men ichida AI bo’lgan full-stack mahsulotlar yarataman.",
  },
  body: {
    en: "Four are live. Each one started with somebody in Tashkent stuck on a problem a spreadsheet could not fix.",
    uz: "To’rttasi ishlab turadi. Har biri Toshkentda kimningdir jadval yecha olmagan muammosidan boshlangan.",
  },
};

export const availability = {
  detail: {
    en: "Taking on freelance full-stack work.",
    uz: "Frilans full-stack ishlarni qabul qilaman.",
  },
};

/** The "what I'm doing right now" block. Keep it to four lines and keep it true. */
export const currently = [
  {
    label: { en: "Engineering", uz: "Injinerlik" },
    text: {
      en: "Software & database engineer at 55 KVARTAL, Tashkent. 430+ listings on a platform I built.",
      uz: "55 KVARTAL (Toshkent) da dasturiy ta’minot va ma’lumotlar bazasi injineri. O’zim qurgan platformada 430+ e’lon.",
    },
  },
  {
    label: { en: "Building", uz: "Yaratilmoqda" },
    text: {
      en: "ZiyoBuddy — an AI tutor. 8,000 requests a month, 125+ learners.",
      uz: "ZiyoBuddy — AI repetitor. Oyiga 8,000 so’rov, 125+ o’quvchi.",
    },
  },
  {
    label: { en: "Studying", uz: "Ta’lim" },
    text: {
      en: "Undergraduate at Duke Kunshan University.",
      uz: "Duke Kunshan universitetining bakalavr talabasi.",
    },
  },
  {
    label: { en: "Running", uz: "Jamoalar" },
    text: {
      en: "Target Coders (36 members) and VocabVibe (1,500+ learners).",
      uz: "Target Coders (36 a’zo) va VocabVibe (1,500+ o’quvchi).",
    },
  },
];

export const projects = [
  {
    slug: "ziyobuddy",
    name: "ZiyoBuddy",
    kind: { en: "AI tutoring platform", uz: "AI repetitorlik platformasi" },
    year: "2025 — present",
    summary: {
      en: "Private tutoring in Uzbekistan is in-person and expensive. This answers the questions instead, across eight subjects.",
      uz: "O’zbekistonda repetitorlik yuzma-yuz va qimmat. Bu esa sakkiz fan bo’yicha savollarga javob beradi.",
    },
    detail: {
      en: [
        "Batched API layer instead of one request per question. That is what holds response time near two seconds under concurrent load.",
        "Accuracy came from prompt structure, not model choice — rebuilding how subject context is assembled moved it up by a third.",
        "Would rebuild: context is still assembled per request. Caching it per session cuts latency and cost.",
      ],
      uz: [
        "Har bir savolga alohida so’rov emas, guruhlangan API qatlami. Shu narsa bir nechta sessiya bir vaqtda ishlaganda javob vaqtini ikki sekund atrofida ushlab turadi.",
        "Aniqlik model tanlashdan emas, prompt tuzilishidan keldi — fan kontekstining yig’ilish usulini qayta qurish uni uchdan biriga oshirdi.",
        "Qayta qurardim: kontekst hali ham har so’rovda yig’iladi. Sessiya bo’yicha keshlash kechikish va xarajatni kamaytiradi.",
      ],
    },
    metrics: [
      { value: "125+", label: { en: "learners", uz: "o’quvchi" } },
      { value: "8,000", label: { en: "requests / month", uz: "so’rov / oy" } },
      { value: "99.7%", label: { en: "uptime", uz: "uzluksiz ishlash" } },
      { value: "2.3s", label: { en: "avg. response", uz: "o’rtacha javob" } },
    ],
    stack: ["TypeScript", "Next.js", "PostgreSQL", "AI APIs"],
    live: "https://ziyobuddy.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/ziyobuddy",
    featured: true,
  },
  {
    slug: "mulktahlilchi",
    name: "MulkTahlilchi",
    kind: { en: "Property valuation tool", uz: "Ko’chmas mulk baholash vositasi" },
    year: "2025 — present",
    summary: {
      en: "Uzbekistan has no public house-price index, so buyers negotiate blind. This scrapes three marketplaces and scores a home on fourteen factors.",
      uz: "O’zbekistonda uy narxlarining ommaviy indeksi yo’q, shuning uchun xaridorlar ko’r-ko’rona savdolashadi. Bu uchta bozordan ma’lumot yig’ib, uyni o’n to’rt mezon bo’yicha baholaydi.",
    },
    detail: {
      en: [
        "Fourteen weighted factors — district, floor, age, area, renovation — because the per-square-metre average is what misleads buyers.",
        "Three marketplaces, three layouts. Scrapers are versioned separately, so a broken one degrades its source instead of the valuation.",
        "The model was never the hard part. Sellers list aspirational prices, so asking price is a signal, not truth.",
      ],
      uz: [
        "O’n to’rt vaznli mezon — tuman, qavat, yoshi, maydoni, ta’miri — chunki xaridorni chalg’itadigan narsa kvadrat metr o’rtachasi.",
        "Uchta bozor, uchta turli tuzilma. Skraperlar alohida versiyalanadi, shuning uchun biri buzilsa faqat o’sha manba zarar ko’radi, baholash emas.",
        "Model hech qachon qiyin qismi bo’lmagan. Sotuvchilar orzu qilgan narxni qo’yadi, shuning uchun so’ralgan narx — signal, haqiqat emas.",
      ],
    },
    metrics: [
      { value: "300+", label: { en: "buyers helped", uz: "xaridorga yordam" } },
      { value: "400+", label: { en: "homes valued", uz: "baholangan uy" } },
      { value: "14", label: { en: "pricing factors", uz: "narx mezoni" } },
      { value: "3", label: { en: "live data sources", uz: "jonli manba" } },
    ],
    stack: ["Python", "Next.js", "TypeScript", "Web scraping"],
    live: "https://mulktahlilchi.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/mulktahlilchi",
    featured: true,
  },
  {
    slug: "revtrak",
    name: "RevTrak",
    kind: { en: "Revenue & task tracking", uz: "Daromad va vazifalar nazorati" },
    year: "2024",
    summary: {
      en: "Transactions, deadlines and analytics in one place, with a model that flags payments likely to slip. Won Ajou Technovate, Teenhack and Yosh Startaperlar.",
      uz: "Tranzaksiyalar, muddatlar va tahlil bir joyda; kechikishi mumkin bo’lgan to’lovlarni belgilaydigan model bilan. Ajou Technovate, Teenhack va Yosh Startaperlar sovrindori.",
    },
    stack: ["TypeScript", "Next.js", "Chart.js"],
    live: "https://rev-trak-flame.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/RevTrak",
    featured: false,
  },
  {
    slug: "trade-qahramon",
    name: "Trade Qahramon",
    kind: { en: "Economics simulator", uz: "Iqtisod simulyatori" },
    year: "2023 — present",
    summary: {
      en: "Supply and demand you can push on and watch react. 15 schools, 135+ students, ~40% better retention.",
      uz: "Talab va taklifni o’zgartirib, natijasini kuzatish mumkin. 15 maktab, 135+ o’quvchi, ~40% yaxshi o’zlashtirish.",
    },
    stack: ["TypeScript", "Next.js", "AI APIs"],
    live: "https://trade-qahramon.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/TradeQahramon",
    featured: false,
  },
  {
    slug: "bexa",
    name: "Bexa",
    kind: { en: "Design rules for AI coding agents", uz: "AI kodlash agentlari uchun dizayn qoidalari" },
    year: "2026",
    summary: {
      en: "SKILL.md files that pull coding agents off their default look — the purple gradient, the three equal cards. My most-starred repo.",
      uz: "Kodlash agentlarini standart ko’rinishdan — binafsha gradient, uchta bir xil karta — chetlatadigan SKILL.md fayllari. Eng ko’p yulduz olgan repozitoriyam.",
    },
    stack: ["Markdown", "Design systems"],
    repo:
      "https://github.com/BekhruzTursunboev/Bexa-professional-frontend-design-skills-for-ai-agents",
    featured: false,
  },
  {
    slug: "target-international-school",
    name: "Target International School",
    kind: { en: "Trilingual school site", uz: "Uch tilli maktab sayti" },
    year: "2026",
    summary: {
      en: "Three languages, five months, still the school's front door.",
      uz: "Uch til, besh oy — hamon maktabning asosiy sahifasi.",
    },
    stack: ["JavaScript", "Tailwind CSS", "HTML/CSS"],
    live: "https://target-international-school.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/Target-International-School",
    featured: false,
  },
];

export const experience = [
  {
    org: "55 KVARTAL",
    orgNote: { en: "Real-estate agency, Tashkent", uz: "Ko’chmas mulk agentligi, Toshkent" },
    role: {
      en: "Software & Database Engineer",
      uz: "Dasturiy ta’minot va ma’lumotlar bazasi injineri",
    },
    period: { en: "Feb 2024 — present", uz: "2024 fev — hozir" },
    points: {
      en: [
        "Built the full-stack platform that manages 430+ property listings, with AI automations that removed roughly 23 hours of manual data entry a week.",
        "Built the internal dashboards agents work in, and integrated REST APIs across three separate platforms.",
      ],
      uz: [
        "430+ ko’chmas mulk e’lonini boshqaradigan full-stack platformani qurdim; AI avtomatlashtirish haftada qo’lda ma’lumot kiritishning taxminan 23 soatini olib tashladi.",
        "Agentlar ishlaydigan ichki paneller qurdim va uchta alohida platforma bo’ylab REST API larni birlashtirdim.",
      ],
    },
  },
  {
    org: "Ibrat Farzandlari",
    orgNote: { en: "Uzbekistan Youth Agency", uz: "O’zbekiston Yoshlar agentligi" },
    role: { en: "Website Manager & Team Lead", uz: "Sayt menejeri va jamoa rahbari" },
    period: { en: "Oct 2024 — Sep 2025", uz: "2024 okt — 2025 sen" },
    points: {
      en: [
        "Led six people building a national debate platform used by 500+ students.",
        "Built a Notion-to-website publishing pipeline that cut the time to publish content by about three quarters.",
        "Ran the sprints, the database architecture decisions and the fortnightly stakeholder reviews.",
      ],
      uz: [
        "500+ o’quvchi foydalanadigan milliy debat platformasini qurgan olti kishilik jamoaga rahbarlik qildim.",
        "Notion dan saytga kontent chiqarish quvurini qurdim; bu nashr qilish vaqtini taxminan to’rtdan uch qismga qisqartirdi.",
        "Sprintlar, ma’lumotlar bazasi arxitekturasi qarorlari va ikki haftalik hisobotlarni boshqardim.",
      ],
    },
  },
  {
    org: "Zonic.uz",
    orgNote: "",
    role: { en: "Junior Backend Developer", uz: "Junior backend dasturchi" },
    period: { en: "Jan 2022 — Jul 2023", uz: "2022 yan — 2023 iyul" },
    points: {
      en: [
        "Wrote a Python Telegram bot with a clean command-handling layer, and moved rendering to Next.js SSR for a ~40% improvement in load time.",
      ],
      uz: [
        "Buyruqlarni toza qatlamda boshqaradigan Python Telegram bot yozdim va renderni Next.js SSR ga o’tkazib, yuklanish vaqtini ~40% yaxshiladim.",
      ],
    },
  },
];

export const community = [
  {
    name: "Target Coders",
    role: { en: "Founder & President", uz: "Asoschi va rais" },
    period: { en: "2024 — present", uz: "2024 — hozir" },
    text: {
      en: "36 members learning React, Next.js and AI tools. The curriculum took a team to a state competition win.",
      uz: "React, Next.js va AI vositalarini o’rganayotgan 36 a’zo. Dastur bir jamoani viloyat tanlovida g’alabaga olib chiqdi.",
    },
  },
  {
    name: "VocabVibe",
    role: { en: "Founder", uz: "Asoschi" },
    period: { en: "2022 — present", uz: "2022 — hozir" },
    text: {
      en: "1,500+ learners on Telegram and TikTok. 200+ posts, 70+ students coached to B1.",
      uz: "Telegram va TikTok da 1,500+ o’quvchi. 200+ post, 70+ o’quvchi B1 darajasiga yetdi.",
    },
  },
  {
    name: "YouTube",
    role: { en: "Content creator", uz: "Kontent muallifi" },
    period: { en: "2022 — present", uz: "2022 — hozir" },
    text: {
      en: "41 bilingual tutorials. 11,000+ views across six countries.",
      uz: "41 ikki tilli darslik. Olti mamlakatdan 11,000+ ko’rish.",
    },
    href: "https://www.youtube.com/@BexruzTursunboev",
  },
];

/**
 * Prize money is deliberately absent from Ajou Technovate and the problem count
 * from GO Code Olympiad: the CV states two different figures for each, so the
 * unambiguous part of the result is all that is claimed here.
 */
export const awards = [
  {
    year: "2025",
    name: "Ajou Technovate Hackathon",
    detail: {
      en: "1st place — AI community-finance app, 38 teams",
      uz: "1-o’rin — AI jamoa-moliya ilovasi, 38 jamoa",
    },
  },
  {
    year: "2025",
    name: "ICT Week",
    detail: {
      en: "Selected by the Ministry of Digital Technologies — AI for Social Good",
      uz: "Raqamli texnologiyalar vazirligi tanlovi — ijtimoiy foyda uchun AI",
    },
  },
  {
    year: "2024",
    name: "Teenhack + Yosh Startaperlar Award",
    detail: { en: "For RevTrak", uz: "RevTrak uchun" },
  },
  {
    year: "2023",
    name: "GO Code Olympiad",
    detail: { en: "2nd place, 86 participants", uz: "2-o’rin, 86 qatnashchi" },
  },
  {
    year: "2023",
    name: "ISIJ Cup",
    detail: {
      en: "B group winner, 125 international participants",
      uz: "B guruh g’olibi, 125 xalqaro qatnashchi",
    },
  },
  {
    year: "2022—24",
    name: "Judo",
    detail: {
      en: "2× district champion, 3× regional qualifier",
      uz: "2 marta tuman chempioni, 3 marta viloyat saralashi",
    },
  },
];

export const toolkit = [
  { group: { en: "Languages", uz: "Tillar" }, items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
  { group: { en: "Frontend", uz: "Frontend" }, items: ["React", "Next.js", "Tailwind CSS", "Chart.js"] },
  { group: { en: "Backend", uz: "Backend" }, items: ["Node.js", "Express", "Django", "REST API design"] },
  { group: { en: "Data", uz: "Ma’lumotlar" }, items: ["PostgreSQL", "MongoDB", "Supabase", "Prisma"] },
  { group: { en: "AI", uz: "AI" }, items: ["Claude API", "OpenAI API", "Prompt engineering"] },
  { group: { en: "Practice", uz: "Amaliyot" }, items: ["Git", "CI/CD", "Agile", "Accessibility"] },
];

/**
 * Logo dimensions are the intrinsic size of the files in public/logos, set so
 * the browser reserves the right box before they load. Both are white-on-dark
 * variants because the page renders them on a constant dark plate.
 */
export const education = {
  school: "Duke Kunshan University",
  note: { en: "Undergraduate", uz: "Bakalavr" },
  period: "2026 — 2030",
  logo: { src: "/logos/duke-kunshan.png", width: 120, height: 120 },
  prior: {
    school: "Target International School",
    note: {
      en: "High school diploma, Business & IT",
      uz: "O’rta maktab diplomi, Biznes va IT",
    },
    period: "2022 — 2026",
    logo: { src: "/logos/target-international-school.png", width: 120, height: 120 },
    points: {
      en: ["GPA 5.0 / 5.0", "Rank 3 of 150", "SAT 1520", "IELTS 7.0"],
      uz: ["GPA 5.0 / 5.0", "150 dan 3-o’rin", "SAT 1520", "IELTS 7.0"],
    },
  },
};

export const languages = [
  {
    name: { en: "Uzbek", uz: "O’zbek" },
    level: { en: "Native", uz: "Ona tili" },
  },
  {
    name: { en: "Russian", uz: "Rus" },
    level: { en: "Professional", uz: "Professional" },
  },
  {
    name: { en: "English", uz: "Ingliz" },
    level: "IELTS 7.0",
  },
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
  { id: "work", label: { en: "Work", uz: "Ishlar" } },
  { id: "experience", label: { en: "Experience", uz: "Tajriba" } },
  { id: "beyond", label: { en: "Beyond", uz: "Qo’shimcha" } },
  { id: "about", label: { en: "About", uz: "Men haqimda" } },
  { id: "contact", label: { en: "Contact", uz: "Aloqa" } },
];
