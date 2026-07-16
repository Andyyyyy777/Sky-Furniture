/**
 * Sky Furniture Admin — full working console
 */
(function () {
  "use strict";

  const KEYS = {
    products: "sky_admin_products",
    orders: "sky_furniture_paid_orders",
    coupons: "sky_admin_coupons",
    activity: "sky_admin_activity",
    session: "sky_admin_ok",
    email: "sky_admin_email",
    theme: "sky_furniture_theme",
    catalogVersion: "sky_catalog_version",
    users: "sky_users",
    fromAdmin: "sky_from_admin"
  };

  const DEFAULT_PASS = "SkyAdmin2026";
  const CATEGORIES = [
    { id: "living-room", label: "Living Room" },
    { id: "bedroom", label: "Bedroom" },
    { id: "office", label: "Office & Gaming" },
    { id: "dining", label: "Dining" },
    { id: "rugs", label: "Rugs" },
    { id: "lighting", label: "Lighting" },
    { id: "decor", label: "Decor & Artifacts" }
  ];
  const LEGACY = {
    living: "living-room",
    "office-gaming": "office",
    sofa: "living-room",
    bed: "bedroom",
    table: "dining",
    lamps: "lighting",
    artifacts: "decor"
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function money(n) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(Number(n) || 0);
  }

  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function catLabel(id) {
    return CATEGORIES.find((c) => c.id === id)?.label || id || "—";
  }

  function assetUrl(url) {
    if (!url) return "";
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return "../" + String(url).replace(/^\//, "");
  }

  function readJSON(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function password() {
    return String(window.SKY_ADMIN_ACCESS?.localPassword || "").trim() || DEFAULT_PASS;
  }

  function log(msg) {
    const list = readJSON(KEYS.activity, []);
    list.unshift({ t: new Date().toISOString(), msg });
    writeJSON(KEYS.activity, list.slice(0, 60));
    renderActivity();
  }

  // ── products ───────────────────────────────────────────
  function normalizeProduct(p) {
    const category = LEGACY[p.category] || p.category || "living-room";
    const stockQty =
      p.stockQty != null ? Math.max(0, Number(p.stockQty)) : p.inStock === false ? 0 : 20;
    const image = String(p.image || "").replace(/^\//, "");
    const images = (Array.isArray(p.images) && p.images.length ? p.images : image ? [image] : [])
      .map((u) => String(u || "").replace(/^\//, ""))
      .filter(Boolean);
    return {
      id: Number(p.id) || Date.now(),
      name: p.name || "Untitled",
      sku: p.sku || `SF-${category.slice(0, 2).toUpperCase()}-${String(p.id || Date.now()).slice(-4)}`,
      category,
      price: Number(p.price) || 0,
      originalPrice:
        p.originalPrice != null && p.originalPrice !== "" ? Number(p.originalPrice) : null,
      rating: Number(p.rating) || 4.7,
      reviews: Number(p.reviews) || 0,
      image: image || "",
      images: images.length ? images : image ? [image] : [],
      description: p.description || "",
      details: Array.isArray(p.details) ? p.details : [],
      inStock: p.inStock !== false && stockQty > 0,
      active: p.active !== false,
      badge: p.badge || null,
      stockQty,
      lowStockAt: p.lowStockAt != null ? Number(p.lowStockAt) : 5,
      featured: Boolean(p.featured)
    };
  }

  function seedFromDataJs() {
    return (window.SKY_PRODUCTS || window.PRODUCTS || []).map(normalizeProduct);
  }

  function getProducts() {
    const liveVersion = String(window.SKY_CATALOG_VERSION || "");
    try {
      const saved = localStorage.getItem(KEYS.catalogVersion) || "";
      if (liveVersion && saved !== liveVersion) {
        localStorage.removeItem(KEYS.products);
        localStorage.setItem(KEYS.catalogVersion, liveVersion);
      }
    } catch (_) {}

    let list = readJSON(KEYS.products, null);
    if (!Array.isArray(list) || !list.length) {
      list = seedFromDataJs();
      if (list.length) saveProducts(list, false);
      return list;
    }

    const seed = seedFromDataJs();
    const byId = new Map(seed.map((p) => [String(p.id), p]));
    let changed = false;
    list = list.map((raw) => {
      const p = normalizeProduct(raw);
      const fresh = byId.get(String(p.id));
      if (fresh?.image && (!p.image || /\.svg|unsplash|placehold/i.test(p.image))) {
        changed = true;
        return { ...p, image: fresh.image, images: fresh.images };
      }
      return p;
    });
    if (changed) saveProducts(list, false);
    return list;
  }

  function saveProducts(list, doLog = true) {
    const normalized = list.map(normalizeProduct);
    writeJSON(KEYS.products, normalized);
    try {
      if (window.SKY_CATALOG_VERSION) {
        localStorage.setItem(KEYS.catalogVersion, String(window.SKY_CATALOG_VERSION));
      }
    } catch (_) {}
    if (doLog) log(`Catalog saved (${normalized.length} products)`);
    return normalized;
  }

  function getOrders() {
    const list = readJSON(KEYS.orders, []);
    return Array.isArray(list) ? list : [];
  }

  function saveOrders(list) {
    writeJSON(KEYS.orders, list || []);
  }

  function orderTime(o) {
    const t = Date.parse(o.createdAt || o.updatedAt || 0);
    return Number.isFinite(t) ? t : 0;
  }

  function isRevenue(o) {
    return o.status !== "cancelled" && o.status !== "pending_payment";
  }

  function startOfDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }

  function startOfWeek(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay();
    x.setDate(x.getDate() - (day === 0 ? 6 : day - 1));
    return x.getTime();
  }

  function getCustomers() {
    const map = new Map();
    (readJSON(KEYS.users, []) || []).forEach((u) => {
      const email = String(u.email || "").toLowerCase();
      if (!email) return;
      map.set(email, {
        email,
        name: u.displayName || u.name || "",
        phone: u.phone || "",
        orderCount: 0,
        totalSpent: 0,
        source: "signup"
      });
    });
    getOrders().forEach((o) => {
      const email = String(o.customer?.email || o.userEmail || "").toLowerCase();
      if (!email) return;
      const prev = map.get(email) || {
        email,
        name: "",
        phone: "",
        orderCount: 0,
        totalSpent: 0,
        source: "checkout"
      };
      prev.orderCount += 1;
      if (isRevenue(o)) prev.totalSpent += Number(o.totals?.total) || 0;
      if (o.customer?.fullName) prev.name = o.customer.fullName;
      if (o.customer?.phone) prev.phone = o.customer.phone;
      if (prev.source === "signup") prev.source = "signup + checkout";
      map.set(email, prev);
    });
    return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
  }

  function getCoupons() {
    return readJSON(KEYS.coupons, []) || [];
  }

  function saveCoupons(list) {
    writeJSON(KEYS.coupons, list);
  }

  // ── theme ──────────────────────────────────────────────
  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem(KEYS.theme, next);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#0F0E0D" : "#F4F0EA";
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        next === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
      btn.title = next === "dark" ? "Light mode" : "Dark mode";
    });
  }

  function initTheme() {
    let theme = "light";
    try {
      const saved = localStorage.getItem(KEYS.theme);
      if (saved === "dark" || saved === "light") theme = saved;
      else if (matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
    } catch (_) {}
    applyTheme(theme);

    // Bind once (login + app topbar both have toggles)
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-theme-toggle]");
      if (!btn) return;
      e.preventDefault();
      const isDark = document.documentElement.classList.contains("dark");
      applyTheme(isDark ? "light" : "dark");
    });

    $("#btn-light")?.addEventListener("click", () => applyTheme("light"));
    $("#btn-dark")?.addEventListener("click", () => applyTheme("dark"));
  }

  function initPasswordToggle() {
    const input = $("#login-pass");
    const btn = $("#toggle-pass");
    if (!input || !btn) return;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.title = show ? "Hide password" : "Show password";
      const eye = btn.querySelector(".pass-eye");
      const eyeOff = btn.querySelector(".pass-eye-off");
      if (eye) eye.classList.toggle("hidden", show);
      if (eyeOff) eyeOff.classList.toggle("hidden", !show);
      input.focus();
    });
  }

  // ── auth / views ───────────────────────────────────────
  function showLogin(err) {
    document.body.classList.remove("is-app");
    const login = $("#login-screen");
    const app = $("#app");
    if (login) login.hidden = false;
    if (app) app.hidden = true;
    $("#drawer").hidden = true;
    const errEl = $("#login-error");
    if (errEl) {
      if (err) {
        errEl.classList.remove("hidden");
        errEl.textContent = err;
      } else {
        errEl.classList.add("hidden");
        errEl.textContent = "";
      }
    }
    setTimeout(() => $("#login-pass")?.focus(), 40);
  }

  function showApp(name) {
    document.body.classList.add("is-app");
    const login = $("#login-screen");
    const app = $("#app");
    if (login) login.hidden = true;
    if (app) app.hidden = false;
    if ($("#admin-name")) $("#admin-name").textContent = name || "Admin";
    fillCategorySelects();
    showView("dashboard");
  }

  function unlock(name) {
    sessionStorage.setItem(KEYS.session, "1");
    sessionStorage.setItem(KEYS.email, name || "Admin");
    sessionStorage.setItem(KEYS.fromAdmin, "1");
    showApp(name || "Admin");
  }

  function logout() {
    sessionStorage.removeItem(KEYS.session);
    sessionStorage.removeItem(KEYS.email);
    sessionStorage.removeItem(KEYS.fromAdmin);
    showLogin();
  }

  function showView(name) {
    $$(".view").forEach((el) => {
      el.hidden = el.id !== "view-" + name;
    });
    $$("[data-view]").forEach((btn) => {
      const on = btn.dataset.view === name;
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("active", on);
    });
    closeDrawer();
    if (name === "dashboard") renderDashboard();
    if (name === "products") renderProducts();
    if (name === "inventory") renderInventory();
    if (name === "orders") renderOrders();
    if (name === "customers") renderCustomers();
    if (name === "coupons") renderCoupons();
    if (name === "tools") renderActivity();
  }

  function fillCategorySelects() {
    const opts = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    const filter =
      `<option value="all">All categories</option>` +
      CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    if ($("#product-cat")) $("#product-cat").innerHTML = filter;
    if ($("#f-category")) $("#f-category").innerHTML = opts;
  }

  // ── renders ────────────────────────────────────────────
  function renderDashboard() {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();
    const day = startOfDay();
    const week = startOfWeek();
    const paid = orders.filter(isRevenue);
    const todayOrders = paid.filter((o) => orderTime(o) >= day);
    const weekOrders = paid.filter((o) => orderTime(o) >= week);
    const daily = todayOrders.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const weekly = weekOrders.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const revenue = paid.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const low = products.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt).length;
    const oos = products.filter((p) => p.stockQty <= 0).length;
    const active = products.filter((p) => p.active).length;

    const kpis = [
      { label: "Today", value: money(daily), sub: todayOrders.length + " paid" },
      { label: "This week", value: money(weekly), sub: weekOrders.length + " paid" },
      { label: "All revenue", value: money(revenue), sub: orders.length + " orders" },
      { label: "Customers", value: String(customers.length), sub: "Sign-ups & buyers" },
      { label: "Products", value: String(products.length), sub: active + " active" },
      { label: "Stock alerts", value: String(low), sub: oos ? oos + " out of stock" : "Healthy", warn: low || oos }
    ];

    $("#kpi-grid").innerHTML = kpis
      .map(
        (k) => `
      <div class="kpi${k.warn ? " warn" : ""}">
        <div class="kpi-label">${esc(k.label)}</div>
        <div class="kpi-value">${esc(k.value)}</div>
        <div class="kpi-sub">${esc(k.sub)}</div>
      </div>`
      )
      .join("");

    const recent = [...orders].sort((a, b) => orderTime(b) - orderTime(a)).slice(0, 6);
    $("#dash-orders").innerHTML = recent.length
      ? recent
          .map(
            (o) => `
        <div class="list-row">
          <span class="truncate min-w-0">${esc(o.orderNumber || o.paymentRef || o.id || "Order")} · ${esc(o.customer?.fullName || o.customer?.email || "")}</span>
          <strong class="tabular-nums shrink-0">${money(o.totals?.total)}</strong>
        </div>`
          )
          .join("")
      : `<p class="empty">No orders yet.</p>`;

    const lowList = products.filter((p) => p.stockQty <= p.lowStockAt).slice(0, 8);
    $("#dash-stock").innerHTML = lowList.length
      ? lowList
          .map(
            (p) => `
        <div class="list-row">
          <span class="truncate">${esc(p.name)}</span>
          <strong class="text-red-600 tabular-nums">${p.stockQty} left</strong>
        </div>`
          )
          .join("")
      : `<p class="empty">Stock levels look healthy.</p>`;

    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    $("#dash-cats").innerHTML = CATEGORIES.map(
      (c) => `<span class="chip">${esc(c.label)} <strong>${counts[c.id] || 0}</strong></span>`
    ).join("");
  }

  function renderProducts() {
    let list = getProducts();
    const q = ($("#product-search")?.value || "").toLowerCase().trim();
    const cat = $("#product-cat")?.value || "all";
    const status = $("#product-status")?.value || "all";

    if (cat !== "all") list = list.filter((p) => p.category === cat);
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
    if (status === "oos") list = list.filter((p) => p.stockQty <= 0);
    if (status === "low") list = list.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt);

    list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    if ($("#product-count")) $("#product-count").textContent = `Showing ${list.length} of ${getProducts().length}`;

    const body = $("#products-body");
    if (!body) return;
    if (!list.length) {
      body.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-stone-400">No products match. Use Tools → Load catalog + photos.</td></tr>`;
      return;
    }

    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty > 0 && p.stockQty <= p.lowStockAt;
        const label = !p.active ? "Hidden" : p.stockQty <= 0 ? "OOS" : low ? "Low" : "Active";
        const badge = label === "OOS" ? "danger" : label === "Low" ? "warn" : label === "Active" ? "ok" : "";
        return `
      <tr>
        <td class="p-3">
          <div class="prod-cell">
            <img class="prod-thumb" src="${esc(assetUrl(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <div class="min-w-0">
              <div class="prod-name">${esc(p.name)}</div>
              <div class="prod-tags">
                ${p.badge ? `<span>${esc(p.badge)}</span>` : ""}
                ${p.featured ? `<span>Featured</span>` : ""}
              </div>
            </div>
          </div>
        </td>
        <td class="p-3 font-mono text-xs text-stone-400">${esc(p.sku || "—")}</td>
        <td class="p-3">${esc(catLabel(p.category))}</td>
        <td class="p-3 tabular-nums">${money(p.price)}${
          p.originalPrice
            ? `<span class="block text-xs text-stone-400 line-through">${money(p.originalPrice)}</span>`
            : ""
        }</td>
        <td class="p-3 tabular-nums font-medium ${p.stockQty <= 0 ? "text-red-600" : low ? "text-amber-600" : ""}">${p.stockQty}</td>
        <td class="p-3"><span class="badge ${badge}">${label}</span></td>
        <td class="p-3 text-right whitespace-nowrap">
          <button type="button" class="row-btn primary" data-edit="${p.id}">Edit</button>
          <button type="button" class="row-btn" data-dup="${p.id}">Dup</button>
          <button type="button" class="row-btn danger" data-del="${p.id}">Del</button>
        </td>
      </tr>`;
      })
      .join("");

    body.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openEditor(getProducts().find((p) => String(p.id) === btn.dataset.edit));
      });
    });
    body.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("Delete this product?")) return;
        saveProducts(getProducts().filter((p) => String(p.id) !== btn.dataset.del));
        log("Deleted product #" + btn.dataset.del);
        renderProducts();
      });
    });
    body.querySelectorAll("[data-dup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = getProducts().find((p) => String(p.id) === btn.dataset.dup);
        if (!src) return;
        const list2 = getProducts();
        list2.push(
          normalizeProduct({
            ...src,
            id: Date.now(),
            name: src.name + " (copy)",
            sku: (src.sku || "SF") + "-C"
          })
        );
        saveProducts(list2);
        log("Duplicated " + src.name);
        renderProducts();
      });
    });
  }

  function setPreview(src) {
    const img = $("#f-preview");
    const empty = $("#f-preview-empty");
    const data = $("#f-image-data");
    if (!img || !empty) return;
    if (src) {
      img.src = assetUrl(src);
      img.classList.remove("hidden");
      empty.classList.add("hidden");
      if (data) data.value = src;
    } else {
      img.removeAttribute("src");
      img.classList.add("hidden");
      empty.classList.remove("hidden");
      if (data) data.value = "";
    }
  }

  function openEditor(product) {
    const wrap = $("#product-editor");
    if (!wrap) return;
    wrap.hidden = false;
    $("#editor-title").textContent = product ? "Edit product" : "New product";
    $("#f-id").value = product?.id ?? "";
    $("#f-name").value = product?.name || "";
    $("#f-sku").value = product?.sku || "";
    $("#f-category").value = product?.category || "living-room";
    $("#f-price").value = product?.price ?? "";
    $("#f-compare").value = product?.originalPrice ?? "";
    $("#f-stock").value = product?.stockQty ?? 20;
    $("#f-low").value = product?.lowStockAt ?? 5;
    $("#f-badge").value = product?.badge || "";
    $("#f-featured").checked = Boolean(product?.featured);
    $("#f-desc").value = product?.description || "";
    $("#f-details").value = (product?.details || []).join("\n");
    $("#f-instock").checked = product?.inStock !== false;
    $("#f-active").checked = product?.active !== false;
    if ($("#f-file")) $("#f-file").value = "";
    const img = product?.image || "";
    if ($("#f-image")) $("#f-image").value = img.startsWith("data:") ? "" : img;
    setPreview(img);
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeEditor() {
    if ($("#product-editor")) $("#product-editor").hidden = true;
  }

  function renderInventory() {
    const body = $("#inventory-body");
    if (!body) return;
    const list = [...getProducts()].sort((a, b) => a.stockQty - b.stockQty);
    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty <= p.lowStockAt;
        const label = p.stockQty <= 0 ? "Out of stock" : low ? "Low stock" : "OK";
        const badge = p.stockQty <= 0 ? "danger" : low ? "warn" : "ok";
        return `
      <tr class="${low ? "tr-low" : ""}">
        <td class="p-3">
          <div class="prod-cell">
            <img class="prod-thumb" src="${esc(assetUrl(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <span class="prod-name">${esc(p.name)}</span>
          </div>
        </td>
        <td class="p-3 font-mono text-xs text-stone-400">${esc(p.sku || "—")}</td>
        <td class="p-3 tabular-nums font-medium ${p.stockQty <= 0 ? "text-red-600" : ""}">${p.stockQty}</td>
        <td class="p-3 tabular-nums text-stone-400">${p.lowStockAt}</td>
        <td class="p-3"><span class="badge ${badge}">${label}</span></td>
        <td class="p-3">
          <div class="flex gap-1.5">
            <button type="button" class="qty-btn" data-inv="${p.id}" data-d="-1">−</button>
            <button type="button" class="qty-btn" data-inv="${p.id}" data-d="1">+</button>
            <button type="button" class="qty-btn px-2 text-xs" data-inv="${p.id}" data-d="10">+10</button>
          </div>
        </td>
      </tr>`;
      })
      .join("");

    body.querySelectorAll("[data-inv]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.inv;
        const d = Number(btn.dataset.d);
        const next = getProducts().map((p) => {
          if (String(p.id) !== String(id)) return p;
          const stockQty = Math.max(0, p.stockQty + d);
          return normalizeProduct({ ...p, stockQty, inStock: stockQty > 0 });
        });
        saveProducts(next, false);
        log(`Stock adjust #${id} (${d > 0 ? "+" : ""}${d})`);
        renderInventory();
      });
    });
  }

  function renderOrders() {
    const filter = $("#order-filter")?.value || "all";
    let orders = getOrders();
    if (filter !== "all") orders = orders.filter((o) => (o.status || "paid") === filter);
    orders = [...orders].sort((a, b) => orderTime(b) - orderTime(a));
    if ($("#orders-meta")) $("#orders-meta").textContent = orders.length + " order(s)";

    const root = $("#orders-list");
    if (!root) return;
    if (!orders.length) {
      root.innerHTML = `<div class="card"><p class="empty">No orders for this filter yet.</p></div>`;
      return;
    }

    root.innerHTML = orders
      .map((o, idx) => {
        const id = o.orderNumber || o.paymentRef || o.id || "local-" + idx;
        const status = o.status || "paid";
        const date = o.createdAt ? new Date(o.createdAt).toLocaleString("en-NG") : "—";
        const items = Array.isArray(o.items) ? o.items : [];
        const preview = items
          .slice(0, 3)
          .map((i) => `${esc(i.name || "Item")} ×${i.quantity || i.qty || 1}`)
          .join(" · ");
        return `
      <article class="card flex flex-wrap justify-between gap-4">
        <div class="min-w-0">
          <p class="font-mono text-sm font-semibold">${esc(id)}</p>
          <p class="text-xs text-stone-500 mt-1">${esc(o.customer?.fullName || "")} · ${esc(o.customer?.email || o.userEmail || "")} · ${esc(o.customer?.phone || "")}</p>
          <p class="text-xs text-stone-400 mt-1">${esc(date)}</p>
          <p class="text-sm font-semibold mt-2">${money(o.totals?.total)} · ${esc(o.payment || "Paystack")}</p>
          <p class="text-xs text-stone-500 mt-1">${esc([o.customer?.address, o.customer?.lga, o.customer?.state].filter(Boolean).join(", "))}</p>
          ${preview ? `<p class="text-xs text-stone-400 mt-2">${preview}</p>` : ""}
        </div>
        <div>
          <select class="field order-status" data-id="${esc(id)}">
            ${["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]
              .map((s) => `<option value="${s}" ${status === s ? "selected" : ""}>${s}</option>`)
              .join("")}
          </select>
        </div>
      </article>`;
      })
      .join("");

    root.querySelectorAll(".order-status").forEach((sel) => {
      sel.addEventListener("change", () => {
        const id = sel.dataset.id;
        const status = sel.value;
        const next = getOrders().map((o) => {
          const oid = String(o.orderNumber || o.paymentRef || o.id || "");
          if (oid === String(id)) return { ...o, status, updatedAt: new Date().toISOString() };
          return o;
        });
        saveOrders(next);
        log(`Order ${id} → ${status}`);
        renderOrders();
      });
    });
  }

  function renderCustomers() {
    const list = getCustomers();
    if ($("#customers-meta")) $("#customers-meta").textContent = list.length + " customer(s)";
    const root = $("#customers-list");
    if (!root) return;
    if (!list.length) {
      root.innerHTML = `<div class="p-6"><p class="empty">No customers yet.</p></div>`;
      return;
    }
    root.innerHTML = list
      .map(
        (c) => `
      <div class="p-4 flex flex-wrap justify-between gap-3">
        <div>
          <p class="font-semibold text-sm">${esc(c.name || "Customer")}</p>
          <p class="text-xs text-stone-500 mt-0.5">${esc(c.email)} · ${esc(c.phone || "—")}</p>
          <p class="text-[11px] text-stone-400 mt-1">Source: ${esc(c.source)}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold tabular-nums">${money(c.totalSpent)}</p>
          <p class="text-xs text-stone-400">${c.orderCount} order(s)</p>
        </div>
      </div>`
      )
      .join("");
  }

  function renderCoupons() {
    const root = $("#coupons-list");
    if (!root) return;
    const list = getCoupons();
    if (!list.length) {
      root.innerHTML = `<div class="card"><p class="empty">No coupons yet. Try WELCOME10 for 10% off.</p></div>`;
      return;
    }
    root.innerHTML = list
      .map(
        (c, i) => `
      <div class="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-mono font-semibold tracking-wide">${esc(c.code)}</p>
          <p class="text-xs text-stone-500 mt-1">
            ${c.type === "percent" ? c.value + "% off" : money(c.value) + " off"}
            · <span class="badge ${c.active === false ? "" : "ok"}">${c.active === false ? "Disabled" : "Active"}</span>
          </p>
        </div>
        <div class="flex gap-2">
          <button type="button" class="btn-secondary text-xs" data-cp-toggle="${i}">${c.active === false ? "Enable" : "Disable"}</button>
          <button type="button" class="btn-secondary text-xs text-red-600" data-cp-del="${i}">Delete</button>
        </div>
      </div>`
      )
      .join("");

    root.querySelectorAll("[data-cp-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const list2 = getCoupons();
        list2.splice(Number(btn.dataset.cpDel), 1);
        saveCoupons(list2);
        log("Deleted coupon");
        renderCoupons();
      });
    });
    root.querySelectorAll("[data-cp-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const list2 = getCoupons();
        const i = Number(btn.dataset.cpToggle);
        list2[i].active = list2[i].active === false;
        saveCoupons(list2);
        renderCoupons();
      });
    });
  }

  function renderActivity() {
    const el = $("#activity");
    if (!el) return;
    const list = readJSON(KEYS.activity, []);
    el.innerHTML = list.length
      ? list
          .map((a) => `<div>${esc((a.t || "").slice(0, 19).replace("T", " "))} — ${esc(a.msg)}</div>`)
          .join("")
      : "<div>No activity yet.</div>";
  }

  // ── drawer ─────────────────────────────────────────────
  function openDrawer() {
    const drawer = $("#drawer");
    const panel = $("#drawer-nav");
    if (!drawer || !panel) return;
    panel.innerHTML = "";
    $$("#sidebar-nav [data-view]").forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.className = "nav-btn" + (clone.classList.contains("is-active") ? " is-active" : "");
      clone.addEventListener("click", () => showView(clone.dataset.view));
      panel.appendChild(clone);
    });
    const shop = document.createElement("a");
    shop.href = "../shop.html";
    shop.target = "_blank";
    shop.rel = "noopener";
    shop.className = "nav-btn";
    shop.textContent = "Open shop ↗";
    panel.appendChild(shop);
    const out = document.createElement("button");
    out.type = "button";
    out.className = "nav-btn text-red-300";
    out.textContent = "Sign out";
    out.addEventListener("click", logout);
    panel.appendChild(out);
    drawer.classList.remove("hidden");
    drawer.hidden = false;
  }

  function closeDrawer() {
    const drawer = $("#drawer");
    if (!drawer) return;
    drawer.classList.add("hidden");
    drawer.hidden = true;
  }

  // ── bind ───────────────────────────────────────────────
  function bindEvents() {
    $("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = ($("#login-pass")?.value || "").trim();
      if (!pass) return showLogin("Please enter your password.");
      if (pass !== password()) {
        if ($("#login-pass")) $("#login-pass").value = "";
        return showLogin("Incorrect password. Try again.");
      }
      unlock("Admin");
    });

    $("#btn-logout")?.addEventListener("click", logout);
    $("#btn-menu")?.addEventListener("click", openDrawer);
    $$("[data-close-drawer]").forEach((el) => el.addEventListener("click", closeDrawer));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (!btn || !btn.dataset.view) return;
      if (!document.body.classList.contains("is-app")) return;
      // ignore plain links that also have data-view accidentally
      if (btn.tagName === "A" && btn.getAttribute("href") && !btn.dataset.view) return;
      e.preventDefault();
      showView(btn.dataset.view);
    });

    $("#product-search")?.addEventListener("input", renderProducts);
    $("#product-cat")?.addEventListener("change", renderProducts);
    $("#product-status")?.addEventListener("change", renderProducts);
    $("#btn-add-product")?.addEventListener("click", () => openEditor(null));
    $("#btn-cancel-edit")?.addEventListener("click", closeEditor);

    $("#f-file")?.addEventListener("change", () => {
      const file = $("#f-file").files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return alert("Choose an image file.");
      if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5 MB.");
      const reader = new FileReader();
      reader.onload = () => {
        const raw = reader.result;
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          const max = 1200;
          if (w > max) {
            h = Math.round((h * max) / w);
            w = max;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          if ($("#f-image")) $("#f-image").value = "";
          setPreview(dataUrl);
        };
        img.onerror = () => setPreview(raw);
        img.src = raw;
      };
      reader.readAsDataURL(file);
    });

    let debounce;
    $("#f-image")?.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const url = ($("#f-image")?.value || "").trim();
        if (url) {
          if ($("#f-file")) $("#f-file").value = "";
          setPreview(url);
        }
      }, 250);
    });

    $("#product-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const image = ($("#f-image-data")?.value || $("#f-image")?.value || "").trim();
      if (!image) return alert("Please upload an image or paste an image path/URL.");
      const stockQty = Number($("#f-stock").value) || 0;
      const data = normalizeProduct({
        id: $("#f-id").value ? Number($("#f-id").value) || $("#f-id").value : Date.now(),
        name: $("#f-name").value.trim(),
        sku: $("#f-sku").value.trim(),
        category: $("#f-category").value,
        price: Number($("#f-price").value),
        originalPrice: $("#f-compare").value ? Number($("#f-compare").value) : null,
        badge: $("#f-badge").value.trim() || null,
        image,
        images: [image],
        description: $("#f-desc").value.trim(),
        details: ($("#f-details").value || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        inStock: $("#f-instock").checked && stockQty > 0,
        active: $("#f-active").checked,
        stockQty,
        lowStockAt: Number($("#f-low").value) || 5,
        featured: $("#f-featured").checked
      });
      const list = getProducts();
      const idx = list.findIndex((p) => String(p.id) === String(data.id));
      if (idx >= 0) {
        data.rating = list[idx].rating;
        data.reviews = list[idx].reviews;
        list[idx] = data;
        log("Updated " + data.name);
      } else {
        list.push(data);
        log("Created " + data.name);
      }
      saveProducts(list);
      closeEditor();
      renderProducts();
    });

    $("#order-filter")?.addEventListener("change", renderOrders);
    $("#btn-refresh-orders")?.addEventListener("click", () => {
      renderOrders();
      log("Orders refreshed");
    });
    $("#btn-refresh-customers")?.addEventListener("click", () => {
      renderCustomers();
      log("Customers refreshed");
    });

    $("#coupon-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = $("#c-code").value.trim().toUpperCase();
      const type = $("#c-type").value;
      const value = Number($("#c-value").value);
      if (!code || !value) return;
      const list = getCoupons();
      if (list.some((c) => c.code === code)) return alert("That code already exists.");
      list.push({ code, type, value, active: true, createdAt: new Date().toISOString() });
      saveCoupons(list);
      log("Coupon " + code + " created");
      e.target.reset();
      renderCoupons();
    });

    function exportJSON() {
      const blob = new Blob([JSON.stringify(getProducts(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sky-products-" + Date.now() + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
      log("Exported products JSON");
    }
    $("#btn-export")?.addEventListener("click", exportJSON);
    $("#btn-export-2")?.addEventListener("click", exportJSON);

    $("#import-file")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      const msg = $("#import-msg");
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error("JSON must be an array of products.");
        saveProducts(data.map(normalizeProduct));
        if (msg) {
          msg.textContent = "Imported " + data.length + " products.";
          msg.className = "text-sm mt-3 status-ok";
        }
        log("Imported " + data.length + " products");
        renderProducts();
      } catch (err) {
        if (msg) {
          msg.textContent = err.message;
          msg.className = "text-sm mt-3 status-err";
        }
      }
      e.target.value = "";
    });

    $("#btn-seed")?.addEventListener("click", () => {
      const catalog = seedFromDataJs();
      const msg = $("#seed-msg");
      if (!catalog.length) {
        if (msg) {
          msg.textContent = "Could not load catalog. Hard refresh and try again.";
          msg.className = "text-sm mt-3 status-err";
        }
        return;
      }
      localStorage.removeItem(KEYS.products);
      if (window.SKY_CATALOG_VERSION) {
        localStorage.setItem(KEYS.catalogVersion, String(window.SKY_CATALOG_VERSION));
      }
      saveProducts(catalog);
      if (msg) {
        msg.textContent = "Loaded " + catalog.length + " products with photos.";
        msg.className = "text-sm mt-3 status-ok";
      }
      log("Seeded " + catalog.length + " products");
      renderProducts();
      renderDashboard();
    });

    $("#btn-reset")?.addEventListener("click", () => {
      if (!confirm("Reset local catalog overrides and reload defaults?")) return;
      localStorage.removeItem(KEYS.products);
      localStorage.removeItem(KEYS.catalogVersion);
      saveProducts(seedFromDataJs());
      const msg = $("#seed-msg");
      if (msg) {
        msg.textContent = "Reset to catalog defaults.";
        msg.className = "text-sm mt-3 status-ok";
      }
      log("Reset catalog overrides");
      renderProducts();
      renderDashboard();
    });
  }

  function boot() {
    initTheme();
    initPasswordToggle();
    bindEvents();
    if (sessionStorage.getItem(KEYS.session) === "1") {
      unlock(sessionStorage.getItem(KEYS.email) || "Admin");
    } else {
      showLogin();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
