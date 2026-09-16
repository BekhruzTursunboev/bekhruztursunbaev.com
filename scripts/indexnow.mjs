// Notifies Bing, Yandex, Seznam and Naver that pages changed, via IndexNow.
//
//   npm run indexnow
//
// Google does not participate -- it uses Search Console and the sitemap instead.
// Yandex does, which matters for a site with Uzbek and Russian-speaking readers.
//
// Authentication is a key file served from the site's own root: the search
// engine fetches https://<host>/<key>.txt and expects it to contain the key.
// The key is read from that file's name so there is one source of truth.
import { readdir, readFile } from "node:fs/promises";
import { LANGS, langPath } from "../src/i18n.mjs";
import { person } from "../src/site.mjs";

const PUBLIC = "public";
const host = new URL(person.url).host;

const keyFiles = (await readdir(PUBLIC)).filter((name) => /^[0-9a-f]{8,128}\.txt$/i.test(name));
if (keyFiles.length !== 1) {
  throw new Error(
    `expected exactly one IndexNow key file in ${PUBLIC}/, found ${keyFiles.length || "none"}`
  );
}
const key = keyFiles[0].replace(/\.txt$/i, "");
const contents = (await readFile(`${PUBLIC}/${keyFiles[0]}`, "utf8")).trim();
if (contents !== key) {
  throw new Error(`${keyFiles[0]} must contain exactly its own key; it contains ${contents.slice(0, 20)}…`);
}

const urlList = LANGS.map((lang) => `${person.url}${langPath(lang)}`);
const payload = {
  host,
  key,
  keyLocation: `${person.url}/${keyFiles[0]}`,
  urlList,
};

// The key file has to be reachable before submitting, or the endpoint accepts
// the request and then silently rejects it on verification.
const probe = await fetch(payload.keyLocation);
if (!probe.ok) {
  throw new Error(`key file is not reachable at ${payload.keyLocation} (HTTP ${probe.status}) — deploy first`);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

console.log(`  submitted ${urlList.length} URLs for ${host}`);
for (const url of urlList) console.log(`    ${url}`);
// 200 accepted, 202 accepted but key still being validated.
console.log(`  IndexNow responded ${response.status} ${response.statusText}`);
if (![200, 202].includes(response.status)) {
  console.error(`  body: ${(await response.text()).slice(0, 300)}`);
  process.exitCode = 1;
}
