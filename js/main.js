/**
 * Sky Furniture — main application script
 * Products: admin localStorage (sky_admin_products) → else assets/js/data.js
 */

const CATALOG_VERSION_KEY = "sky_catalog_version";

function resolveAssetUrl(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  // Strip leading slash so paths work from site root without absolute-root issues
  let clean = String(url).replace(/^\//, "");
  // Admin lives in /admin/ so needs ../
  try {
    if (/\/admin(\/|$)/i.test(location.pathname || "")) {
      if (!clean.startsWith("../")) clean = "../" + clean;
    }
  } catch (_) {}
  return clean;
}

function loadProductCatalog() {
  const liveVersion = String(window.SKY_CATALOG_VERSION || "");
  try {
    const savedVersion = localStorage.getItem(CATALOG_VERSION_KEY) || "";
    // Drop stale admin overrides when catalog file was updated
    if (liveVersion && savedVersion !== liveVersion) {
      localStorage.removeItem("sky_admin_products");
      localStorage.setItem(CATALOG_VERSION_KEY, liveVersion);
    }
  } catch (_) {}

  try {
    const admin = JSON.parse(localStorage.getItem("sky_admin_products") || "null");
    if (Array.isArray(admin) && admin.length) {
      // Prefer live file images when admin cache still has broken remote/missing paths
      const fromFile = Array.isArray(window.SKY_PRODUCTS) ? window.SKY_PRODUCTS : [];
      const fileById = new Map(fromFile.map((p) => [Number(p.id), p]));
      return admin.map((p) => {
        const fresh = fileById.get(Number(p.id));
        const staleImg = String(p.image || "");
        if (
          fresh &&
          fresh.image &&
          (/unsplash|placehold|\.svg/i.test(staleImg) || !staleImg)
        ) {
          return normalizeShopProduct({ ...p, image: fresh.image, images: fresh.images || [fresh.image] });
        }
        return normalizeShopProduct(p);
      });
    }
  } catch (_) {}
  const base = Array.isArray(window.SKY_PRODUCTS) ? window.SKY_PRODUCTS : [];
  try {
    if (liveVersion) localStorage.setItem(CATALOG_VERSION_KEY, liveVersion);
  } catch (_) {}
  return base.map(normalizeShopProduct);
}

function normalizeShopProduct(p) {
  const legacy = { living: "living-room", "office-gaming": "office", sofa: "living-room", bed: "bedroom", table: "dining", lamps: "lighting", artifacts: "decor" };
  const category = legacy[p.category] || p.category || "living-room";
  const image = resolveAssetUrl(p.image || "");
  const images = (Array.isArray(p.images) && p.images.length ? p.images : p.image ? [p.image] : [])
    .map(resolveAssetUrl)
    .filter(Boolean);
  return {
    ...p,
    id: Number(p.id),
    category,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
    image: image || (images[0] || ""),
    images: images.length ? images : image ? [image] : [],
    details: Array.isArray(p.details) ? p.details : [],
    inStock: p.inStock !== false,
    active: p.active !== false
  };
}

let PRODUCTS = loadProductCatalog().filter((p) => p.active !== false);
const CATEGORIES = Array.isArray(window.SKY_CATEGORIES)
  ? window.SKY_CATEGORIES
  : [
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

const CART_KEY = "sky_furniture_cart";
const ORDERS_KEY = "sky_furniture_orders";
const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 15000;
const TAX_RATE = 0.075;
const PICKUP_LOCATION = "Sky Furniture Showroom, Allen Avenue, Ikeja, Lagos";

const products = PRODUCTS;

/** Reload catalog after admin edits (call on shop if needed) */
function refreshProductCatalog() {
  PRODUCTS = loadProductCatalog().filter((p) => p.active !== false);
  return PRODUCTS;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function categoryLabel(id) {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  const star = (cls) =>
    `<svg class="w-3.5 h-3.5 ${cls} inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
  for (let i = 0; i < full; i++) html += star("text-amber-500");
  if (half) html += star("text-amber-400");
  for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) html += star("text-stone-300");
  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Cart (localStorage)
// ---------------------------------------------------------------------------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cart:updated"));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const id = Number(productId);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += quantity;
  else cart.push({ id, quantity });
  saveCart(cart);
  showToast("Added to cart");
  return cart;
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== Number(productId)));
  showToast("Removed from cart");
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  if (!item) return;
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = Math.min(99, quantity);
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartItemsWithProducts() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity };
    })
    .filter(Boolean);
}

/**
 * @param {{ delivery?: "home" | "pickup" }} [options]
 */
function getCartTotals(options = {}) {
  const delivery = options.delivery || "home";
  const items = getCartItemsWithProducts();
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  let shipping = 0;
  if (delivery === "pickup") {
    shipping = 0;
  } else if (subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD) {
    shipping = SHIPPING_FEE;
  }
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;
  return {
    subtotal,
    shipping,
    tax,
    total,
    delivery,
    itemCount: items.length,
    quantity: getCartCount()
  };
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cart:updated"));
}

// ---------------------------------------------------------------------------
// Orders (localStorage)
// ---------------------------------------------------------------------------
function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  // Keep admin "paid orders" store in sync
  try {
    const paidKey = "sky_furniture_paid_orders";
    const paid = JSON.parse(localStorage.getItem(paidKey) || "[]");
    const list = Array.isArray(paid) ? paid : [];
    list.unshift(order);
    localStorage.setItem(paidKey, JSON.stringify(list.slice(0, 200)));
  } catch (_) {}

  // Cloud sync for multi-user admin dashboard
  if (window.SkyCloudStore?.saveOrderToCloud) {
    window.SkyCloudStore.saveOrderToCloud(order).catch(() => {});
  } else {
    import("./assets/js/cloud-store.js")
      .then((mod) => mod.saveOrderToCloud(order))
      .catch(() => {});
  }
  return order;
}

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SKY-${stamp}${rand}`;
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count > 99 ? "99+" : String(count);
    el.classList.toggle("hidden", count === 0);
    el.classList.toggle("flex", count > 0);
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] bg-ink text-cream px-5 py-3 rounded-full text-sm shadow-xl opacity-0 translate-y-2 transition-all duration-300 pointer-events-none";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
    toast.classList.add("opacity-100", "translate-y-0");
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    toast.classList.remove("opacity-100", "translate-y-0");
  }, 2200);
}

// ---------------------------------------------------------------------------
// Filter / search products
// ---------------------------------------------------------------------------
function filterProducts({ category = "all", query = "", sort = "featured" } = {}) {
  let list = [...PRODUCTS];

  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }

  const q = query.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        categoryLabel(p.category).toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  return list;
}

