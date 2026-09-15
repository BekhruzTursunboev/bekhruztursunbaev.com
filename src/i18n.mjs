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
    toolkitLead: "No proficiency bars. Shipped production code in all of it.",

    about: "About",
    aboutHeadA: "Tashkent",
    aboutHeadAccent: "to",
    aboutHeadB: "Kunshan.",
    aboutLead: "I started coding because what I wanted did not exist in Uzbek.",
    aboutBody:
      "Everything since follows that shape: an agent drowning in spreadsheets, students priced out of tutoring, buyers guessing at house prices. First year at {school}, after four years shipping from Tashkent. Full-stack because small teams cannot specialise.",
    aboutJudo: "Also: two district judo titles. Nothing teaches showing up like losing in front of people.",
    education: "Education",
    languages: "Languages",
    workAuth: "Ask about work authorisation and I will tell you exactly where I stand.",

    colophon: "Colophon",
    colophonBody:
      "Hand-written, built by a Node script. No framework, no animation library — every transition is CSS, so the page reads before a single script runs. The source is public. Fonts are {selfHosted}: Google Fonts does not resolve from mainland China, and half my readers are there.",
    colophonSelfHosted: "self-hosted",
    statThirdParty: "Third-party requests",
    statJs: "JavaScript shipped",
    statFonts: "Fonts, self-hosted",
    statDomain: "Domain",
    statSource: "Source",
    statSourceValue: "on GitHub ↗",

    contact: "Contact",
    contactHeadA: "Say",
    contactHeadAccent: "hello",
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
    skip: "Kontentga o’tish",
    sections: "Bo’limlar",
    cv: "Rezyume",
    cvFull: "Rezyume",
    themeToggle: "Yorug’ va qorong’i mavzuni almashtirish",
    menuOpen: "Bo’limlar menyusini ochish",
    menuClose: "Bo’limlar menyusini yopish",
    langSwitch: "Read in English",
    langSwitchAria: "Read this page in English",

    currently: "Hozir",
    seeWork: "Ishlarni ko’rish",

    selectedWork: "Tanlangan ishlar",
    workHeadA: "To’rttasi hozir",
    workHeadAccent: "ishlayapti",
    workLead: "Ikkitasi batafsil yozilgan. Qolganlari kod havolasi bilan.",
    alsoBuilt: "Shuningdek",
    liveSite: "Sayt",
    live: "Sayt",
    source: "Kod",
    moreRepos: "GitHub’da yana 30 dan ortig’i",
    moreReposTail: "— o’yinlar, Telegram botlar, tajribalar.",

    experience: "Tajriba",
    experienceHeadA: "2022 dan buyon",
    experienceHeadAccent: "pullik",
    experienceHeadB: "injinerlik.",

    beyond: "Koddan tashqari",
    beyondHeadA: "O’rgatib",
    beyondHeadAccent: "o’rgandim",
    beyondLead: "Ikki jamoa, bitta kanal, 1,500+ o’quvchi.",
    recognition: "E’tirof",
    toolkit: "Vositalar",
    toolkitLead: "Foiz ko’rsatkichlari yo’q. Hammasida production kod yozgan.",

    about: "Men haqimda",
    aboutHeadA: "Toshkentdan",
    aboutHeadAccent: "Kunshanga",
    aboutHeadB: ".",
    aboutLead: "Kod yozishni boshladim, chunki o’zim xohlagan narsa o’zbek tilida yo’q edi.",
    aboutBody:
      "O’shandan beri hammasi shu shaklda: jadvalga ko’milgan agent, repetitorlik qimmat bo’lgan o’quvchilar, uy narxini taxmin qiladigan xaridorlar. Toshkentda to’rt yil ishlagach, hozir {school} birinchi kursida. Full-stack — chunki kichik jamoalar bitta yo’nalishga ixtisoslasha olmaydi.",
    aboutJudo: "Yana: judo bo’yicha ikki marta tuman chempioni. Odamlar oldida yutqazishdek hech narsa qat’iyat o’rgatmaydi.",
    education: "Ta’lim",
    languages: "Tillar",
    workAuth: "Ishlash ruxsati haqida so’rang — aniq holatimni aytaman.",

    colophon: "Sayt haqida",
    colophonBody:
      "Qo’lda yozilgan, Node skripti bilan yig’ilgan. Framework ham, animatsiya kutubxonasi ham yo’q — barcha o’tishlar CSS, shuning uchun sahifa bitta skript ishlashidan oldin o’qiladi. Kodi ochiq. Shriftlar {selfHosted}: Google Fonts Xitoydan ochilmaydi, o’quvchilarimning yarmi esa o’sha yerda.",
    colophonSelfHosted: "o’z serverimda",
    statThirdParty: "Uchinchi tomon so’rovlari",
    statJs: "JavaScript hajmi",
    statFonts: "Shriftlar, o’z serverida",
    statDomain: "Domen",
    statSource: "Kod",
    statSourceValue: "GitHub’da ↗",

    contact: "Aloqa",
    contactHeadA: "Salom",
    contactHeadAccent: "yozing",
    contactBody: "Telegram eng tez; email ham xuddi shunday ishlaydi, ikkisiga ham javob beraman.",
    elsewhere: "Boshqa joylarda",
    telegram: "Telegram",

    footerNote: "Noldan yozilgan. Shablon ham, sayt yasovchi ham yo’q.",

    ogPlace: "Kunshan, Xitoy",
    ogRole: "Full-stack va AI injineri",
    ogTagline: "AI repetitorlik · mulk baholash · daromad vositalari",

    notFoundTitle: "Topilmadi",
    notFoundHeadA: "Bunday sahifa",
    notFoundHeadAccent: "mavjud emas",
    notFoundBody: "Bu yerda hech narsa yo’q. Havola xato bo’lgan yoki men biror narsani ko’chirgan.",
    notFoundBack: "Saytga qaytish",
    notFoundReport: "Buzilganini aytish",

    metaDescription:
      "Bekhruz Tursunboev — Toshkentdan full-stack va AI injineri, Duke Kunshan talabasi. AI repetitorlik, mulk baholash va daromad vositalari.",
  },
};

/** Fills {placeholders} in a UI string. */
export const fill = (template, values) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
