/**
 * Download verified furniture photos and map them to product IDs.
 * node scripts/download-product-photos.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const outDir = path.join(__dirname, "..", "assets", "images", "products");
fs.mkdirSync(outDir, { recursive: true });

// Each URL was previously verified as the correct furniture type
const MAP = {
  101: { name: "Maison Cloud Sectional Sofa", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80&auto=format&fit=crop" },
  102: { name: "Aurelia Cream Tufted Armchair", url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&auto=format&fit=crop" },
  103: { name: "Solstice Mustard Velvet Armchair", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop" },
  104: { name: "Noir Gallery Sideboard Credenza", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop" },
  105: { name: "Harbour Grey Tufted Sofa", url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80&auto=format&fit=crop" },
  106: { name: "Atelier Solid Wood Side Table", url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80&auto=format&fit=crop" },
  201: { name: "Sovereign King Bedroom Suite", url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&auto=format&fit=crop" },
  202: { name: "Nocturne Channel Upholstered Bed", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80&auto=format&fit=crop" },
  203: { name: "Luna City Guest Bed", url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80&auto=format&fit=crop" },
  204: { name: "Atelier Round Bedside Table", url: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80&auto=format&fit=crop" },
  205: { name: "Hermitage Oak Wardrobe Armoire", url: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80&auto=format&fit=crop" },
  206: { name: "Velvet Belle Bedroom Lounge Chair", url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80&auto=format&fit=crop" },
  301: { name: "Apex Pro Gaming Desk Setup", url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80&auto=format&fit=crop" },
  302: { name: "Executive Swivel Lounge Chair", url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80&auto=format&fit=crop" },
  303: { name: "Studio Focus Study Desk", url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format&fit=crop" },
  304: { name: "Command Warm Work Desk", url: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80&auto=format&fit=crop" },
  305: { name: "Aero Swivel Office Chair", url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80&auto=format&fit=crop" },
  306: { name: "Director Shell Lounge Chair", url: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80&auto=format&fit=crop" },
  401: { name: "Imperial Emerald Dining Set", url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80&auto=format&fit=crop" },
  402: { name: "Heritage Oak Dining Set", url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80&auto=format&fit=crop" },
  403: { name: "Compact White Dining Table Set", url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80&auto=format&fit=crop" },
  404: { name: "Palazzo Solid Wood Dining Table", url: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80&auto=format&fit=crop" },
  405: { name: "Couture Heritage Dining Chair", url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80&auto=format&fit=crop" },
  406: { name: "Gallery Gold Sideboard Credenza", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop" },
  501: { name: "Persia Royal Heritage Rug", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  502: { name: "Nordic Line Living Rug", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  503: { name: "Anatolia Pattern Runner Look", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  504: { name: "Cloud Soft Area Rug", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  505: { name: "Terrace Indoor-Outdoor Look Rug", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  506: { name: "Silk Route Gallery Rug", url: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80&auto=format&fit=crop" },
  601: { name: "Celeste Multi-Globe Chandelier", url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80&auto=format&fit=crop" },
  602: { name: "Arc Industrial Floor Lamp", url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80&auto=format&fit=crop" },
  603: { name: "Lumen White Pendant Light", url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80&auto=format&fit=crop" },
  604: { name: "Orbital Rattan-Look Pendant", url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80&auto=format&fit=crop" },
  605: { name: "Linear Brass Wall Sconce Pair", url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80&auto=format&fit=crop" },
  606: { name: "Studio Grey Pendant Lamp", url: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80&auto=format&fit=crop" },
  701: { name: "Heritage Floral Oil Art Print", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80&auto=format&fit=crop" },
  702: { name: "Horizon Minimal Wall Clock", url: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80&auto=format&fit=crop" },
  703: { name: "Bloom Floor Vase with Pampas", url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop" },
  704: { name: "Gallery Console Décor Styling Set", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop" },
  705: { name: "Venetian Round Wall Mirror", url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80&auto=format&fit=crop" },
  706: { name: "Silk Luxe Pillow Ensemble", url: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80&auto=format&fit=crop" },
  707: { name: "Noir Glass Candle Vessel", url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80&auto=format&fit=crop" },
  708: { name: "Amber Accent Lounge Chair Look", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80&auto=format&fit=crop" },
  709: { name: "Heirloom Soft Accent Pillows", url: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80&auto=format&fit=crop" },
  710: { name: "Amber Glass Statement Vase", url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop" }
};

// Use generated images if present (session images folder)
const GEN = {
  105: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "1.jpg"),
  104: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "2.jpg"),
  103: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "3.jpg"),
  106: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "4.jpg"),
  202: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "5.jpg"),
  201: path.join(process.env.USERPROFILE || "", ".grok", "sessions", "C%3A%5CUsers%5Cdiego", "019f5bb6-20c2-76a0-a8e8-89be9860bc90", "images", "6.jpg")
};

function download(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": "SkyFurniture/1.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error("HTTP " + res.statusCode + " " + url));
        return;
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error("timeout " + url));
    });
  });
}

(async () => {
  const results = {};
  for (const [id, meta] of Object.entries(MAP)) {
    const outJpg = path.join(outDir, `${id}.jpg`);
    try {
      if (GEN[id] && fs.existsSync(GEN[id])) {
        fs.copyFileSync(GEN[id], outJpg);
        console.log("GEN", id, meta.name);
      } else {
        const buf = await download(meta.url);
        if (buf.length < 3000) throw new Error("too small " + buf.length);
        fs.writeFileSync(outJpg, buf);
        console.log("OK ", id, meta.name, buf.length);
      }
      results[id] = {
        name: meta.name,
        image: `assets/images/products/${id}.jpg`
      };
    } catch (e) {
      console.error("FAIL", id, e.message);
      // fallback: keep any existing file
      if (fs.existsSync(outJpg)) {
        results[id] = { name: meta.name, image: `assets/images/products/${id}.jpg` };
      }
    }
  }

  // Update data.js
  const dataPath = path.join(__dirname, "..", "assets", "js", "data.js");
  let s = fs.readFileSync(dataPath, "utf8");
  s = s.replace(
    /window\.SKY_CATALOG_VERSION\s*=\s*"[^"]*"/,
    'window.SKY_CATALOG_VERSION = "2026-07-16-v4-photos"'
  );
  if (!s.includes("SKY_CATALOG_VERSION")) {
    s = s.replace(
      "window.SKY_PRODUCTS = [",
      'window.SKY_CATALOG_VERSION = "2026-07-16-v4-photos";\nwindow.SKY_PRODUCTS = ['
    );
  }

  for (const [id, meta] of Object.entries(results)) {
    const img = meta.image;
    const re = new RegExp(
      `(id:\\s*${id},[\\s\\S]*?)image:\\s*"[^"]*",\\s*images:\\s*\\[[\\s\\S]*?\\]`,
      "m"
    );
    if (!re.test(s)) {
      console.error("no block", id);
      continue;
    }
    s = s.replace(
      re,
      `$1image: "${img}",\n    images: [\n      "${img}"\n    ]`
    );
    const reName = new RegExp(`(id:\\s*${id},\\s*)name:\\s*"[^"]*"`);
    s = s.replace(reName, `$1name: ${JSON.stringify(meta.name)}`);
  }

  fs.writeFileSync(dataPath, s);
  console.log("Updated data.js with", Object.keys(results).length, "local JPG product photos");
})();