// ---------------------------------------------------------------------------
// Product card HTML (hover + quick view)
// ---------------------------------------------------------------------------
function renderProductCard(p, options = {}) {
  const { showQuickView = true } = options;
  return `
    <article class="product-card group relative flex flex-col" data-product-id="${p.id}">
      <div class="relative overflow-hidden bg-sand aspect-[4/5] rounded-sm">
        ${
          p.badge
            ? `<span class="absolute top-3 left-3 z-10 bg-cream/95 backdrop-blur-sm text-ink text-[10px] tracking-wider uppercase px-2.5 py-1 font-medium shadow-sm">${escapeHtml(p.badge)}</span>`
            : ""
        }
        <a href="product-detail.html?id=${p.id}" class="block h-full w-full">
          <img
            src="${p.image}"
            alt="${escapeHtml(p.name)} - ${escapeHtml(categoryLabel(p.category))} furniture from Sky Furniture Nigeria"
            width="600"
            height="750"
            class="product-card-img w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </a>
        <!-- Hover overlay -->
        <div class="product-card-overlay absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div class="absolute inset-x-0 bottom-0 p-3 sm:p-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col gap-2">
          ${
            showQuickView
              ? `<button type="button" class="quick-view-btn w-full bg-cream/95 backdrop-blur text-ink text-xs sm:text-sm font-medium py-2.5 tracking-wide hover:bg-white transition shadow-md" data-quick-view="${p.id}">
                  Quick View
                </button>`
              : ""
          }
          <button type="button" class="add-cart-btn w-full bg-ink text-cream text-xs sm:text-sm font-medium py-2.5 tracking-wide hover:bg-stone-800 transition shadow-md" data-add-cart="${p.id}">
            Add to Cart
          </button>
        </div>
      </div>
      <div class="mt-4 flex flex-col flex-1">
        <div class="flex items-center gap-1 mb-1">${renderStars(p.rating)}
          <span class="text-xs text-stone-400 ml-1">(${p.reviews})</span>
        </div>
        <p class="text-[11px] text-stone-400 uppercase tracking-[0.15em]">${escapeHtml(categoryLabel(p.category))}</p>
        <a href="product-detail.html?id=${p.id}" class="font-display text-xl text-ink hover:text-clay transition-colors duration-300 leading-snug mt-0.5">
          ${escapeHtml(p.name)}
        </a>
        <div class="mt-1.5 flex items-center gap-2">
          <span class="text-sm font-medium tabular-nums">${formatPrice(p.price)}</span>
          ${
            p.originalPrice
              ? `<span class="text-sm text-stone-400 line-through tabular-nums">${formatPrice(p.originalPrice)}</span>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

function bindProductCardEvents(root = document) {
  root.querySelectorAll("[data-quick-view]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openQuickView(Number(btn.dataset.quickView));
    });
  });
  root.querySelectorAll("[data-add-cart]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(Number(btn.dataset.addCart), 1);
      btn.classList.add("ring-2", "ring-warm");
      setTimeout(() => btn.classList.remove("ring-2", "ring-warm"), 400);
    });
  });
}

