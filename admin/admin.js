/**
 * Sky Furniture Admin — store control center
 * Products: localStorage (sky_admin_products) + data.js seed
 * Orders & customers: local first; cloud optional
 */

// Cloud helpers are optional — admin must still work if Firebase fails
let isCloudReady = () => false;
let fetchCloudOrders = async () => getOrders();
let fetchCloudCustomers = async () => [];
let subscribeOrders = (cb) => {
  cb(getOrders());
  return () => {};
};
let subscribeCustomers = (cb) => {
  cb([]);
  return () => {};
};
let updateOrderStatusCloud = async (id, status) => {
  const next = getOrders().map((o) => {
    const oid = String(o.orderNumber || o.paymentRef || o.id || "");
    if (oid === String(id)) return { ...o, status, updatedAt: new Date().toISOString() };
    return o;
  });
  saveOrders(next);
  return next;
};
let getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("sky_furniture_paid_orders") || "[]");
  } catch {
    return [];
  }
};
let saveLocalOrders = (list) => {
  localStorage.setItem("sky_furniture_paid_orders", JSON.stringify(list || []));
};

import("../assets/js/cloud-store.js")
  .then((mod) => {
    isCloudReady = mod.isCloudReady;
    fetchCloudOrders = mod.fetchCloudOrders;
    fetchCloudCustomers = mod.fetchCloudCustomers;
    subscribeOrders = mod.subscribeOrders;
    subscribeCustomers = mod.subscribeCustomers;
    updateOrderStatusCloud = mod.updateOrderStatusCloud;
    getLocalOrders = mod.getLocalOrders;
    saveLocalOrders = mod.saveLocalOrders;
  })
  .catch((err) => {
    console.warn("[Admin] Cloud store unavailable — local mode only", err?.message || err);
  });

const STORAGE_KEY = "sky_admin_products";
const ORDERS_KEY = "sky_furniture_paid_orders";
const COUPONS_KEY = "sky_admin_coupons";
const ACTIVITY_KEY = "sky_admin_activity";
const ADMIN_EMAIL = "emekaanderson29@gmail.com";
const SESSION_KEY = "sky_admin_ok";
const FROM_ADMIN_KEY = "sky_from_admin";
const THEME_KEY = "sky_furniture_theme";
/** Always works for store owner (also override via admin-access.local.js) */
const DEFAULT_ADMIN_PASS = "SkyAdmin2026";

/** Live caches refreshed from cloud */
let LIVE_ORDERS = [];
let LIVE_CUSTOMERS = [];
let unsubOrders = null;
let unsubCustomers = null;

const CATEGORY_OPTIONS = [
  { id: "living-room", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "office", label: "Office & Gaming" },
  { id: "dining", label: "Dining" },
  { id: "rugs", label: "Rugs" },
  { id: "lighting", label: "Lighting" },
  { id: "decor", label: "Decor & Artifacts" }
];

const LEGACY_CAT = {
  living: "living-room",
  "office-gaming": "office",
  sofa: "living-room",
  bed: "bedroom",
  table: "dining",
  lamps: "lighting",
  artifacts: "decor"
};

const UPLOAD_MAX_WIDTH = 1200;
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmt(n) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(n || 0);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function logActivity(msg) {
  try {
    const list = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    list.unshift({ t: new Date().toISOString(), msg });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list.slice(0, 80)));
  } catch (_) {}
  renderActivity();
}

function renderActivity() {
  const el = document.getElementById("activity-log");
  if (!el) return;
  try {
    const list = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    el.innerHTML = list.length
      ? list
          .map((a) => `<div>${escapeHtml(a.t.slice(0, 19).replace("T", " "))} — ${escapeHtml(a.msg)}</div>`)
          .join("")
      : "<div>No activity yet.</div>";
  } catch {
    el.innerHTML = "<div>No activity yet.</div>";
  }
}

function categoryLabel(id) {
  return CATEGORY_OPTIONS.find((c) => c.id === id)?.label || id;
}

function resolveAdminAssetUrl(url) {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  let clean = String(url).replace(/^\//, "");
  // Admin page is under /admin/ so assets are one level up
  if (clean.startsWith("assets/")) return "../" + clean;
  if (clean.startsWith("images/")) return "../assets/" + clean;
  return "../" + clean;
}

function normalizeProduct(p) {
  const cat = LEGACY_CAT[p.category] || p.category || "living-room";
  const stockQty =
    p.stockQty != null ? Number(p.stockQty) : p.inStock === false ? 0 : 20;
  const image = String(p.image || "").replace(/^\//, "");
  const images = (Array.isArray(p.images) && p.images.length ? p.images : image ? [image] : [])
    .map((u) => String(u || "").replace(/^\//, ""))
    .filter(Boolean);
  return {
    id: Number(p.id) || Date.now(),
    name: p.name || "Untitled",
    sku: p.sku || `SF-${cat.slice(0, 2).toUpperCase()}-${String(p.id || Date.now()).slice(-4)}`,
    category: cat,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice != null && p.originalPrice !== "" ? Number(p.originalPrice) : null,
    rating: Number(p.rating) || 4.7,
    reviews: Number(p.reviews) || 0,
    image: image || "",
    images: images.length ? images : image ? [image] : [],
    description: p.description || "",
    details: Array.isArray(p.details) ? p.details : [],
    inStock: p.inStock !== false && stockQty > 0,
    active: p.active !== false,
    badge: p.badge || null,
    stockQty: Math.max(0, stockQty),
    lowStockAt: p.lowStockAt != null ? Number(p.lowStockAt) : 5,
    featured: Boolean(p.featured)
  };
}

function catalogFromDataJs() {
  return (window.SKY_PRODUCTS || window.PRODUCTS || []).map(normalizeProduct);
}

function getProducts() {
  // Always prefer fresh data.js when version changes
  const liveVersion = String(window.SKY_CATALOG_VERSION || "");
  try {
    const savedVersion = localStorage.getItem("sky_catalog_version") || "";
    if (liveVersion && savedVersion !== liveVersion) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem("sky_catalog_version", liveVersion);
    }
  } catch (_) {}

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) {
        // Patch any leftover unsplash / absolute-root paths from data.js
        const seed = catalogFromDataJs();
        const byId = new Map(seed.map((p) => [String(p.id), p]));
        return list.map((p) => {
          const n = normalizeProduct(p);
          const fresh = byId.get(String(n.id));
          if (fresh && (!n.image || /unsplash|placehold|\.svg/i.test(n.image))) {
            return { ...n, image: fresh.image, images: fresh.images };
          }
          return n;
        });
      }
    }
  } catch (_) {}
  const seed = catalogFromDataJs();
  if (seed.length) {
    saveProducts(seed, false);
    return seed;
  }
  return [];
}

