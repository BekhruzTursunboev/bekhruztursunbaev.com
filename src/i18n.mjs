/**
 * Languages and the interface strings that are not content.
 *
 * English is the default and lives at `/`; Uzbek lives at `/uz/`. Both are
 * rendered at build time as complete, separately indexable pages -- there is no
 * client-side switching, so neither language costs the other anything.
 *
 * On the apostrophe: correct Uzbek Latin writes oʻ and gʻ with U+02BB, and the
 * tutuq belgisi with U+02BC. None of the four webfonts here carry either
 * codepoint, so those characters would render from a fallback font and the text
 * would visibly break mid-word. The copy therefore uses U+2019, which every
 * family has and which is what Uzbek sites overwhelmingly use in practice.
 * `npm run fonts` asserts U+2019 is present so this cannot regress silently.
 */

export const LANGS = ["en", "uz"];
export const DEFAULT_LANG = "en";

/** Where each language is served from. */
export const langPath = (lang) => (lang === DEFAULT_LANG ? "/" : `/${lang}/`);

export const langMeta = {
  en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_US" },
  uz: { label: "O’zbekcha", short: "UZ", htmlLang: "uz", ogLocale: "uz_UZ" },
};

/**
 * Resolves a content value for a language. A plain string is returned as-is, so
 * a field that is identical in both languages -- a name, a date, a stack list --
 * needs no wrapping, and a field that has not been translated yet falls back to
 * English rather than rendering `undefined`.
 */
export const pick = (value, lang) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] ?? value[DEFAULT_LANG];
  }
  return value;
};

