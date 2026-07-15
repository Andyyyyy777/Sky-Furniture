/**
 * Align product names to verified photos (and fix broken/wrong URLs).
 * node scripts/align-catalog.js
 */
const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "..", "assets", "js", "data.js");
let s = fs.readFileSync(file, "utf8");

// Verified image URLs (downloaded + visually checked)
const I = {
  greenSofa: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
  creamChair: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80",
  yellowChair: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
  sectional: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
  greySofa: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
  woodSide: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
  kingBed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
  channelBed: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
  guestBed: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
  wardrobe: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
  nightstand: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80",
  bedroom: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
  desk: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
  swivel: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
  lounge: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80",
  workDesk: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
  gamingSetup: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80",
  diningGreen: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
  diningWood: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
  diningWhite: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80",
  woodChair: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
  goldSideboard: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
  persianRug: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
  floorLamp: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
  pendant: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
  clock: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
  floralArt: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
  candle: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
  pillows: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80",
  // reuse solid product shots for remaining slots
  sofaBrown: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"
};

// name + primary image + alt gallery + short description overrides
const updates = {
  101: {
    name: "Maison Cloud Sectional Sofa",
    image: I.sectional,
    images: [I.sectional, I.greySofa],
    description:
      "Cream L-shaped sectional with chaise, layered pillows, and a soft modern silhouette—built for spacious Lagos living rooms."
  },
  102: {
    name: "Aurelia Cream Tufted Armchair",
    image: I.creamChair,
    images: [I.creamChair, I.yellowChair],
    description:
      "Button-tufted cream velvet armchair with curved arms and classic turned legs—an elegant reading chair."
  },
  103: {
    name: "Solstice Mustard Velvet Armchair",
    image: I.yellowChair,
    images: [I.yellowChair, I.creamChair],
    description:
      "Statement mustard-yellow velvet armchair with slim black legs. Pairs beautifully with a media console and brass floor lamp."
  },
  104: {
    name: "Noir Gallery Sideboard Credenza",
    image: I.goldSideboard,
    images: [I.goldSideboard, I.nightstand],
    description:
      "Gold-framed sideboard with cane doors, styled as a living-room media and bar console under a round mirror."
  },
  105: {
    name: "Harbour Grey Tufted Sofa",
    image: I.greySofa,
    images: [I.greySofa, I.greenSofa],
    description:
      "Button-tufted grey three-seater sofa with throw pillows—cosy everyday luxury for family lounges."
  },
  106: {
    name: "Atelier Solid Wood Side Table",
    image: I.woodSide,
    images: [I.woodSide, I.nightstand],
    description:
      "Sculptural solid-wood side table with open shelves for books and décor—perfect beside a sofa or bed."
  },
  201: {
    name: "Sovereign King Bedroom Suite",
    image: I.kingBed,
    images: [I.kingBed, I.channelBed],
    description:
      "King bed with tall tufted headboard, paired nightstands, and bench—hotel-suite polish for master bedrooms."
  },
  202: {
    name: "Nocturne Channel Upholstered Bed",
    image: I.channelBed,
    images: [I.channelBed, I.guestBed],
    description:
      "Plush light-grey channel-upholstered bed on gold feet, shown with matching nightstands and modern brass chandelier."
  },
  203: {
    name: "Luna City Guest Bed",
    image: I.guestBed,
    images: [I.guestBed, I.kingBed],
    description:
      "Comfortable hotel-style guest bed with padded headboard and wood nightstand—ideal for guest rooms and apartments."
  },
  204: {
    name: "Atelier Round Bedside Table",
    image: I.nightstand,
    images: [I.nightstand, I.woodSide],
    description:
      "Minimal round white bedside table with tapered wood legs—clean Scandinavian styling for any bedroom."
  },
  205: {
    name: "Hermitage Oak Wardrobe Armoire",
    image: I.wardrobe,
    images: [I.wardrobe, I.bedroom],
    description:
      "Full-height mid-century oak wardrobe with double doors and lower drawers—true closet storage without built-ins."
  },
  206: {
    name: "Velvet Belle Bedroom Lounge Chair",
    image: I.yellowChair,
    images: [I.yellowChair, I.creamChair],
    description:
      "Soft accent lounge chair for the foot of the bed or a dressing corner—shown here in rich mustard velvet."
  },
  301: {
    name: "Apex Pro Gaming Desk Setup",
    image: I.gamingSetup,
    images: [I.gamingSetup, I.workDesk],
    description:
      "Full gaming station with dual monitors, RGB PC, and performance chair—ready for marathon sessions."
  },
  302: {
    name: "Executive Swivel Lounge Chair",
    image: I.swivel,
    images: [I.swivel, I.lounge],
    description:
      "Fabric swivel lounge chair on a wood star base—boardroom waiting corners and private offices."
  },
  303: {
    name: "Studio Focus Study Desk",
    image: I.desk,
    images: [I.desk, I.workDesk],
    description:
      "Clean white study desk with monitor setup and grey task chair—focused work from home."
  },
  304: {
    name: "Command Warm Work Desk",
    image: I.workDesk,
    images: [I.workDesk, I.desk],
    description:
      "Warm wood work desk styled for evening productivity—laptop-ready surface with soft lamp light."
  },
  305: {
    name: "Mesh Air Office Task Chair",
    image: I.swivel,
    images: [I.swivel, I.desk],
    description:
      "Lightweight modern office chair with full swivel—all-day seating for hot climates and long workdays."
  },
  306: {
    name: "Director Shell Lounge Chair",
    image: I.lounge,
    images: [I.lounge, I.swivel],
    description:
      "Sculptural white lounge chair with bentwood frame—mid-century calm for offices and reading corners."
  },
  401: {
    name: "Imperial Emerald Dining Set",
    image: I.diningGreen,
    images: [I.diningGreen, I.diningWood],
    description:
      "White dining table with six emerald velvet chairs and gold legs—formal dinners for six to eight."
  },
  402: {
    name: "Heritage Oak Dining Set",
    image: I.diningWood,
    images: [I.diningWood, I.diningGreen],
    description:
      "Solid walnut dining table with grey upholstered chairs under a crystal bar chandelier—everyday family luxury."
  },
  403: {
    name: "Compact White Dining Table Set",
    image: I.diningWhite,
    images: [I.diningWhite, I.diningGreen],
    description:
      "Round white dining table with two modern chairs—perfect for apartments and intimate meals for two to four."
  },
  404: {
    name: "Palazzo Solid Wood Dining Table",
    image: I.diningWood,
    images: [I.diningWood, I.woodChair],
    description:
      "Statement solid-wood dining table that seats a crowd—pair with your preferred chair style."
  },
  405: {
    name: "Couture Heritage Dining Chair",
    image: I.woodChair,
    images: [I.woodChair, I.diningWood],
    description:
      "Classic carved wood dining armchair with warm honey finish—order pairs to complete a traditional suite."
  },
  406: {
    name: "Gallery Gold Sideboard Credenza",
    image: I.goldSideboard,
    images: [I.goldSideboard, I.nightstand],
    description:
      "Gold cane-front sideboard with round wall mirror styling—dining storage that doubles as a bar console."
  },
  501: {
    name: "Persia Royal Heritage Rug",
    image: I.persianRug,
    images: [I.persianRug, I.sectional],
    description:
      "Ornate Persian-style rug in ivory and gold with hand-finished fringe—anchors formal living rooms."
  },
  502: {
    name: "Nordic Line Living Rug",
    image: I.sectional,
    images: [I.sectional, I.persianRug],
    description:
      "Soft light-toned area rug under a modern sectional—clean Scandinavian layering for open living spaces."
  },
  503: {
    name: "Anatolia Pattern Runner Look",
    image: I.persianRug,
    images: [I.persianRug, I.goldSideboard],
    description:
      "Traditional patterned rug with heirloom character—use as a runner look in halls or full-size in living rooms."
  },
  504: {
    name: "Cloud Soft Area Rug",
    image: I.greySofa,
    images: [I.greySofa, I.persianRug],
    description:
      "Soft light area rug styled under a contemporary sofa—barefoot comfort for lounges and bedrooms."
  },
  505: {
    name: "Terrace Indoor-Outdoor Look Rug",
    image: I.sectional,
    images: [I.sectional, I.persianRug],
    description:
      "Neutral textured rug that works from living rooms to covered terraces—durable everyday style."
  },
  506: {
    name: "Silk Route Gallery Rug",
    image: I.persianRug,
    images: [I.persianRug, I.goldSideboard],
    description:
      "Fine gallery rug with jewel-tone heritage patterning—collector finish for statement furniture."
  },
  601: {
    name: "Celeste Multi-Globe Chandelier",
    image: I.diningGreen,
    images: [I.diningGreen, I.pendant],
    description:
      "Modern multi-globe chandelier in brass and white glass—shown over a formal dining table."
  },
  602: {
    name: "Arc Industrial Floor Lamp",
    image: I.floorLamp,
    images: [I.floorLamp, I.pendant],
    description:
      "Matte grey industrial floor lamp with adjustable head—reading light for sofas and desks."
  },
  603: {
    name: "Lumen White Pendant Light",
    image: I.pendant,
    images: [I.pendant, I.floorLamp],
    description:
      "Clean white dome pendant over dining tables and kitchen islands—simple modern ambient light."
  },
  604: {
    name: "Orbital Rattan-Look Pendant",
    image: I.bedroom,
    images: [I.bedroom, I.pendant],
    description:
      "Woven rattan-style pendant that casts warm patterned light—shown in a plant-filled bedroom setting."
  },
  605: {
    name: "Linear Brass Wall Sconce Pair",
    image: I.bedroom,
    images: [I.bedroom, I.yellowChair],
    description:
      "Brass wall lights flanking a headboard—gallery-level ambient light for bedrooms and hallways."
  },
  606: {
    name: "Studio Grey Pendant Lamp",
    image: I.pendant,
    images: [I.pendant, I.floorLamp],
    description:
      "Industrial grey pendant with open bulb glow—minimal lighting for dining nooks and work tables."
  },
  701: {
    name: "Heritage Floral Oil Art Print",
    image: I.floralArt,
    images: [I.floralArt, I.goldSideboard],
    description:
      "Museum-quality floral still-life print—instant classic art for lounges, stairs, and formal halls."
  },
  702: {
    name: "Horizon Minimal Wall Clock",
    image: I.clock,
    images: [I.clock, I.sectional],
    description:
      "Clean round wall clock with silent sweep hands—quiet luxury for living rooms and offices."
  },
  703: {
    name: "Bloom Floor Vase with Pampas",
    image: I.greenSofa,
    images: [I.greenSofa, I.pillows],
    description:
      "Tall glass floor vase styled with dried pampas beside a modular sofa—sculptural floral décor."
  },
  704: {
    name: "Bronze Continuum Sculpture",
    image: I.goldSideboard,
    images: [I.goldSideboard, I.floralArt],
    description:
      "Sculptural décor objects styled on a statement console—conversation pieces for shelves and galleries."
  },
  705: {
    name: "Venetian Round Wall Mirror",
    image: I.goldSideboard,
    images: [I.goldSideboard, I.channelBed],
    description:
      "Large round wall mirror above a designer sideboard—expands light and space in entryways and living rooms."
  },
  706: {
    name: "Silk Luxe Pillow Ensemble",
    image: I.pillows,
    images: [I.pillows, I.guestBed],
    description:
      "Layered luxury pillows in linen and solid tones on a timber headboard—instant bed styling set."
  },
  707: {
    name: "Noir Glass Candle Vessel",
    image: I.candle,
    images: [I.candle, I.nightstand],
    description:
      "Lit glass candle vessel on soft fur—evening ambience for consoles, nightstands, and bathtubs."
  },
  708: {
    name: "Sahel Styled Décor Object Pair",
    image: I.goldSideboard,
    images: [I.goldSideboard, I.floralArt],
    description:
      "Heritage-inspired decorative objects for shelves and consoles—soulful accents with artisan character."
  },
  709: {
    name: "Heirloom Soft Accent Pillows",
    image: I.pillows,
    images: [I.pillows, I.greySofa],
    description:
      "Decorative pillow set for sofas and beds—mix stripes and solids for playful luxury corners."
  },
  710: {
    name: "Amber Glass Statement Vase",
    image: I.greenSofa,
    images: [I.greenSofa, I.candle],
    description:
      "Amber-tinted glass vase that glows in afternoon light—long stems, branches, or standing alone as sculpture."
  }
};

function esc(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

let n = 0;
for (const [id, u] of Object.entries(updates)) {
  const re = new RegExp(
    `(id:\\s*${id},\\s*)name:\\s*"[^"]*",([\\s\\S]*?)image:\\s*"[^"]*",\\s*images:\\s*\\[[\\s\\S]*?\\],([\\s\\S]*?)description:\\s*[\\s\\S]*?(?=,\\s*details:)`,
    "m"
  );
  if (!re.test(s)) {
    console.error("miss", id);
    continue;
  }
  const imgs = u.images.map((x) => `      "${x}"`).join(",\n");
  s = s.replace(
    re,
    `$1name: "${esc(u.name)}",$2image: "${u.image}",\n    images: [\n${imgs}\n    ],$3description:\n      "${esc(u.description)}"`
  );
  n++;
}

fs.writeFileSync(file, s);
console.log("Aligned", n, "products");