function saveProducts(list, log = true) {
  const normalized = list.map(normalizeProduct);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  try {
    if (window.SKY_CATALOG_VERSION) {
      localStorage.setItem("sky_catalog_version", String(window.SKY_CATALOG_VERSION));
    }
  } catch (_) {}
  window.SKY_ADMIN_PRODUCTS = normalized;
  window.SKY_PRODUCTS_LIVE = normalized;
  if (log) logActivity(`Catalog saved (${normalized.length} products)`);
}

function getOrders() {
  if (LIVE_ORDERS.length) return LIVE_ORDERS;
  try {
    const local = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(local) ? local : getLocalOrders();
  } catch {
    return getLocalOrders();
  }
}

function saveOrders(list) {
  LIVE_ORDERS = list || [];
  saveLocalOrders(LIVE_ORDERS);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(LIVE_ORDERS));
  } catch (_) {}
}

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()) {
  const x = startOfDay(d);
  // Monday-start week
  const day = x.getDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setDate(x.getDate() - diff);
  return x;
}

function orderTime(o) {
  const t = o.createdAt || o.updatedAt;
  if (!t) return 0;
  const ms = new Date(t).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function isCountableRevenue(o) {
  return o.status !== "cancelled" && o.status !== "pending_payment";
}

function sumIncome(orders, sinceMs) {
  return (orders || [])
    .filter((o) => isCountableRevenue(o) && orderTime(o) >= sinceMs)
    .reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
}

function getCoupons() {
  try {
    return JSON.parse(localStorage.getItem(COUPONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCoupons(list) {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(list));
}

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------
function showApp(email) {
  document.getElementById("gate")?.classList.add("hidden");
  document.getElementById("admin-app")?.classList.remove("hidden");
  const el = document.getElementById("admin-email");
  if (el) el.textContent = email || "Admin";
  const note = document.getElementById("admin-mode-note");
  if (note && !note.dataset.liveSet) {
    note.textContent =
      "Store control center — manage products, stock, orders, customers, coupons, and income. Theme is shared with the shop.";
  }
  clearGateError();
}

function showGate(msg) {
  document.getElementById("gate")?.classList.remove("hidden");
  document.getElementById("admin-app")?.classList.add("hidden");
  const gateMsg = document.getElementById("gate-msg");
  if (gateMsg && msg) gateMsg.textContent = msg;
}

function clearGateError() {
  const err = document.getElementById("gate-error");
  if (err) {
    err.textContent = "";
    err.classList.add("hidden");
  }
}

function showGateError(message) {
  const err = document.getElementById("gate-error");
  if (!err) {
    alert(message);
    return;
  }
  err.textContent = message;
  err.classList.remove("hidden");
}

function markAdminShopPreview() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(FROM_ADMIN_KEY, "1");
  } catch (_) {}
}

function ensureCatalogSeeded() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : null;
    if (Array.isArray(list) && list.length) return list;
  } catch (_) {}
  const seed = catalogFromDataJs();
  if (seed.length) {
    saveProducts(seed, false);
    logActivity(`Auto-loaded ${seed.length} products from catalog`);
  }
  return seed;
}

function unlockAdmin(email) {
  sessionStorage.setItem(SESSION_KEY, "1");
  if (email) sessionStorage.setItem("sky_admin_email", email);
  showApp(email || ADMIN_EMAIL);
  // Always ensure latest catalog + product photos are available
  ensureCatalogSeeded();
  refreshCatalogImagesFromDataJs();
  fillCategorySelects();
  loadProducts();
  loadInventory();
  loadCoupons();
  renderActivity();
  renderDashboard();
  loadOrders();
  loadCustomers();
  initLiveData().catch(() => {});
}

/** Merge fresh image paths from data.js onto cached admin products */
function refreshCatalogImagesFromDataJs() {
  try {
    const seed = catalogFromDataJs();
    if (!seed.length) return;
    const byId = new Map(seed.map((p) => [String(p.id), p]));
    const list = getProducts();
    let changed = false;
    const next = list.map((p) => {
      const fresh = byId.get(String(p.id));
      if (!fresh?.image) return p;
      const stale = !p.image || /unsplash|placehold|\.svg/i.test(p.image);
      if (stale || p.image !== fresh.image) {
        changed = true;
        return {
          ...p,
          image: fresh.image,
          images: fresh.images?.length ? fresh.images : [fresh.image],
          name: p.name || fresh.name
        };
      }
      return p;
    });
    // If catalog is empty of products that exist in data.js, re-seed fully
    if (!list.length) {
      saveProducts(seed, false);
      return;
    }
    if (changed) saveProducts(next, false);
  } catch (_) {}
}

async function initLiveData() {
  const note = document.getElementById("admin-mode-note");
  const cloud = isCloudReady();

  // Initial fetch
  try {
    LIVE_ORDERS = await fetchCloudOrders();
    saveOrders(LIVE_ORDERS);
  } catch {
    LIVE_ORDERS = getOrders();
  }
  try {
    LIVE_CUSTOMERS = await fetchCloudCustomers();
  } catch {
    LIVE_CUSTOMERS = [];
  }

  if (note) {
    note.dataset.liveSet = "1";
    note.textContent = cloud
      ? "Live mode: orders & customers sync from Firestore (all site users). Products stay in this browser until you export."
      : "Local mode: Firebase not connected — orders/customers are only what this browser has saved. Create Firestore in Firebase Console for multi-user live data.";
  }

  renderDashboard();
  loadOrders();
  loadCustomers();

  // Realtime listeners
  if (typeof unsubOrders === "function") unsubOrders();
  if (typeof unsubCustomers === "function") unsubCustomers();

  unsubOrders = subscribeOrders((orders) => {
    LIVE_ORDERS = orders || [];
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(LIVE_ORDERS));
    } catch (_) {}
    renderDashboard();
    const ordersTab = document.getElementById("tab-orders");
    if (ordersTab && !ordersTab.classList.contains("hidden")) loadOrders();
    const dash = document.getElementById("tab-dashboard");
    if (dash && !dash.classList.contains("hidden")) renderDashboard();
  });

  unsubCustomers = subscribeCustomers((customers) => {
    LIVE_CUSTOMERS = customers || [];
    const customersTab = document.getElementById("tab-customers");
    if (customersTab && !customersTab.classList.contains("hidden")) loadCustomers();
    renderDashboard();
  });
}

function getLocalAdminPassword() {
  const fromConfig = String(window.SKY_ADMIN_ACCESS?.localPassword || "").trim();
  return fromConfig || DEFAULT_ADMIN_PASS;
}

function checkAccess() {
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    unlockAdmin(sessionStorage.getItem("sky_admin_email") || ADMIN_EMAIL);
    return;
  }

  showLocalUnlock("Sign in to manage your store");

  // Optional: auto-unlock when signed in as Firebase admin
  import("../assets/js/firebase.js")
    .then((mod) => {
      if (!mod.firebaseReady) return;
      mod.onUserChanged((user) => {
        if (user && mod.isAdminUser(user)) {
          unlockAdmin(user.email);
        }
      });
    })
    .catch(() => {});
}

