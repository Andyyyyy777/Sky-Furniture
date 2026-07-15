/**
 * Build elegant SVG product cards that ALWAYS show the exact product name.
 * node scripts/build-product-svgs.js
 */
const fs = require("fs");
const path = require("path");

const list = JSON.parse(
  fs.readFileSync(path.join(__dirname, "product-list.json"), "utf8")
);
const outDir = path.join(__dirname, "..", "assets", "images", "products");
fs.mkdirSync(outDir, { recursive: true });

const icons = {
  "living-room": `<path d="M40 140h240v20H40zm20-70h200v70H60zm20 0V50h40v20m100 0V50h40v20" fill="none" stroke="#C4A77D" stroke-width="6" stroke-linecap="round"/>`,
  bedroom: `<path d="M50 150h220v15H50zm20-55h180v55H70zm10-25h60v25m50 0h60v25" fill="none" stroke="#C4A77D" stroke-width="6" stroke-linecap="round"/>`,
  office: `<path d="M70 70h180v90H70zm30 90v30m120-30v30M90 50h140" fill="none" stroke="#C4A77D" stroke-width="6" stroke-linecap="round"/>`,
  dining: `<ellipse cx="160" cy="95" rx="90" ry="28" fill="none" stroke="#C4A77D" stroke-width="6"/><path d="M90 95v55m140-55v55M70 155h180" fill="none" stroke="#C4A77D" stroke-width="6" stroke-linecap="round"/>`,
  rugs: `<rect x="55" y="70" width="210" height="90" rx="8" fill="none" stroke="#C4A77D" stroke-width="6"/><path d="M75 95h170M75 115h140M75 135h160" stroke="#C4A77D" stroke-width="4" opacity="0.6"/>`,
  lighting: `<path d="M160 40v30m-40 40c0-30 20-45 40-45s40 15 40 45c0 25-20 35-40 50-20-15-40-25-40-50z" fill="none" stroke="#C4A77D" stroke-width="6"/><path d="M145 165h30" stroke="#C4A77D" stroke-width="6" stroke-linecap="round"/>`,
  decor: `<circle cx="160" cy="100" r="55" fill="none" stroke="#C4A77D" stroke-width="6"/><path d="M130 100h60M160 70v60" stroke="#C4A77D" stroke-width="5" stroke-linecap="round"/>`
};

const catLabel = {
  "living-room": "Living Room",
  bedroom: "Bedroom",
  office: "Office",
  dining: "Dining",
  rugs: "Rugs",
  lighting: "Lighting",
  decor: "Decor"
};

function wrapName(name, max = 22) {
  const words = name.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function svgFor(p) {
  const lines = wrapName(p.name);
  const startY = lines.length === 1 ? 248 : lines.length === 2 ? 232 : 220;
  const text = lines
    .map(
      (line, i) =>
        `<text x="200" y="${startY + i * 28}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="#2C2926">${escapeXml(line)}</text>`
    )
    .join("\n  ");
  const icon = icons[p.cat] || icons.decor;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F3EE"/>
      <stop offset="100%" stop-color="#E8E0D5"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)"/>
  <rect x="24" y="24" width="352" height="452" rx="18" fill="#FFFEFC" stroke="#E8E0D5" stroke-width="2"/>
  <text x="200" y="58" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" letter-spacing="3" fill="#8B7355">${escapeXml((catLabel[p.cat] || "Product").toUpperCase())}</text>
  <g transform="translate(40, 90)">${icon}</g>
  ${text}
  <text x="200" y="320" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#8B7355">Sky Furniture</text>
  <line x1="140" y1="340" x2="260" y2="340" stroke="#C4A77D" stroke-width="2"/>
  <text x="200" y="375" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" fill="#78716C">Product ID ${p.id}</text>
  <text x="200" y="430" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11" fill="#A8A29E">Luxury furniture · Made for Nigerian homes</text>
</svg>`;
}

function escapeXml(t) {
  return String(t)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

for (const p of list) {
  const file = path.join(outDir, `${p.id}.svg`);
  fs.writeFileSync(file, svgFor(p));
}
console.log("Wrote", list.length, "SVG product images to assets/images/products/");
