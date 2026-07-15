const fs = require("fs");
const path = require("path");

const list = JSON.parse(
  fs.readFileSync(path.join(__dirname, "product-list.json"), "utf8")
);
const dataPath = path.join(__dirname, "..", "assets", "js", "data.js");
let s = fs.readFileSync(dataPath, "utf8");

let n = 0;
for (const p of list) {
  // Leading slash = site root (works on shop + admin when served via http://localhost or host)
  const img = `/assets/images/products/${p.id}.svg`;
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

// Restore original luxury product names from product-list.json (stable)
for (const p of list) {
  const reName = new RegExp(`(id:\\s*${p.id},\\s*)name:\\s*"[^"]*"`);
  if (reName.test(s)) {
    s = s.replace(reName, `$1name: ${JSON.stringify(p.name)}`);
  }
}

fs.writeFileSync(dataPath, s);
console.log("Wired", n, "products to local SVG images");