function wirePasswordUnlock() {
  if (wirePasswordUnlock._done) return;
  wirePasswordUnlock._done = true;

  const attempt = () => {
    clearGateError();
    const pass = (document.getElementById("admin-pass")?.value || "").trim();
    if (!pass) {
      showGateError("Please enter your password.");
      return;
    }
    if (pass === getLocalAdminPassword()) {
      unlockAdmin(ADMIN_EMAIL);
      return;
    }
    showGateError("Incorrect password. Try again.");
    const input = document.getElementById("admin-pass");
    if (input) {
      input.value = "";
      input.focus();
    }
  };

  const form = document.getElementById("local-admin-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      attempt();
    });
  } else {
    document.getElementById("admin-unlock")?.addEventListener("click", attempt);
  }

  // Show / hide password (never reveals the real admin password — only typed input)
  document.getElementById("toggle-pass-vis")?.addEventListener("click", () => {
    const input = document.getElementById("admin-pass");
    const btn = document.getElementById("toggle-pass-vis");
    if (!input) return;
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    if (btn) {
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.title = show ? "Hide password" : "Show password";
    }
  });
}

function showLocalUnlock(message) {
  showGate(message || "Sign in to manage your store");
  document.getElementById("gate-loading")?.classList.add("hidden");
  wirePasswordUnlock();
  setTimeout(() => document.getElementById("admin-pass")?.focus(), 60);
}

document.getElementById("admin-logout")?.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(FROM_ADMIN_KEY);
  sessionStorage.removeItem("sky_admin_email");
  // Return to clean admin login (do not expose password)
  location.href = "index.html";
});

function initViewShopLinks() {
  document.querySelectorAll('a[href*="shop.html"]').forEach((link) => {
    link.addEventListener("click", () => markAdminShopPreview());
  });
}

// ---------------------------------------------------------------------------
// Theme (shared key with storefront)
// ---------------------------------------------------------------------------
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

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#161412" : "#F7F3EE");

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  });
}

function initTheme() {
  applyTheme(getPreferredTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      applyTheme(next);
    });
  });
}

// ---------------------------------------------------------------------------
// Tabs + mobile drawer
// ---------------------------------------------------------------------------
function setTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.tab === tab);
  });
  ["dashboard", "products", "inventory", "orders", "customers", "coupons", "seed"].forEach((id) => {
    document.getElementById(`tab-${id}`)?.classList.toggle("hidden", id !== tab);
  });
  closeMobileDrawer();
  if (tab === "dashboard") renderDashboard();
  if (tab === "products") loadProducts();
  if (tab === "inventory") loadInventory();
  if (tab === "orders") loadOrders();
  if (tab === "customers") loadCustomers();
  if (tab === "coupons") loadCoupons();
  if (tab === "seed") renderActivity();
}

function openMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  if (!drawer) return;
  drawer.classList.remove("hidden");
  document.body.classList.add("overflow-hidden");
}

function closeMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  if (!drawer) return;
  drawer.classList.add("hidden");
  document.body.classList.remove("overflow-hidden");
}

function initMobileDrawer() {
  const copy = document.getElementById("mobile-nav-copy");
  const source = document.querySelector(".admin-sidebar nav");
  if (copy && source && !copy.childElementCount) {
    source.querySelectorAll(".tab-btn").forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.classList.add("tab-btn");
      copy.appendChild(clone);
    });
    const shop = document.createElement("a");
    shop.href = "../shop.html";
    shop.target = "_blank";
    shop.rel = "noopener";
    shop.className = "admin-nav-item text-sm mt-2";
    shop.textContent = "View shop ↗";
    shop.addEventListener("click", () => markAdminShopPreview());
    copy.appendChild(shop);
  }

  document.getElementById("mobile-nav-toggle")?.addEventListener("click", openMobileDrawer);
  document.querySelectorAll("[data-close-drawer]").forEach((el) => {
    el.addEventListener("click", closeMobileDrawer);
  });
}

