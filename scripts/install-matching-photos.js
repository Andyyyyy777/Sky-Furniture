/**
 * Install real product photos that match each product name.
 * Uses local candidate JPGs first, then downloads verified Unsplash photos.
 * node scripts/install-matching-photos.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets", "images", "products");
const candDir = path.join(__dirname, "_candidates");
const genDir = path.join(
  process.env.USERPROFILE || "",
  ".grok",
  "sessions",
  "C%3A%5CUsers%5Cdiego",
  "019f5bb6-20c2-76a0-a8e8-89be9860bc90",
  "images"
);

fs.mkdirSync(outDir, { recursive: true });

// Curated: each product id → name + local candidate file and/or download URL
// URLs chosen so the subject matches the product name (furniture type).
const MAP = {
  101: {
    name: "Maison Cloud Sectional Sofa",
    local: ["sectional.jpg", "sofaL.jpg", "livingSofa.jpg"],
    gen: "1.jpg",
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop"
  },
  102: {
    name: "Aurelia Cream Tufted Armchair",
    local: ["armchair.jpg"],
    url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&auto=format&fit=crop"
  },
  103: {
    name: "Solstice Mustard Velvet Armchair",
    local: ["armchair2.jpg"],
    gen: "3.jpg",
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop"
  },
  104: {
    name: "Noir Gallery Sideboard Credenza",
    local: ["sideboard.jpg", "media.jpg"],
    gen: "2.jpg",
    url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80&auto=format&fit=crop"
  },
  105: {
    name: "Harbour Grey Tufted Sofa",
    local: ["greySofa.jpg", "livingSofa.jpg"],
    gen: "1.jpg",
    url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80&auto=format&fit=crop"
  },
  106: {
    name: "Atelier Solid Wood Side Table",
    local: ["nesting.jpg", "coffee.jpg", "woodTable.jpg"],
    gen: "4.jpg",
    url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80&auto=format&fit=crop"
  },
  201: {
    name: "Sovereign King Bedroom Suite",
    local: ["canopy.jpg", "bed.jpg"],
    gen: "6.jpg",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80&auto=format&fit=crop"
  },
  202: {
    name: "Nocturne Channel Upholstered Bed",
    local: ["bed.jpg"],
    gen: "5.jpg",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&auto=format&fit=crop"
  },
  203: {
    name: "Luna City Guest Bed",
    local: ["bed.jpg", "night.jpg"],
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80&auto=format&fit=crop"
  },
  204: {
    name: "Atelier Round Bedside Table",
    local: ["night.jpg", "nesting.jpg"],
    url: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80&auto=format&fit=crop"
  },
  205: {
    name: "Hermitage Oak Wardrobe Armoire",
    local: ["wardrobe.jpg"],
    url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80&auto=format&fit=crop"
  },
  206: {
    name: "Velvet Belle Bedroom Lounge Chair",
    local: ["lounge.jpg", "armchair.jpg"],
    url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&auto=format&fit=crop"
  },
  301: {
    name: "Apex Pro Gaming Desk Setup",
    local: ["gamingDesk.jpg"],
    url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80&auto=format&fit=crop"
  },
  302: {
    name: "Executive Swivel Lounge Chair",
    local: ["officeChair.jpg", "lounge.jpg"],
    url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80&auto=format&fit=crop"
  },
  303: {
    name: "Studio Focus Study Desk",
    local: ["desk.jpg"],
    url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format&fit=crop"
  },
  304: {
    name: "Command Warm Work Desk",
    local: ["desk.jpg", "gamingDesk.jpg"],
    url: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80&auto=format&fit=crop"
  },
  305: {
    name: "Aero Swivel Office Chair",
    local: ["officeChair.jpg"],
    url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80&auto=format&fit=crop"
  },
  306: {
    name: "Director Shell Lounge Chair",
    local: ["lounge.jpg"],
    url: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80&auto=format&fit=crop"
  },
  401: {
    name: "Imperial Emerald Dining Set",
    local: ["dining.jpg"],
    url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80&auto=format&fit=crop"
  },
  402: {
    name: "Heritage Oak Dining Set",
    local: ["woodTable.jpg", "dining.jpg"],
    url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80&auto=format&fit=crop"
  },
  403: {
    name: "Compact White Dining Table Set",
    local: ["dining.jpg"],
    url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80&auto=format&fit=crop"
  },
  404: {
    name: "Palazzo Solid Wood Dining Table",
    local: ["woodTable.jpg"],
    url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80&auto=format&fit=crop"
  },
  405: {
    name: "Couture Heritage Dining Chair",
    local: ["diningChair.jpg"],
    url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80&auto=format&fit=crop"
  },
  406: {
    name: "Gallery Gold Sideboard Credenza",
    local: ["sideboard.jpg", "media2.jpg"],
    url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80&auto=format&fit=crop"
  },
  501: {
    name: "Persia Royal Heritage Rug",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop"
  },
  502: {
    name: "Nordic Line Living Rug",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop"
  },
  503: {
    name: "Anatolia Pattern Runner Look",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop"
  },
  504: {
    name: "Cloud Soft Area Rug",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80&auto=format&fit=crop"
  },
  505: {
    name: "Terrace Indoor-Outdoor Look Rug",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop"
  },
  506: {
    name: "Silk Route Gallery Rug",
    local: ["rug.jpg"],
    url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop"
  },
  601: {
    name: "Celeste Multi-Globe Chandelier",
    local: ["chandelier.jpg"],
    url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80&auto=format&fit=crop"
  },
  602: {
    name: "Arc Industrial Floor Lamp",
    local: ["floorLamp.jpg"],
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80&auto=format&fit=crop"
  },
  603: {
    name: "Lumen White Pendant Light",
    local: ["tableLamp.jpg", "pendant.jpg"],
    url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80&auto=format&fit=crop"
  },
  604: {
    name: "Orbital Rattan-Look Pendant",
    local: ["pendant.jpg"],
    url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80&auto=format&fit=crop"
  },
  605: {
    name: "Linear Brass Wall Sconce Pair",
    local: ["pendant.jpg", "chandelier.jpg"],
    url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80&auto=format&fit=crop"
  },
  606: {
    name: "Studio Grey Pendant Lamp",
    local: ["chandelier.jpg", "pendant.jpg"],
    url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80&auto=format&fit=crop"
  },
  701: {
    name: "Heritage Floral Oil Art Print",
    local: ["art.jpg"],
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80&auto=format&fit=crop"
  },
  702: {
    name: "Horizon Minimal Wall Clock",
    local: ["clock.jpg"],
    url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80&auto=format&fit=crop"
  },
  703: {
    name: "Bloom Floor Vase with Pampas",
    local: ["vase.jpg"],
    url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop"
  },
  704: {
    name: "Gallery Console Décor Styling Set",
    local: ["sculpture.jpg", "media.jpg"],
    url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop"
  },
  705: {
    name: "Venetian Round Wall Mirror",
    local: ["mirror.jpg"],
    url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop"
  },
  706: {
    name: "Silk Luxe Pillow Ensemble",
    local: ["pillows.jpg"],
    url: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80&auto=format&fit=crop"
  },
  707: {
    name: "Noir Glass Candle Vessel",
    local: ["candles.jpg"],
    url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80&auto=format&fit=crop"
  },
  708: {
    name: "Amber Accent Lounge Chair Look",
    local: ["armchair2.jpg", "lounge.jpg"],
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop"
  },
  709: {
    name: "Heirloom Soft Accent Pillows",
    local: ["pillows.jpg"],
    url: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80&auto=format&fit=crop"
  },
  710: {
    name: "Amber Glass Statement Vase",
    local: ["vase.jpg"],
    url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop"
  }
};

function download(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      { headers: { "User-Agent": "SkyFurniture/1.0", Accept: "image/*" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error("HTTP " + res.statusCode));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

function findLocal(meta) {
  // Prefer generated session photos when present (hand-picked matches)
  if (meta.gen) {
    const p = path.join(genDir, meta.gen);
    if (fs.existsSync(p) && fs.statSync(p).size > 5000) return p;
  }
  for (const name of meta.local || []) {
    const p = path.join(candDir, name);
    if (fs.existsSync(p) && fs.statSync(p).size > 5000) return p;
  }
  return null;
}

(async () => {
  const results = {};
  let ok = 0;
  let fail = 0;

  for (const [id, meta] of Object.entries(MAP)) {
    const outJpg = path.join(outDir, `${id}.jpg`);
    let source = "none";
    try {
      const localPath = findLocal(meta);
      if (localPath) {
        fs.copyFileSync(localPath, outJpg);
        source = "local:" + path.basename(localPath);
      } else if (meta.url) {
        const buf = await download(meta.url);
        if (buf.length < 4000) throw new Error("too small " + buf.length);
        // Reject obvious non-images (HTML error pages)
        const head = buf.slice(0, 20).toString("utf8");
        if (head.includes("<!DOCTYPE") || head.includes("<html")) {
          throw new Error("got HTML not image");
        }
        fs.writeFileSync(outJpg, buf);
        source = "download";
      } else {
        throw new Error("no source");
      }
      const size = fs.statSync(outJpg).size;
      console.log("OK ", id, meta.name.slice(0, 40).padEnd(40), source, size);
      results[id] = { name: meta.name, image: `assets/images/products/${id}.jpg` };
      ok++;
    } catch (e) {
      console.error("FAIL", id, meta.name, e.message);
      fail++;
      if (fs.existsSync(outJpg) && fs.statSync(outJpg).size > 4000) {
        results[id] = { name: meta.name, image: `assets/images/products/${id}.jpg` };
      }
    }
  }

  // Update data.js — point every product at local JPG + bump catalog version
  const dataPath = path.join(root, "assets", "js", "data.js");
  let s = fs.readFileSync(dataPath, "utf8");
  const version = "2026-07-16-v5-matched-photos";
  s = s.replace(
    /window\.SKY_CATALOG_VERSION\s*=\s*"[^"]*"/,
    `window.SKY_CATALOG_VERSION = "${version}"`
  );
  if (!s.includes("SKY_CATALOG_VERSION")) {
    s = s.replace(
      "window.SKY_PRODUCTS = [",
      `window.SKY_CATALOG_VERSION = "${version}";\nwindow.SKY_PRODUCTS = [`
    );
  }

  // Global swap .svg product image paths to .jpg
  s = s.replace(
    /assets\/images\/products\/(\d+)\.svg/g,
    "assets/images/products/$1.jpg"
  );

  for (const [id, meta] of Object.entries(results)) {
    const img = meta.image;
    const re = new RegExp(
      `(id:\\s*${id},[\\s\\S]*?)image:\\s*"[^"]*",\\s*images:\\s*\\[[\\s\\S]*?\\]`,
      "m"
    );
    if (re.test(s)) {
      s = s.replace(re, `$1image: "${img}",\n    images: [\n      "${img}"\n    ]`);
    }
    const reName = new RegExp(`(id:\\s*${id},\\s*)name:\\s*"[^"]*"`);
    s = s.replace(reName, `$1name: ${JSON.stringify(meta.name)}`);
  }

  fs.writeFileSync(dataPath, s);
  console.log("\nDone:", ok, "photos installed,", fail, "failures");
  console.log("data.js updated →", version);
  console.log("JPG count:", fs.readdirSync(outDir).filter((f) => f.endsWith(".jpg")).length);
})();