// ---------------------------------------------------------------------------
// Quick View Modal
// ---------------------------------------------------------------------------
function ensureQuickViewModal() {
  if (document.getElementById("quick-view-modal")) return;

  const modal = document.createElement("div");
  modal.id = "quick-view-modal";
  modal.className = "fixed inset-0 z-[70] hidden";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "qv-title");
  modal.innerHTML = `
    <div class="qv-backdrop absolute inset-0 bg-ink/60 backdrop-blur-sm opacity-0 transition-opacity duration-300" data-qv-close></div>
    <div class="absolute inset-0 overflow-y-auto p-4 sm:p-6 flex items-start sm:items-center justify-center">
      <div class="qv-panel relative w-full max-w-4xl bg-cream shadow-2xl opacity-0 scale-95 translate-y-4 transition-all duration-300 my-4 sm:my-8">
        <button type="button" class="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 border border-sand text-stone-600 hover:text-ink hover:bg-white transition flex items-center justify-center shadow-sm" data-qv-close aria-label="Close">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div id="qv-content" class="grid md:grid-cols-2 gap-0"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-qv-close]")) closeQuickView();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeQuickView();
  });
}

let qvQty = 1;

function openQuickView(productId) {
  const p = getProductById(productId);
  if (!p) return;
  ensureQuickViewModal();
  qvQty = 1;

  const content = document.getElementById("qv-content");
  content.innerHTML = `
    <div class="aspect-[4/5] md:aspect-auto md:min-h-[420px] bg-sand overflow-hidden">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover" />
    </div>
    <div class="p-6 sm:p-8 md:p-10 flex flex-col">
      ${p.badge ? `<span class="self-start text-[10px] tracking-wider uppercase bg-sand text-ink px-2 py-1 font-medium mb-3">${escapeHtml(p.badge)}</span>` : ""}
      <p class="text-[11px] text-stone-400 uppercase tracking-[0.15em]">${escapeHtml(categoryLabel(p.category))}</p>
      <h2 id="qv-title" class="font-display text-3xl md:text-4xl text-ink mt-1 leading-tight">${escapeHtml(p.name)}</h2>
      <div class="mt-3 flex items-center gap-2">
        ${renderStars(p.rating)}
        <span class="text-sm text-stone-500">${p.rating} (${p.reviews})</span>
      </div>
      <div class="mt-4 flex items-baseline gap-3">
        <span class="text-2xl font-medium tabular-nums">${formatPrice(p.price)}</span>
        ${p.originalPrice ? `<span class="text-base text-stone-400 line-through tabular-nums">${formatPrice(p.originalPrice)}</span>` : ""}
      </div>
      <p class="mt-5 text-stone-600 font-light leading-relaxed text-sm sm:text-base line-clamp-4">${escapeHtml(p.description)}</p>
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <div class="flex items-center border border-sand bg-white">
          <button type="button" id="qv-qty-minus" class="w-11 h-11 text-lg hover:bg-sand transition" aria-label="Decrease">-</button>
          <span id="qv-qty" class="w-10 text-center text-sm font-medium">1</span>
          <button type="button" id="qv-qty-plus" class="w-11 h-11 text-lg hover:bg-sand transition" aria-label="Increase">+</button>
        </div>
        <button type="button" id="qv-add" class="flex-1 min-w-[140px] bg-ink text-cream py-3 text-sm font-medium tracking-wide hover:bg-stone-800 transition">
          Add to Cart
        </button>
      </div>
      <a href="product-detail.html?id=${p.id}" class="mt-4 text-sm text-clay hover:text-ink transition inline-flex items-center gap-1">
        View full details
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>
  `;

  document.getElementById("qv-qty-minus").onclick = () => {
    qvQty = Math.max(1, qvQty - 1);
    document.getElementById("qv-qty").textContent = qvQty;
  };
  document.getElementById("qv-qty-plus").onclick = () => {
    qvQty = Math.min(10, qvQty + 1);
    document.getElementById("qv-qty").textContent = qvQty;
  };
  document.getElementById("qv-add").onclick = () => {
    addToCart(p.id, qvQty);
    closeQuickView();
  };

  const modal = document.getElementById("quick-view-modal");
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  requestAnimationFrame(() => {
    modal.querySelector(".qv-backdrop").classList.add("opacity-100");
    modal.querySelector(".qv-panel").classList.remove("opacity-0", "scale-95", "translate-y-4");
    modal.querySelector(".qv-panel").classList.add("opacity-100", "scale-100", "translate-y-0");
  });
}

function closeQuickView() {
  const modal = document.getElementById("quick-view-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  const backdrop = modal.querySelector(".qv-backdrop");
  const panel = modal.querySelector(".qv-panel");
  backdrop.classList.remove("opacity-100");
  panel.classList.add("opacity-0", "scale-95", "translate-y-4");
  panel.classList.remove("opacity-100", "scale-100", "translate-y-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }, 280);
}

// ---------------------------------------------------------------------------
// Shared UI: mobile menu, search forms
// ---------------------------------------------------------------------------
function initHeader() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => menu.classList.toggle("hidden"));
  }

  const searchBtn = document.getElementById("mobile-search-btn");
  const searchBox = document.getElementById("mobile-search");
  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", () => searchBox.classList.toggle("hidden"));
  }

  // Live search on shop page if #live-search exists
  const liveSearch = document.getElementById("live-search");
  if (liveSearch && typeof window.__shopState !== "undefined") {
    liveSearch.addEventListener("input", () => {
      window.__shopState.query = liveSearch.value;
      window.__renderShop();
    });
  }
}

// ---------------------------------------------------------------------------
// Page: Home
// ---------------------------------------------------------------------------
function initHome() {
  const grid = document.getElementById("featured-grid");
  if (grid) {
    const featured = PRODUCTS.slice(0, 4);
    grid.innerHTML = featured.map((p) => renderProductCard(p)).join("");
    bindProductCardEvents(grid);
  }

  // Carousel
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides.length) return;
  const dots = document.querySelectorAll(".carousel-dot");
  let index = 0;
  let timer;

  function goTo(i) {
    slides[index]?.classList.remove("active");
    dots[index]?.classList.remove("bg-white/90");
    dots[index]?.classList.add("bg-white/40");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index]?.classList.add("bg-white/90");
    dots[index]?.classList.remove("bg-white/40");
  }

  function next() {
    goTo(index + 1);
  }
  function prev() {
    goTo(index - 1);
  }
  function reset() {
    clearInterval(timer);
    timer = setInterval(next, 5500);
  }

  document.getElementById("carousel-next")?.addEventListener("click", () => {
    next();
    reset();
  });
  document.getElementById("carousel-prev")?.addEventListener("click", () => {
    prev();
    reset();
  });
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goTo(Number(dot.dataset.index));
      reset();
    });
  });
  timer = setInterval(next, 5500);
}

// ---------------------------------------------------------------------------
// Page: Shop (filters + search + sort)
// ---------------------------------------------------------------------------
function initShop() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  let startCategory = params.get("category") || "all";
  // Legacy URL support
  if (startCategory === "living") startCategory = "living-room";
  if (startCategory === "office-gaming") startCategory = "office";

  window.__shopState = {
    category: startCategory,
    query: params.get("q") || "",
    sort: "featured"
  };

  // Pre-fill search inputs
  document.querySelectorAll('input[name="q"], #live-search, #header-search').forEach((input) => {
    if (window.__shopState.query) input.value = window.__shopState.query;
  });

  // Category filter buttons
  const filterRoot = document.getElementById("category-filters");
  if (filterRoot) {
    filterRoot.innerHTML = CATEGORIES.map(
      (c) => `
      <button type="button" data-category="${c.id}" class="filter-btn text-left text-sm px-4 py-2 rounded-full border transition-all duration-300
        ${window.__shopState.category === c.id ? "bg-ink text-cream border-ink shadow-sm" : "bg-white text-stone-600 border-sand hover:border-ink/40 hover:text-ink"}">
        ${c.label}
      </button>`
    ).join("");

    filterRoot.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.__shopState.category = btn.dataset.category;
        window.__shopState.query = "";
        document.querySelectorAll('input[name="q"], #live-search, #header-search').forEach((i) => {
          i.value = "";
        });
        const url = new URL(window.location.href);
        if (window.__shopState.category === "all") url.searchParams.delete("category");
        else url.searchParams.set("category", window.__shopState.category);
        url.searchParams.delete("q");
        history.replaceState({}, "", url);
        updateFilterButtons();
        window.__renderShop();
      });
    });
  }

  function updateFilterButtons() {
    filterRoot?.querySelectorAll(".filter-btn").forEach((btn) => {
      const active = btn.dataset.category === window.__shopState.category;
      btn.className = `filter-btn text-left text-sm px-4 py-2 rounded-full border transition-all duration-300 ${
        active
          ? "bg-ink text-cream border-ink shadow-sm"
          : "bg-white text-stone-600 border-sand hover:border-ink/40 hover:text-ink"
      }`;
    });
  }

  // Sort
  ["sort-select", "sort-select-mobile"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", (e) => {
      window.__shopState.sort = e.target.value;
      document.getElementById("sort-select") && (document.getElementById("sort-select").value = e.target.value);
      document.getElementById("sort-select-mobile") &&
        (document.getElementById("sort-select-mobile").value = e.target.value);
      window.__renderShop();
    });
  });

  // Live search field on shop
  const live = document.getElementById("live-search");
  if (live) {
    live.addEventListener("input", () => {
      window.__shopState.query = live.value;
      const url = new URL(window.location.href);
      if (live.value.trim()) url.searchParams.set("q", live.value.trim());
      else url.searchParams.delete("q");
      history.replaceState({}, "", url);
      window.__renderShop();
    });
  }

  window.__renderShop = function renderShop() {
    const { category, query, sort } = window.__shopState;
    const list = filterProducts({ category, query, sort });
    const empty = document.getElementById("empty-state");
    const title = document.getElementById("page-title");
    const countEl = document.getElementById("result-count");

    if (title) {
      title.textContent = query.trim()
        ? `Results for "${query.trim()}"`
        : category === "all"
          ? "All Furniture"
          : categoryLabel(category);
    }
    if (countEl) {
      countEl.textContent = list.length === 1 ? "1 piece" : `${list.length} pieces`;
    }

    if (!list.length) {
      grid.innerHTML = "";
      empty?.classList.remove("hidden");
      return;
    }
    empty?.classList.add("hidden");
    grid.innerHTML = list.map((p) => renderProductCard(p)).join("");
    bindProductCardEvents(grid);
  };

  window.__renderShop();
}

// ---------------------------------------------------------------------------
// Page: Product detail
// ---------------------------------------------------------------------------
function initProductDetail() {
  const root = document.getElementById("product-content");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const product = getProductById(params.get("id") || 1);
  const notFound = document.getElementById("not-found");

  if (!product) {
    notFound?.classList.remove("hidden");
    return;
  }

  document.title = `${product.name} - Sky Furniture`;
  const crumb = document.getElementById("crumb-name");
  if (crumb) crumb.textContent = product.name;

  let qty = 1;
  let activeImage = 0;
  const images = product.images || [product.image];

  function render() {
    root.innerHTML = `
      <div class="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div class="aspect-[4/5] bg-sand overflow-hidden mb-3 group">
            <img id="main-image" src="${images[activeImage]}" alt="${escapeHtml(product.name)}"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            ${images
              .map(
                (src, i) => `
              <button type="button" data-img="${i}" class="aspect-square bg-sand overflow-hidden border-2 transition duration-300 ${
                i === activeImage ? "border-ink" : "border-transparent hover:border-sand"
              }">
                <img src="${src}" alt="" class="w-full h-full object-cover" />
              </button>`
              )
              .join("")}
          </div>
        </div>
        <div class="lg:pt-4">
          ${product.badge ? `<span class="inline-block text-[10px] tracking-wider uppercase bg-sand text-ink px-2 py-1 font-medium mb-3">${escapeHtml(product.badge)}</span>` : ""}
          <p class="text-xs text-stone-400 uppercase tracking-wider">${escapeHtml(categoryLabel(product.category))}</p>
          <h1 class="font-display text-4xl md:text-5xl text-ink mt-1 leading-tight">${escapeHtml(product.name)}</h1>
          <div class="mt-3 flex items-center gap-2">
            ${renderStars(product.rating)}
            <span class="text-sm text-stone-500">${product.rating} (${product.reviews} reviews)</span>
          </div>
          <div class="mt-5 flex items-baseline gap-3">
            <span class="text-2xl font-medium tabular-nums">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="text-lg text-stone-400 line-through tabular-nums">${formatPrice(product.originalPrice)}</span>` : ""}
          </div>
          <p class="mt-6 text-stone-600 font-light leading-relaxed">${escapeHtml(product.description)}</p>
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <div class="flex items-center border border-sand bg-white">
              <button type="button" id="pd-minus" class="w-11 h-11 text-lg hover:bg-sand transition">-</button>
              <span id="pd-qty" class="w-10 text-center text-sm font-medium">${qty}</span>
              <button type="button" id="pd-plus" class="w-11 h-11 text-lg hover:bg-sand transition">+</button>
            </div>
            <button type="button" id="pd-add" class="flex-1 min-w-[160px] bg-ink text-cream py-3.5 text-sm font-medium tracking-wide hover:bg-stone-800 transition shadow-md hover:shadow-lg">
              Add to Cart
            </button>
          </div>
          <a href="cart.html" class="inline-block mt-4 text-sm text-clay hover:text-ink transition">View cart -></a>
          <div class="mt-10 pt-8 border-t border-sand">
            <h2 class="text-sm font-medium tracking-wide mb-4">Details</h2>
            <ul class="space-y-2 text-sm text-stone-600 font-light">
              ${product.details.map((d) => `<li class="flex gap-2"><span class="text-warm">·</span> ${escapeHtml(d)}</li>`).join("")}
            </ul>
          </div>
          <p class="mt-6 text-sm text-stone-500">${product.inStock ? "In stock - delivery in 5-14 business days" : "Out of stock"}</p>
        </div>
      </div>
    `;

    root.querySelectorAll("[data-img]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeImage = Number(btn.dataset.img);
        render();
      });
    });
    document.getElementById("pd-minus").onclick = () => {
      qty = Math.max(1, qty - 1);
      document.getElementById("pd-qty").textContent = qty;
    };
    document.getElementById("pd-plus").onclick = () => {
      qty = Math.min(10, qty + 1);
      document.getElementById("pd-qty").textContent = qty;
    };
    document.getElementById("pd-add").onclick = () => addToCart(product.id, qty);
  }

  render();

  // Related
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const relatedSection = document.getElementById("related-section");
  const relatedGrid = document.getElementById("related-grid");
  if (related.length && relatedSection && relatedGrid) {
    relatedSection.hidden = false;
    relatedGrid.innerHTML = related.map((p) => renderProductCard(p)).join("");
    bindProductCardEvents(relatedGrid);
  }
}

