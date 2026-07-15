const fs = require("fs");
const s = fs.readFileSync("assets/js/data.js", "utf8");
console.log("version", /SKY_CATALOG_VERSION\s*=\s*"([^"]+)"/.exec(s)?.[1]);
const imgs = [...s.matchAll(/image:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log("sample", imgs.slice(0, 3));
const missing = imgs.filter((u) => u.startsWith("assets/") && !fs.existsSync(u));
console.log("missing files", missing.length, missing.slice(0, 5));
