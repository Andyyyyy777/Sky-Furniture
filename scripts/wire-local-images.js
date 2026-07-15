const fs = require("fs");
const path = require("path");

const list = JSON.parse(
  fs.readFileSync(path.join(__dirname, "product-list.json"), "utf8")
);
const dataPath = path.join(__dirname, "..", "assets", "js", "data.js");
let s = fs.readFileSync(dataPath, "utf8");

// Relative to site root pages (index.html, shop.html) — no leading slash
let n = 0;
for (const p of list) {
  const img = `assets/images/products/${p.id}.svg`;
  const re = new RegExp(
    `(id:\\s*${p.id},[\\s\\S]*?)image:\\s*"[^"]*",\\s*images:\\s*\\[[\\s\\S]*?\\]`,
    "m"
  );
  if (!re.test(s)) {
    console.error("miss", p.id);
    continue;
  }
  s = s.replace(
    re,
    `$1image: "${img}",\n    images: [\n      "${img}"\n    ]`
  );
  n++;
}

for (const p of list) {
  const reName = new RegExp(`(id:\\s*${p.id},\\s*)name:\\s*"[^"]*"`);
  if (reName.test(s)) {
    s = s.replace(reName, `$1name: ${JSON.stringify(p.name)}`);
  }
}

// Catalog version so browsers drop stale localStorage catalogs
if (!s.includes("SKY_CATALOG_VERSION")) {
  s = s.replace(
    "window.SKY_PRODUCTS = [",
    'window.SKY_CATALOG_VERSION = "2026-07-16-v3";\nwindow.SKY_PRODUCTS = ['
  );
} else {
  s = s.replace(
    /window\.SKY_CATALOG_VERSION\s*=\s*"[^"]*"/,
    'window.SKY_CATALOG_VERSION = "2026-07-16-v3"'
  );
}

fs.writeFileSync(dataPath, s);
console.log("Wired", n, "products to relative SVG paths + catalog version");