// ---------------------------------------------------------------------------
// Page: Cart
// ---------------------------------------------------------------------------
function initCartPage() {
  const itemsRoot = document.getElementById("cart-items");
  if (!itemsRoot && !document.getElementById("cart-empty")) return;

  function renderCart() {
    const items = getCartItemsWithProducts();
    const empty = document.getElementById("cart-empty");
    const filled = document.getElementById("cart-filled");
    const subtitle = document.getElementById("cart-subtitle");

    if (!items.length) {
      empty?.classList.remove("hidden");
      filled?.classList.add("hidden");
      if (subtitle) subtitle.textContent = "";
      return;
    }

    empty?.classList.add("hidden");
    filled?.classList.remove("hidden");
    const count = items.reduce((s, i) => s + i.quantity, 0);
    if (subtitle) subtitle.textContent = count === 1 ? "1 item" : `${count} items`;

    itemsRoot.innerHTML = items
      .map(
        (item) => `
      <div class="flex gap-4 sm:gap-6 py-6 border-b border-sand first:pt-0 group/row">
        <a href="product-detail.html?id=${item.id}" class="w-24 h-28 sm:w-32 sm:h-36 bg-sand shrink-0 overflow-hidden">
          <img src="${item.image}" alt="${escapeHtml(item.name)}" class="w-full h-full object-cover transition duration-500 group-hover/row:scale-105" />
        </a>
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex justify-between gap-4">
            <div>
              <p class="text-xs text-stone-400 uppercase tracking-wider">${escapeHtml(categoryLabel(item.category))}</p>
              <a href="product-detail.html?id=${item.id}" class="font-display text-xl hover:text-clay transition">${escapeHtml(item.name)}</a>
              <p class="text-sm mt-1 tabular-nums">${formatPrice(item.price)}</p>
            </div>
            <p class="text-sm font-medium shrink-0 tabular-nums">${formatPrice(item.lineTotal)}</p>
          </div>
          <div class="mt-auto pt-4 flex items-center justify-between">
            <div class="flex items-center border border-sand bg-white">
              <button type="button" class="w-9 h-9 hover:bg-sand transition" data-qty-change="${item.id}" data-delta="-1" aria-label="Decrease">-</button>
              <span class="w-8 text-center text-sm">${item.quantity}</span>
              <button type="button" class="w-9 h-9 hover:bg-sand transition" data-qty-change="${item.id}" data-delta="1" aria-label="Increase">+</button>
            </div>
            <button type="button" class="text-xs text-stone-400 hover:text-red-700 transition underline underline-offset-2" data-remove="${item.id}">Remove</button>
          </div>
        </div>
      </div>`
      )
      .join("");

    itemsRoot.querySelectorAll("[data-qty-change]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.qtyChange);
        const item = getCart().find((i) => i.id === id);
        if (!item) return;
        updateQuantity(id, item.quantity + Number(btn.dataset.delta));
        renderCart();
      });
    });
    itemsRoot.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        removeFromCart(Number(btn.dataset.remove));
        renderCart();
      });
    });

    const totals = getCartTotals();
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set("sum-subtotal", formatPrice(totals.subtotal));
    set("sum-shipping", totals.shipping === 0 ? "Free" : formatPrice(totals.shipping));
    set("sum-tax", formatPrice(totals.tax));
    set("sum-total", formatPrice(totals.total));
    const note = document.getElementById("shipping-note");
    if (note) {
      note.textContent =
        totals.subtotal >= FREE_SHIPPING_THRESHOLD
          ? "You qualify for free shipping"
          : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free shipping`;
    }
  }

  renderCart();
  document.addEventListener("cart:updated", renderCart);
}

// ---------------------------------------------------------------------------
// Page: Checkout - validation, delivery, fake Paystack/Stripe, orders
// ---------------------------------------------------------------------------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

/** Nigerian phone: 0803... / 0701... / +234 803... / 234803... */
function isValidNgPhone(phone) {
  const digits = String(phone).replace(/[\s\-()]/g, "");
  if (/^(\+?234|0)[789][01]\d{8}$/.test(digits)) return true;
  if (/^0\d{10}$/.test(digits)) return true;
  return false;
}

function setFieldError(name, message) {
  const err = document.querySelector(`[data-error-for="${name}"]`);
  const input = document.getElementById(name) || document.querySelector(`[name="${name}"]`);
  if (err) {
    if (message) {
      err.textContent = message;
      err.classList.remove("hidden");
    } else {
      err.textContent = "";
      err.classList.add("hidden");
    }
  }
  if (input && input.classList) {
    input.classList.toggle("border-red-400", Boolean(message));
    input.classList.toggle("bg-red-50/40", Boolean(message));
  }
}

function clearAllFieldErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
    el.classList.add("hidden");
  });
  document.querySelectorAll(".field-input").forEach((el) => {
    el.classList.remove("border-red-400", "bg-red-50/40");
  });
  const globalErr = document.getElementById("form-global-error");
  if (globalErr) {
    globalErr.classList.add("hidden");
    globalErr.textContent = "";
  }
}

function getSelectedDelivery() {
  return document.querySelector('input[name="delivery"]:checked')?.value || "home";
}

function getSelectedPayment() {
  return document.querySelector('input[name="payment"]:checked')?.value || "paystack";
}

function collectCheckoutForm() {
  return {
    fullName: document.getElementById("fullName")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    address: document.getElementById("address")?.value.trim() || "",
    lga: document.getElementById("lga")?.value || "",
    city: document.getElementById("city")?.value.trim() || "",
    state: document.getElementById("state")?.value || "",
    country: document.getElementById("country")?.value.trim() || "Nigeria",
    landmark: document.getElementById("landmark")?.value.trim() || "",
    notes: document.getElementById("notes")?.value.trim() || "",
    delivery: getSelectedDelivery(),
    payment: getSelectedPayment(),
    terms: Boolean(document.getElementById("terms")?.checked)
  };
}

/**
 * @returns {{ valid: boolean, errors: Record<string, string>, data: object }}
 */
function validateCheckoutForm() {
  const data = collectCheckoutForm();
  const errors = {};

  if (!data.fullName || data.fullName.length < 3) {
    errors.fullName = "Enter your full name (at least 3 characters).";
  } else if (data.fullName.split(/\s+/).filter(Boolean).length < 2) {
    errors.fullName = "Please enter first and last name.";
  }

  if (!data.email) errors.email = "Email is required.";
  else if (!isValidEmail(data.email)) errors.email = "Enter a valid email address.";

  if (!data.phone) errors.phone = "Phone number is required.";
  else if (!isValidNgPhone(data.phone)) {
    errors.phone = "Enter a valid Nigerian number (e.g. 0803 123 4567 or +234...).";
  }

  // State & LGA always required (needed for pickup contact and home delivery)
  if (!data.state) {
    errors.state = "Select your state.";
  } else if (typeof NIGERIA_LOCATIONS !== "undefined" && !NIGERIA_LOCATIONS[data.state]) {
    errors.state = "Select a valid Nigerian state.";
  }

  if (!data.lga) {
    errors.lga = "Select your Local Government Area.";
  } else if (
    data.state &&
    typeof getLGAsForState === "function" &&
    !getLGAsForState(data.state).includes(data.lga)
  ) {
    errors.lga = "Select a valid LGA for the chosen state.";
  }

  if (data.delivery === "home") {
    if (!data.address || data.address.length < 8) {
      errors.address = "Enter a full street address for delivery.";
    }
    if (!data.city || data.city.length < 2) {
      errors.city = "Enter your town, city, or neighbourhood.";
    }
  }

  if (!data.delivery) errors.delivery = "Choose a delivery option.";
  if (!data.payment) errors.payment = "Choose a payment method.";
  if (!data.terms) errors.terms = "You must accept the terms to place an order.";

  return { valid: Object.keys(errors).length === 0, errors, data };
}

function showValidationErrors(errors) {
  clearAllFieldErrors();
  Object.entries(errors).forEach(([key, msg]) => setFieldError(key, msg));
  const firstKey = Object.keys(errors)[0];
  if (firstKey) {
    const el = document.getElementById(firstKey) || document.querySelector(`[name="${firstKey}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    el?.focus?.();
  }
  const globalErr = document.getElementById("form-global-error");
  if (globalErr) {
    globalErr.textContent = "Please fix the highlighted fields and try again.";
    globalErr.classList.remove("hidden");
  }
}

