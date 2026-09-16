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
    uz: "AI’ga asoslangan full-stack mahsulotlar yarataman.",
  },
  body: {
    en: "Four are live: an AI tutor, a property valuation tool, a revenue tracker and an economics simulator.",
    uz: "To’rttasi ishlamoqda: AI repetitor, uy narxini baholash vositasi, daromad hisobi tizimi va iqtisodiyot simulyatori.",
  },
};

export const availability = {
  detail: {
    en: "Taking on freelance full-stack work.",
    uz: "Frilans full-stack loyihalarni qabul qilaman.",
  },
};

/** The "what I'm doing right now" block. Keep it to four lines and keep it true. */
export const currently = [
  {
    label: { en: "Engineering", uz: "Ish" },
    text: {
      en: "Software & database engineer at 55 KVARTAL, Tashkent. 430+ listings on a platform I built.",
      uz: "55 KVARTAL (Toshkent) kompaniyasida dasturiy ta’minot va ma’lumotlar bazasi muhandisiman. U yerdagi 430+ e’lon men yaratgan platformada ishlaydi.",
    },
  },
  {
    label: { en: "Building", uz: "Loyiha" },
    text: {
      en: "ZiyoBuddy — an AI tutor. 8,000 requests a month, 125+ learners.",
      uz: "ZiyoBuddy — AI repetitor. Oyiga 8,000 so’rov, 125+ o’quvchi.",
    },
  },
  {
    label: { en: "Studying", uz: "O’qish" },
    text: {
      en: "Undergraduate at Duke Kunshan University.",
      uz: "Duke Kunshan University’da bakalavriatda o’qiyman.",
    },
  },
  {
    label: { en: "Running", uz: "Jamoalar" },
    text: {
      en: "Target Coders (36 members) and VocabVibe (1,500+ learners).",
      uz: "Target Coders (36 a’zo) va VocabVibe (1,500+ o’quvchi) jamoalarini boshqaraman.",
    },
  },
];