function fillCategorySelects() {
  const opts =
    `<option value="all">All categories</option>` +
    CATEGORY_OPTIONS.map((c) => `<option value="${c.id}">${escapeHtml(c.label)}</option>`).join("");
  const filter = document.getElementById("admin-cat-filter");
  if (filter) filter.innerHTML = opts;
  const formCat = document.getElementById("pf-category");
  if (formCat) {
    formCat.innerHTML = CATEGORY_OPTIONS.map(
      (c) => `<option value="${c.id}">${escapeHtml(c.label)}</option>`
    ).join("");
  }
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function countLocalCustomers() {
  try {
    const users = JSON.parse(localStorage.getItem("sky_users") || "[]");
    return Array.isArray(users) ? users.length : 0;
  } catch {
    return 0;
  }
}

function renderDashboard() {
  const products = getProducts();
  const orders = getOrders();
  const orderEmails = new Set(
    orders.map((o) => (o.customer?.email || o.userEmail || "").toLowerCase()).filter(Boolean)
  );
  const customerCount =
    LIVE_CUSTOMERS.length ||
    Math.max(orderEmails.size, countLocalCustomers());
  const active = products.filter((p) => p.active !== false).length;
  const featured = products.filter((p) => p.featured).length;
  const oos = products.filter((p) => !p.inStock || p.stockQty <= 0).length;
  const low = products.filter(
    (p) => p.stockQty > 0 && p.stockQty <= (p.lowStockAt ?? 5)
  ).length;
  const withPhoto = products.filter(
    (p) => p.image && !/\.svg$/i.test(p.image) && !/placehold/i.test(p.image)
  ).length;
  const coupons = getCoupons().filter((c) => c.active !== false).length;

  const paidOrders = orders.filter(isCountableRevenue);
  const revenue = paidOrders.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
  const dayStart = startOfDay().getTime();
  const weekStart = startOfWeek().getTime();
  const dailyIncome = sumIncome(orders, dayStart);
  const weeklyIncome = sumIncome(orders, weekStart);
  const todayOrders = paidOrders.filter((o) => orderTime(o) >= dayStart).length;
  const weekOrders = paidOrders.filter((o) => orderTime(o) >= weekStart).length;

  // Keep KPI strip tight (prestige retail admin style: few clear metrics)
  const cards = [
    { label: "Today", value: fmt(dailyIncome), sub: `${todayOrders} paid order(s)`, tone: "is-accent" },
    { label: "This week", value: fmt(weeklyIncome), sub: `${weekOrders} paid order(s)`, tone: "is-accent" },
    { label: "Revenue", value: fmt(revenue), sub: `${orders.length} total orders`, tone: "" },
    { label: "Customers", value: String(customerCount), sub: "Accounts & buyers", tone: "" },
    { label: "Products", value: String(products.length), sub: `${active} active · ${withPhoto} with photos`, tone: withPhoto < products.length ? "is-warn" : "" },
    { label: "Stock alerts", value: String(low), sub: oos ? `${oos} out of stock` : "Healthy levels", tone: low || oos ? "is-warn" : "is-ok" }
  ];

  const cardsEl = document.getElementById("dash-cards");
  if (cardsEl) {
    cardsEl.innerHTML = cards
      .map(
        (c) => `
    <div class="admin-stat-card ${c.tone || ""}">
      <p class="admin-stat-label">${escapeHtml(c.label)}</p>
      <p class="admin-stat-value">${escapeHtml(c.value)}</p>
      <p class="admin-stat-sub">${escapeHtml(c.sub)}</p>
    </div>`
      )
      .join("");
  }

  // Feature cards — every capability of the admin
  const featuresEl = document.getElementById("dash-features");
  if (featuresEl) {
    const features = [
      { tab: "products", title: "Products", desc: "Add, edit, duplicate, bulk actions, featured flags, badges, image upload/URL.", meta: `${products.length} items` },
      { tab: "inventory", title: "Inventory", desc: "Quick ± stock adjust, low-stock alerts, OOS tracking.", meta: `${low} low · ${oos} OOS` },
      { tab: "orders", title: "Orders", desc: "Paid checkouts, status updates, print summary, live refresh.", meta: `${orders.length} orders` },
      { tab: "customers", title: "Customers", desc: "Everyone who signed up, signed in, or checked out.", meta: `${customerCount} people` },
      { tab: "coupons", title: "Coupons", desc: "Percent or fixed NGN discounts stored locally.", meta: `${coupons} active` },
      { tab: "seed", title: "Tools", desc: "Reload catalog + photos, import/export JSON, activity log, theme.", meta: "Backup & sync" }
    ];
    featuresEl.innerHTML = features
      .map(
        (f) => `
      <button type="button" data-tab="${f.tab}" class="tab-btn admin-feature-card">
        <div class="feat-top">
          <p class="feat-title">${escapeHtml(f.title)}</p>
          <span class="feat-meta">${escapeHtml(f.meta)}</span>
        </div>
        <p class="feat-desc">${escapeHtml(f.desc)}</p>
        <p class="feat-go">Open →</p>
      </button>`
      )
      .join("");
  }

  const lowList = products
    .filter((p) => p.stockQty <= (p.lowStockAt ?? 5))
    .slice(0, 8);
  const lowEl = document.getElementById("dash-low-stock");
  if (lowEl) {
    lowEl.innerHTML = lowList.length
      ? lowList
          .map(
            (p) =>
              `<div class="admin-list-row"><span class="truncate">${escapeHtml(p.name)}</span><span class="text-red-700 dark:text-red-400 tabular-nums shrink-0 font-medium">${p.stockQty} left</span></div>`
          )
          .join("")
      : `<p class="text-stone-400 text-sm">All stock levels look healthy.</p>`;
  }

  const recent = [...orders].sort((a, b) => orderTime(b) - orderTime(a)).slice(0, 6);
  const recentEl = document.getElementById("dash-recent-orders");
  if (recentEl) {
    recentEl.innerHTML = recent.length
      ? recent
          .map(
            (o) =>
              `<div class="admin-list-row"><span class="truncate text-xs"><span class="tabular-nums">${escapeHtml(o.orderNumber || o.paymentRef || o.id || "Order")}</span><span class="text-stone-400"> · ${escapeHtml(o.customer?.fullName || o.customer?.email || "")}</span></span><span class="shrink-0 font-medium">${fmt(o.totals?.total)}</span></div>`
          )
          .join("")
      : `<p class="text-stone-400 text-sm">No orders yet — paid checkouts appear here automatically.</p>`;
  }

  const counts = {};
  products.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  const catEl = document.getElementById("dash-categories");
  if (catEl) {
    catEl.innerHTML = CATEGORY_OPTIONS.map(
      (c) =>
        `<span class="admin-cat-chip">${escapeHtml(c.label)} <strong class="tabular-nums">${counts[c.id] || 0}</strong></span>`
    ).join("");
  }

  const imgHealth = document.getElementById("dash-image-health");
  if (imgHealth) {
    const missing = products.filter(
      (p) => !p.image || /\.svg$/i.test(p.image) || /placehold|unsplash/i.test(p.image)
    );
    imgHealth.innerHTML = missing.length
      ? `<p class="text-amber-700 dark:text-amber-400 text-sm mb-2">${missing.length} product(s) need a proper photo.</p>` +
        missing
          .slice(0, 6)
          .map((p) => `<div class="admin-list-row"><span class="truncate">${escapeHtml(p.name)}</span></div>`)
          .join("") +
        `<p class="text-xs text-stone-400 mt-2">Use Tools → Load catalog + photos to refresh from data.js.</p>`
      : `<p class="text-sm text-stone-500">All ${products.length} products have local photos attached (JPG).</p>
         <p class="text-xs text-stone-400 mt-2">Catalog version: ${escapeHtml(window.SKY_CATALOG_VERSION || "—")}</p>`;
  }

  const dashAct = document.getElementById("dash-activity");
  if (dashAct) {
    try {
      const list = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
      dashAct.innerHTML = list.length
        ? list
            .slice(0, 8)
            .map((a) => `<div>${escapeHtml(a.t.slice(0, 19).replace("T", " "))} — ${escapeHtml(a.msg)}</div>`)
            .join("")
        : "<div>No activity yet — actions you take will appear here.</div>";
    } catch {
      dashAct.innerHTML = "<div>No activity yet.</div>";
    }
  }
}

// ---------------------------------------------------------------------------
// Products table + bulk
// ---------------------------------------------------------------------------
function getSelectedIds() {
  return [...document.querySelectorAll(".row-check:checked")].map((el) => el.value);
}

function updateBulkBar() {
  const ids = getSelectedIds();
  const bar = document.getElementById("bulk-bar");
  if (!bar) return;
  bar.classList.toggle("hidden", ids.length === 0);
  document.getElementById("bulk-count").textContent = `${ids.length} selected`;
}

function loadProducts() {
  const tbody = document.getElementById("products-tbody");
  if (!tbody) return;
  let list = getProducts();
  const filter = document.getElementById("admin-cat-filter")?.value || "all";
  const status = document.getElementById("admin-status-filter")?.value || "all";
  const q = (document.getElementById("admin-search")?.value || "").toLowerCase().trim();

  if (filter !== "all") list = list.filter((p) => p.category === filter);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }
  if (status === "active") list = list.filter((p) => p.active);
  if (status === "hidden") list = list.filter((p) => !p.active);
  if (status === "oos") list = list.filter((p) => !p.inStock || p.stockQty <= 0);
  if (status === "low") list = list.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt);
  if (status === "featured") list = list.filter((p) => p.featured);

  list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  const stats = document.getElementById("product-stats");
  if (stats) {
    const all = getProducts();
    stats.textContent = `Showing ${list.length} of ${all.length} products`;
  }

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="p-6 text-center text-stone-500">No products match. Use Tools → Load catalog + photos.</td></tr>`;
    updateBulkBar();
    return;
  }

  tbody.innerHTML = list
    .map((p) => {
      const low = p.stockQty > 0 && p.stockQty <= p.lowStockAt;
      const stockClass =
        p.stockQty <= 0
          ? "text-red-700 dark:text-red-400"
          : low
            ? "text-amber-700 dark:text-amber-400"
            : "";
      const statusLabel = !p.active
        ? "Hidden"
        : p.stockQty <= 0
          ? "OOS"
          : low
            ? "Low"
            : "Active";
      const statusClass =
        statusLabel === "OOS"
          ? "admin-badge is-danger"
          : statusLabel === "Low"
            ? "admin-badge is-warn"
            : statusLabel === "Hidden"
              ? "admin-badge"
              : "admin-badge is-ok";
      return `
    <tr>
      <td><input type="checkbox" class="row-check" value="${p.id}" /></td>
      <td>
        <div class="admin-product-cell">
          <img src="${escapeHtml(resolveAdminAssetUrl(p.image))}" alt="" class="admin-thumb" loading="lazy" onerror="this.style.opacity='0.35'" />
          <div class="meta">
            <p class="name">${escapeHtml(p.name)}</p>
            <div class="tags">
              ${p.badge ? `<span>${escapeHtml(p.badge)}</span>` : ""}
              ${p.featured ? `<span class="featured">Featured</span>` : ""}
            </div>
          </div>
        </div>
      </td>
      <td class="text-xs font-mono text-stone-500">${escapeHtml(p.sku || "—")}</td>
      <td class="text-sm">${escapeHtml(categoryLabel(p.category))}</td>
      <td class="tabular-nums text-sm">
        ${fmt(p.price)}
        ${p.originalPrice ? `<span class="block text-xs text-stone-400 line-through">${fmt(p.originalPrice)}</span>` : ""}
      </td>
      <td class="tabular-nums text-sm font-medium ${stockClass}">${p.stockQty}</td>
      <td><span class="${statusClass}">${statusLabel}</span></td>
      <td class="text-right whitespace-nowrap text-sm">
        <button type="button" data-dup="${p.id}" class="admin-link-btn">Dup</button>
        <button type="button" data-edit="${p.id}" class="admin-link-btn is-primary">Edit</button>
        <button type="button" data-del="${p.id}" class="admin-link-btn is-danger">Del</button>
      </td>
    </tr>`;
    })
    .join("");

  tbody.querySelectorAll(".row-check").forEach((c) => c.addEventListener("change", updateBulkBar));
  tbody.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openForm(getProducts().find((x) => String(x.id) === String(btn.dataset.edit)));
    });
  });
  tbody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!confirm("Delete this product?")) return;
      saveProducts(getProducts().filter((x) => String(x.id) !== String(btn.dataset.del)));
      logActivity(`Deleted product #${btn.dataset.del}`);
      loadProducts();
      loadInventory();
      renderDashboard();
    });
  });
  tbody.querySelectorAll("[data-dup]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = getProducts().find((x) => String(x.id) === String(btn.dataset.dup));
      if (!src) return;
      const copy = {
        ...src,
        id: Date.now(),
        name: src.name + " (copy)",
        sku: (src.sku || "SF") + "-COPY"
      };
      const list = getProducts();
      list.push(normalizeProduct(copy));
      saveProducts(list);
      logActivity(`Duplicated: ${src.name}`);
      loadProducts();
    });
  });
  updateBulkBar();
}