function updateDeliveryUI() {
  const delivery = getSelectedDelivery();
  document.querySelectorAll(".delivery-option").forEach((label) => {
    const active = label.dataset.delivery === delivery;
    label.classList.toggle("border-ink", active);
    label.classList.toggle("bg-cream/40", active);
    label.classList.toggle("border-sand", !active);
    label.classList.toggle("bg-white", !active);
  });

  // Street + town required mainly for home delivery (state/LGA always shown)
  const isHome = delivery === "home";
  document.querySelectorAll(".address-required").forEach((el) => {
    el.classList.toggle("hidden", !isHome);
  });
  if (!isHome) {
    setFieldError("address", "");
    setFieldError("city", "");
  }

  updateCheckoutSummary();
}

function updatePaymentUI() {
  const payment = getSelectedPayment();
  document.querySelectorAll(".payment-option").forEach((label) => {
    const active = label.dataset.pay === payment;
    label.classList.toggle("border-ink", active);
    label.classList.toggle("bg-cream/40", active);
    label.classList.toggle("border-sand", !active);
    label.classList.toggle("bg-white", !active);
  });
}

function updateCheckoutSummary() {
  const items = getCartItemsWithProducts();
  const delivery = getSelectedDelivery();
  const totals = getCartTotals({ delivery });

  const orderItems = document.getElementById("order-items");
  if (orderItems) {
    orderItems.innerHTML = items
      .map(
        (item) => `
      <div class="flex gap-3">
        <div class="relative w-16 h-16 bg-sand shrink-0 overflow-hidden">
          <img src="${item.image}" alt="" class="w-full h-full object-cover" />
          <span class="absolute -top-1 -right-1 bg-ink text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center">${item.quantity}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">${escapeHtml(item.name)}</p>
          <p class="text-xs text-stone-400 tabular-nums">${formatPrice(item.price)} x ${item.quantity}</p>
        </div>
        <p class="text-sm shrink-0 tabular-nums">${formatPrice(item.lineTotal)}</p>
      </div>`
      )
      .join("");
  }

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("summary-count", totals.quantity === 1 ? "1 item" : `${totals.quantity} items`);
  set("co-subtotal", formatPrice(totals.subtotal));
  set("co-tax", formatPrice(totals.tax));
  set("co-total", formatPrice(totals.total));
  set(
    "co-shipping-label",
    delivery === "pickup" ? "Store pickup" : "Home delivery"
  );
  set("co-shipping", totals.shipping === 0 ? "Free" : formatPrice(totals.shipping));

  const homePriceEl = document.getElementById("delivery-home-price");
  if (homePriceEl) {
    const homeFee =
      totals.subtotal >= FREE_SHIPPING_THRESHOLD || totals.subtotal === 0
        ? 0
        : SHIPPING_FEE;
    homePriceEl.textContent = homeFee === 0 ? "Free" : formatPrice(homeFee);
    homePriceEl.classList.toggle("text-green-700", homeFee === 0);
    homePriceEl.classList.toggle("font-medium", homeFee === 0);
    homePriceEl.classList.toggle("text-clay", homeFee !== 0);
  }

  const hint = document.getElementById("shipping-hint");
  if (hint) {
    if (delivery === "pickup") {
      hint.textContent = `Pickup at ${PICKUP_LOCATION}`;
    } else if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
      hint.textContent = "You qualify for free Lagos home delivery";
    } else {
      hint.textContent = `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - totals.subtotal)} more for free Lagos delivery`;
    }
  }
}

