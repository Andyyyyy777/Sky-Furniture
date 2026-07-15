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
  { id: "decor", label: "Decor & Artifacts" }
];

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
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80",
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80",
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80",
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=900&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
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
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80"
    ],
    description:
      "Amber-tinted glass vase that glows in afternoon light—long stems, branches, or standing alone as sculpture.",
    details: ["Tinted glass", "Weighted base", "Height 35 cm", "Hand-blown look", "Indoor vase"],
    inStock: true,
    badge: "New"
  }
];

// Back-compat aliases used by older scripts
window.PRODUCTS = window.SKY_PRODUCTS;
window.CATEGORIES = window.SKY_CATEGORIES;