document.getElementById("select-all")?.addEventListener("change", (e) => {
  document.querySelectorAll(".row-check").forEach((c) => {
    c.checked = e.target.checked;
  });
  updateBulkBar();
});

document.querySelectorAll("[data-bulk]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.bulk;
    const ids = new Set(getSelectedIds());
    if (!ids.size) return;
    let list = getProducts();

    if (action === "delete") {
      if (!confirm(`Delete ${ids.size} products?`)) return;
      list = list.filter((p) => !ids.has(String(p.id)));
      logActivity(`Bulk deleted ${ids.size} products`);
    } else {
      list = list.map((p) => {
        if (!ids.has(String(p.id))) return p;
        const n = { ...p };
        if (action === "activate") n.active = true;
        if (action === "hide") n.active = false;
        if (action === "instock") {
          n.inStock = true;
          if (n.stockQty <= 0) n.stockQty = 10;
        }
        if (action === "oos") {
          n.inStock = false;
          n.stockQty = 0;
        }
        if (action === "feature") n.featured = true;
        if (action === "discount10") {
          if (!n.originalPrice) n.originalPrice = n.price;
          n.price = Math.round(n.price * 0.9);
          n.badge = n.badge || "Sale";
        }
        return n;
      });
      logActivity(`Bulk action "${action}" on ${ids.size} products`);
    }
    saveProducts(list);
    document.getElementById("select-all").checked = false;
    loadProducts();
    loadInventory();
    renderDashboard();
  });
});

document.getElementById("admin-search")?.addEventListener("input", loadProducts);
document.getElementById("admin-cat-filter")?.addEventListener("change", loadProducts);
document.getElementById("admin-status-filter")?.addEventListener("change", loadProducts);

// ---------------------------------------------------------------------------
// Image helpers (upload + URL)
// ---------------------------------------------------------------------------
function setImagePreview(src) {
  const img = document.getElementById("pf-image-preview");
  const empty = document.getElementById("pf-image-preview-empty");
  const clearBtn = document.getElementById("pf-image-clear");
  const dataField = document.getElementById("pf-image-data");
  if (!img || !empty) return;
  if (src && String(src).trim()) {
    img.src = resolveAdminAssetUrl(src);
    img.classList.remove("hidden");
    empty.classList.add("hidden");
    clearBtn?.classList.remove("hidden");
    if (dataField) dataField.value = src;
  } else {
    img.removeAttribute("src");
    img.classList.add("hidden");
    empty.classList.remove("hidden");
    clearBtn?.classList.add("hidden");
    if (dataField) dataField.value = "";
  }
}