function openPaymentModal(gateway) {
  const modal = document.getElementById("payment-modal");
  const desc = document.getElementById("payment-modal-desc");
  if (!modal) return;
  if (desc) {
    desc.textContent =
      gateway === "stripe"
        ? "Stripe test mode · pk_test_···· · Authorizing card..."
        : "Paystack test mode · pk_test_···· · Opening secure channel...";
  }
  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closePaymentModal() {
  const modal = document.getElementById("payment-modal");
  modal?.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function openConfirmModal(order) {
  const modal = document.getElementById("confirm-modal");
  if (!modal) return;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("confirm-order-id", order.orderNumber);
  set(
    "confirm-payment",
    order.payment === "stripe"
      ? "Stripe (demo)"
      : order.paymentRef
        ? "Paystack"
        : "Paystack"
  );
  const refEl = document.getElementById("confirm-payment");
  if (refEl && order.paymentRef) {
    refEl.textContent = "Paystack · " + order.paymentRef;
  }
  set(
    "confirm-delivery",
    order.delivery === "pickup"
      ? "Store pickup · Ikeja"
      : `Home · ${order.customer.lga || order.customer.city}, ${order.customer.state}`
  );
  set("confirm-total", formatPrice(order.totals.total));
  set("confirm-email", order.customer.email);

  // Also fill page-level success block
  const oid = document.getElementById("order-id");
  if (oid) oid.textContent = order.orderNumber;

  const details = document.getElementById("confirm-details");
  if (details) {
    details.classList.add("hidden");
    details.innerHTML = `
      <p class="font-medium mb-2">Customer</p>
      <p class="text-stone-600 font-light">${escapeHtml(order.customer.fullName)} · ${escapeHtml(order.customer.phone)}</p>
      <p class="text-stone-600 font-light mt-1">${
        order.delivery === "pickup"
          ? escapeHtml(PICKUP_LOCATION)
          : escapeHtml(
              [
                order.customer.address,
                order.customer.city,
                order.customer.lga,
                order.customer.state,
                order.customer.country || "Nigeria"
              ]
                .filter(Boolean)
                .join(", ")
            )
      }</p>
      <p class="font-medium mt-4 mb-2">Items</p>
      <ul class="space-y-1 text-stone-600 font-light">
        ${order.items
          .map(
            (i) =>
              `<li class="flex justify-between gap-2"><span>${escapeHtml(i.name)} x ${i.quantity}</span><span class="tabular-nums">${formatPrice(i.lineTotal)}</span></li>`
          )
          .join("")}
      </ul>
      <p class="text-xs text-stone-400 mt-4">Saved ${new Date(order.createdAt).toLocaleString("en-NG")} · Ref ${escapeHtml(order.paymentRef)}</p>
    `;
  }

  modal.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
  requestAnimationFrame(() => {
    const panel = modal.querySelector(".confirm-panel");
    panel?.classList.remove("opacity-0", "scale-95");
    panel?.classList.add("opacity-100", "scale-100");
  });
}

function closeConfirmModal() {
  const modal = document.getElementById("confirm-modal");
  if (!modal) return;
  const panel = modal.querySelector(".confirm-panel");
  panel?.classList.add("opacity-0", "scale-95");
  panel?.classList.remove("opacity-100", "scale-100");
  setTimeout(() => {
    modal.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }, 250);
}

/**
 * Simulate Paystack / Stripe test payment then persist order.
 * @param {"paystack"|"stripe"|"place"} source
 */
async function processCheckout(source) {
  const { valid, errors, data } = validateCheckoutForm();
  if (!valid) {
    showValidationErrors(errors);
    return;
  }
  clearAllFieldErrors();

  // Sync radio to button source if user clicked a gateway button
  if (source === "paystack" || source === "stripe") {
    const radio = document.querySelector(`input[name="payment"][value="${source}"]`);
    if (radio) {
      radio.checked = true;
      updatePaymentUI();
    }
    data.payment = source;
  }

  const items = getCartItemsWithProducts();
  if (!items.length) {
    showToast("Your cart is empty");
    return;
  }

  const delivery = data.delivery;
  const totals = getCartTotals({ delivery });
  const gateway = data.payment === "stripe" ? "stripe" : "paystack";

  openPaymentModal(gateway);

  // Fake network + payment authorization delay
  await new Promise((r) => setTimeout(r, 1600));

  const orderNumber = generateOrderNumber();
  const paymentRef =
    gateway === "stripe"
      ? `pi_test_${Math.random().toString(36).slice(2, 12)}`
      : `psk_test_${Math.random().toString(36).slice(2, 12)}`;

  const order = {
    orderNumber,
    paymentRef,
    status: "paid",
    payment: gateway,
    delivery,
    customer: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      lga: data.lga,
      city: data.city,
      state: data.state,
      landmark: data.landmark,
      notes: data.notes,
      country: data.country || "Nigeria"
    },
    pickupLocation: delivery === "pickup" ? PICKUP_LOCATION : null,
    items: items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      image: i.image
    })),
    totals: {
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total
    },
    currency: "NGN",
    createdAt: new Date().toISOString()
  };

  saveOrder(order);
  clearCart();
  closePaymentModal();

  const formWrap = document.getElementById("checkout-form-wrap");
  formWrap?.classList.add("hidden");

  openConfirmModal(order);
  showToast("Order placed successfully");
}