export const projects = [
  {
    slug: "ziyobuddy",
    name: "ZiyoBuddy",
    kind: { en: "AI tutoring platform", uz: "AI repetitorlik platformasi" },
    year: { en: "2025 — present", uz: "2025 — hozir" },
    summary: {
      en: "An AI tutor that answers students’ questions across eight subjects.",
      uz: "Sakkiz fan bo’yicha o’quvchilarning savollariga javob beradigan AI repetitor.",
    },
    detail: {
      en: [
        "API calls are batched and concurrent sessions run in parallel, which is what keeps responses fast under load.",
        "Prompt optimisation raised answer accuracy by 35%.",
      ],
      uz: [
        "API so’rovlari guruhlab yuboriladi va sessiyalar parallel ishlaydi, shu tufayli yuklama ostida ham javob tez qaytadi.",
        "Promptlarni optimallashtirish javoblar aniqligini 35% ga oshirdi.",
      ],
    },
    metrics: [
      { value: "125+", label: { en: "learners", uz: "o’quvchi" } },
      { value: "8,000", label: { en: "requests / month", uz: "so’rov / oy" } },
      { value: "99.7%", label: { en: "uptime", uz: "uzluksiz ishlash" } },
      { value: "2.3s", label: { en: "avg. response", uz: "o’rtacha javob vaqti" } },
    ],
    stack: ["TypeScript", "Next.js", "PostgreSQL", "AI APIs"],
    live: "https://ziyobuddy.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/ziyobuddy",
    featured: true,
  },
  {
    slug: "mulktahlilchi",
    name: "MulkTahlilchi",
    kind: { en: "Property valuation tool", uz: "Uy narxini baholash vositasi" },
    year: { en: "2025 — present", uz: "2025 — hozir" },
    summary: {
      en: "An AI tool that estimates home prices in Uzbekistan.",
      uz: "O’zbekistonda uy narxini baholaydigan AI vosita.",
    },
    detail: {
      en: [
        "Scores each home with a 14-factor pricing algorithm.",
        "Uses live listing data from three Uzbek marketplaces.",
      ],
      uz: [
        "Har bir uyni 14 mezonli narx algoritmi bilan baholaydi.",
        "Uchta o’zbek e’lon saytidan jonli ma’lumot oladi.",
      ],
    },
    metrics: [
      { value: "300+", label: { en: "buyers helped", uz: "xaridor" } },
      { value: "400+", label: { en: "homes valued", uz: "baholangan uy" } },
      { value: "14", label: { en: "pricing factors", uz: "narx mezoni" } },
      { value: "3", label: { en: "live data sources", uz: "ma’lumot manbai" } },
    ],
    stack: ["Python", "Next.js", "TypeScript", "Web scraping"],
    live: "https://mulktahlilchi.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/mulktahlilchi",
    featured: true,
  },
  {
    slug: "revtrak",
    name: "RevTrak",
    kind: { en: "Revenue & task tracking", uz: "Daromad va vazifalarni kuzatish" },
    year: "2024",
    summary: {
      en: "Transactions, deadlines and analytics in one place, with a model that flags payments likely to slip. Won Ajou Technovate, Teenhack and Yosh Startaperlar.",
      uz: "To’lovlar, muddatlar va tahlil bitta tizimda, kechikishi mumkin bo’lgan to’lovlarni oldindan ko’rsatadi. Ajou Technovate, Teenhack va Yosh Startaperlar g’olibi.",
    },
    stack: ["TypeScript", "Next.js", "Chart.js"],
    live: "https://rev-trak-flame.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/RevTrak",
    featured: false,
  },
  {
    slug: "trade-qahramon",
    name: "Trade Qahramon",
    kind: { en: "Economics simulator", uz: "Iqtisodiyot simulyatori" },
    year: { en: "2023 — present", uz: "2023 — hozir" },
    summary: {
      en: "Supply and demand you can push on and watch react. 15 schools, 135+ students, ~40% better retention.",
      uz: "Talab va taklifni o’zgartirib, bozor qanday javob berishini ko’rish mumkin. 15 ta maktab, 135+ o’quvchi, mavzuni eslab qolish ~40% yaxshilangan.",
    },
    stack: ["TypeScript", "Next.js", "AI APIs"],
    live: "https://trade-qahramon.vercel.app",
    repo: "https://github.com/BekhruzTursunboev/TradeQahramon",
    featured: false,
  },
  {
    slug: "bexa",
    name: "Bexa",
    kind: { en: "Design rules for AI coding agents", uz: "AI agentlar uchun dizayn qoidalari" },
    year: "2026",
    summary: {
      en: "SKILL.md files that pull coding agents off their default look — the purple gradient, the three equal cards.",
      uz: "Kod yozuvchi AI agentlarni odatiy dizayndan — binafsha gradient va uchta bir xil kartadan — voz kechtiradigan SKILL.md fayllar.",
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
      en: "A three-language website for my school, built over five months.",
      uz: "Maktabim uchun uch tilli sayt, besh oyda yaratilgan.",
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
      uz: "Dasturiy ta’minot va ma’lumotlar bazasi muhandisi",
    },
    period: { en: "Feb 2024 — present", uz: "2024-yil fevral — hozir" },
    points: {
      en: [
        "Built the full-stack platform that manages 430+ property listings, with AI automations that removed roughly 23 hours of manual data entry a week.",
        "Built the internal dashboards agents work in, and integrated REST APIs across three separate platforms.",
      ],
      uz: [
        "430+ ko’chmas mulk e’lonini boshqaradigan full-stack platformani yaratdim. AI yordamidagi avtomatlashtirish haftasiga taxminan 23 soatlik qo’lda ma’lumot kiritishni olib tashladi.",
        "Agentlar ishlaydigan ichki boshqaruv panellarini yaratdim va uchta alohida platformani REST API orqali bog’ladim.",
      ],
    },
  },
  {
    org: "Ibrat Farzandlari",
    orgNote: { en: "Uzbekistan Youth Agency", uz: "Yoshlar ishlari agentligi" },
    role: { en: "Website Manager & Team Lead", uz: "Sayt menejeri va jamoa rahbari" },
    period: { en: "Oct 2024 — Sep 2025", uz: "2024-yil oktyabr — 2025-yil sentyabr" },
    points: {
      en: [
        "Led six people building a national debate platform used by 500+ students.",
        "Built a Notion-to-website publishing pipeline that cut the time to publish content by about three quarters.",
        "Ran the sprints, the database architecture decisions and the fortnightly stakeholder reviews.",
      ],
      uz: [
        "500+ o’quvchi foydalanadigan milliy debat platformasini yaratgan 6 kishilik jamoaga rahbarlik qildim.",
        "Notion’dan saytga kontent chiqarishni avtomatlashtirdim — nashr qilish vaqti taxminan 75% ga qisqardi.",
        "Sprintlarni, ma’lumotlar bazasi arxitekturasi bo’yicha qarorlarni va ikki haftada bir bo’ladigan hisobot uchrashuvlarini boshqardim.",
      ],
    },
  },
  {
    org: "Zonic.uz",
    orgNote: "",
    role: { en: "Junior Backend Developer", uz: "Junior backend dasturchi" },
    period: { en: "Jan 2022 — Jul 2023", uz: "2022-yil yanvar — 2023-yil iyul" },
    points: {
      en: [
        "Wrote a Python Telegram bot with a clean command-handling layer, and moved rendering to Next.js SSR for a ~40% improvement in load time.",
      ],
      uz: [
        "Buyruqlarni aniq tuzilishda qayta ishlaydigan Python Telegram bot yozdim va sahifalarni Next.js SSR’ga o’tkazib, yuklanish vaqtini ~40% ga yaxshiladim.",
      ],
    },
  },
];