function getFormImageValue() {
  return (
    document.getElementById("pf-image-data")?.value?.trim() ||
    document.getElementById("pf-image")?.value?.trim() ||
    ""
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    if (file.size > UPLOAD_MAX_BYTES) {
      reject(new Error("Image must be under 5 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = () => {
      const raw = reader.result;
      const img = new Image();
      img.onload = () => {
        try {
          let w = img.width;
          let h = img.height;
          if (w > UPLOAD_MAX_WIDTH) {
            h = Math.round((h * UPLOAD_MAX_WIDTH) / w);
            w = UPLOAD_MAX_WIDTH;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } catch {
          resolve(raw);
        }
      };
      img.onerror = () => reject(new Error("Invalid image."));
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

function initImageFields() {
  const fileInput = document.getElementById("pf-image-file");
  const urlInput = document.getElementById("pf-image");
  fileInput?.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      if (urlInput) urlInput.value = "";
      setImagePreview(dataUrl);
    } catch (err) {
      alert(err.message);
      fileInput.value = "";
    }
  });
  let t;
  urlInput?.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const url = urlInput.value.trim();
      if (url) {
        if (fileInput) fileInput.value = "";
        setImagePreview(url);
      }
    }, 350);
  });
  document.getElementById("pf-image-clear")?.addEventListener("click", () => {
    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";
    setImagePreview("");
  });
}

function openForm(product) {
  document.getElementById("product-form-wrap").classList.remove("hidden");
  document.getElementById("form-title").textContent = product ? "Edit product" : "New product";
  document.getElementById("pf-id").value = product?.id ?? "";
  document.getElementById("pf-name").value = product?.name || "";
  document.getElementById("pf-sku").value = product?.sku || "";
  document.getElementById("pf-category").value = product?.category || "living-room";
  document.getElementById("pf-price").value = product?.price ?? "";
  document.getElementById("pf-original").value = product?.originalPrice ?? "";
  document.getElementById("pf-stock-qty").value = product?.stockQty ?? 20;
  document.getElementById("pf-low-stock").value = product?.lowStockAt ?? 5;
  document.getElementById("pf-badge").value = product?.badge || "";
  document.getElementById("pf-featured").checked = Boolean(product?.featured);
  const fileInput = document.getElementById("pf-image-file");
  if (fileInput) fileInput.value = "";
  const imgVal = product?.image || "";
  const urlInput = document.getElementById("pf-image");
  if (urlInput) urlInput.value = imgVal.startsWith("data:") ? "" : imgVal;
  setImagePreview(imgVal);
  document.getElementById("pf-desc").value = product?.description || "";
  document.getElementById("pf-details").value = (product?.details || []).join("\n");
  document.getElementById("pf-stock").checked = product?.inStock !== false;
  document.getElementById("pf-active").checked = product?.active !== false;
  document.getElementById("product-form-wrap").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("btn-new-product")?.addEventListener("click", () => openForm(null));
document.getElementById("btn-cancel-form")?.addEventListener("click", () => {
  document.getElementById("product-form-wrap").classList.add("hidden");
});

document.getElementById("product-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const idRaw = document.getElementById("pf-id").value;
  const image = getFormImageValue();
  if (!image) {
    alert("Please upload an image or paste an image URL.");
    return;
  }
  const stockQty = Number(document.getElementById("pf-stock-qty").value) || 0;
  const inStockCheck = document.getElementById("pf-stock").checked && stockQty > 0;
  const details = (document.getElementById("pf-details").value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = normalizeProduct({
    id: idRaw ? Number(idRaw) || idRaw : Date.now(),
    name: document.getElementById("pf-name").value.trim(),
    sku: document.getElementById("pf-sku").value.trim(),
    category: document.getElementById("pf-category").value,
    price: Number(document.getElementById("pf-price").value),
    originalPrice: document.getElementById("pf-original").value
      ? Number(document.getElementById("pf-original").value)
      : null,
    badge: document.getElementById("pf-badge").value.trim() || null,
    image,
    images: [image],
    description: document.getElementById("pf-desc").value.trim(),
    details,
    inStock: inStockCheck,
    active: document.getElementById("pf-active").checked,
    stockQty,
    lowStockAt: Number(document.getElementById("pf-low-stock").value) || 5,
    featured: document.getElementById("pf-featured").checked,
    rating: 4.7,
    reviews: 0
  });

  const list = getProducts();
  const idx = list.findIndex((p) => String(p.id) === String(data.id));
  if (idx >= 0) {
    data.rating = list[idx].rating;
    data.reviews = list[idx].reviews;
    list[idx] = data;
    logActivity(`Updated product: ${data.name}`);
  } else {
    list.push(data);
    logActivity(`Created product: ${data.name}`);
  }
  saveProducts(list);
  document.getElementById("product-form-wrap").classList.add("hidden");
  loadProducts();
  loadInventory();
  renderDashboard();
});

// ---------------------------------------------------------------------------
// Inventory tab
// ---------------------------------------------------------------------------
function loadInventory() {
  const tbody = document.getElementById("inventory-tbody");
  if (!tbody) return;
  const list = [...getProducts()].sort((a, b) => a.stockQty - b.stockQty);
  tbody.innerHTML = list
    .map((p) => {
      const low = p.stockQty <= p.lowStockAt;
      const status =
        p.stockQty <= 0 ? "Out of stock" : low ? "Low stock" : "OK";
      const badgeClass =
        p.stockQty <= 0
          ? "admin-badge is-danger"
          : low
            ? "admin-badge is-warn"
            : "admin-badge is-ok";
      return `
    <tr class="${low ? "is-low-stock" : ""}">
      <td>
        <div class="admin-product-cell">
          <img src="${escapeHtml(resolveAdminAssetUrl(p.image))}" alt="" class="admin-thumb" loading="lazy" onerror="this.style.opacity='0.35'" />
          <span class="name">${escapeHtml(p.name)}</span>
        </div>
      </td>
      <td class="text-xs font-mono text-stone-500">${escapeHtml(p.sku || "—")}</td>
      <td class="tabular-nums font-medium ${p.stockQty <= 0 ? "text-red-700" : ""}">${p.stockQty}</td>
      <td class="tabular-nums text-stone-500">${p.lowStockAt}</td>
      <td><span class="${badgeClass}">${status}</span></td>
      <td>
        <div class="flex items-center gap-1.5">
          <button type="button" class="admin-qty-btn" data-inv="${p.id}" data-d="-1" aria-label="Decrease stock">−</button>
          <button type="button" class="admin-qty-btn" data-inv="${p.id}" data-d="1" aria-label="Increase stock">+</button>
          <button type="button" class="admin-qty-btn is-wide" data-inv="${p.id}" data-d="10">+10</button>
        </div>
      </td>
    </tr>`;
    })
    .join("");

  tbody.querySelectorAll("[data-inv]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.inv;
      const d = Number(btn.dataset.d);
      const list = getProducts().map((p) => {
        if (String(p.id) !== String(id)) return p;
        const stockQty = Math.max(0, p.stockQty + d);
        return normalizeProduct({ ...p, stockQty, inStock: stockQty > 0 });
      });
      saveProducts(list, false);
      logActivity(`Stock adjust product #${id} (${d > 0 ? "+" : ""}${d})`);
      loadInventory();
      loadProducts();
      renderDashboard();
    });
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
function loadOrders() {
  const root = document.getElementById("orders-admin");
  if (!root) return;
  const filter = document.getElementById("order-status-filter")?.value || "all";
  let orders = getOrders();
  if (filter !== "all") orders = orders.filter((o) => (o.status || "paid") === filter);

  const meta = document.getElementById("orders-meta");
  if (meta) {
    meta.textContent = `${orders.length} order(s)${isCloudReady() ? " · live sync on" : " · this browser"}`;
  }

  if (!orders.length) {
    root.innerHTML = `<p class="text-stone-500 text-sm">No orders for this filter yet. Paid checkouts from any user appear here automatically.</p>`;
    return;
  }

  root.innerHTML = orders
    .map((o, idx) => {
      const id = o.orderNumber || o.paymentRef || o.id || `local-${idx}`;
      const status = o.status || "paid";
      const date = o.createdAt ? new Date(o.createdAt).toLocaleString("en-NG") : "—";
      const items = Array.isArray(o.items) ? o.items : [];
      const itemPreview = items.length
        ? items
            .slice(0, 3)
            .map((i) => `${escapeHtml(i.name || "Item")} ×${i.quantity || i.qty || 1}`)
            .join(" · ")
        : "";
      return `
    <article class="admin-card admin-order-card">
      <div class="flex flex-wrap justify-between gap-3">
        <div class="min-w-0">
          <p class="font-medium tabular-nums text-sm">${escapeHtml(id)}</p>
          <p class="text-xs text-stone-500 mt-1">${escapeHtml(o.customer?.fullName || "")} · ${escapeHtml(o.customer?.email || o.userEmail || "")} · ${escapeHtml(o.customer?.phone || "")}</p>
          <p class="text-xs text-stone-400 mt-1">${date}</p>
          <p class="text-sm mt-2 font-medium">${fmt(o.totals?.total)} · ${escapeHtml(o.payment || "Paystack")}</p>
          <p class="text-xs text-stone-500 mt-1">${escapeHtml([o.customer?.address, o.customer?.lga, o.customer?.state].filter(Boolean).join(", "))}</p>
          ${itemPreview ? `<p class="text-xs text-stone-400 mt-2 line-clamp-2">${itemPreview}</p>` : ""}
        </div>
        <div class="flex flex-col gap-2 items-end">
          <select data-order-id="${escapeHtml(id)}" class="order-status admin-input text-sm">
            ${["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]
              .map((s) => `<option value="${s}" ${status === s ? "selected" : ""}>${s}</option>`)
              .join("")}
          </select>
          <button type="button" class="admin-link-btn is-primary text-xs" data-print-order="${idx}">Print summary</button>
        </div>
      </div>
    </article>`;
    })
    .join("");

  root.querySelectorAll(".order-status").forEach((sel) => {
    sel.addEventListener("change", async () => {
      const ref = sel.dataset.orderId;
      const status = sel.value;
      await updateOrderStatusCloud(ref, status);
      LIVE_ORDERS = getOrders().map((o) => {
        const oid = String(o.orderNumber || o.paymentRef || o.id || "");
        if (oid === String(ref)) return { ...o, status, updatedAt: new Date().toISOString() };
        return o;
      });
      // if still missing, refresh from cloud
      try {
        LIVE_ORDERS = await fetchCloudOrders();
        saveOrders(LIVE_ORDERS);
      } catch (_) {
        saveOrders(LIVE_ORDERS);
      }
      logActivity(`Order ${ref} → ${status}`);
      loadOrders();
      renderDashboard();
    });
  });

  root.querySelectorAll("[data-print-order]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const o = orders[Number(btn.dataset.printOrder)];
      if (!o) return;
      const w = window.open("", "_blank");
      w.document.write(`<pre style="font-family:system-ui;padding:24px">${escapeHtml(
        JSON.stringify(o, null, 2)
      )}</pre>`);
      w.document.close();
      w.print();
    });
  });
}

