/**
 * Sky Furniture — Luxury product catalog & categories (NGN)
 * Loaded before js/main.js on shop, home, cart, checkout, product pages.
 */
window.SKY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "living-room", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "office", label: "Office & Gaming" },
  { id: "dining", label: "Dining" },
  { id: "rugs", label: "Rugs" },
  { id: "lighting", label: "Lighting" },
  { id: "decor", label: "Decor & Artifacts" },
  { id: "outdoor-patio", label: "Outdoor / Patio" },
  { id: "storage", label: "Storage" },
  { id: "kitchen", label: "Kitchen" },
  { id: "diffusers", label: "Diffusers" },
  { id: "bedding-essentials", label: "Bedding Essentials" },
  { id: "massage-chairs", label: "Massage Chairs" },
  { id: "hotel-commercial", label: "Hotel & Commercial" },
  { id: "coming-soon", label: "Coming Soon" }
];

window.SKY_CATALOG_VERSION = "2026-07-24-v8-massage-daybed-fix";
window.SKY_PRODUCTS = [
  // ─── Living Room ───────────────────────────────────────────────────────
  {
    id: 101,
    name: "Maison Cloud Sectional Sofa",
    category: "living-room",
    price: 2450000,
    originalPrice: 2890000,
    rating: 4.9,
    reviews: 86,
    image: "assets/images/products/101.jpg",
    images: [
      "assets/images/products/101.jpg"
    ],
    description:
      "Cream L-shaped sectional with chaise, layered pillows, and a soft modern silhouette—built for spacious Lagos living rooms.",
    details: ["Linen blend upholstery", "L-shape sectional", "Feather-blend cushions", "Seats 5–6", "Custom slipcovers available"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 102,
    name: "Aurelia Cream Tufted Armchair",
    category: "living-room",
    price: 685000,
    originalPrice: null,
    rating: 4.8,
    reviews: 54,
    image: "assets/images/products/102.jpg",
    images: [
      "assets/images/products/102.jpg"
    ],
    description:
      "Button-tufted cream velvet armchair with curved arms and classic turned legs—an elegant reading chair.",
    details: ["Emerald performance velvet", "Solid beech frame", "Brass sabots", "High-density foam", "72 × 78 × 85 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 103,
    name: "Solstice Mustard Velvet Armchair",
    category: "living-room",
    price: 890000,
    originalPrice: 1050000,
    rating: 4.7,
    reviews: 41,
    image: "assets/images/products/103.jpg",
    images: [
      "assets/images/products/103.jpg"
    ],
    description:
      "Statement mustard-yellow velvet armchair with slim black legs. Pairs beautifully with a media console and brass floor lamp.",
    details: ["Marble top", "Bronze-finished steel base", "Protective felt pads", "120 × 70 × 40 cm", "Indoor use"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 104,
    name: "Noir Gallery Sideboard Credenza",
    category: "living-room",
    price: 750000,
    originalPrice: null,
    rating: 4.6,
    reviews: 38,
    image: "assets/images/products/104.jpg",
    images: [
      "assets/images/products/104.jpg"
    ],
    description:
      "Gold-framed sideboard with cane doors, styled as a living-room media and bar console under a round mirror.",
    details: ["Matte black oak veneer", "Fluted doors", "Soft-close hardware", "Fits TVs up to 75\"", "180 × 45 × 50 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 105,
    name: "Harbour Grey Tufted Sofa",
    category: "living-room",
    price: 1890000,
    originalPrice: null,
    rating: 4.8,
    reviews: 29,
    image: "assets/images/products/105.jpg",
    images: [
      "assets/images/products/105.jpg"
    ],
    description:
      "Button-tufted grey three-seater sofa with throw pillows—cosy everyday luxury for family lounges.",
    details: ["Sand bouclé fabric", "Modular connectors", "Removable covers", "Hardwood frame", "Deep 95 cm seat"],
    inStock: true,
    badge: "New"
  },
  {
    id: 106,
    name: "Atelier Solid Wood Side Table",
    category: "living-room",
    price: 420000,
    originalPrice: 495000,
    rating: 4.5,
    reviews: 47,
    image: "assets/images/products/106.jpg",
    images: [
      "assets/images/products/106.jpg"
    ],
    description:
      "Sculptural solid-wood side table with open shelves for books and décor—perfect beside a sofa or bed.",
    details: ["Smoked tempered glass", "Champagne gold metal", "Set of 2", "Nesting design", "Easy clean surface"],
    inStock: true,
    badge: "Sale"
  },

  // ─── Bedroom ───────────────────────────────────────────────────────────
  {
    id: 201,
    name: "Sovereign King Bedroom Suite",
    category: "bedroom",
    price: 2850000,
    originalPrice: null,
    rating: 4.9,
    reviews: 62,
    image: "assets/images/products/201.jpg",
    images: [
      "assets/images/products/201.jpg"
    ],
    description:
      "King bed with tall tufted headboard, paired nightstands, and bench—hotel-suite polish for master bedrooms.",
    details: ["King size 180 × 200 cm", "Solid ash frame", "Linen headboard wrap", "Canopy rails", "Natural oil finish"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 202,
    name: "Nocturne Channel Upholstered Bed",
    category: "bedroom",
    price: 1650000,
    originalPrice: 1890000,
    rating: 4.8,
    reviews: 71,
    image: "assets/images/products/202.jpg",
    images: [
      "assets/images/products/202.jpg"
    ],
    description:
      "Plush light-grey channel-upholstered bed on gold feet, shown with matching nightstands and modern brass chandelier.",
    details: ["Queen 160 × 200 cm", "Charcoal bouclé", "Winged headboard", "2 storage drawers", "Slatted base included"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 203,
    name: "Luna City Guest Bed",
    category: "bedroom",
    price: 520000,
    originalPrice: null,
    rating: 4.6,
    reviews: 34,
    image: "assets/images/products/203.jpg",
    images: [
      "assets/images/products/203.jpg"
    ],
    description:
      "Comfortable hotel-style guest bed with padded headboard and wood nightstand—ideal for guest rooms and apartments.",
    details: ["Single 90 × 200 cm", "Ivory linen headboard", "Solid pine frame", "Low profile", "Easy assembly"],
    inStock: true,
    badge: null
  },
  {
    id: 204,
    name: "Atelier Round Bedside Table",
    category: "bedroom",
    price: 385000,
    originalPrice: null,
    rating: 4.7,
    reviews: 48,
    image: "assets/images/products/204.jpg",
    images: [
      "assets/images/products/204.jpg"
    ],
    description:
      "Minimal round white bedside table with tapered wood legs—clean Scandinavian styling for any bedroom.",
    details: ["Set of 2", "Walnut finish", "Soft-close drawers", "Brass pulls", "50 × 40 × 55 cm each"],
    inStock: true,
    badge: "New"
  },
  {
    id: 205,
    name: "Hermitage Oak Wardrobe Armoire",
    category: "bedroom",
    price: 1980000,
    originalPrice: 2250000,
    rating: 4.8,
    reviews: 27,
    image: "assets/images/products/205.jpg",
    images: [
      "assets/images/products/205.jpg"
    ],
    description:
      "Full-height mid-century oak wardrobe with double doors and lower drawers—true closet storage without built-ins.",
    details: ["Smoked oak", "Hanging + shelves", "Interior LED strip", "Soft-close doors", "120 × 60 × 220 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 206,
    name: "Velvet Belle Bedroom Lounge Chair",
    category: "bedroom",
    price: 1120000,
    originalPrice: null,
    rating: 4.7,
    reviews: 22,
    image: "assets/images/products/206.jpg",
    images: [
      "assets/images/products/206.jpg"
    ],
    description:
      "Soft accent lounge chair for the foot of the bed or a dressing corner—shown here in rich mustard velvet.",
    details: ["Dresser + chair set", "Blush velvet seat", "Six soft-close drawers", "Mirror-ready top", "Champagne hardware"],
    inStock: true,
    badge: null
  },

  // ─── Office & Gaming ───────────────────────────────────────────────────
  {
    id: 301,
    name: "Apex Pro Gaming Desk Setup",
    category: "office",
    price: 485000,
    originalPrice: 560000,
    rating: 4.7,
    reviews: 93,
    image: "assets/images/products/301.jpg",
    images: [
      "assets/images/products/301.jpg"
    ],
    description:
      "Full gaming station with dual monitors, RGB PC, and performance chair—ready for marathon sessions.",
    details: ["Class-4 gas lift", "4D armrests", "165° recline", "Lumbar & head pillow", "150 kg capacity"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 302,
    name: "Executive Swivel Lounge Chair",
    category: "office",
    price: 620000,
    originalPrice: null,
    rating: 4.8,
    reviews: 51,
    image: "assets/images/products/302.jpg",
    images: [
      "assets/images/products/302.jpg"
    ],
    description:
      "Fabric swivel lounge chair on a wood star base—boardroom waiting corners and private offices.",
    details: ["Full-grain leather", "Aluminium base", "Synchro-tilt", "Adjustable lumbar", "Silent castors"],
    inStock: true,
    badge: "New"
  },
  {
    id: 303,
    name: "Studio Focus Study Desk",
    category: "office",
    price: 445000,
    originalPrice: 520000,
    rating: 4.6,
    reviews: 44,
    image: "assets/images/products/303.jpg",
    images: [
      "assets/images/products/303.jpg"
    ],
    description:
      "Clean white study desk with monitor setup and grey task chair—focused work from home.",
    details: ["White oak top", "Cable management", "Soft-close drawer", "140 × 70 × 75 cm", "Anti-scratch finish"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 304,
    name: "Command Warm Work Desk",
    category: "office",
    price: 395000,
    originalPrice: null,
    rating: 4.5,
    reviews: 67,
    image: "assets/images/products/304.jpg",
    images: [
      "assets/images/products/304.jpg"
    ],
    description:
      "Warm wood work desk styled for evening productivity—laptop-ready surface with soft lamp light.",
    details: ["RGB edge light", "Z-shaped steel frame", "Mouse pad inlay", "Headphone hook", "140 × 60 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 305,
    name: "Aero Swivel Office Chair",
    category: "office",
    price: 285000,
    originalPrice: 340000,
    rating: 4.7,
    reviews: 118,
    image: "assets/images/products/305.jpg",
    images: [
      "assets/images/products/305.jpg"
    ],
    description:
      "Lightweight modern office chair with full swivel—all-day seating for hot climates and long workdays.",
    details: ["Breathable mesh", "Adaptive lumbar", "Multi-tilt", "Height adjustable", "BIFMA-style testing"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 306,
    name: "Director Shell Lounge Chair",
    category: "office",
    price: 780000,
    originalPrice: null,
    rating: 4.8,
    reviews: 31,
    image: "assets/images/products/306.jpg",
    images: [
      "assets/images/products/306.jpg"
    ],
    description:
      "Sculptural white lounge chair with bentwood frame—mid-century calm for offices and reading corners.",
    details: ["Cognac top-grain leather", "Walnut legs", "Deep seat", "Guest & executive use", "Spot clean leather"],
    inStock: true,
    badge: "New"
  },

  // ─── Dining ────────────────────────────────────────────────────────────
  {
    id: 401,
    name: "Imperial Emerald Dining Set",
    category: "dining",
    price: 3200000,
    originalPrice: 3650000,
    rating: 4.9,
    reviews: 39,
    image: "assets/images/products/401.jpg",
    images: [
      "assets/images/products/401.jpg"
    ],
    description:
      "White dining table with six emerald velvet chairs and gold legs—formal dinners for six to eight.",
    details: ["Table + 8 chairs", "Extendable walnut top", "Performance fabric seats", "Seats 8–10 extended", "Felt floor protectors"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 402,
    name: "Heritage Oak Dining Set",
    category: "dining",
    price: 2150000,
    originalPrice: null,
    rating: 4.8,
    reviews: 58,
    image: "assets/images/products/402.jpg",
    images: [
      "assets/images/products/402.jpg"
    ],
    description:
      "Solid walnut dining table with grey upholstered chairs under a crystal bar chandelier—everyday family luxury.",
    details: ["Table + 6 chairs", "Solid oak", "Spindle-back chairs", "Natural oil finish", "200 × 95 cm table"],
    inStock: true,
    badge: null
  },
  {
    id: 403,
    name: "Compact White Dining Table Set",
    category: "dining",
    price: 1450000,
    originalPrice: 1680000,
    rating: 4.7,
    reviews: 45,
    image: "assets/images/products/403.jpg",
    images: [
      "assets/images/products/403.jpg"
    ],
    description:
      "Round white dining table with two modern chairs—perfect for apartments and intimate meals for two to four.",
    details: ["Table + 4 chairs", "Sintered stone top", "Velvet chairs", "Round Ø 110 cm", "Metal pedestal base"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 404,
    name: "Palazzo Solid Wood Dining Table",
    category: "dining",
    price: 1780000,
    originalPrice: null,
    rating: 4.8,
    reviews: 33,
    image: "assets/images/products/404.jpg",
    images: [
      "assets/images/products/404.jpg"
    ],
    description:
      "Statement solid-wood dining table that seats a crowd—pair with your preferred chair style.",
    details: ["Table only", "Seats 6–8", "Live-edge aesthetic", "Matte protective coat", "220 × 100 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 405,
    name: "Couture Heritage Dining Chair",
    category: "dining",
    price: 320000,
    originalPrice: 380000,
    rating: 4.6,
    reviews: 72,
    image: "assets/images/products/405.jpg",
    images: [
      "assets/images/products/405.jpg"
    ],
    description:
      "Classic carved wood dining armchair with warm honey finish—order pairs to complete a traditional suite.",
    details: ["Set of 2 chairs", "Oatmeal linen", "Oak legs", "Stackable lightly", "Sold as pair"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 406,
    name: "Gallery Gold Sideboard Credenza",
    category: "dining",
    price: 980000,
    originalPrice: null,
    rating: 4.7,
    reviews: 28,
    image: "assets/images/products/406.jpg",
    images: [
      "assets/images/products/406.jpg"
    ],
    description:
      "Gold cane-front sideboard with round wall mirror styling—dining storage that doubles as a bar console.",
    details: ["Fluted doors", "Adjustable shelves", "Soft-close", "180 × 45 × 80 cm", "Walnut stain"],
    inStock: true,
    badge: null
  },

  // ─── Rugs ──────────────────────────────────────────────────────────────
  {
    id: 501,
    name: "Persia Royal Heritage Rug",
    category: "rugs",
    price: 1250000,
    originalPrice: 1480000,
    rating: 4.9,
    reviews: 41,
    image: "assets/images/products/501.jpg",
    images: [
      "assets/images/products/501.jpg"
    ],
    description:
      "Ornate Persian-style rug in ivory and gold with hand-finished fringe—anchors formal living rooms.",
    details: ["Persian-inspired pattern", "Dense pile", "Non-slip recommended", "200 × 300 cm", "Professional clean"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 502,
    name: "Nordic Line Living Rug",
    category: "rugs",
    price: 685000,
    originalPrice: null,
    rating: 4.7,
    reviews: 56,
    image: "assets/images/products/502.jpg",
    images: [
      "assets/images/products/502.jpg"
    ],
    description:
      "Soft light-toned area rug under a modern sectional—clean Scandinavian layering for open living spaces.",
    details: ["100% wool blend", "Modern geometric", "Low pile", "160 × 230 cm", "Spot clean"],
    inStock: true,
    badge: "New"
  },
  {
    id: 503,
    name: "Anatolia Pattern Runner Look",
    category: "rugs",
    price: 295000,
    originalPrice: 350000,
    rating: 4.6,
    reviews: 63,
    image: "assets/images/products/503.jpg",
    images: [
      "assets/images/products/503.jpg"
    ],
    description:
      "Traditional patterned rug with heirloom character—use as a runner look in halls or full-size in living rooms.",
    details: ["Kilim-style flat weave", "Reversible", "80 × 250 cm", "Cotton blend", "Shake clean"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 504,
    name: "Cloud Soft Area Rug",
    category: "rugs",
    price: 545000,
    originalPrice: null,
    rating: 4.8,
    reviews: 77,
    image: "assets/images/products/504.jpg",
    images: [
      "assets/images/products/504.jpg"
    ],
    description:
      "Soft light area rug styled under a contemporary sofa—barefoot comfort for lounges and bedrooms.",
    details: ["High pile shag", "Ivory", "Soft polyester blend", "160 × 230 cm", "Anti-shed finish"],
    inStock: true,
    badge: null
  },
  {
    id: 505,
    name: "Terrace Indoor-Outdoor Look Rug",
    category: "rugs",
    price: 265000,
    originalPrice: 310000,
    rating: 4.5,
    reviews: 39,
    image: "assets/images/products/505.jpg",
    images: [
      "assets/images/products/505.jpg"
    ],
    description:
      "Neutral textured rug that works from living rooms to covered terraces—durable everyday style.",
    details: ["Outdoor polypropylene", "UV resistant", "Hose clean", "150 × 210 cm", "Quick dry"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 506,
    name: "Silk Route Gallery Rug",
    category: "rugs",
    price: 1890000,
    originalPrice: null,
    rating: 4.9,
    reviews: 18,
    image: "assets/images/products/506.jpg",
    images: [
      "assets/images/products/506.jpg"
    ],
    description:
      "Fine gallery rug with jewel-tone heritage patterning—collector finish for statement furniture.",
    details: ["Silk-touch fibres", "Fine density", "200 × 300 cm", "Professional clean only", "Limited edition feel"],
    inStock: true,
    badge: "New"
  },

  // ─── Lighting ──────────────────────────────────────────────────────────
  {
    id: 601,
    name: "Celeste Multi-Globe Chandelier",
    category: "lighting",
    price: 1450000,
    originalPrice: 1680000,
    rating: 4.9,
    reviews: 36,
    image: "assets/images/products/601.jpg",
    images: [
      "assets/images/products/601.jpg"
    ],
    description:
      "Modern multi-globe chandelier in brass and white glass—shown over a formal dining table.",
    details: ["Crystal glass drops", "E14 fittings × 12", "Dimmable compatible", "Ø 80 cm", "Professional install recommended"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 602,
    name: "Arc Industrial Floor Lamp",
    category: "lighting",
    price: 385000,
    originalPrice: 450000,
    rating: 4.7,
    reviews: 84,
    image: "assets/images/products/602.jpg",
    images: [
      "assets/images/products/602.jpg"
    ],
    description:
      "Matte grey industrial floor lamp with adjustable head—reading light for sofas and desks.",
    details: ["Brushed brass", "Linen shade", "E27", "Height ~180 cm", "Marble weighted base"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 603,
    name: "Lumen White Pendant Light",
    category: "lighting",
    price: 185000,
    originalPrice: null,
    rating: 4.8,
    reviews: 61,
    image: "assets/images/products/603.jpg",
    images: [
      "assets/images/products/603.jpg"
    ],
    description:
      "Clean white dome pendant over dining tables and kitchen islands—simple modern ambient light.",
    details: ["Alabaster-effect ceramic", "Silk-look shade", "Inline dimmer", "E14", "Height 48 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 604,
    name: "Orbital Rattan-Look Pendant",
    category: "lighting",
    price: 245000,
    originalPrice: 290000,
    rating: 4.6,
    reviews: 52,
    image: "assets/images/products/604.jpg",
    images: [
      "assets/images/products/604.jpg"
    ],
    description:
      "Woven rattan-style pendant that casts warm patterned light—shown in a plant-filled bedroom setting.",
    details: ["Natural rattan", "E27", "1.5 m cord", "Ø 45 cm", "Indoor use"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 605,
    name: "Linear Brass Wall Sconce Pair",
    category: "lighting",
    price: 220000,
    originalPrice: null,
    rating: 4.7,
    reviews: 40,
    image: "assets/images/products/605.jpg",
    images: [
      "assets/images/products/605.jpg"
    ],
    description:
      "Brass wall lights flanking a headboard—gallery-level ambient light for bedrooms and hallways.",
    details: ["Set of 2", "Brushed brass", "G9 bulbs", "Hardwire", "Electrician install"],
    inStock: true,
    badge: null
  },
  {
    id: 606,
    name: "Studio Grey Pendant Lamp",
    category: "lighting",
    price: 980000,
    originalPrice: null,
    rating: 4.8,
    reviews: 25,
    image: "assets/images/products/606.jpg",
    images: [
      "assets/images/products/606.jpg"
    ],
    description:
      "Industrial grey pendant with open bulb glow—minimal lighting for dining nooks and work tables.",
    details: ["Frosted glass globes", "Matte black frame", "G9 LEDs compatible", "Adjustable drops", "Ø 90 cm"],
    inStock: true,
    badge: "New"
  },

  // ─── Decor & Artifacts ─────────────────────────────────────────────────
  {
    id: 701,
    name: "Heritage Floral Oil Art Print",
    category: "decor",
    price: 385000,
    originalPrice: null,
    rating: 4.8,
    reviews: 44,
    image: "assets/images/products/701.jpg",
    images: [
      "assets/images/products/701.jpg"
    ],
    description:
      "Museum-quality floral still-life print—instant classic art for lounges, stairs, and formal halls.",
    details: ["Set of 3 portraits", "Gilded frames", "Ready to hang", "Mixed sizes", "UV-resistant print"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 702,
    name: "Horizon Minimal Wall Clock",
    category: "decor",
    price: 145000,
    originalPrice: 175000,
    rating: 4.7,
    reviews: 69,
    image: "assets/images/products/702.jpg",
    images: [
      "assets/images/products/702.jpg"
    ],
    description:
      "Clean round wall clock with silent sweep hands—quiet luxury for living rooms and offices.",
    details: ["Silent quartz", "Brushed brass", "Ø 50 cm", "Battery operated", "Easy hang"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 703,
    name: "Bloom Floor Vase with Pampas",
    category: "decor",
    price: 95000,
    originalPrice: null,
    rating: 4.6,
    reviews: 88,
    image: "assets/images/products/703.jpg",
    images: [
      "assets/images/products/703.jpg"
    ],
    description:
      "Tall glass floor vase styled with dried pampas beside a modular sofa—sculptural floral décor.",
    details: ["Set of 3 vases", "Water-safe glaze", "Heights 15–32 cm", "Handcrafted look", "Unique glaze variation"],
    inStock: true,
    badge: null
  },
  {
    id: 704,
    name: "Gallery Console Décor Styling Set",
    category: "decor",
    price: 275000,
    originalPrice: null,
    rating: 4.9,
    reviews: 21,
    image: "assets/images/products/704.jpg",
    images: [
      "assets/images/products/704.jpg"
    ],
    description:
      "Designer console vignette with sculptural objects, plants, and accents—ready-made styling for a living room wall.",
    details: ["Bronze-finish metal", "Marble base", "Weighted", "Height 35 cm", "Indoor only"],
    inStock: true,
    badge: "New"
  },
  {
    id: 705,
    name: "Venetian Round Wall Mirror",
    category: "decor",
    price: 485000,
    originalPrice: 560000,
    rating: 4.8,
    reviews: 37,
    image: "assets/images/products/705.jpg",
    images: [
      "assets/images/products/705.jpg"
    ],
    description:
      "Large round wall mirror above a designer sideboard—expands light and space in entryways and living rooms.",
    details: ["Full length", "Arched top", "Champagne metal", "Lean or wall mount", "60 × 170 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 706,
    name: "Silk Luxe Pillow Ensemble",
    category: "decor",
    price: 125000,
    originalPrice: null,
    rating: 4.7,
    reviews: 95,
    image: "assets/images/products/706.jpg",
    images: [
      "assets/images/products/706.jpg"
    ],
    description:
      "Layered luxury pillows in linen and solid tones on a timber headboard—instant bed styling set.",
    details: ["Set of 4", "Silk-touch + bouclé", "Hidden zips", "Inserts included", "Dry clean covers"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 707,
    name: "Noir Glass Candle Vessel",
    category: "decor",
    price: 78000,
    originalPrice: 95000,
    rating: 4.5,
    reviews: 58,
    image: "assets/images/products/707.jpg",
    images: [
      "assets/images/products/707.jpg"
    ],
    description:
      "Lit glass candle vessel on soft fur—evening ambience for consoles, nightstands, and bathtubs.",
    details: ["Holders + tray + candles", "Matte black metal", "Pillar sizes mixed", "Heat-safe tray", "Gift ready"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 708,
    name: "Amber Accent Lounge Chair Look",
    category: "decor",
    price: 320000,
    originalPrice: null,
    rating: 4.9,
    reviews: 26,
    image: "assets/images/products/708.jpg",
    images: [
      "assets/images/products/708.jpg"
    ],
    description:
      "Warm orange accent chair styling within a full living-room vignette—inspiration piece for bold seating moments.",
    details: ["Set of 2 figures", "Bronze finish", "Weighted bases", "Heights 22–28 cm", "Artisan aesthetic"],
    inStock: true,
    badge: "Artifact"
  },
  {
    id: 709,
    name: "Heirloom Soft Accent Pillows",
    category: "decor",
    price: 65000,
    originalPrice: null,
    rating: 4.6,
    reviews: 49,
    image: "assets/images/products/709.jpg",
    images: [
      "assets/images/products/709.jpg"
    ],
    description:
      "Decorative pillow set for sofas and beds—mix stripes and solids for playful luxury corners.",
    details: ["Wood ornaments set", "Decorative toys", "Non-toxic finish", "Shelf styling", "Gift boxed"],
    inStock: true,
    badge: null
  },
  {
    id: 710,
    name: "Amber Glass Statement Vase",
    category: "decor",
    price: 72000,
    originalPrice: null,
    rating: 4.7,
    reviews: 71,
    image: "assets/images/products/710.jpg",
    images: [
      "assets/images/products/710.jpg"
    ],
    description:
      "Amber-tinted glass vase that glows in afternoon light—long stems, branches, or standing alone as sculpture.",
    details: ["Tinted glass", "Weighted base", "Height 35 cm", "Hand-blown look", "Indoor vase"],
    inStock: true,
    badge: "New"
  },

  // ─── Outdoor / Patio ────────────────────────────────────────────────────
  {
    id: 801,
    name: "Lagos Terrace Lounge Set",
    category: "outdoor-patio",
    price: 1850000,
    originalPrice: 2100000,
    rating: 4.8,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80"
    ],
    description:
      "Weather-ready modular outdoor lounge with deep cushions—built for rooftops, terraces, and garden parties.",
    details: ["All-weather rattan look", "UV-stable cushions", "Modular sofa + table", "Seats 4–6", "Easy-clean fabric"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 802,
    name: "Poolside Daybed Canopy",
    category: "outdoor-patio",
    price: 980000,
    originalPrice: null,
    rating: 4.9,
    reviews: 28,
    image: "assets/images/products/802.jpg",
    images: [
      "assets/images/products/802.jpg",
      "assets/images/products/802b.jpg",
      "assets/images/products/802c.jpg"
    ],
    description:
      "Resort-style outdoor daybed with soft canopy draping—hotel pool energy for private gardens.",
    details: ["Canopy shade", "Thick outdoor mattress", "Powder-coated frame", "Cushion set included", "Patio / poolside"],
    inStock: true,
    badge: "New"
  },
  {
    id: 803,
    name: "Acacia Outdoor Dining Table",
    category: "outdoor-patio",
    price: 720000,
    originalPrice: 850000,
    rating: 4.7,
    reviews: 35,
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80"
    ],
    description:
      "Solid outdoor dining table for al fresco meals—pairs with teak-look chairs for a full patio suite.",
    details: ["Acacia hardwood", "Seats 6", "Weather-oiled finish", "Parasol hole optional", "Outdoor dining"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 804,
    name: "Wicker Patio Conversation Set",
    category: "outdoor-patio",
    price: 1250000,
    originalPrice: null,
    rating: 4.8,
    reviews: 51,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"
    ],
    description:
      "Fancy outdoor conversation set with coffee table—clean lines for modern balconies and courtyards.",
    details: ["PE wicker weave", "Glass-top table", "Deep seat cushions", "Set for 4", "Stackable accent chairs"],
    inStock: true,
    badge: null
  },

  // ─── Storage ────────────────────────────────────────────────────────────
  {
    id: 811,
    name: "Oak Wardrobe Armoire",
    category: "storage",
    price: 890000,
    originalPrice: 1050000,
    rating: 4.8,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80"
    ],
    description:
      "Full-height wardrobe with soft-close doors—room for hanging rails, shelves, and seasonal storage.",
    details: ["Solid oak veneer", "Soft-close hinges", "Hanging + shelf zones", "Mirror option", "Bedroom storage"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 812,
    name: "Floating Display Shelves Set",
    category: "storage",
    price: 145000,
    originalPrice: null,
    rating: 4.6,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
    ],
    description:
      "Clean floating shelves for books, ceramics, and pantry overflow—minimal hardware, maximum calm.",
    details: ["Set of 3 lengths", "Hidden brackets", "Walnut or oak", "Wall-mounted", "Load-rated"],
    inStock: true,
    badge: "New"
  },
  {
    id: 813,
    name: "Chest of Drawers — Six Drawer",
    category: "storage",
    price: 420000,
    originalPrice: 490000,
    rating: 4.7,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"
    ],
    description:
      "Wide dresser with six deep drawers—linen, knits, and everyday storage without bedroom clutter.",
    details: ["Six drawers", "Soft-close runners", "Dovetail construction", "Anti-tip hardware", "Bedroom / hallway"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 814,
    name: "Modular Cube Storage Unit",
    category: "storage",
    price: 265000,
    originalPrice: null,
    rating: 4.5,
    reviews: 71,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80"
    ],
    description:
      "Open cube storage for living rooms and kids’ rooms—style with baskets or leave open for display.",
    details: ["9-cube grid", "Basket-compatible", "Freestanding", "Tool-free expand", "Living / office"],
    inStock: true,
    badge: null
  },

  // ─── Kitchen ────────────────────────────────────────────────────────────
  {
    id: 821,
    name: "Butcher-Block Kitchen Island",
    category: "kitchen",
    price: 780000,
    originalPrice: 920000,
    rating: 4.9,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80"
    ],
    description:
      "Freestanding kitchen island with prep surface and storage—the heart of a modern cook space.",
    details: ["Butcher-block top", "Open + closed storage", "Towel bar", "Locking casters optional", "Prep station"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 822,
    name: "Chef’s Copper Utensil Set",
    category: "kitchen",
    price: 95000,
    originalPrice: null,
    rating: 4.7,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80"
    ],
    description:
      "Designer utensil set for open shelving kitchens—ladles, spatulas, and hangers that look as good as they cook.",
    details: ["10-piece set", "Heat-resistant handles", "Hang rail included", "Dishwasher safe tools", "Gift ready"],
    inStock: true,
    badge: "New"
  },
  {
    id: 823,
    name: "Marble Countertop Stool Pair",
    category: "kitchen",
    price: 310000,
    originalPrice: 360000,
    rating: 4.6,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80"
    ],
    description:
      "Counter-height stools for kitchen islands—slim profiles that tuck under ledges when not in use.",
    details: ["Set of 2", "Counter height", "Footrest ring", "Upholstered seat", "Kitchen bar seating"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 824,
    name: "Open Kitchen Pantry Rack",
    category: "kitchen",
    price: 185000,
    originalPrice: null,
    rating: 4.5,
    reviews: 66,
    image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80",
      "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=900&q=80"
    ],
    description:
      "Tall open rack for pots, pans, and dry goods—restaurant energy for home kitchens.",
    details: ["Metal frame", "Adjustable shelves", "Hooks for utensils", "Freestanding", "Pantry overflow"],
    inStock: true,
    badge: null
  },

  // ─── Diffusers ──────────────────────────────────────────────────────────
  {
    id: 831,
    name: "Reed Diffuser — Amber Noir",
    category: "diffusers",
    price: 28000,
    originalPrice: 35000,
    rating: 4.8,
    reviews: 204,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80",
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=80"
    ],
    description:
      "Smoked glass reed diffuser with amber-noir scent—living rooms, guest baths, and reception desks.",
    details: ["200 ml oil", "8 rattan reeds", "Lasts 8–12 weeks", "Alcohol-free base", "Gift boxed"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 832,
    name: "Ultrasonic Mist Diffuser",
    category: "diffusers",
    price: 45000,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80",
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=80"
    ],
    description:
      "Quiet ultrasonic diffuser with soft LED glow—pair with essential oils for bedrooms and spas.",
    details: ["300 ml tank", "Auto shut-off", "Timer modes", "Whisper quiet", "Night light modes"],
    inStock: true,
    badge: "New"
  },
  {
    id: 833,
    name: "Ceramic Vessel Diffuser Set",
    category: "diffusers",
    price: 38000,
    originalPrice: 48000,
    rating: 4.6,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80"
    ],
    description:
      "Hand-glazed ceramic vessels with dual scents—styled for consoles and bathroom vanities.",
    details: ["2 vessels", "2 fragrance oils", "Ceramic + wood lid", "Decor-forward", "Refills available"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 834,
    name: "Essential Oil Trio — Citrus Grove",
    category: "diffusers",
    price: 22000,
    originalPrice: null,
    rating: 4.9,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=900&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80"
    ],
    description:
      "Three pure essential oils—bergamot, lemon, and green tea—for electric or reed diffusers.",
    details: ["3 × 10 ml", "100% essential oils", "Dropper tops", "Works with ultrasonic", "Bright citrus blend"],
    inStock: true,
    badge: null
  },

  // ─── Bedding Essentials ─────────────────────────────────────────────────
  {
    id: 841,
    name: "Egyptian Cotton Sheet Set — King",
    category: "bedding-essentials",
    price: 185000,
    originalPrice: 220000,
    rating: 4.9,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"
    ],
    description:
      "Crisp king sheet set in hotel-weight cotton—fitted, flat, and pillowcases for a cool night’s sleep.",
    details: ["King size", "400-thread cotton", "Deep pocket fitted", "4-piece set", "Breathable weave"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 842,
    name: "Cloud Duvet & Cover Bundle",
    category: "bedding-essentials",
    price: 245000,
    originalPrice: null,
    rating: 4.8,
    reviews: 97,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
      "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=900&q=80"
    ],
    description:
      "All-season duvet insert with washable cover—light loft for Lagos nights without overheating.",
    details: ["Queen / King options", "Microfibre fill", "Zip cover", "Machine washable cover", "Corner ties"],
    inStock: true,
    badge: "New"
  },
  {
    id: 843,
    name: "Hotel Pillow Set (4)",
    category: "bedding-essentials",
    price: 98000,
    originalPrice: 120000,
    rating: 4.7,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80"
    ],
    description:
      "Four supportive pillows—two soft, two medium—for layered hotel-style beds.",
    details: ["Set of 4", "Down-alternative", "Cotton covers", "Hypoallergenic", "Standard size"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 844,
    name: "Linen Throw Blanket",
    category: "bedding-essentials",
    price: 65000,
    originalPrice: null,
    rating: 4.6,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616627561839-074385245ff6?w=900&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"
    ],
    description:
      "Washed linen throw for beds and sofas—casual luxury that softens with every wash.",
    details: ["100% linen", "Fringe edges", "200 × 150 cm", "Stone-washed", "Neutral tones"],
    inStock: true,
    badge: null
  },
  {
    id: 845,
    name: "Mattress Protector + Topper Duo",
    category: "bedding-essentials",
    price: 155000,
    originalPrice: 180000,
    rating: 4.8,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80"
    ],
    description:
      "Waterproof protector plus plush topper—keep mattresses fresh and sleep surfaces cloud-soft.",
    details: ["Waterproof barrier", "Quilted topper", "Elastic skirt", "King / Queen", "Quiet fabric"],
    inStock: true,
    badge: null
  },

  // ─── Massage Chairs ─────────────────────────────────────────────────────
  {
    id: 851,
    name: "Sky Spa Full-Body Massage Chair",
    category: "massage-chairs",
    price: 2850000,
    originalPrice: 3200000,
    rating: 4.9,
    reviews: 48,
    image: "assets/images/products/851.jpg",
    images: [
      "assets/images/products/851.jpg",
      "assets/images/products/851b.jpg",
      "assets/images/products/853.jpg"
    ],
    description:
      "Zero-gravity full-body electronic massage chair with SL-track rollers—neck to calves recovery for home wellness rooms.",
    details: ["Zero-gravity recline", "Heat therapy", "Bluetooth speaker", "Auto programs", "Foot rollers"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 852,
    name: "Executive Shiatsu Massage Chair",
    category: "massage-chairs",
    price: 2450000,
    originalPrice: null,
    rating: 4.7,
    reviews: 61,
    image: "assets/images/products/852.jpg",
    images: [
      "assets/images/products/852.jpg",
      "assets/images/products/851.jpg",
      "assets/images/products/854.jpg"
    ],
    description:
      "Premium brown leather electronic massage chair—shiatsu nodes and deep recline for offices and dens.",
    details: ["Shiatsu rollers", "Remote control", "PU leather", "Full-body airbags", "Living / office"],
    inStock: true,
    badge: "New"
  },
  {
    id: 853,
    name: "Graphite Zero-G Massage Chair",
    category: "massage-chairs",
    price: 2680000,
    originalPrice: 2990000,
    rating: 4.8,
    reviews: 37,
    image: "assets/images/products/853.jpg",
    images: [
      "assets/images/products/853.jpg",
      "assets/images/products/851.jpg",
      "assets/images/products/855.jpg"
    ],
    description:
      "Graphite full-body massage chair with multi-zone airbags—quiet motors for premium living rooms.",
    details: ["Multi-zone airbags", "Calf kneading", "USB charge port", "Quiet motor", "Power recline"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 854,
    name: "Cloud Cream Massage Chair",
    category: "massage-chairs",
    price: 2580000,
    originalPrice: null,
    rating: 4.6,
    reviews: 29,
    image: "assets/images/products/854.jpg",
    images: [
      "assets/images/products/854.jpg",
      "assets/images/products/852.jpg",
      "assets/images/products/851b.jpg"
    ],
    description:
      "Cream full-body electronic massage chair for spa-style homes—stretch modes and lumbar heat.",
    details: ["Stretch programs", "Lumbar heat", "Calf airbags", "Wall-hug recline", "Soft cream upholstery"],
    inStock: true,
    badge: null
  },
  {
    id: 855,
    name: "Navy Executive Massage Recliner",
    category: "massage-chairs",
    price: 2150000,
    originalPrice: 2400000,
    rating: 4.7,
    reviews: 33,
    image: "assets/images/products/855.jpg",
    images: [
      "assets/images/products/855.jpg",
      "assets/images/products/853.jpg",
      "assets/images/products/851.jpg"
    ],
    description:
      "Navy blue premium massage recliner—compact full-body programs for apartments and hotel suites.",
    details: ["Navy upholstery", "Full-body programs", "Space-saving recline", "Remote included", "Hotel / home"],
    inStock: true,
    badge: "New"
  },

  // ─── Hotel & Commercial (bar chairs / reception) ────────────────────────
  {
    id: 861,
    name: "Velvet Bar Stool — Hotel Edition",
    category: "hotel-commercial",
    price: 125000,
    originalPrice: 150000,
    rating: 4.8,
    reviews: 94,
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80"
    ],
    description:
      "Upholstered bar stool styled for hotel lounges and cocktail bars—comfortable height for long service nights.",
    details: ["Bar height", "Velvet upholstery", "Metal footrest", "Contract-grade base", "Stackable option"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 862,
    name: "Brass Ring Bar Chair Pair",
    category: "hotel-commercial",
    price: 280000,
    originalPrice: null,
    rating: 4.7,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80"
    ],
    description:
      "Pair of brass-accent bar chairs for boutique bars and reception counters—shine under pendant lights.",
    details: ["Set of 2", "Brass-tone frame", "Swivel seat", "Counter / bar height", "Commercial finish"],
    inStock: true,
    badge: "New"
  },
  {
    id: 863,
    name: "Reception Lobby Bar Stool",
    category: "hotel-commercial",
    price: 98000,
    originalPrice: 115000,
    rating: 4.6,
    reviews: 71,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80"
    ],
    description:
      "Sleek stool for hotel receptions and check-in bars—clean silhouette that photographs well in lobbies.",
    details: ["Leatherette seat", "Powder-coated steel", "Footrest", "Easy clean", "Lobby / F&B"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 864,
    name: "Dark Wood Tavern Bar Chair",
    category: "hotel-commercial",
    price: 110000,
    originalPrice: null,
    rating: 4.5,
    reviews: 83,
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=900&q=80",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80"
    ],
    description:
      "Classic wood bar chair for pubs, lounges, and hotel bars—warm grain with durable commercial build.",
    details: ["Solid wood frame", "Padded seat", "Cross-brace strength", "Floor protectors", "Bar height"],
    inStock: true,
    badge: null
  },
  {
    id: 865,
    name: "Backless Chrome Bar Stool (Set of 4)",
    category: "hotel-commercial",
    price: 320000,
    originalPrice: 380000,
    rating: 4.7,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80"
    ],
    description:
      "Minimal chrome stools for high-traffic hotel bars—stack neatly after service and wipe down fast.",
    details: ["Set of 4", "Chrome base", "Backless", "Weighted foot", "Commercial stackable"],
    inStock: true,
    badge: null
  }
];

// Back-compat aliases used by older scripts
window.PRODUCTS = window.SKY_PRODUCTS;
window.CATEGORIES = window.SKY_CATEGORIES;
