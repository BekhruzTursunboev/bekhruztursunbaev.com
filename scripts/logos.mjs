// Fetches the two institution logos and writes optimised copies to public/logos.
// Kept as a script rather than committed blobs alone so the provenance of each
// file is documented and they can be refreshed if either institution rebrands.
//
// Both sit on a constant dark plate in the page. The Target mark is white and
// red and would disappear against the light theme's cream background, and the
// Duke Kunshan mark reads on either ground, so one dark plate suits both.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "public/logos";
const HEIGHT = 120; // ~4x the 30px display height, for dense screens

const SOURCES = [
  {
    slug: "duke-kunshan",
    // Duke Kunshan's official square mark, taken from the icon their own site
    // declares. A square asset keeps both plates the same shape, which is what
    // lets the text in the two rows align.
    url: "https://www.dukekunshan.edu.cn/wp-content/uploads/2025/03/cropped-Icon-192x192.png",
  },
  {
    slug: "target-international-school",
    // From the school site in Bekhruz's own repository.
    url: "https://raw.githubusercontent.com/BekhruzTursunboev/Target-International-School/HEAD/img/logo-blue.png",
  },
];

await mkdir(OUT, { recursive: true });

for (const { slug, url } of SOURCES) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!response.ok) throw new Error(`${slug}: ${response.status} ${response.statusText}`);
  const source = Buffer.from(await response.arrayBuffer());

  // Trim the transparent margin so each mark optically fills its plate, then
  // letterbox back onto an exact square. Both plates are square, so a non-square
  // file would scale down to fit and the two marks would not match in size.
  const trimmed = await sharp(source)
    .trim({ threshold: 10 })
    .resize({ width: HEIGHT, height: HEIGHT, fit: "inside" })
    .toBuffer();

  const square = await sharp({
    create: {
      width: HEIGHT,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: trimmed, gravity: "centre" }])
    // PNG for both, rather than whichever format happens to be smaller per
    // file: the markup references these paths by name, so the extension has to
    // be predictable. A few hundred bytes is not worth a broken image.
    .png({ compressionLevel: 9 })
    .toBuffer();

  const meta = await sharp(square).metadata();
  await writeFile(`${OUT}/${slug}.png`, square);
  console.log(`  ${slug}.png  ${meta.width}x${meta.height}  ${(square.length / 1024).toFixed(1)} KB`);
}