document.getElementById("order-status-filter")?.addEventListener("change", loadOrders);

document.getElementById("btn-refresh-orders")?.addEventListener("click", async () => {
  try {
    LIVE_ORDERS = await fetchCloudOrders();
    saveOrders(LIVE_ORDERS);
    loadOrders();
    renderDashboard();
    logActivity("Orders refreshed");
  } catch (err) {
    alert("Could not refresh orders: " + (err.message || "unknown error"));
  }
});

document.getElementById("btn-refresh-customers")?.addEventListener("click", async () => {
  try {
    LIVE_CUSTOMERS = await fetchCloudCustomers();
    loadCustomers();
    renderDashboard();
    logActivity("Customers refreshed");
  } catch (err) {
    alert("Could not refresh customers: " + (err.message || "unknown error"));
  }
});

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
function loadCustomers() {
  const root = document.getElementById("customers-list");
  if (!root) return;

  let list = LIVE_CUSTOMERS.slice();
  if (!list.length) {
    // Merge local sign-ups + checkout buyers
    const map = new Map();
    try {
      const users = JSON.parse(localStorage.getItem("sky_users") || "[]");
      if (Array.isArray(users)) {
        users.forEach((u) => {
          const email = String(u.email || "").toLowerCase();
          if (!email) return;
          map.set(email, {
            email,
            name: u.displayName || u.name || "",
            phone: u.phone || "",
            orderCount: 0,
            totalSpent: 0,
            source: "signup",
            lastSeenAt: u.createdAt || null
          });
        });
      }
    } catch (_) {}
    getOrders().forEach((o) => {
      const email = (o.customer?.email || o.userEmail || "").toLowerCase();
      if (!email) return;
      const prev = map.get(email) || {
        email,
        name: o.customer?.fullName || "",
        phone: o.customer?.phone || "",
        orderCount: 0,
        totalSpent: 0,
        source: "checkout"
      };
      prev.orderCount += 1;
      if (isCountableRevenue(o)) prev.totalSpent += Number(o.totals?.total) || 0;
      if (o.customer?.fullName) prev.name = o.customer.fullName;
      if (o.customer?.phone) prev.phone = o.customer.phone;
      if (prev.source === "signup") prev.source = "signup + checkout";
      map.set(email, prev);
    });
    list = [...map.values()];
  }

  list.sort(
    (a, b) =>
      (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0) ||
      String(b.lastSeenAt || "").localeCompare(String(a.lastSeenAt || ""))
  );

  const meta = document.getElementById("customers-meta");
  if (meta) {
    meta.textContent = `${list.length} customer(s)${isCloudReady() ? " · live sync on" : " · this browser"}`;
  }

  if (!list.length) {
    root.innerHTML = `<p class="p-6 text-sm text-stone-500">No customers yet. Anyone who signs up, signs in, or places an order is listed here.</p>`;
    return;
  }

  root.innerHTML = list
    .map((c) => {
      const seen = c.lastSeenAt
        ? new Date(c.lastSeenAt).toLocaleString("en-NG")
        : c.lastOrderAt
          ? new Date(c.lastOrderAt).toLocaleString("en-NG")
          : "—";
      const source = c.source || "site";
      return `
    <div class="p-4 flex flex-wrap justify-between gap-3 items-start">
      <div class="min-w-0">
        <p class="font-medium text-sm">${escapeHtml(c.name || "Customer")}</p>
        <p class="text-xs text-stone-500 mt-0.5">${escapeHtml(c.email)} · ${escapeHtml(c.phone || "—")}</p>
        <p class="text-[11px] text-stone-400 mt-1">Source: ${escapeHtml(source)} · Last active: ${escapeHtml(seen)}</p>
      </div>
      <div class="text-right text-sm shrink-0">
        <p class="tabular-nums font-medium">${fmt(c.totalSpent || c.spent || 0)}</p>
        <p class="text-xs text-stone-400">${Number(c.orderCount || c.orders || 0)} order(s)</p>
      </div>
    </div>`;
    })
    .join("");
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------
function loadCoupons() {
  const root = document.getElementById("coupons-list");
  if (!root) return;
  const list = getCoupons();
  if (!list.length) {
    root.innerHTML = `<p class="text-sm text-stone-500">No coupons yet. Create WELCOME10 for 10% off, for example.</p>`;
    return;
  }
  root.innerHTML = list
    .map(
      (c, i) => `
    <div class="admin-card flex flex-wrap justify-between gap-2 items-center">
      <div>
        <p class="font-mono font-medium">${escapeHtml(c.code)}</p>
        <p class="text-xs text-stone-500 mt-0.5">${c.type === "percent" ? c.value + "% off" : fmt(c.value) + " off"} · <span class="${c.active === false ? "admin-badge" : "admin-badge is-ok"}">${c.active === false ? "Disabled" : "Active"}</span></p>
      </div>
      <div class="flex gap-2">
        <button type="button" data-cp-toggle="${i}" class="admin-chip-btn">${c.active === false ? "Enable" : "Disable"}</button>
        <button type="button" data-cp-del="${i}" class="admin-link-btn is-danger text-xs">Delete</button>
      </div>
    </div>`
    )
    .join("");

  root.querySelectorAll("[data-cp-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = getCoupons();
      list.splice(Number(btn.dataset.cpDel), 1);
      saveCoupons(list);
      logActivity("Deleted coupon");
      loadCoupons();
    });
  });
  root.querySelectorAll("[data-cp-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const list = getCoupons();
      const i = Number(btn.dataset.cpToggle);
      list[i].active = list[i].active === false;
      saveCoupons(list);
      loadCoupons();
    });
  });
}

