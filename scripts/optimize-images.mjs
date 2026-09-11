// Asset pipeline: turns the raw studio JPG into a cropped, responsive portrait.
// Run `npm run images` whenever personal_shoot.JPG changes.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SOURCE = "personal_shoot.JPG";
const OUT = "public/img";
const WIDTHS = [420, 640, 880];

// 4:5 editorial crop, framed on the subject rather than the lawn.
// Values are in the EXIF-rotated 3024x4032 coordinate space.
const CROP = { left: 763, top: 1180, width: 1456, height: 1820 };

await mkdir(OUT, { recursive: true });

// metadata() reports pre-rotation dimensions, so swap them when EXIF calls for
// a quarter turn -- CROP is expressed in the *rotated* coordinate space.
const raw = await sharp(SOURCE).metadata();
const turned = [5, 6, 7, 8].includes(raw.orientation ?? 1);
const width = turned ? raw.height : raw.width;
const height = turned ? raw.width : raw.height;
console.log(`source ${raw.width}x${raw.height} -> upright ${width}x${height}`);

if (CROP.left + CROP.width > width || CROP.top + CROP.height > height) {
  throw new Error(
    `crop ${CROP.width}x${CROP.height}+${CROP.left}+${CROP.top} falls outside ${width}x${height}`
  );
}

for (const w of WIDTHS) {
  for (const [format, options] of [
    ["avif", { quality: 60, effort: 6 }],
    ["webp", { quality: 78, effort: 6 }],
  ]) {
    const file = `${OUT}/portrait-${w}.${format}`;
    const { size } = await sharp(SOURCE)
      .rotate()
      .extract(CROP)
      .resize({ width: w })
      .toFormat(format, options)
      .toFile(file);
    console.log(`${String(Math.round(size / 1024)).padStart(4)} KB  ${file}`);
  }
}

const blur = await sharp(SOURCE)
  .rotate()
  .extract(CROP)
  .resize({ width: 12 })
  .webp({ quality: 30 })
  .toBuffer();
console.log(`\nblur (${blur.length}B): data:image/webp;base64,${blur.toString("base64")}`);
