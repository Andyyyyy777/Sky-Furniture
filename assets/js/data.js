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
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80"
    ],
    description:
      "A grand L-shaped sectional in performance linen, deep feather-blend cushions, and solid oak feet. The centerpiece of a refined Lagos living room.",
    details: ["Linen blend upholstery", "L-shape sectional", "Feather-blend cushions", "Seats 5–6", "Custom slipcovers available"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 102,
    name: "Aurelia Velvet Armchair",
    category: "living-room",
    price: 685000,
    originalPrice: null,
    rating: 4.8,
    reviews: 54,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
    ],
    description:
      "Sculptural armchair in deep emerald velvet with channel-tufted back and polished brass sabots. A quiet statement for reading corners.",
    details: ["Emerald performance velvet", "Solid beech frame", "Brass sabots", "High-density foam", "72 × 78 × 85 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 103,
    name: "Caldera Marble Centre Table",
    category: "living-room",
    price: 890000,
    originalPrice: 1050000,
    rating: 4.7,
    reviews: 41,
    image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=900&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80"
    ],
    description:
      "Italian-inspired coffee table with a thick Calacatta-veined marble top and brushed bronze base. Designed for layered trays and art books.",
    details: ["Marble top", "Bronze-finished steel base", "Protective felt pads", "120 × 70 × 40 cm", "Indoor use"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 104,
    name: "Noir Luxe TV Media Console",
    category: "living-room",
    price: 750000,
    originalPrice: null,
    rating: 4.6,
    reviews: 38,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
    ],
    description:
      "Low-profile media console in matte black oak with fluted doors and soft-close drawers. Cable management for a seamless wall.",
    details: ["Matte black oak veneer", "Fluted doors", "Soft-close hardware", "Fits TVs up to 75\"", "180 × 45 × 50 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 105,
    name: "Solstice Modular Sofa Duo",
    category: "living-room",
    price: 1890000,
    originalPrice: null,
    rating: 4.8,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80"
    ],
    description:
      "Two-piece modular sofa in warm sand bouclé. Reconfigure as a chaise lounge or classic three-seater for flexible entertaining.",
    details: ["Sand bouclé fabric", "Modular connectors", "Removable covers", "Hardwood frame", "Deep 95 cm seat"],
    inStock: true,
    badge: "New"
  },
  {
    id: 106,
    name: "Étoile Nesting Coffee Tables",
    category: "living-room",
    price: 420000,
    originalPrice: 495000,
    rating: 4.5,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=900&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=900&q=80"
    ],
    description:
      "Set of two nesting tables in smoked glass and champagne gold frames. Slide apart for entertaining or nest for a clean silhouette.",
    details: ["Smoked tempered glass", "Champagne gold metal", "Set of 2", "Nesting design", "Easy clean surface"],
    inStock: true,
    badge: "Sale"
  },

  // ─── Bedroom ───────────────────────────────────────────────────────────
  {
    id: 201,
    name: "Sovereign King Canopy Bed",
    category: "bedroom",
    price: 2850000,
    originalPrice: null,
    rating: 4.9,
    reviews: 62,
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80"
    ],
    description:
      "King canopy bed in solid ash with linen-wrapped headboard posts. A hotel-suite presence for master bedrooms.",
    details: ["King size 180 × 200 cm", "Solid ash frame", "Linen headboard wrap", "Canopy rails", "Natural oil finish"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 202,
    name: "Nocturne Queen Upholstered Bed",
    category: "bedroom",
    price: 1650000,
    originalPrice: 1890000,
    rating: 4.8,
    reviews: 71,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80"
    ],
    description:
      "Queen bed fully upholstered in charcoal bouclé with tall winged headboard and discreet under-bed storage drawers.",
    details: ["Queen 160 × 200 cm", "Charcoal bouclé", "Winged headboard", "2 storage drawers", "Slatted base included"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 203,
    name: "Luna Single Guest Bed",
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
      "Elegant single bed with soft ivory linen headboard—perfect for guest rooms, children's suites, or compact apartments.",
    details: ["Single 90 × 200 cm", "Ivory linen headboard", "Solid pine frame", "Low profile", "Easy assembly"],
    inStock: true,
    badge: null
  },
  {
    id: 204,
    name: "Atelier Pair of Bedside Tables",
    category: "bedroom",
    price: 385000,
    originalPrice: null,
    rating: 4.7,
    reviews: 48,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=80"
    ],
    description:
      "Matched pair of nightstands in walnut with soft-close drawers and brass pulls. Designed to flank king or queen beds.",
    details: ["Set of 2", "Walnut finish", "Soft-close drawers", "Brass pulls", "50 × 40 × 55 cm each"],
    inStock: true,
    badge: "New"
  },
  {
    id: 205,
    name: "Hermitage Wardrobe Armoire",
    category: "bedroom",
    price: 1980000,
    originalPrice: 2250000,
    rating: 4.8,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80"
    ],
    description:
      "Floor-to-near-ceiling wardrobe in smoked oak with hanging rails, shelving, and a soft interior light. Closet-quality without built-ins.",
    details: ["Smoked oak", "Hanging + shelves", "Interior LED strip", "Soft-close doors", "120 × 60 × 220 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 206,
    name: "Velvet Belle Bedroom Chair & Dresser Set",
    category: "bedroom",
    price: 1120000,
    originalPrice: null,
    rating: 4.7,
    reviews: 22,
    image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=900&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&q=80"
    ],
    description:
      "Curved vanity dresser with six drawers and a matching blush velvet bedroom chair. Dressing ritual, elevated.",
    details: ["Dresser + chair set", "Blush velvet seat", "Six soft-close drawers", "Mirror-ready top", "Champagne hardware"],
    inStock: true,
    badge: null
  },

  // ─── Office & Gaming ───────────────────────────────────────────────────
  {
    id: 301,
    name: "Apex Pro Gaming Throne",
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
      "High-back gaming chair in black and graphite PU leather with 4D armrests, lumbar support, and recline to 165°. Built for marathon sessions.",
    details: ["Class-4 gas lift", "4D armrests", "165° recline", "Lumbar & head pillow", "150 kg capacity"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 302,
    name: "Executive Obsidian Desk Chair",
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
      "Boardroom-grade executive chair in full-grain black leather with polished aluminium base. Presence that matches ambition.",
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
      "Minimal study desk in white oak with cable grommets, drawer for stationery, and a surface wide enough for dual monitors.",
    details: ["White oak top", "Cable management", "Soft-close drawer", "140 × 70 × 75 cm", "Anti-scratch finish"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 304,
    name: "Command RGB Gaming Desk",
    category: "office",
    price: 395000,
    originalPrice: null,
    rating: 4.5,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=900&q=80"
    ],
    description:
      "Carbon-look gaming desk with full-width RGB edge lighting, cup holder, headphone hook, and mouse pad surface inlay.",
    details: ["RGB edge light", "Z-shaped steel frame", "Mouse pad inlay", "Headphone hook", "140 × 60 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 305,
    name: "Mesh Air Office Task Chair",
    category: "office",
    price: 285000,
    originalPrice: 340000,
    rating: 4.7,
    reviews: 118,
    image: "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=900&q=80",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80"
    ],
    description:
      "Breathable mesh task chair with adaptive lumbar and multi-tilt control—all-day comfort for hot climates and long workdays.",
    details: ["Breathable mesh", "Adaptive lumbar", "Multi-tilt", "Height adjustable", "BIFMA-style testing"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 306,
    name: "Director Leather Office Lounge",
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
      "Mid-century executive lounge chair in cognac leather—for private offices, client corners, and quiet thinking.",
    details: ["Cognac top-grain leather", "Walnut legs", "Deep seat", "Guest & executive use", "Spot clean leather"],
    inStock: true,
    badge: "New"
  },

  // ─── Dining ────────────────────────────────────────────────────────────
  {
    id: 401,
    name: "Imperial 8-Seater Dining Set",
    category: "dining",
    price: 3200000,
    originalPrice: 3650000,
    rating: 4.9,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80",
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80"
    ],
    description:
      "Formal dining set: extendable walnut table with eight upholstered chairs. Built for celebrations that last past midnight.",
    details: ["Table + 8 chairs", "Extendable walnut top", "Performance fabric seats", "Seats 8–10 extended", "Felt floor protectors"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 402,
    name: "Heritage 6-Seater Oak Dining Set",
    category: "dining",
    price: 2150000,
    originalPrice: null,
    rating: 4.8,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
    ],
    description:
      "Warm European oak dining set for six with sculpted spindle-back chairs. Everyday luxury for family meals.",
    details: ["Table + 6 chairs", "Solid oak", "Spindle-back chairs", "Natural oil finish", "200 × 95 cm table"],
    inStock: true,
    badge: null
  },
  {
    id: 403,
    name: "Compact 4-Seater Marble Dining Set",
    category: "dining",
    price: 1450000,
    originalPrice: 1680000,
    rating: 4.7,
    reviews: 45,
    image: "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=900&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80"
    ],
    description:
      "Round sintered-stone dining table with four velvet chairs—perfect for apartments and intimate dinners for four.",
    details: ["Table + 4 chairs", "Sintered stone top", "Velvet chairs", "Round Ø 110 cm", "Metal pedestal base"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 404,
    name: "Palazzo Live-Edge Dining Table",
    category: "dining",
    price: 1780000,
    originalPrice: null,
    rating: 4.8,
    reviews: 33,
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=900&q=80",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=900&q=80"
    ],
    description:
      "Statement dining table only—live-edge inspired slab top on black sculptural base. Pair with your own chairs or ours.",
    details: ["Table only", "Seats 6–8", "Live-edge aesthetic", "Matte protective coat", "220 × 100 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 405,
    name: "Couture Dining Chair Pair",
    category: "dining",
    price: 320000,
    originalPrice: 380000,
    rating: 4.6,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=900&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=80"
    ],
    description:
      "Pair of upholstered dining chairs in oatmeal linen with tapered oak legs. Order multiple pairs for a full suite.",
    details: ["Set of 2 chairs", "Oatmeal linen", "Oak legs", "Stackable lightly", "Sold as pair"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 406,
    name: "Gallery Sideboard Credenza",
    category: "dining",
    price: 980000,
    originalPrice: null,
    rating: 4.7,
    reviews: 28,
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=900&q=80",
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=900&q=80"
    ],
    description:
      "Long sideboard for dining rooms—china, linens, and barware behind fluted doors with soft ambient top surface for lamps and art.",
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
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80"
    ],
    description:
      "Luxury Persian-style rug in deep ruby and gold medallion patterns. Hand-inspired design that anchors formal living rooms.",
    details: ["Persian-inspired pattern", "Dense pile", "Non-slip recommended", "200 × 300 cm", "Professional clean"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 502,
    name: "Nordic Line Modern Wool Rug",
    category: "rugs",
    price: 685000,
    originalPrice: null,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
    ],
    description:
      "Contemporary geometric wool rug in ivory and charcoal. Clean Scandinavian luxury for minimalist interiors.",
    details: ["100% wool blend", "Modern geometric", "Low pile", "160 × 230 cm", "Spot clean"],
    inStock: true,
    badge: "New"
  },
  {
    id: 503,
    name: "Anatolia Turkish Kilim Runner",
    category: "rugs",
    price: 295000,
    originalPrice: 350000,
    rating: 4.6,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80",
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80"
    ],
    description:
      "Flat-weave Turkish-inspired runner with tribal motifs—hallways, entrances, and beside beds with artisan character.",
    details: ["Kilim-style flat weave", "Reversible", "80 × 250 cm", "Cotton blend", "Shake clean"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 504,
    name: "Cloud Nine Shaggy Luxe Rug",
    category: "rugs",
    price: 545000,
    originalPrice: null,
    rating: 4.8,
    reviews: 77,
    image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80"
    ],
    description:
      "Ultra-plush high-pile shag in pure ivory. Barefoot luxury for bedrooms and lounge corners.",
    details: ["High pile shag", "Ivory", "Soft polyester blend", "160 × 230 cm", "Anti-shed finish"],
    inStock: true,
    badge: null
  },
  {
    id: 505,
    name: "Terrace Weather Outdoor Rug",
    category: "rugs",
    price: 265000,
    originalPrice: 310000,
    rating: 4.5,
    reviews: 39,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=900&q=80"
    ],
    description:
      "UV-resistant outdoor rug in stone and sage tones for balconies, terraces, and covered patios. Style that survives the elements.",
    details: ["Outdoor polypropylene", "UV resistant", "Hose clean", "150 × 210 cm", "Quick dry"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 506,
    name: "Silk Route Hand-Feel Gallery Rug",
    category: "rugs",
    price: 1890000,
    originalPrice: null,
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1600166898405-da9535204843?w=900&q=80",
      "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=900&q=80"
    ],
    description:
      "Ultra-fine gallery rug with silk-touch sheen and muted jewel tones. A collector piece for under statement furniture.",
    details: ["Silk-touch fibres", "Fine density", "200 × 300 cm", "Professional clean only", "Limited edition feel"],
    inStock: true,
    badge: "New"
  },

  // ─── Lighting ──────────────────────────────────────────────────────────
  {
    id: 601,
    name: "Crystal Cascade Chandelier",
    category: "lighting",
    price: 1450000,
    originalPrice: 1680000,
    rating: 4.9,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80"
    ],
    description:
      "Multi-tier crystal chandelier with warm LED compatibility. Hotel glamour for double-volume foyers and formal dining rooms.",
    details: ["Crystal glass drops", "E14 fittings × 12", "Dimmable compatible", "Ø 80 cm", "Professional install recommended"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 602,
    name: "Arc Brass Floor Lamp",
    category: "lighting",
    price: 385000,
    originalPrice: 450000,
    rating: 4.7,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80"
    ],
    description:
      "Iconic arched floor lamp in brushed brass with oversized linen shade—reads beautifully over sectionals and reading nooks.",
    details: ["Brushed brass", "Linen shade", "E27", "Height ~180 cm", "Marble weighted base"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 603,
    name: "Alabaster Glow Table Lamp",
    category: "lighting",
    price: 185000,
    originalPrice: null,
    rating: 4.8,
    reviews: 61,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=80"
    ],
    description:
      "Sculptural table lamp with alabaster-effect base and cream silk shade. Soft bedside or console lighting.",
    details: ["Alabaster-effect ceramic", "Silk-look shade", "Inline dimmer", "E14", "Height 48 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 604,
    name: "Orbital Rattan Pendant",
    category: "lighting",
    price: 245000,
    originalPrice: 290000,
    rating: 4.6,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=900&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80"
    ],
    description:
      "Handwoven rattan pendant that casts patterned light over dining tables and kitchen islands. Resort calm at home.",
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
    image: "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80"
    ],
    description:
      "Pair of linear wall sconces in brushed brass—flank a bed, mirror, or artwork for gallery-level ambient light.",
    details: ["Set of 2", "Brushed brass", "G9 bulbs", "Hardwire", "Electrician install"],
    inStock: true,
    badge: null
  },
  {
    id: 606,
    name: "Celeste Multi-Globe Chandelier",
    category: "lighting",
    price: 980000,
    originalPrice: null,
    rating: 4.8,
    reviews: 25,
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=900&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=900&q=80"
    ],
    description:
      "Modern chandelier of staggered frosted glass globes on a matte black frame. Contemporary luxury for open-plan living.",
    details: ["Frosted glass globes", "Matte black frame", "G9 LEDs compatible", "Adjustable drops", "Ø 90 cm"],
    inStock: true,
    badge: "New"
  },

  // ─── Decor & Artifacts ─────────────────────────────────────────────────
  {
    id: 701,
    name: "Heritage Oil Portrait Collection",
    category: "decor",
    price: 385000,
    originalPrice: null,
    rating: 4.8,
    reviews: 44,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ],
    description:
      "Museum-quality portrait print set in gilded frames—instant gallery wall for staircases and formal lounges.",
    details: ["Set of 3 portraits", "Gilded frames", "Ready to hang", "Mixed sizes", "UV-resistant print"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 702,
    name: "Horizon Brass Wall Clock",
    category: "decor",
    price: 145000,
    originalPrice: 175000,
    rating: 4.7,
    reviews: 69,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900&q=80",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=900&q=80"
    ],
    description:
      "Minimal large wall clock with brushed brass bezel and silent sweep movement. Quiet luxury for living rooms and offices.",
    details: ["Silent quartz", "Brushed brass", "Ø 50 cm", "Battery operated", "Easy hang"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 703,
    name: "Bloom Ceramic Flower Vase Trio",
    category: "decor",
    price: 95000,
    originalPrice: null,
    rating: 4.6,
    reviews: 88,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80"
    ],
    description:
      "Hand-glazed ceramic flower vases in bone, sand, and clay tones. Style fresh blooms or dried pampas with sculptural grace.",
    details: ["Set of 3 vases", "Water-safe glaze", "Heights 15–32 cm", "Handcrafted look", "Unique glaze variation"],
    inStock: true,
    badge: null
  },
  {
    id: 704,
    name: "Bronze Continuum Sculpture",
    category: "decor",
    price: 275000,
    originalPrice: null,
    rating: 4.9,
    reviews: 21,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80"
    ],
    description:
      "Abstract bronze-finish sculpture on a marble plinth. A conversation piece for consoles, libraries, and boardrooms.",
    details: ["Bronze-finish metal", "Marble base", "Weighted", "Height 35 cm", "Indoor only"],
    inStock: true,
    badge: "New"
  },
  {
    id: 705,
    name: "Venetian Arch Floor Mirror",
    category: "decor",
    price: 485000,
    originalPrice: 560000,
    rating: 4.8,
    reviews: 37,
    image: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ],
    description:
      "Full-length arched floor mirror with slim champagne metal frame. Expands light and space in bedrooms and dressing areas.",
    details: ["Full length", "Arched top", "Champagne metal", "Lean or wall mount", "60 × 170 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 706,
    name: "Silk Luxe Throw Pillow Ensemble",
    category: "decor",
    price: 125000,
    originalPrice: null,
    rating: 4.7,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=900&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=900&q=80"
    ],
    description:
      "Set of four luxury throw pillows in silk-touch and bouclé mixes—champagne, ivory, and soft gold. Instant sofa styling.",
    details: ["Set of 4", "Silk-touch + bouclé", "Hidden zips", "Inserts included", "Dry clean covers"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 707,
    name: "Noir Candle Holder & Vessel Set",
    category: "decor",
    price: 78000,
    originalPrice: 95000,
    rating: 4.5,
    reviews: 58,
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80"
    ],
    description:
      "Matte black candle holders with pillar candles and a matching vessel tray. Evening ambience, effortlessly elevated.",
    details: ["Holders + tray + candles", "Matte black metal", "Pillar sizes mixed", "Heat-safe tray", "Gift ready"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 708,
    name: "Sahel African Bronze Artifact Pair",
    category: "decor",
    price: 320000,
    originalPrice: null,
    rating: 4.9,
    reviews: 26,
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=900&q=80",
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=900&q=80"
    ],
    description:
      "African-inspired bronze-finish figures celebrating form and heritage. Soulful accents for shelves, consoles, and galleries.",
    details: ["Set of 2 figures", "Bronze finish", "Weighted bases", "Heights 22–28 cm", "Artisan aesthetic"],
    inStock: true,
    badge: "Artifact"
  },
  {
    id: 709,
    name: "Heirloom Decorative Toy & Ornament Set",
    category: "decor",
    price: 65000,
    originalPrice: null,
    rating: 4.6,
    reviews: 49,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=900&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80"
    ],
    description:
      "Wooden animal figures and stacked ornaments for styled shelves, nurseries, and playful luxury corners—display-first, joy always.",
    details: ["Wood ornaments set", "Decorative toys", "Non-toxic finish", "Shelf styling", "Gift boxed"],
    inStock: true,
    badge: null
  },
  {
    id: 710,
    name: "Amber Statement Flower Vase",
    category: "decor",
    price: 72000,
    originalPrice: null,
    rating: 4.7,
    reviews: 71,
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=900&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80"
    ],
    description:
      "Tall amber glass flower vase that glows in afternoon light. Long stems, branches, or standing alone as sculpture.",
    details: ["Tinted glass", "Weighted base", "Height 35 cm", "Hand-blown look", "Indoor vase"],
    inStock: true,
    badge: "New"
  }
];

// Back-compat aliases used by older scripts
window.PRODUCTS = window.SKY_PRODUCTS;
window.CATEGORIES = window.SKY_CATEGORIES;