export const community = [
  {
    name: "Target Coders",
    role: { en: "Founder & President", uz: "Asoschi va prezident" },
    period: { en: "2024 — present", uz: "2024 — hozir" },
    text: {
      en: "36 members learning React, Next.js and AI tools. The curriculum took a team to a state competition win.",
      uz: "React, Next.js va AI vositalarini o’rganayotgan 36 a’zo. O’quv dasturimiz bilan tayyorlangan jamoa davlat miqyosidagi tanlovda g’olib bo’ldi.",
    },
  },
  {
    name: "VocabVibe",
    role: { en: "Founder", uz: "Asoschi" },
    period: { en: "2022 — present", uz: "2022 — hozir" },
    text: {
      en: "1,500+ learners on Telegram and TikTok. 200+ posts, 70+ students coached to B1.",
      uz: "Telegram va TikTok’da 1,500+ o’quvchi. 200+ post, 70+ o’quvchi B1 darajasiga chiqdi.",
    },
  },
  {
    name: "YouTube",
    role: { en: "Content creator", uz: "Kontent muallifi" },
    period: { en: "2022 — present", uz: "2022 — hozir" },
    text: {
      en: "41 bilingual tutorials. 11,000+ views across six countries.",
      uz: "Ikki tilda 41 ta video darslik. Olti davlatdan 11,000+ ko’rish.",
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
      uz: "1-o’rin — AI asosidagi jamoaviy moliya ilovasi, 38 jamoa",
    },
  },
  {
    year: "2025",
    name: "ICT Week",
    detail: {
      en: "Selected by the Ministry of Digital Technologies — AI for Social Good",
      uz: "Raqamli texnologiyalar vazirligi tomonidan tanlangan — AI for Social Good",
    },
  },
  {
    year: "2024",
    name: "Teenhack + Yosh Startaperlar Award",
    detail: { en: "For RevTrak", uz: "RevTrak loyihasi uchun" },
  },
  {
    year: "2023",
    name: "GO Code Olympiad",
    detail: { en: "2nd place, 86 participants", uz: "2-o’rin, 86 ishtirokchi" },
  },
  {
    year: "2023",
    name: "ISIJ Cup",
    detail: {
      en: "B group winner, 125 international participants",
      uz: "B guruh g’olibi, 125 xalqaro ishtirokchi",
    },
  },
  {
    year: "2022—24",
    name: "Judo",
    detail: {
      en: "2× district champion, 3× regional qualifier",
      uz: "2 marta tuman chempioni, 3 marta viloyat bosqichiga chiqqan",
    },
  },
];

export const toolkit = [
  { group: { en: "Languages", uz: "Dasturlash tillari" }, items: ["TypeScript", "JavaScript", "Python", "C++", "SQL"] },
  { group: { en: "Frontend", uz: "Frontend" }, items: ["React", "Next.js", "Tailwind CSS", "Chart.js"] },
  { group: { en: "Backend", uz: "Backend" }, items: ["Node.js", "Express", "Django", "REST API design"] },
  { group: { en: "Data", uz: "Ma’lumotlar bazasi" }, items: ["PostgreSQL", "MongoDB", "Supabase", "Prisma"] },
  { group: { en: "AI", uz: "AI" }, items: ["Claude API", "OpenAI API", "Prompt engineering"] },
  { group: { en: "Practice", uz: "Jarayonlar" }, items: ["Git", "CI/CD", "Agile", "Accessibility"] },
];

/**
 * Logo dimensions are the intrinsic size of the files in public/logos, set so
 * the browser reserves the right box before they load. Both are white-on-dark
 * variants because the page renders them on a constant dark plate.
 */
export const education = {
  school: "Duke Kunshan University",
  note: { en: "Undergraduate", uz: "Bakalavriat" },
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
      uz: ["GPA 5.0 / 5.0", "150 o’quvchi ichida 3-o’rin", "SAT 1520", "IELTS 7.0"],
    },
  },
};

export const languages = [
  {
    name: { en: "Uzbek", uz: "O’zbek tili" },
    level: { en: "Native", uz: "Ona tili" },
  },
  {
    name: { en: "Russian", uz: "Rus tili" },
    level: { en: "Professional", uz: "Yuqori daraja" },
  },
  {
    name: { en: "English", uz: "Ingliz tili" },
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
  { id: "work", label: { en: "Work", uz: "Loyihalar" } },
  { id: "experience", label: { en: "Experience", uz: "Tajriba" } },
  { id: "beyond", label: { en: "Beyond", uz: "Faoliyat" } },
  { id: "about", label: { en: "About", uz: "Men haqimda" } },
  { id: "contact", label: { en: "Contact", uz: "Aloqa" } },
];