document.getElementById("coupon-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("cp-code").value.trim().toUpperCase();
  const type = document.getElementById("cp-type").value;
  const value = Number(document.getElementById("cp-value").value);
  if (!code || !value) return;
  const list = getCoupons();
  if (list.some((c) => c.code === code)) {
    alert("That code already exists.");
    return;
  }
  list.push({ code, type, value, active: true, createdAt: new Date().toISOString() });
  saveCoupons(list);
  logActivity(`Created coupon ${code}`);
  e.target.reset();
  loadCoupons();
});

// ---------------------------------------------------------------------------
// Tools: seed / export / import
// ---------------------------------------------------------------------------
function exportJSON() {
  const blob = new Blob([JSON.stringify(getProducts(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `sky-furniture-products-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  logActivity("Exported products JSON");
}

document.getElementById("btn-export-json")?.addEventListener("click", exportJSON);
document.getElementById("btn-export-json-2")?.addEventListener("click", exportJSON);

document.getElementById("import-json")?.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  const status = document.getElementById("import-status");
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("JSON must be an array of products.");
    saveProducts(data.map(normalizeProduct));
    status.textContent = `Imported ${data.length} products.`;
    status.className = "admin-status-msg is-ok";
    logActivity(`Imported ${data.length} products from JSON`);
    loadProducts();
    loadInventory();
    renderDashboard();
  } catch (err) {
    status.textContent = err.message;
    status.className = "admin-status-msg is-err";
  }
  e.target.value = "";
});

document.getElementById("btn-seed")?.addEventListener("click", () => {
  const status = document.getElementById("seed-status");
  const catalog = catalogFromDataJs();
  if (!catalog.length) {
    status.textContent = "Could not load data.js — hard refresh and try again.";
    status.className = "admin-status-msg is-err";
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (window.SKY_CATALOG_VERSION) {
      localStorage.setItem("sky_catalog_version", String(window.SKY_CATALOG_VERSION));
    }
  } catch (_) {}
  saveProducts(catalog);
  status.textContent = `Loaded ${catalog.length} products with matching images.`;
  status.className = "admin-status-msg is-ok";
  logActivity(`Seeded ${catalog.length} products from data.js`);
  loadProducts();
  loadInventory();
  renderDashboard();
});

document.getElementById("btn-clear-catalog")?.addEventListener("click", () => {
  if (!confirm("Clear local catalog overrides and reload defaults from data.js?")) return;
  localStorage.removeItem(STORAGE_KEY);
  try {
    localStorage.removeItem("sky_catalog_version");
  } catch (_) {}
  saveProducts(catalogFromDataJs());
  document.getElementById("seed-status").textContent = "Reset to data.js defaults.";
  logActivity("Cleared local overrides / reset catalog");
  loadProducts();
  loadInventory();
  renderDashboard();
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
function bootAdmin() {
  try {
    initTheme();
    initMobileDrawer();
    initImageFields();
    initViewShopLinks();
    wirePasswordUnlock();

    // Event delegation so dashboard feature cards & any new tab buttons work
    document.addEventListener("click", (e) => {
      const tabBtn = e.target.closest("[data-tab]");
      if (!tabBtn || !tabBtn.dataset.tab) return;
      // Don't treat non-button links that happen to have data-tab incorrectly
      if (tabBtn.tagName === "A" && tabBtn.getAttribute("href")) return;
      e.preventDefault();
      setTab(tabBtn.dataset.tab);
    });

    document.getElementById("btn-theme-light")?.addEventListener("click", () => applyTheme("light"));
    document.getElementById("btn-theme-dark")?.addEventListener("click", () => applyTheme("dark"));

    checkAccess();
  } catch (err) {
    console.error("[Admin] boot failed", err);
    try {
      showLocalUnlock("Sign in to manage your store");
      showGateError("Admin had a startup error. You can still try signing in.");
    } catch (_) {
      alert("Admin failed to start: " + (err.message || err));
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootAdmin);
} else {
  bootAdmin();
}