function initNigeriaLocationSelects() {
  const stateEl = document.getElementById("state");
  const lgaEl = document.getElementById("lga");
  if (!stateEl || !lgaEl) return;

  if (typeof populateStateSelect !== "function") {
    console.warn("nigeria-locations.js not loaded - state/LGA lists unavailable.");
    return;
  }

  // Default Lagos for Sky Furniture HQ focus
  populateStateSelect(stateEl, "Lagos");
  populateLGASelect(lgaEl, "Lagos");

  stateEl.addEventListener("change", () => {
    setFieldError("state", "");
    setFieldError("lga", "");
    populateLGASelect(lgaEl, stateEl.value);
  });

  lgaEl.addEventListener("change", () => setFieldError("lga", ""));
}

function initCheckout() {
  const formWrap = document.getElementById("checkout-form-wrap");
  if (!formWrap && !document.getElementById("checkout-empty")) return;

  const items = getCartItemsWithProducts();
  const emptyEl = document.getElementById("checkout-empty");

  if (!items.length) {
    emptyEl?.classList.remove("hidden");
    return;
  }

  formWrap?.classList.remove("hidden");

  // All 36 states + FCT and their LGAs
  initNigeriaLocationSelects();

  updateCheckoutSummary();
  updateDeliveryUI();
  updatePaymentUI();

  // Delivery radios
  document.querySelectorAll('input[name="delivery"]').forEach((input) => {
    input.addEventListener("change", updateDeliveryUI);
  });

  // Payment radios
  document.querySelectorAll('input[name="payment"]').forEach((input) => {
    input.addEventListener("change", updatePaymentUI);
  });

  // Live-clear error on input
  ["fullName", "email", "phone", "address", "lga", "city", "state", "terms"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, () => setFieldError(id, ""));
  });

  // Paystack real payments: handled by js/paystack-pay.js (capture phase).
  // Stripe remains demo-only.
  document.getElementById("btn-stripe")?.addEventListener("click", () => {
    const radio = document.querySelector('input[name="payment"][value="stripe"]');
    if (radio) radio.checked = true;
    updatePaymentUI();
    processCheckout("stripe");
  });

  document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const method = document.querySelector('input[name="payment"]:checked')?.value || "paystack";
    if (method === "stripe") {
      processCheckout("stripe");
      return;
    }
    // Default Paystack path
    if (window.SkyPaystack?.startPayment) {
      window.SkyPaystack.startPayment(e);
    } else {
      processCheckout("paystack");
    }
  });

  document.getElementById("btn-view-order-details")?.addEventListener("click", () => {
    document.getElementById("confirm-details")?.classList.toggle("hidden");
  });

  // Closing confirm modal shows page-level success summary
  document.querySelectorAll("[data-confirm-close]").forEach((el) => {
    el.addEventListener("click", () => {
      closeConfirmModal();
      document.getElementById("order-success")?.classList.remove("hidden");
    });
  });
}

// ---------------------------------------------------------------------------
// Dark mode
// ---------------------------------------------------------------------------
const THEME_KEY = "sky_furniture_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  });
}

function initDarkMode() {
  applyTheme(getPreferredTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
    });
  });
}

// ---------------------------------------------------------------------------
// Testimonials carousel
// ---------------------------------------------------------------------------
const TESTIMONIALS = [
  {
    quote:
      "The Linen Cloud Sofa transformed our Lekki apartment. Quality feels premium and delivery to Eti-Osa was seamless.",
    name: "Chioma A.",
    role: "Lagos · Living room",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80"
  },
  {
    quote:
      "Sky Furniture helped me finish my office in Port Harcourt. The oak desk vibe from their dining pieces inspired everything.",
    name: "Tunde O.",
    role: "Rivers · Workspace",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80"
  },
  {
    quote:
      "Pickup in Ikeja was easy, and the ceramic vases + portrait set made our hallway look like a gallery.",
    name: "Amina B.",
    role: "Abuja · Decor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80"
  }
];

function initTestimonials() {
  const root = document.getElementById("testimonials-root");
  if (!root) return;

  let index = 0;
  const track = document.getElementById("testimonials-track");
  const dotsWrap = document.getElementById("testimonials-dots");

  track.innerHTML = TESTIMONIALS.map(
    (t, i) => `
    <blockquote class="testimonial-slide ${i === 0 ? "active" : ""} px-2 sm:px-8 text-center" data-t-index="${i}">
      <p class="font-display text-2xl sm:text-3xl md:text-4xl text-ink leading-snug max-w-3xl mx-auto">"${escapeHtml(t.quote)}"</p>
      <footer class="mt-8 flex flex-col items-center gap-3">
        <img src="${t.avatar}" alt="Portrait of ${escapeHtml(t.name)}" width="56" height="56" class="w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
        <div>
          <cite class="not-italic font-medium text-ink">${escapeHtml(t.name)}</cite>
          <p class="text-sm text-stone-500 font-light">${escapeHtml(t.role)}</p>
        </div>
      </footer>
    </blockquote>`
  ).join("");

  dotsWrap.innerHTML = TESTIMONIALS.map(
    (_, i) =>
      `<button type="button" class="t-dot w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-ink" : "bg-stone-300"}" data-t-go="${i}" aria-label="Testimonial ${i + 1}"></button>`
  ).join("");

  function go(i) {
    const slides = track.querySelectorAll(".testimonial-slide");
    const dots = dotsWrap.querySelectorAll(".t-dot");
    slides[index]?.classList.remove("active");
    dots[index]?.classList.remove("bg-ink");
    dots[index]?.classList.add("bg-stone-300");
    index = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
    slides[index]?.classList.add("active");
    dots[index]?.classList.add("bg-ink");
    dots[index]?.classList.remove("bg-stone-300");
  }

  document.getElementById("t-prev")?.addEventListener("click", () => go(index - 1));
  document.getElementById("t-next")?.addEventListener("click", () => go(index + 1));
  dotsWrap.querySelectorAll("[data-t-go]").forEach((btn) => {
    btn.addEventListener("click", () => go(Number(btn.dataset.tGo)));
  });

  let timer = setInterval(() => go(index + 1), 6000);
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", () => {
    timer = setInterval(() => go(index + 1), 6000);
  });
}