export const ui = {
  en: {
    skip: "Skip to content",
    sections: "Sections",
    cv: "CV",
    cvFull: "Curriculum vitae",
    themeToggle: "Switch between light and dark theme",
    menuOpen: "Open section menu",
    menuClose: "Close section menu",
    langSwitch: "O’zbekchada o’qish",
    langSwitchAria: "Read this page in Uzbek",

    currently: "Currently",
    seeWork: "See the work",

    selectedWork: "Selected work",
    workHeadA: "Four of these are",
    workHeadAccent: "live",
    workLead: "Two written up properly. The rest with links to the code.",
    alsoBuilt: "Also built",
    liveSite: "Live site",
    live: "Live",
    source: "Source",
    moreRepos: "30-odd more on",
    moreReposTail: "— games, Telegram bots, experiments.",

    experience: "Experience",
    experienceHeadA: "Paid engineering work",
    experienceHeadAccent: "since",
    experienceHeadB: "2022.",

    beyond: "Beyond the code",
    beyondHeadA: "Teaching is how I",
    beyondHeadAccent: "learned",
    beyondLead: "Two communities, one channel, 1,500+ people taught.",
    recognition: "Recognition",
    toolkit: "Toolkit",
    toolkitLead: "No proficiency bars — just what I work with.",

    about: "About",
    aboutHeadA: "Tashkent",
    aboutHeadAccent: "to",
    aboutHeadB: "Kunshan.",
    aboutLead: "Building and shipping software since 2022.",
    aboutBody:
      "Most of it has real users in Uzbekistan: a real-estate platform that removed 23 hours of manual data entry a week, an AI tutor for 125+ learners, a valuation tool 300+ home buyers have used. Now in my first year at {school}.",
    aboutJudo: "Judo: two-time district champion.",
    education: "Education",
    languages: "Languages",
    workAuth: "Ask about work authorisation and I will tell you exactly where I stand.",

    colophon: "Colophon",
    colophonBody:
      "Hand-written, built by a Node script. No framework, no animation library — every transition is CSS, so the page reads before a single script runs. The source is public. Fonts are {selfHosted}: Google Fonts does not resolve from mainland China.",
    colophonSelfHosted: "self-hosted",
    statThirdParty: "Third-party requests",
    statJs: "JavaScript shipped",
    statFonts: "Fonts, self-hosted",
    statDomain: "Domain",
    statSource: "Source",
    statSourceValue: "on GitHub ↗",

    contact: "Contact",
    contactHeadA: "You can",
    contactHeadAccent: "contact me",
    contactBody: "Telegram is fastest; email works just as well and I answer both.",
    elsewhere: "Elsewhere",
    telegram: "Telegram",

    footerNote: "Built from scratch. No template, no page builder.",

    ogPlace: "Kunshan, China",
    ogRole: "Full-stack & AI engineer",
    ogTagline: "AI tutoring · property valuation · revenue tools",

    notFoundTitle: "Not found",
    notFoundHeadA: "This page does not",
    notFoundHeadAccent: "exist",
    notFoundBody: "Nothing here. The link was probably wrong, or I moved something.",
    notFoundBack: "Back to the site",
    notFoundReport: "Tell me it is broken",

    metaDescription:
      "Bekhruz Tursunboev — full-stack and AI engineer from Tashkent, studying at Duke Kunshan University. AI tutoring, property valuation and revenue tools, live.",
  },

  uz: {
    skip: "Asosiy qismga o’tish",
    sections: "Bo’limlar",
    cv: "Rezyume",
    cvFull: "Rezyume",
    themeToggle: "Yorug’ yoki qorong’i rejimga o’tish",
    menuOpen: "Menyuni ochish",
    menuClose: "Menyuni yopish",
    langSwitch: "Read in English",
    langSwitchAria: "Read this page in English",
    currently: "Hozirda",
    seeWork: "Loyihalarni ko’rish",
    selectedWork: "Loyihalar",
    workHeadA: "To’rt loyiha",
    workHeadAccent: "ishlamoqda",
    workLead: "Ikkitasi batafsil yozilgan, qolganlari uchun kod havolasi bor.",
    alsoBuilt: "Boshqa loyihalar",
    liveSite: "Saytni ochish",
    live: "Sayt",
    source: "Kod",
    moreRepos: "Yana 30 dan ortiq loyiha",
    moreReposTail: "sahifamda — o’yinlar, Telegram botlar va tajribalar.",
    experience: "Tajriba",
    experienceHeadA: "2022 yildan beri",
    experienceHeadAccent: "dasturchi",
    experienceHeadB: "sifatida ishlayman.",
    beyond: "Faoliyat",
    beyondHeadA: "Bilganimni",
    beyondHeadAccent: "o’rgataman",
    beyondLead: "Ikki jamoa, bitta YouTube kanal va 1,500 dan ortiq o’quvchi.",
    recognition: "Yutuqlar",
    toolkit: "Texnologiyalar",
    toolkitLead: "Foizli shkalalarsiz — ishlatadigan texnologiyalarim.",
    about: "Men haqimda",
    aboutHeadA: "Toshkentdan",
    aboutHeadAccent: "Kunshanga",
    aboutHeadB: ".",
    aboutLead: "2022 yildan beri dasturiy mahsulotlar yaratib kelaman.",
    aboutBody: "Ularning aksariyati O’zbekistonda real foydalanuvchilarga ega: haftasiga 23 soatlik qo’lda ma’lumot kiritishni olib tashlagan ko’chmas mulk platformasi, 125+ o’quvchi foydalanadigan AI repetitor va 300+ xaridor foydalangan uy narxini baholash vositasi. Hozir 1-kurs talabasiman — {school}.",
    aboutJudo: "Dzyudo bo’yicha ikki marta tuman chempioni bo’lganman.",
    education: "Ta’lim",
    languages: "Tillar",
    workAuth: "Ishlash huquqi bo’yicha savolingiz bo’lsa, yozing — aniq javob beraman.",
    colophon: "Sayt haqida",
    colophonBody: "Sayt framework’siz, qo’lda yozilgan va Node skripti bilan yig’iladi. Animatsiyalar faqat CSS’da, shuning uchun sahifa JavaScript’siz ham to’liq ochiladi. Manba kodi ochiq. Shriftlar {selfHosted}, chunki Google Fonts Xitoyda ochilmaydi.",
    colophonSelfHosted: "o’z serverimda joylashgan",
    statThirdParty: "Tashqi so’rovlar",
    statJs: "JavaScript hajmi",
    statFonts: "Shriftlar (o’z serverimda)",
    statDomain: "Domen",
    statSource: "Manba kodi",
    statSourceValue: "GitHub ↗",
    contact: "Aloqa",
    contactHeadA: "Men bilan",
    contactHeadAccent: "bog’laning",
    contactBody: "Telegram orqali tezroq javob beraman, email ham bo’ladi.",
    elsewhere: "Havolalar",
    telegram: "Telegram",
    footerNote: "Shablonsiz, noldan yozilgan.",
    ogPlace: "Kunshan, Xitoy",
    ogRole: "Full-stack va AI dasturchi",
    ogTagline: "AI repetitor · uy narxini baholash · daromad hisobi",
    notFoundTitle: "Sahifa topilmadi",
    notFoundHeadA: "Bunday sahifa",
    notFoundHeadAccent: "yo’q",
    notFoundBody: "Havola noto’g’ri yoki sahifa o’chirilgan.",
    notFoundBack: "Bosh sahifaga qaytish",
    notFoundReport: "Xato haqida xabar berish",
    metaDescription: "Bekhruz Tursunboev — Toshkentlik full-stack va AI dasturchi, Duke Kunshan University talabasi. AI repetitor, uy narxini baholash va boshqa loyihalar.",
  },
};

/** Fills {placeholders} in a UI string. */
export const fill = (template, values) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
