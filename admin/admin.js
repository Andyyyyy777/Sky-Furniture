/**
 * Sky Furniture — Admin console (clean rebuild)
 * Products: localStorage sky_admin_products + data.js seed
 * Orders: sky_furniture_paid_orders
 * Coupons: sky_admin_coupons
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

  // ── helpers ────────────────────────────────────────────
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

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
    const clean = String(url).replace(/^\//, "");
    if (clean.startsWith("assets/")) return "../" + clean;
    return "../" + clean;
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
    const p = String(window.SKY_ADMIN_ACCESS?.localPassword || "").trim();
    return p || DEFAULT_PASS;
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
    const raw = window.SKY_PRODUCTS || window.PRODUCTS || [];
    return raw.map(normalizeProduct);
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

    // Patch broken/stale images from data.js
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

  // ── orders / customers / coupons ───────────────────────
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
    readJSON(KEYS.users, []).forEach((u) => {
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
    return readJSON(KEYS.coupons, []);
  }

  function saveCoupons(list) {
    writeJSON(KEYS.coupons, list);
  }

  // ── theme ──────────────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEYS.theme, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0f0e0d" : "#f3efe8";
  }

  function initTheme() {
    const saved = localStorage.getItem(KEYS.theme);
    const theme =
      saved === "dark" || saved === "light"
        ? saved
        : matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    applyTheme(theme);
    $$("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
      });
    });
    $("#btn-light")?.addEventListener("click", () => applyTheme("light"));
    $("#btn-dark")?.addEventListener("click", () => applyTheme("dark"));
  }

  // ── auth / views ───────────────────────────────────────
  function showLogin(err) {
    document.body.classList.remove("is-app");
    $("#login-screen").hidden = false;
    $("#app").hidden = true;
    $("#drawer").hidden = true;
    const errEl = $("#login-error");
    if (err) {
      errEl.hidden = false;
      errEl.textContent = err;
    } else {
      errEl.hidden = true;
      errEl.textContent = "";
    }
    setTimeout(() => $("#login-pass")?.focus(), 50);
  }

  function showApp(name) {
    document.body.classList.add("is-app");
    $("#login-screen").hidden = true;
    $("#app").hidden = false;
    $("#admin-name").textContent = name || "Admin";
    fillCategorySelects();
    showView("dashboard");
  }

  function unlock(name) {
    sessionStorage.setItem(KEYS.session, "1");
    if (name) sessionStorage.setItem(KEYS.email, name);
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
      el.hidden = el.id !== `view-${name}`;
    });
    $$(".nav-item[data-view]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === name);
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
    const daily = paid.filter((o) => orderTime(o) >= day).reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const weekly = paid.filter((o) => orderTime(o) >= week).reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const revenue = paid.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const low = products.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt).length;
    const oos = products.filter((p) => p.stockQty <= 0).length;
    const active = products.filter((p) => p.active).length;

    $("#kpi-grid").innerHTML = [
      { label: "Today", value: money(daily), sub: `${paid.filter((o) => orderTime(o) >= day).length} paid` },
      { label: "This week", value: money(weekly), sub: `${paid.filter((o) => orderTime(o) >= week).length} paid` },
      { label: "All revenue", value: money(revenue), sub: `${orders.length} orders` },
      { label: "Customers", value: String(customers.length), sub: "Sign-ups & buyers" },
      { label: "Products", value: String(products.length), sub: `${active} active` },
      { label: "Stock alerts", value: String(low), sub: oos ? `${oos} out of stock` : "Healthy", warn: low || oos }
    ]
      .map(
        (k) => `
      <div class="kpi${k.warn ? " warn" : ""}">
        <div class="label">${esc(k.label)}</div>
        <div class="value">${esc(k.value)}</div>
        <div class="sub">${esc(k.sub)}</div>
      </div>`
      )
      .join("");

    const recent = [...orders].sort((a, b) => orderTime(b) - orderTime(a)).slice(0, 6);
    $("#dash-orders").innerHTML = recent.length
      ? recent
          .map(
            (o) => `
        <div class="list-row">
          <span class="truncate">${esc(o.orderNumber || o.paymentRef || o.id || "Order")} · ${esc(o.customer?.fullName || o.customer?.email || "")}</span>
          <strong class="money">${money(o.totals?.total)}</strong>
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
          <strong style="color:var(--danger)">${p.stockQty} left</strong>
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
    $("#product-count").textContent = `Showing ${list.length} of ${getProducts().length}`;

    const body = $("#products-body");
    if (!list.length) {
      body.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--muted)">No products match. Use Tools → Load catalog.</td></tr>`;
      return;
    }

    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty > 0 && p.stockQty <= p.lowStockAt;
        const label = !p.active ? "Hidden" : p.stockQty <= 0 ? "OOS" : low ? "Low" : "Active";
        const badge =
          label === "OOS"
            ? "danger"
            : label === "Low"
              ? "warn"
              : label === "Active"
                ? "ok"
                : "";
        return `
      <tr>
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(assetUrl(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <div>
              <div class="name">${esc(p.name)}</div>
              <div class="tags">
                ${p.badge ? `<span>${esc(p.badge)}</span>` : ""}
                ${p.featured ? `<span>Featured</span>` : ""}
              </div>
            </div>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td>${esc(catLabel(p.category))}</td>
        <td class="money">${money(p.price)}${p.originalPrice ? `<span class="strike">${money(p.originalPrice)}</span>` : ""}</td>
        <td class="money" style="${p.stockQty <= 0 ? "color:var(--danger)" : low ? "color:var(--warn)" : ""}">${p.stockQty}</td>
        <td><span class="badge ${badge}">${label}</span></td>
        <td class="row-actions">
          <button type="button" data-edit="${p.id}" class="primary">Edit</button>
          <button type="button" data-dup="${p.id}">Dup</button>
          <button type="button" data-del="${p.id}" class="danger">Del</button>
        </td>
      </tr>`;
      })
      .join("");

    body.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => openEditor(getProducts().find((p) => String(p.id) === btn.dataset.edit)));
    });
    body.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("Delete this product?")) return;
        saveProducts(getProducts().filter((p) => String(p.id) !== btn.dataset.del));
        log(`Deleted product #${btn.dataset.del}`);
        renderProducts();
        renderDashboard();
      });
    });
    body.querySelectorAll("[data-dup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = getProducts().find((p) => String(p.id) === btn.dataset.dup);
        if (!src) return;
        const copy = normalizeProduct({
          ...src,
          id: Date.now(),
          name: src.name + " (copy)",
          sku: (src.sku || "SF") + "-C"
        });
        const list2 = getProducts();
        list2.push(copy);
        saveProducts(list2);
        log(`Duplicated ${src.name}`);
        renderProducts();
      });
    });
  }

  function setPreview(src) {
    const img = $("#f-preview");
    const empty = $("#f-preview-empty");
    const data = $("#f-image-data");
    if (src) {
      img.src = assetUrl(src);
      img.hidden = false;
      empty.hidden = true;
      if (data) data.value = src;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
      empty.hidden = false;
      if (data) data.value = "";
    }
  }

  function openEditor(product) {
    $("#product-editor").hidden = false;
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
    $("#f-file").value = "";
    const img = product?.image || "";
    $("#f-image").value = img.startsWith("data:") ? "" : img;
    setPreview(img);
    $("#product-editor").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeEditor() {
    $("#product-editor").hidden = true;
  }

  function renderInventory() {
    const list = [...getProducts()].sort((a, b) => a.stockQty - b.stockQty);
    $("#inventory-body").innerHTML = list
      .map((p) => {
        const low = p.stockQty <= p.lowStockAt;
        const label = p.stockQty <= 0 ? "Out of stock" : low ? "Low stock" : "OK";
        const badge = p.stockQty <= 0 ? "danger" : low ? "warn" : "ok";
        return `
      <tr class="${low ? "low" : ""}">
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(assetUrl(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <span class="name">${esc(p.name)}</span>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td class="money" style="${p.stockQty <= 0 ? "color:var(--danger)" : ""}">${p.stockQty}</td>
        <td class="money muted">${p.lowStockAt}</td>
        <td><span class="badge ${badge}">${label}</span></td>
        <td>
          <div class="qty-btns">
            <button type="button" data-inv="${p.id}" data-d="-1">−</button>
            <button type="button" data-inv="${p.id}" data-d="1">+</button>
            <button type="button" data-inv="${p.id}" data-d="10">+10</button>
          </div>
        </td>
      </tr>`;
      })
      .join("");

    $$("#inventory-body [data-inv]").forEach((btn) => {
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
    $("#orders-meta").textContent = `${orders.length} order(s)`;

    if (!orders.length) {
      $("#orders-list").innerHTML = `<div class="card"><p class="empty">No orders for this filter yet.</p></div>`;
      return;
    }

    $("#orders-list").innerHTML = orders
      .map((o, idx) => {
        const id = o.orderNumber || o.paymentRef || o.id || `local-${idx}`;
        const status = o.status || "paid";
        const date = o.createdAt ? new Date(o.createdAt).toLocaleString("en-NG") : "—";
        const items = Array.isArray(o.items) ? o.items : [];
        const preview = items
          .slice(0, 3)
          .map((i) => `${esc(i.name || "Item")} ×${i.quantity || i.qty || 1}`)
          .join(" · ");
        return `
      <article class="card order-card">
        <div>
          <strong class="mono">${esc(id)}</strong>
          <div class="meta">${esc(o.customer?.fullName || "")} · ${esc(o.customer?.email || o.userEmail || "")} · ${esc(o.customer?.phone || "")}</div>
          <div class="meta">${esc(date)}</div>
          <div style="margin-top:8px;font-weight:600">${money(o.totals?.total)} · ${esc(o.payment || "Paystack")}</div>
          <div class="meta">${esc([o.customer?.address, o.customer?.lga, o.customer?.state].filter(Boolean).join(", "))}</div>
          ${preview ? `<div class="meta" style="margin-top:6px">${preview}</div>` : ""}
        </div>
        <div class="order-side">
          <select class="input order-status" data-id="${esc(id)}" style="width:auto;min-width:140px">
            ${["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]
              .map((s) => `<option value="${s}" ${status === s ? "selected" : ""}>${s}</option>`)
              .join("")}
          </select>
        </div>
      </article>`;
      })
      .join("");

    $$(".order-status").forEach((sel) => {
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
        renderDashboard();
      });
    });
  }

  function renderCustomers() {
    const list = getCustomers();
    $("#customers-meta").textContent = `${list.length} customer(s)`;
    if (!list.length) {
      $("#customers-list").innerHTML = `<div class="row"><p class="empty" style="padding:8px">No customers yet.</p></div>`;
      return;
    }
    $("#customers-list").innerHTML = list
      .map(
        (c) => `
      <div class="row">
        <div>
          <strong>${esc(c.name || "Customer")}</strong>
          <div class="meta" style="color:var(--muted);font-size:12.5px;margin-top:2px">${esc(c.email)} · ${esc(c.phone || "—")}</div>
          <div class="meta" style="color:var(--muted);font-size:11.5px;margin-top:2px">Source: ${esc(c.source)}</div>
        </div>
        <div style="text-align:right">
          <strong class="money">${money(c.totalSpent)}</strong>
          <div style="color:var(--muted);font-size:12px">${c.orderCount} order(s)</div>
        </div>
      </div>`
      )
      .join("");
  }

  function renderCoupons() {
    const list = getCoupons();
    if (!list.length) {
      $("#coupons-list").innerHTML = `<div class="card"><p class="empty">No coupons yet. Create WELCOME10 for 10% off.</p></div>`;
      return;
    }
    $("#coupons-list").innerHTML = list
      .map(
        (c, i) => `
      <div class="card" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center">
        <div>
          <strong class="mono" style="letter-spacing:.04em">${esc(c.code)}</strong>
          <div class="meta" style="color:var(--muted);font-size:12.5px;margin-top:4px">
            ${c.type === "percent" ? c.value + "% off" : money(c.value) + " off"}
            · <span class="badge ${c.active === false ? "" : "ok"}">${c.active === false ? "Disabled" : "Active"}</span>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-ghost" data-cp-toggle="${i}">${c.active === false ? "Enable" : "Disable"}</button>
          <button type="button" class="btn btn-ghost" data-cp-del="${i}" style="color:var(--danger)">Delete</button>
        </div>
      </div>`
      )
      .join("");

    $$("[data-cp-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const list2 = getCoupons();
        list2.splice(Number(btn.dataset.cpDel), 1);
        saveCoupons(list2);
        log("Deleted coupon");
        renderCoupons();
      });
    });
    $$("[data-cp-toggle]").forEach((btn) => {
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
    panel.innerHTML = "";
    $$("#sidebar-nav .nav-item").forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.addEventListener("click", () => showView(clone.dataset.view));
      panel.appendChild(clone);
    });
    const shop = document.createElement("a");
    shop.href = "../shop.html";
    shop.target = "_blank";
    shop.rel = "noopener";
    shop.className = "nav-item";
    shop.textContent = "Open shop ↗";
    panel.appendChild(shop);
    const out = document.createElement("button");
    out.type = "button";
    out.className = "nav-item danger";
    out.textContent = "Sign out";
    out.addEventListener("click", logout);
    panel.appendChild(out);
    drawer.hidden = false;
  }

  function closeDrawer() {
    $("#drawer").hidden = true;
  }

  // ── events ─────────────────────────────────────────────
  function bindEvents() {
    $("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const pass = ($("#login-pass")?.value || "").trim();
      if (!pass) return showLogin("Please enter your password.");
      if (pass !== password()) {
        $("#login-pass").value = "";
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
      if ($("#app")?.hidden) return;
      e.preventDefault();
      showView(btn.dataset.view);
    });

    $("#product-search")?.addEventListener("input", renderProducts);
    $("#product-cat")?.addEventListener("change", renderProducts);
    $("#product-status")?.addEventListener("change", renderProducts);
    $("#btn-add-product")?.addEventListener("click", () => openEditor(null));
    $("#btn-cancel-edit")?.addEventListener("click", closeEditor);

    $("#f-file")?.addEventListener("change", async () => {
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
          $("#f-image").value = "";
          setPreview(dataUrl);
        };
        img.onerror = () => setPreview(raw);
        img.src = raw;
      };
      reader.readAsDataURL(file);
    });

    let t;
    $("#f-image")?.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const url = $("#f-image").value.trim();
        if (url) {
          $("#f-file").value = "";
          setPreview(url);
        }
      }, 300);
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
        log(`Updated ${data.name}`);
      } else {
        list.push(data);
        log(`Created ${data.name}`);
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
      log(`Coupon ${code} created`);
      e.target.reset();
      renderCoupons();
    });

    function exportJSON() {
      const blob = new Blob([JSON.stringify(getProducts(), null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `sky-products-${Date.now()}.json`;
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
        msg.textContent = `Imported ${data.length} products.`;
        msg.className = "status ok";
        log(`Imported ${data.length} products`);
        renderProducts();
      } catch (err) {
        msg.textContent = err.message;
        msg.className = "status err";
      }
      e.target.value = "";
    });

    $("#btn-seed")?.addEventListener("click", () => {
      const catalog = seedFromDataJs();
      const msg = $("#seed-msg");
      if (!catalog.length) {
        msg.textContent = "Could not load catalog. Hard refresh and try again.";
        msg.className = "status err";
        return;
      }
      localStorage.removeItem(KEYS.products);
      if (window.SKY_CATALOG_VERSION) {
        localStorage.setItem(KEYS.catalogVersion, String(window.SKY_CATALOG_VERSION));
      }
      saveProducts(catalog);
      msg.textContent = `Loaded ${catalog.length} products with photos.`;
      msg.className = "status ok";
      log(`Seeded ${catalog.length} products`);
      renderProducts();
      renderDashboard();
    });

    $("#btn-reset")?.addEventListener("click", () => {
      if (!confirm("Reset local catalog overrides and reload defaults?")) return;
      localStorage.removeItem(KEYS.products);
      localStorage.removeItem(KEYS.catalogVersion);
      saveProducts(seedFromDataJs());
      $("#seed-msg").textContent = "Reset to catalog defaults.";
      $("#seed-msg").className = "status ok";
      log("Reset catalog overrides");
      renderProducts();
      renderDashboard();
    });
  }

  // ── boot ───────────────────────────────────────────────
  function boot() {
    initTheme();
    bindEvents();
    // Always start on login unless session exists
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
