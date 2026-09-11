// Builds public/og.png (1200x630), the card Telegram / LinkedIn / X render when
// the link is shared. Generated once here rather than at request time, so the
// static export stays a pile of files with no server behind it.
import sharp from "sharp";

const W = 1200, H = 630, PANEL = 470;
const BG = "#141210", INK = "#f6efe7", MUTED = "#a39a90", ACCENT = "#f97316";

const portrait = await sharp("personal_shoot.JPG")
  .rotate()
  .extract({ left: 763, top: 1180, width: 1456, height: 1820 })
  .resize({ width: PANEL, height: H, position: "top" })
  .toBuffer();

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const FONT = "Segoe UI Semibold, Segoe UI, Arial, sans-serif";
const MONO = "Consolas, Courier New, monospace";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <g font-family="${MONO}" font-size="19" fill="${MUTED}" letter-spacing="2.4">
    <text x="72" y="88">KUNSHAN, CHINA</text>
  </g>
  <circle cx="368" cy="81" r="5" fill="${ACCENT}"/>
  <text x="386" y="88" font-family="${MONO}" font-size="19" fill="${MUTED}" letter-spacing="2.4">OPEN TO INTERNSHIPS</text>

  <text x="68" y="246" font-family="${FONT}" font-size="92" font-weight="700" fill="${INK}" letter-spacing="-3.6">Bekhruz</text>
  <text x="68" y="340" font-family="Georgia, serif" font-size="92" font-style="italic" fill="${MUTED}" letter-spacing="-2.4">Tursunboev</text>

  <rect x="70" y="392" width="58" height="2" fill="${ACCENT}"/>

  <text x="68" y="452" font-family="${FONT}" font-size="30" fill="${INK}">${esc("Full-stack & AI engineer")}</text>
  <text x="68" y="502" font-family="${FONT}" font-size="24" fill="${MUTED}">${esc("AI tutoring · property valuation · revenue tools")}</text>

  <text x="68" y="576" font-family="${MONO}" font-size="21" fill="${ACCENT}" letter-spacing="0.6">bekhruztursunbaev.com</text>

  <rect x="${W - PANEL}" y="0" width="2" height="${H}" fill="#2b2622"/>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: portrait, left: W - PANEL, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");

const { size, width, height } = await sharp("public/og.png").metadata();
console.log(`og.png ${width}x${height}  ${Math.round(size / 1024)} KB`);
