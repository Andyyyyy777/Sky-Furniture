/**
 * Sky Furniture Admin — luxurious console (full rebuild)
 */
(function () {
  "use strict";

  const K = {
    products: "sky_admin_products",
    orders: "sky_furniture_paid_orders",
    coupons: "sky_admin_coupons",
    activity: "sky_admin_activity",
    session: "sky_admin_ok",
    email: "sky_admin_email",
    theme: "sky_furniture_theme",
    catalog: "sky_catalog_version",
    users: "sky_users",
    fromAdmin: "sky_from_admin"
  };

  const DEFAULT_PASS = "SkyAdmin2026";
  const CATS = [
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

  const money = (n) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(Number(n) || 0);

  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const catLabel = (id) => CATS.find((c) => c.id === id)?.label || id || "—";

  function asset(url) {
    if (!url) return "";
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return "../" + String(url).replace(/^\//, "");
  }

  function read(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function pass() {
    return String(window.SKY_ADMIN_ACCESS?.localPassword || "").trim() || DEFAULT_PASS;
  }

  function log(msg) {
    const list = read(K.activity, []);
    list.unshift({ t: new Date().toISOString(), msg });
    write(K.activity, list.slice(0, 80));
    renderActivity();
  }

  // ── products ───────────────────────────────────────────
  function norm(p) {
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

  function seed() {
    return (window.SKY_PRODUCTS || window.PRODUCTS || []).map(norm);
  }

  function getProducts() {
    const live = String(window.SKY_CATALOG_VERSION || "");
    try {
      const saved = localStorage.getItem(K.catalog) || "";
      if (live && saved !== live) {
        localStorage.removeItem(K.products);
        localStorage.setItem(K.catalog, live);
      }
    } catch (_) {}

    let list = read(K.products, null);
    if (!Array.isArray(list) || !list.length) {
      list = seed();
      if (list.length) saveProducts(list, false);
      return list;
    }

    const byId = new Map(seed().map((p) => [String(p.id), p]));
    let changed = false;
    list = list.map((raw) => {
      const p = norm(raw);
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
    const next = list.map(norm);
    write(K.products, next);
    try {
      if (window.SKY_CATALOG_VERSION) localStorage.setItem(K.catalog, String(window.SKY_CATALOG_VERSION));
    } catch (_) {}
    if (doLog) log("Catalog saved (" + next.length + " products)");
    return next;
  }

  function getOrders() {
    const list = read(K.orders, []);
    return Array.isArray(list) ? list : [];
  }

  function saveOrders(list) {
    write(K.orders, list || []);
  }

  function orderTime(o) {
    const t = Date.parse(o.createdAt || o.updatedAt || 0);
    return Number.isFinite(t) ? t : 0;
  }

  function isRevenue(o) {
    return o.status !== "cancelled" && o.status !== "pending_payment";
  }

  function startDay(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }

  function startWeek(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay();
    x.setDate(x.getDate() - (day === 0 ? 6 : day - 1));
    return x.getTime();
  }

  function getCustomers() {
    const map = new Map();
    (read(K.users, []) || []).forEach((u) => {
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
    return read(K.coupons, []) || [];
  }

  function saveCoupons(list) {
    write(K.coupons, list);
  }

  // ── theme ──────────────────────────────────────────────
  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(K.theme, next);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#100e0c" : "#1a1612";
    $$("[data-theme]").forEach((btn) => {
      btn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      btn.title = next === "dark" ? "Light mode" : "Dark mode";
      btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function initTheme() {
    let theme = "light";
    try {
      const saved = localStorage.getItem(K.theme);
      if (saved === "dark" || saved === "light") theme = saved;
      else if (matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
    } catch (_) {}
    applyTheme(theme);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-theme]");
      if (!btn) return;
      e.preventDefault();
      applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark");
    });

    $("#theme-light")?.addEventListener("click", () => applyTheme("light"));
    $("#theme-dark")?.addEventListener("click", () => applyTheme("dark"));
  }

  function initPassToggle() {
    const input = $("#pass");
    const btn = $("#pass-toggle");
    if (!input || !btn) return;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus();
    });
  }

  // ── auth / pages ───────────────────────────────────────
  function showLogin(err) {
    document.body.classList.remove("is-app");
    $("#login").hidden = false;
    $("#app").hidden = true;
    $("#drawer").hidden = true;
    const el = $("#login-err");
    if (err) {
      el.hidden = false;
      el.textContent = err;
    } else {
      el.hidden = true;
      el.textContent = "";
    }
    setTimeout(() => $("#pass")?.focus(), 40);
  }

  function showApp(name) {
    document.body.classList.add("is-app");
    $("#login").hidden = true;
    $("#app").hidden = false;
    if ($("#who")) $("#who").textContent = name || "Admin";
    fillCats();
    go("dashboard");
  }

  function unlock(name) {
    sessionStorage.setItem(K.session, "1");
    sessionStorage.setItem(K.email, name || "Admin");
    sessionStorage.setItem(K.fromAdmin, "1");
    showApp(name || "Admin");
  }

  function logout() {
    sessionStorage.removeItem(K.session);
    sessionStorage.removeItem(K.email);
    sessionStorage.removeItem(K.fromAdmin);
    showLogin();
  }

  function go(page) {
    $$(".page").forEach((el) => {
      el.hidden = el.id !== "page-" + page;
    });
    $$("[data-page]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.page === page);
    });
    closeDrawer();
    if (page === "dashboard") renderDashboard();
    if (page === "products") renderProducts();
    if (page === "inventory") renderInventory();
    if (page === "orders") renderOrders();
    if (page === "customers") renderCustomers();
    if (page === "coupons") renderCoupons();
    if (page === "tools") renderActivity();
  }

  function fillCats() {
    const opts = CATS.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    const filter =
      `<option value="all">All categories</option>` +
      CATS.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    if ($("#filter-cat")) $("#filter-cat").innerHTML = filter;
    if ($("#p-cat")) $("#p-cat").innerHTML = opts;
  }

  // ── renders ────────────────────────────────────────────
  function renderDashboard() {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();
    const day = startDay();
    const week = startWeek();
    const paid = orders.filter(isRevenue);
    const today = paid.filter((o) => orderTime(o) >= day);
    const thisWeek = paid.filter((o) => orderTime(o) >= week);
    const daily = today.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const weekly = thisWeek.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const revenue = paid.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const low = products.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt).length;
    const oos = products.filter((p) => p.stockQty <= 0).length;
    const active = products.filter((p) => p.active).length;
    const withPhoto = products.filter((p) => p.image && !/\.svg$/i.test(p.image)).length;

    const cards = [
      { label: "Today", value: money(daily), sub: today.length + " paid orders" },
      { label: "This week", value: money(weekly), sub: thisWeek.length + " paid orders" },
      { label: "All revenue", value: money(revenue), sub: orders.length + " total orders" },
      { label: "Customers", value: String(customers.length), sub: "Accounts & buyers" },
      { label: "Products", value: String(products.length), sub: active + " active · " + withPhoto + " photos" },
      { label: "Stock alerts", value: String(low), sub: oos ? oos + " out of stock" : "Levels healthy", warn: low || oos }
    ];

    $("#kpis").innerHTML = cards
      .map(
        (c) => `
      <div class="kpi${c.warn ? " is-warn" : ""}">
        <div class="kpi__label">${esc(c.label)}</div>
        <div class="kpi__value">${esc(c.value)}</div>
        <div class="kpi__sub">${esc(c.sub)}</div>
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
          <strong class="text-danger money">${p.stockQty} left</strong>
        </div>`
          )
          .join("")
      : `<p class="empty">Stock levels look healthy.</p>`;

    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    $("#dash-cats").innerHTML = CATS.map(
      (c) => `<span class="chip">${esc(c.label)} <strong>${counts[c.id] || 0}</strong></span>`
    ).join("");
  }

  function renderProducts() {
    let list = getProducts();
    const q = ($("#q")?.value || "").toLowerCase().trim();
    const cat = $("#filter-cat")?.value || "all";
    const status = $("#filter-status")?.value || "all";

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
    if (status === "featured") list = list.filter((p) => p.featured);

    list = [...list].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    if ($("#product-meta")) $("#product-meta").textContent = "Showing " + list.length + " of " + getProducts().length;

    const body = $("#products-tbody");
    if (!body) return;
    if (!list.length) {
      body.innerHTML =
        '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--muted)">No products match. Use Tools → Load catalog + photos.</td></tr>';
      return;
    }

    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty > 0 && p.stockQty <= p.lowStockAt;
        const label = !p.active ? "Hidden" : p.stockQty <= 0 ? "OOS" : low ? "Low" : "Active";
        const badge =
          label === "OOS"
            ? "badge--danger"
            : label === "Low"
              ? "badge--warn"
              : label === "Active"
                ? "badge--ok"
                : "";
        return `
      <tr>
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(asset(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <div>
              <div class="prod__name">${esc(p.name)}</div>
              <div class="prod__tags">
                ${p.badge ? "<span>" + esc(p.badge) + "</span>" : ""}
                ${p.featured ? "<span>Featured</span>" : ""}
              </div>
            </div>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td>${esc(catLabel(p.category))}</td>
        <td class="money">${money(p.price)}${
          p.originalPrice ? '<span class="strike">' + money(p.originalPrice) + "</span>" : ""
        }</td>
        <td class="money ${p.stockQty <= 0 ? "text-danger" : low ? "text-warn" : ""}">${p.stockQty}</td>
        <td><span class="badge ${badge}">${label}</span></td>
        <td class="row-actions">
          <button type="button" class="primary" data-edit="${p.id}">Edit</button>
          <button type="button" data-dup="${p.id}">Dup</button>
          <button type="button" class="danger" data-del="${p.id}">Del</button>
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
          norm({
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
    const img = $("#p-preview");
    const empty = $("#p-preview-empty");
    const data = $("#p-image-data");
    if (!img || !empty) return;
    if (src) {
      img.src = asset(src);
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
    const wrap = $("#editor");
    if (!wrap) return;
    wrap.hidden = false;
    $("#editor-title").textContent = product ? "Edit product" : "New product";
    $("#p-id").value = product?.id ?? "";
    $("#p-name").value = product?.name || "";
    $("#p-sku").value = product?.sku || "";
    $("#p-cat").value = product?.category || "living-room";
    $("#p-price").value = product?.price ?? "";
    $("#p-compare").value = product?.originalPrice ?? "";
    $("#p-stock").value = product?.stockQty ?? 20;
    $("#p-low").value = product?.lowStockAt ?? 5;
    $("#p-badge").value = product?.badge || "";
    $("#p-featured").checked = Boolean(product?.featured);
    $("#p-desc").value = product?.description || "";
    $("#p-details").value = (product?.details || []).join("\n");
    $("#p-instock").checked = product?.inStock !== false;
    $("#p-active").checked = product?.active !== false;
    if ($("#p-file")) $("#p-file").value = "";
    const img = product?.image || "";
    if ($("#p-image")) $("#p-image").value = img.startsWith("data:") ? "" : img;
    setPreview(img);
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeEditor() {
    if ($("#editor")) $("#editor").hidden = true;
  }

  function renderInventory() {
    const body = $("#inventory-tbody");
    if (!body) return;
    const list = [...getProducts()].sort((a, b) => a.stockQty - b.stockQty);
    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty <= p.lowStockAt;
        const label = p.stockQty <= 0 ? "Out of stock" : low ? "Low stock" : "OK";
        const badge = p.stockQty <= 0 ? "badge--danger" : low ? "badge--warn" : "badge--ok";
        return `
      <tr class="${low ? "is-low" : ""}">
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(asset(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <span class="prod__name">${esc(p.name)}</span>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td class="money ${p.stockQty <= 0 ? "text-danger" : ""}">${p.stockQty}</td>
        <td class="money mono">${p.lowStockAt}</td>
        <td><span class="badge ${badge}">${label}</span></td>
        <td>
          <div class="qty">
            <button type="button" data-inv="${p.id}" data-d="-1">−</button>
            <button type="button" data-inv="${p.id}" data-d="1">+</button>
            <button type="button" data-inv="${p.id}" data-d="10">+10</button>
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
          return norm({ ...p, stockQty, inStock: stockQty > 0 });
        });
        saveProducts(next, false);
        log("Stock adjust #" + id + " (" + (d > 0 ? "+" : "") + d + ")");
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
      root.innerHTML = '<div class="panel"><p class="empty">No orders for this filter yet.</p></div>';
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
          .map((i) => esc(i.name || "Item") + " ×" + (i.quantity || i.qty || 1))
          .join(" · ");
        return `
      <article class="panel order-card">
        <div>
          <strong class="mono" style="color:var(--ink)">${esc(id)}</strong>
          <div class="meta">${esc(o.customer?.fullName || "")} · ${esc(o.customer?.email || o.userEmail || "")} · ${esc(o.customer?.phone || "")}</div>
          <div class="meta">${esc(date)}</div>
          <div style="margin-top:8px;font-weight:600">${money(o.totals?.total)} · ${esc(o.payment || "Paystack")}</div>
          <div class="meta">${esc([o.customer?.address, o.customer?.lga, o.customer?.state].filter(Boolean).join(", "))}</div>
          ${preview ? '<div class="meta" style="margin-top:6px">' + preview + "</div>" : ""}
        </div>
        <div>
          <select class="input order-status" data-id="${esc(id)}" style="width:auto;min-width:150px">
            ${["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]
              .map((s) => '<option value="' + s + '"' + (status === s ? " selected" : "") + ">" + s + "</option>")
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
        log("Order " + id + " → " + status);
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
      root.innerHTML = '<div class="customer-row"><p class="empty">No customers yet.</p></div>';
      return;
    }
    root.innerHTML = list
      .map(
        (c) => `
      <div class="customer-row">
        <div>
          <strong>${esc(c.name || "Customer")}</strong>
          <div class="meta" style="color:var(--muted);font-size:12.5px;margin-top:3px">${esc(c.email)} · ${esc(c.phone || "—")}</div>
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
    const root = $("#coupons-list");
    if (!root) return;
    const list = getCoupons();
    if (!list.length) {
      root.innerHTML = '<div class="panel"><p class="empty">No coupons yet. Create WELCOME10 for 10% off.</p></div>';
      return;
    }
    root.innerHTML = list
      .map(
        (c, i) => `
      <div class="panel" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center">
        <div>
          <strong class="mono" style="color:var(--ink);letter-spacing:.06em">${esc(c.code)}</strong>
          <div class="meta" style="color:var(--muted);font-size:12.5px;margin-top:4px">
            ${c.type === "percent" ? c.value + "% off" : money(c.value) + " off"}
            · <span class="badge ${c.active === false ? "" : "badge--ok"}">${c.active === false ? "Disabled" : "Active"}</span>
          </div>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn--ghost" data-cp-toggle="${i}">${c.active === false ? "Enable" : "Disable"}</button>
          <button type="button" class="btn btn--ghost text-danger" data-cp-del="${i}">Delete</button>
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
    const list = read(K.activity, []);
    el.innerHTML = list.length
      ? list
          .map((a) => "<div>" + esc((a.t || "").slice(0, 19).replace("T", " ")) + " — " + esc(a.msg) + "</div>")
          .join("")
      : "<div>No activity yet.</div>";
  }

  // ── drawer ─────────────────────────────────────────────
  function openDrawer() {
    const drawer = $("#drawer");
    const panel = $("#drawer-nav");
    if (!drawer || !panel) return;
    panel.innerHTML = "";
    $$("#nav [data-page]").forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.addEventListener("click", () => go(clone.dataset.page));
      panel.appendChild(clone);
    });
    const shop = document.createElement("a");
    shop.href = "../shop.html";
    shop.target = "_blank";
    shop.rel = "noopener";
    shop.className = "nav-link";
    shop.textContent = "Shop ↗";
    panel.appendChild(shop);
    const out = document.createElement("button");
    out.type = "button";
    out.className = "nav-link nav-link--danger";
    out.textContent = "Sign out";
    out.addEventListener("click", logout);
    panel.appendChild(out);
    drawer.hidden = false;
  }

  function closeDrawer() {
    if ($("#drawer")) $("#drawer").hidden = true;
  }

  // ── events ─────────────────────────────────────────────
  function bind() {
    $("#login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = ($("#pass")?.value || "").trim();
      if (!value) return showLogin("Please enter your password.");
      if (value !== pass()) {
        if ($("#pass")) $("#pass").value = "";
        return showLogin("Incorrect password. Try again.");
      }
      unlock("Admin");
    });

    $("#logout")?.addEventListener("click", logout);
    $("#menu-open")?.addEventListener("click", openDrawer);
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeDrawer));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn || !btn.dataset.page) return;
      if (!document.body.classList.contains("is-app")) return;
      if (btn.tagName === "A" && btn.getAttribute("href")) return;
      e.preventDefault();
      go(btn.dataset.page);
    });

    $("#q")?.addEventListener("input", renderProducts);
    $("#filter-cat")?.addEventListener("change", renderProducts);
    $("#filter-status")?.addEventListener("change", renderProducts);
    $("#add-product")?.addEventListener("click", () => openEditor(null));
    $("#editor-cancel")?.addEventListener("click", closeEditor);

    $("#p-file")?.addEventListener("change", () => {
      const file = $("#p-file").files?.[0];
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
          if (w > 1200) {
            h = Math.round((h * 1200) / w);
            w = 1200;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          if ($("#p-image")) $("#p-image").value = "";
          setPreview(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => setPreview(raw);
        img.src = raw;
      };
      reader.readAsDataURL(file);
    });

    let t;
    $("#p-image")?.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const url = ($("#p-image")?.value || "").trim();
        if (url) {
          if ($("#p-file")) $("#p-file").value = "";
          setPreview(url);
        }
      }, 250);
    });

    $("#product-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const image = ($("#p-image-data")?.value || $("#p-image")?.value || "").trim();
      if (!image) return alert("Please upload an image or paste a path/URL.");
      const stockQty = Number($("#p-stock").value) || 0;
      const data = norm({
        id: $("#p-id").value ? Number($("#p-id").value) || $("#p-id").value : Date.now(),
        name: $("#p-name").value.trim(),
        sku: $("#p-sku").value.trim(),
        category: $("#p-cat").value,
        price: Number($("#p-price").value),
        originalPrice: $("#p-compare").value ? Number($("#p-compare").value) : null,
        badge: $("#p-badge").value.trim() || null,
        image,
        images: [image],
        description: $("#p-desc").value.trim(),
        details: ($("#p-details").value || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        inStock: $("#p-instock").checked && stockQty > 0,
        active: $("#p-active").checked,
        stockQty,
        lowStockAt: Number($("#p-low").value) || 5,
        featured: $("#p-featured").checked
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
    $("#orders-refresh")?.addEventListener("click", () => {
      renderOrders();
      log("Orders refreshed");
    });
    $("#customers-refresh")?.addEventListener("click", () => {
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
    $("#export-json")?.addEventListener("click", exportJSON);
    $("#export-json-2")?.addEventListener("click", exportJSON);

    $("#import-json")?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      const msg = $("#import-msg");
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error("JSON must be an array of products.");
        saveProducts(data.map(norm));
        if (msg) {
          msg.textContent = "Imported " + data.length + " products.";
          msg.className = "msg is-ok";
        }
        log("Imported " + data.length + " products");
        renderProducts();
      } catch (err) {
        if (msg) {
          msg.textContent = err.message;
          msg.className = "msg is-err";
        }
      }
      e.target.value = "";
    });

    $("#btn-seed")?.addEventListener("click", () => {
      const catalog = seed();
      const msg = $("#seed-msg");
      if (!catalog.length) {
        if (msg) {
          msg.textContent = "Could not load catalog. Hard refresh and try again.";
          msg.className = "msg is-err";
        }
        return;
      }
      localStorage.removeItem(K.products);
      if (window.SKY_CATALOG_VERSION) localStorage.setItem(K.catalog, String(window.SKY_CATALOG_VERSION));
      saveProducts(catalog);
      if (msg) {
        msg.textContent = "Loaded " + catalog.length + " products with photos.";
        msg.className = "msg is-ok";
      }
      log("Seeded " + catalog.length + " products");
      renderProducts();
      renderDashboard();
    });

    $("#btn-reset")?.addEventListener("click", () => {
      if (!confirm("Reset local catalog overrides and reload defaults?")) return;
      localStorage.removeItem(K.products);
      localStorage.removeItem(K.catalog);
      saveProducts(seed());
      const msg = $("#seed-msg");
      if (msg) {
        msg.textContent = "Reset to catalog defaults.";
        msg.className = "msg is-ok";
      }
      log("Reset catalog overrides");
      renderProducts();
      renderDashboard();
    });
  }

  function boot() {
    initTheme();
    initPassToggle();
    bind();
    if (sessionStorage.getItem(K.session) === "1") {
      unlock(sessionStorage.getItem(K.email) || "Admin");
    } else {
      showLogin();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
