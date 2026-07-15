// Sample furniture product catalog
const products = [
  {
    id: 1,
    name: "Linen Cloud Sofa",
    category: "sofa",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
    ],
    description: "A plush three-seater sofa upholstered in soft natural linen. Deep cushions and solid oak legs make it the centerpiece of any living room.",
    details: ["Solid oak frame", "Performance linen blend", "Removable cushion covers", "Seats 3 comfortably", "Dimensions: 220 × 95 × 85 cm"],
    inStock: true,
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Oak Crest Bed",
    category: "bed",
    price: 1899,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
    ],
    description: "Handcrafted solid oak platform bed with a tall headboard and clean Scandinavian lines. Built to last generations.",
    details: ["Solid European oak", "Platform base (no box spring)", "King & Queen available", "Natural oil finish", "Dimensions: 180 × 200 cm (Queen)"],
    inStock: true,
    badge: "New"
  },
  {
    id: 3,
    name: "Walnut Dining Table",
    category: "table",
    price: 1499,
    originalPrice: 1799,
    rating: 4.7,
    reviews: 56,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
      "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&q=80"
    ],
    description: "Live-edge inspired walnut dining table seating six. Warm grain patterns and tapered legs for a refined dining experience.",
    details: ["American black walnut", "Seats 6", "Protective matte finish", "Handmade joinery", "Dimensions: 200 × 95 × 75 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 4,
    name: "Ceramic Vessel Set",
    category: "artifacts",
    price: 189,
    originalPrice: null,
    rating: 4.6,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80"
    ],
    description: "A trio of hand-thrown ceramic vessels in warm clay tones. Perfect as a sculptural arrangement on a console or shelf.",
    details: ["Handcrafted stoneware", "Set of 3 vessels", "Unglazed & glazed mix", "Each piece unique", "Heights: 18 / 24 / 32 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 5,
    name: "Arc Floor Lamp",
    category: "lamps",
    price: 349,
    originalPrice: 429,
    rating: 4.5,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?w=800&q=80"
    ],
    description: "Elegant arched floor lamp with a linen shade and brushed brass finish. Soft, ambient light for reading corners and living rooms.",
    details: ["Brushed brass finish", "Linen drum shade", "E27 bulb compatible", "Adjustable arc", "Height: 180 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 6,
    name: "Velvet Accent Chair",
    category: "sofa",
    price: 699,
    originalPrice: null,
    rating: 4.7,
    reviews: 63,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80"
    ],
    description: "Mid-century inspired accent chair in rich terracotta velvet. Curved backrest and tapered walnut legs.",
    details: ["Terracotta velvet", "Walnut-stained legs", "High-density foam", "Weight capacity 120 kg", "Dimensions: 72 × 78 × 82 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 7,
    name: "Marble Side Table",
    category: "table",
    price: 449,
    originalPrice: null,
    rating: 4.8,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80",
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80"
    ],
    description: "Minimalist round side table with a genuine Carrara marble top and slim black steel base. A quiet luxury accent.",
    details: ["Carrara marble top", "Powder-coated steel base", "Felt floor protectors", "Easy to assemble", "Diameter: 45 cm, Height: 50 cm"],
    inStock: true,
    badge: "New"
  },
  {
    id: 8,
    name: "Woven Pendant Light",
    category: "lamps",
    price: 229,
    originalPrice: null,
    rating: 4.4,
    reviews: 47,
    image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80"
    ],
    description: "Handwoven rattan pendant that casts beautiful patterned light. Ideal over dining tables or in entryways.",
    details: ["Natural rattan", "E27 fitting", "Includes 1.5 m cord", "Indoor use only", "Diameter: 40 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 9,
    name: "Brass Sculpture",
    category: "artifacts",
    price: 275,
    originalPrice: null,
    rating: 4.9,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80"
    ],
    description: "Abstract brass sculpture with organic curves. A conversation piece for shelves, consoles, or desks.",
    details: ["Solid brass", "Hand-finished patina", "Weighted base", "One-of-a-kind casting", "Height: 28 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 10,
    name: "Upholstered Storage Bed",
    category: "bed",
    price: 2199,
    originalPrice: 2499,
    rating: 4.6,
    reviews: 52,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
    ],
    description: "Queen storage bed with soft bouclé upholstery and hydraulic lift storage. Style meets function for smaller bedrooms.",
    details: ["Bouclé fabric", "Hydraulic storage", "Slatted base included", "Queen size", "Dimensions: 160 × 200 cm"],
    inStock: true,
    badge: "Sale"
  },
  {
    id: 11,
    name: "Console Hall Table",
    category: "table",
    price: 599,
    originalPrice: null,
    rating: 4.5,
    reviews: 29,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"
    ],
    description: "Slim ash wood console with a single drawer. Perfect for entryways, behind sofas, or as a display surface.",
    details: ["Solid ash wood", "Soft-close drawer", "Natural finish", "Wall-friendly depth", "Dimensions: 120 × 35 × 80 cm"],
    inStock: true,
    badge: null
  },
  {
    id: 12,
    name: "Ceramic Table Lamp",
    category: "lamps",
    price: 159,
    originalPrice: null,
    rating: 4.7,
    reviews: 91,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80"
    ],
    description: "Glazed ceramic table lamp in soft sage green with a cream linen shade. Warm bedside or desk lighting.",
    details: ["Ceramic base", "Linen shade", "Inline switch", "E14 bulb", "Height: 42 cm"],
    inStock: true,
    badge: "Best Seller"
  }
];

function getProductById(id) {
  return products.find((p) => p.id === Number(id));
}

function getProductsByCategory(category) {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(amount);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) {
    html += '<svg class="w-4 h-4 text-amber-500 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }
  if (half) {
    html += '<svg class="w-4 h-4 text-amber-500 inline" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="#e5e7eb"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) {
    html += '<svg class="w-4 h-4 text-stone-300 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }
  return html;
}