// ---------------------------------------------------------------------------
// Design Your Space - simple room selector
// ---------------------------------------------------------------------------
const ROOM_DESIGNS = {
  living: {
    title: "Living Room",
    blurb: "Anchor the room with a sectional, marble centre table, and layered light.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&q=80",
    tips: ["Start with seating scale", "Add a luxury area rug", "Finish with a brass floor lamp"],
    shop: "shop.html?category=living-room",
    picks: [101, 103, 602]
  },
  bedroom: {
    title: "Bedroom Sanctuary",
    blurb: "A sovereign bed, quiet nightstands, and soft ambient lighting.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=80",
    tips: ["Choose king or queen scale", "Pair matching bedside tables", "Add a table lamp"],
    shop: "shop.html?category=bedroom",
    picks: [201, 204, 603]
  },
  dining: {
    title: "Dining Gathering",
    blurb: "An elegant dining set, chandelier, and sculptural centerpiece.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&q=80",
    tips: ["Match seats to guests", "Hang a chandelier", "Style with a flower vase"],
    shop: "shop.html?category=dining",
    picks: [401, 601, 703]
  },
  office: {
    title: "Office and Gaming",
    blurb: "Ergonomic seating, a focused desk, and clean surfaces.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80",
    tips: ["Pick task vs gaming chair", "Desk for dual monitors", "Add focused lighting"],
    shop: "shop.html?category=office",
    picks: [301, 303, 302]
  },
  entry: {
    title: "Decor and Finishing",
    blurb: "Portraits, clocks, mirrors, and African-inspired artifacts.",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80",
    tips: ["Gallery wall with portraits", "Add a wall clock", "Layer vases and sculpture"],
    shop: "shop.html?category=decor",
    picks: [701, 702, 708]
  }
};

function initDesignSpace() {
  const section = document.getElementById("design-space");
  if (!section) return;

  const panel = document.getElementById("design-panel");
  const chips = section.querySelectorAll("[data-room]");

  function render(roomKey) {
    const room = ROOM_DESIGNS[roomKey];
    if (!room || !panel) return;

    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.room === roomKey));

    const pickCards = room.picks
      .map((id) => getProductById(id))
      .filter(Boolean)
      .map(
        (p) => `
        <a href="product-detail.html?id=${p.id}" class="group flex gap-3 items-center bg-white border border-sand p-2 hover:border-ink/30 transition">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" width="64" height="64" class="w-16 h-16 object-cover" loading="lazy" decoding="async" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate group-hover:text-clay transition">${escapeHtml(p.name)}</p>
            <p class="text-xs text-stone-500 tabular-nums">${formatPrice(p.price)}</p>
          </div>
        </a>`
      )
      .join("");

    panel.innerHTML = `
      <div class="grid md:grid-cols-2 gap-0 overflow-hidden border border-sand bg-white">
        <div class="aspect-[4/3] md:aspect-auto md:min-h-[360px]">
          <img src="${room.image}" alt="${escapeHtml(room.title)} interior inspiration for Sky Furniture" width="1000" height="750" class="w-full h-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div class="p-6 md:p-8 lg:p-10 flex flex-col">
          <p class="text-xs tracking-[0.2em] uppercase text-clay mb-2">Design Your Space</p>
          <h3 class="font-display text-3xl text-ink">${escapeHtml(room.title)}</h3>
          <p class="mt-3 text-stone-600 font-light leading-relaxed">${escapeHtml(room.blurb)}</p>
          <ul class="mt-5 space-y-2 text-sm text-stone-600">
            ${room.tips.map((t) => `<li class="flex gap-2"><span class="text-warm">·</span> ${escapeHtml(t)}</li>`).join("")}
          </ul>
          <div class="mt-6 space-y-2">
            <p class="text-xs uppercase tracking-wider text-stone-400">Suggested pieces</p>
            ${pickCards}
          </div>
          <a href="${room.shop}" class="mt-8 inline-flex self-start bg-ink text-cream px-6 py-3 text-sm font-medium hover:bg-stone-800 transition">Shop this room</a>
        </div>
      </div>`;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => render(chip.dataset.room));
  });

  render("living");
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  updateCartBadge();
  ensureQuickViewModal();
  initHeader();

  const page = document.body.dataset.page || "";
  if (page === "home" || document.getElementById("featured-grid")) {
    initHome();
    initTestimonials();
    initDesignSpace();
  }
  if (page === "shop" || document.getElementById("product-grid")) initShop();
  if (page === "product" || document.getElementById("product-content")) initProductDetail();
  if (page === "cart" || document.getElementById("cart-items")) initCartPage();
  if (page === "checkout" || document.getElementById("checkout-form-wrap")) initCheckout();

  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showToast("Thanks for subscribing!");
      form.reset();
    });
  });
});

window.SkyFurniture = {
  get PRODUCTS() {
    return PRODUCTS;
  },
  refreshProductCatalog,
  addToCart,
  removeFromCart,
  updateQuantity,
  openQuickView,
  closeQuickView,
  formatPrice,
  getCartTotals,
  getCartItemsWithProducts,
  filterProducts,
  getOrders,
  saveOrder,
  validateCheckoutForm,
  processCheckout,
  applyTheme,
  getPreferredTheme,
  openConfirmModal,
  clearCart,
  showValidationErrors
};
window.addToCart = addToCart;
window.openQuickView = openQuickView;
window.formatPrice = formatPrice;
window.getProductById = getProductById;
window.getCartItemsWithProducts = getCartItemsWithProducts;
window.getCartTotals = getCartTotals;
window.clearCart = clearCart;
window.openConfirmModal = openConfirmModal;
window.showValidationErrors = showValidationErrors;
window.validateCheckoutForm = validateCheckoutForm;
window.processCheckout = processCheckout;

