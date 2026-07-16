/**
 * Sky Furniture Admin — control room
 * Products: localStorage sky_admin_products + data.js
 * Orders: sky_furniture_paid_orders
 */
(function () {
  "use strict";

  const KEY = {
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

  const PASS_DEFAULT = "SkyAdmin2026";
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

  function read(key, fb) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v == null ? fb : v;
    } catch {
      return fb;
    }
  }

  function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function password() {
    return String(window.SKY_ADMIN_ACCESS?.localPassword || "").trim() || PASS_DEFAULT;
  }

  function log(msg) {
    const list = read(KEY.activity, []);
    list.unshift({ t: new Date().toISOString(), msg });
    write(KEY.activity, list.slice(0, 80));
    renderActivity();
  }

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
      const saved = localStorage.getItem(KEY.catalog) || "";
      if (live && saved !== live) {
        localStorage.removeItem(KEY.products);
        localStorage.setItem(KEY.catalog, live);
      }
    } catch (_) {}

    let list = read(KEY.products, null);
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
    write(KEY.products, next);
    try {
      if (window.SKY_CATALOG_VERSION) localStorage.setItem(KEY.catalog, String(window.SKY_CATALOG_VERSION));
    } catch (_) {}
    if (doLog) log("Catalog saved (" + next.length + " products)");
    return next;
  }

  function getOrders() {
    const list = read(KEY.orders, []);
    return Array.isArray(list) ? list : [];
  }

  function saveOrders(list) {
    write(KEY.orders, list || []);
  }

  function orderTime(o) {
    const t = Date.parse(o.createdAt || o.updatedAt || 0);
    return Number.isFinite(t) ? t : 0;
  }

  function isRevenue(o) {
    return o.status !== "cancelled" && o.status !== "pending_payment";
  }

  function dayStart(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
  }

  function weekStart(d = new Date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay();
    x.setDate(x.getDate() - (day === 0 ? 6 : day - 1));
    return x.getTime();
  }

  function getCustomers() {
    const map = new Map();
    (read(KEY.users, []) || []).forEach((u) => {
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
    return read(KEY.coupons, []) || [];
  }

  function saveCoupons(list) {
    write(KEY.coupons, list);
  }

  // theme
  function applyTheme(theme) {
    const next = theme === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY.theme, next);
    } catch (_) {}
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === "dark" ? "#0f0d0b" : "#12100e";
    $$("[data-theme]").forEach((btn) => {
      btn.title = next === "dark" ? "Light mode" : "Dark mode";
      btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  }

  function initTheme() {
    let theme = "light";
    try {
      const saved = localStorage.getItem(KEY.theme);
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

  function initShowPass() {
    const input = $("#gate-pass");
    const btn = $("#gate-show");
    if (!input || !btn) return;
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      input.focus();
    });
  }

  // auth
  function showGate(err) {
    document.body.classList.remove("is-in");
    $("#gate").hidden = false;
    $("#app").hidden = true;
    $("#drawer").hidden = true;
    const el = $("#gate-err");
    if (err) {
      el.hidden = false;
      el.textContent = err;
    } else {
      el.hidden = true;
      el.textContent = "";
    }
    setTimeout(() => $("#gate-pass")?.focus(), 40);
  }

  function showApp(name) {
    document.body.classList.add("is-in");
    $("#gate").hidden = true;
    $("#app").hidden = false;
    if ($("#who")) $("#who").textContent = name || "Admin";
    fillCats();
    go("home");
  }

  function unlock(name) {
    sessionStorage.setItem(KEY.session, "1");
    sessionStorage.setItem(KEY.email, name || "Admin");
    sessionStorage.setItem(KEY.fromAdmin, "1");
    showApp(name || "Admin");
  }

  function logout() {
    sessionStorage.removeItem(KEY.session);
    sessionStorage.removeItem(KEY.email);
    sessionStorage.removeItem(KEY.fromAdmin);
    showGate();
  }

  function go(tab) {
    $$(".tab").forEach((el) => {
      el.hidden = el.id !== "tab-" + tab;
    });
    $$("[data-tab]").forEach((btn) => {
      btn.classList.toggle("is-on", btn.dataset.tab === tab);
    });
    closeDrawer();
    if (tab === "home") renderHome();
    if (tab === "products") renderProducts();
    if (tab === "stock") renderStock();
    if (tab === "orders") renderOrders();
    if (tab === "customers") renderCustomers();
    if (tab === "coupons") renderCoupons();
    if (tab === "tools") renderActivity();
  }

  function fillCats() {
    const opts = CATS.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    const filter =
      `<option value="all">All categories</option>` +
      CATS.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join("");
    if ($("#cat-filter")) $("#cat-filter").innerHTML = filter;
    if ($("#f-cat")) $("#f-cat").innerHTML = opts;
  }

  // renders
  function renderHome() {
    const products = getProducts();
    const orders = getOrders();
    const customers = getCustomers();
    const day = dayStart();
    const week = weekStart();
    const paid = orders.filter(isRevenue);
    const today = paid.filter((o) => orderTime(o) >= day);
    const thisWeek = paid.filter((o) => orderTime(o) >= week);
    const daily = today.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const weekly = thisWeek.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const revenue = paid.reduce((s, o) => s + (Number(o.totals?.total) || 0), 0);
    const low = products.filter((p) => p.stockQty > 0 && p.stockQty <= p.lowStockAt).length;
    const oos = products.filter((p) => p.stockQty <= 0).length;
    const active = products.filter((p) => p.active).length;
    const photos = products.filter((p) => p.image && !/\.svg$/i.test(p.image)).length;

    $("#kpis").innerHTML = [
      { l: "Today", v: money(daily), s: today.length + " paid" },
      { l: "This week", v: money(weekly), s: thisWeek.length + " paid" },
      { l: "All revenue", v: money(revenue), s: orders.length + " orders" },
      { l: "Customers", v: String(customers.length), s: "Accounts & buyers" },
      { l: "Products", v: String(products.length), s: active + " active · " + photos + " photos" },
      { l: "Stock alerts", v: String(low), s: oos ? oos + " out of stock" : "Healthy", w: low || oos }
    ]
      .map(
        (k) => `
      <div class="kpi${k.w ? " warn" : ""}">
        <div class="l">${esc(k.l)}</div>
        <div class="v">${esc(k.v)}</div>
        <div class="s">${esc(k.s)}</div>
      </div>`
      )
      .join("");

    const recent = [...orders].sort((a, b) => orderTime(b) - orderTime(a)).slice(0, 6);
    $("#home-orders").innerHTML = recent.length
      ? recent
          .map(
            (o) => `
        <div class="row">
          <span class="truncate">${esc(o.orderNumber || o.paymentRef || o.id || "Order")} · ${esc(o.customer?.fullName || o.customer?.email || "")}</span>
          <strong class="money">${money(o.totals?.total)}</strong>
        </div>`
          )
          .join("")
      : `<p class="empty">No orders yet.</p>`;

    const lowList = products.filter((p) => p.stockQty <= p.lowStockAt).slice(0, 8);
    $("#home-stock").innerHTML = lowList.length
      ? lowList
          .map(
            (p) => `
        <div class="row">
          <span class="truncate">${esc(p.name)}</span>
          <strong class="t-danger money">${p.stockQty} left</strong>
        </div>`
          )
          .join("")
      : `<p class="empty">Stock levels look healthy.</p>`;

    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    $("#home-cats").innerHTML = CATS.map(
      (c) => `<span class="chip">${esc(c.label)} <strong>${counts[c.id] || 0}</strong></span>`
    ).join("");
  }

  function renderProducts() {
    let list = getProducts();
    const q = ($("#search")?.value || "").toLowerCase().trim();
    const cat = $("#cat-filter")?.value || "all";
    const status = $("#status-filter")?.value || "all";

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
    if ($("#prod-count")) $("#prod-count").textContent = "Showing " + list.length + " of " + getProducts().length;

    const body = $("#prod-body");
    if (!body) return;
    if (!list.length) {
      body.innerHTML =
        '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--muted)">No products. Use Tools → Load catalog + photos.</td></tr>';
      return;
    }

    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty > 0 && p.stockQty <= p.lowStockAt;
        const label = !p.active ? "Hidden" : p.stockQty <= 0 ? "OOS" : low ? "Low" : "Active";
        const badge = label === "OOS" ? "danger" : label === "Low" ? "warn" : label === "Active" ? "ok" : "";
        return `
      <tr>
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(asset(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <div>
              <div class="pname">${esc(p.name)}</div>
              <div class="ptags">
                ${p.badge ? "<span>" + esc(p.badge) + "</span>" : ""}
                ${p.featured ? "<span>Featured</span>" : ""}
              </div>
            </div>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td>${esc(catLabel(p.category))}</td>
        <td class="money">${money(p.price)}${p.originalPrice ? '<span class="strike">' + money(p.originalPrice) + "</span>" : ""}</td>
        <td class="money ${p.stockQty <= 0 ? "t-danger" : low ? "t-warn" : ""}">${p.stockQty}</td>
        <td><span class="badge ${badge}">${label}</span></td>
        <td class="ra">
          <button type="button" class="p" data-edit="${p.id}">Edit</button>
          <button type="button" data-dup="${p.id}">Dup</button>
          <button type="button" class="d" data-del="${p.id}">Del</button>
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
        log("Deleted #" + btn.dataset.del);
        renderProducts();
      });
    });
    body.querySelectorAll("[data-dup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = getProducts().find((p) => String(p.id) === btn.dataset.dup);
        if (!src) return;
        const list2 = getProducts();
        list2.push(norm({ ...src, id: Date.now(), name: src.name + " (copy)", sku: (src.sku || "SF") + "-C" }));
        saveProducts(list2);
        log("Duplicated " + src.name);
        renderProducts();
      });
    });
  }

  function setPreview(src) {
    const img = $("#f-prev");
    const empty = $("#f-prev-empty");
    const data = $("#f-data");
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
    $("#f-id").value = product?.id ?? "";
    $("#f-name").value = product?.name || "";
    $("#f-sku").value = product?.sku || "";
    $("#f-cat").value = product?.category || "living-room";
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
    if ($("#f-url")) $("#f-url").value = img.startsWith("data:") ? "" : img;
    setPreview(img);
    wrap.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeEditor() {
    if ($("#editor")) $("#editor").hidden = true;
  }

  function renderStock() {
    const body = $("#stock-body");
    if (!body) return;
    const list = [...getProducts()].sort((a, b) => a.stockQty - b.stockQty);
    body.innerHTML = list
      .map((p) => {
        const low = p.stockQty <= p.lowStockAt;
        const label = p.stockQty <= 0 ? "Out of stock" : low ? "Low stock" : "OK";
        const badge = p.stockQty <= 0 ? "danger" : low ? "warn" : "ok";
        return `
      <tr class="${low ? "low" : ""}">
        <td>
          <div class="prod">
            <img class="thumb" src="${esc(asset(p.image))}" alt="" loading="lazy" onerror="this.style.opacity=.3" />
            <span class="pname">${esc(p.name)}</span>
          </div>
        </td>
        <td class="mono">${esc(p.sku || "—")}</td>
        <td class="money ${p.stockQty <= 0 ? "t-danger" : ""}">${p.stockQty}</td>
        <td class="mono">${p.lowStockAt}</td>
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
        log("Stock #" + id + " " + (d > 0 ? "+" : "") + d);
        renderStock();
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
      root.innerHTML = '<div class="card"><p class="empty">No orders for this filter.</p></div>';
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
      <article class="card order">
        <div>
          <strong class="mono" style="color:var(--ink)">${esc(id)}</strong>
          <div class="meta">${esc(o.customer?.fullName || "")} · ${esc(o.customer?.email || o.userEmail || "")} · ${esc(o.customer?.phone || "")}</div>
          <div class="meta">${esc(date)}</div>
          <div style="margin-top:8px;font-weight:700">${money(o.totals?.total)} · ${esc(o.payment || "Paystack")}</div>
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
    if ($("#cust-meta")) $("#cust-meta").textContent = list.length + " customer(s)";
    const root = $("#cust-list");
    if (!root) return;
    if (!list.length) {
      root.innerHTML = '<div class="cust"><p class="empty">No customers yet.</p></div>';
      return;
    }
    root.innerHTML = list
      .map(
        (c) => `
      <div class="cust">
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
    const root = $("#coupon-list");
    if (!root) return;
    const list = getCoupons();
    if (!list.length) {
      root.innerHTML = '<div class="card"><p class="empty">No coupons yet. Try WELCOME10 for 10% off.</p></div>';
      return;
    }
    root.innerHTML = list
      .map(
        (c, i) => `
      <div class="card" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center">
        <div>
          <strong class="mono" style="color:var(--ink);letter-spacing:.05em">${esc(c.code)}</strong>
          <div class="meta" style="color:var(--muted);font-size:12.5px;margin-top:4px">
            ${c.type === "percent" ? c.value + "% off" : money(c.value) + " off"}
            · <span class="badge ${c.active === false ? "" : "ok"}">${c.active === false ? "Disabled" : "Active"}</span>
          </div>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-ghost" data-cp-toggle="${i}">${c.active === false ? "Enable" : "Disable"}</button>
          <button type="button" class="btn btn-ghost t-danger" data-cp-del="${i}">Delete</button>
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
    const list = read(KEY.activity, []);
    el.innerHTML = list.length
      ? list
          .map((a) => "<div>" + esc((a.t || "").slice(0, 19).replace("T", " ")) + " — " + esc(a.msg) + "</div>")
          .join("")
      : "<div>No activity yet.</div>";
  }

  function openDrawer() {
    const drawer = $("#drawer");
    const panel = $("#drawer-nav");
    if (!drawer || !panel) return;
    panel.innerHTML = "";
    $$("#side-nav [data-tab]").forEach((btn) => {
      const clone = btn.cloneNode(true);
      clone.addEventListener("click", () => go(clone.dataset.tab));
      panel.appendChild(clone);
    });
    const shop = document.createElement("a");
    shop.href = "../shop.html";
    shop.target = "_blank";
    shop.rel = "noopener";
    shop.className = "nav";
    shop.textContent = "Open shop ↗";
    panel.appendChild(shop);
    const out = document.createElement("button");
    out.type = "button";
    out.className = "nav danger";
    out.textContent = "Sign out";
    out.addEventListener("click", logout);
    panel.appendChild(out);
    drawer.hidden = false;
  }

  function closeDrawer() {
    if ($("#drawer")) $("#drawer").hidden = true;
  }

  function bind() {
    $("#gate-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = ($("#gate-pass")?.value || "").trim();
      if (!value) return showGate("Please enter your password.");
      if (value !== password()) {
        if ($("#gate-pass")) $("#gate-pass").value = "";
        return showGate("Incorrect password. Try again.");
      }
      unlock("Admin");
    });

    $("#sign-out")?.addEventListener("click", logout);
    $("#open-menu")?.addEventListener("click", openDrawer);
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeDrawer));

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tab]");
      if (!btn || !btn.dataset.tab) return;
      if (!document.body.classList.contains("is-in")) return;
      if (btn.tagName === "A" && btn.getAttribute("href")) return;
      e.preventDefault();
      go(btn.dataset.tab);
    });

    $("#search")?.addEventListener("input", renderProducts);
    $("#cat-filter")?.addEventListener("change", renderProducts);
    $("#status-filter")?.addEventListener("change", renderProducts);
    $("#btn-new")?.addEventListener("click", () => openEditor(null));
    $("#btn-cancel")?.addEventListener("click", closeEditor);

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
          if (w > 1200) {
            h = Math.round((h * 1200) / w);
            w = 1200;
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          if ($("#f-url")) $("#f-url").value = "";
          setPreview(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => setPreview(raw);
        img.src = raw;
      };
      reader.readAsDataURL(file);
    });

    let t;
    $("#f-url")?.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const url = ($("#f-url")?.value || "").trim();
        if (url) {
          if ($("#f-file")) $("#f-file").value = "";
          setPreview(url);
        }
      }, 250);
    });

    $("#form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const image = ($("#f-data")?.value || $("#f-url")?.value || "").trim();
      if (!image) return alert("Please upload an image or paste a path/URL.");
      const stockQty = Number($("#f-stock").value) || 0;
      const data = norm({
        id: $("#f-id").value ? Number($("#f-id").value) || $("#f-id").value : Date.now(),
        name: $("#f-name").value.trim(),
        sku: $("#f-sku").value.trim(),
        category: $("#f-cat").value,
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
    $("#orders-refresh")?.addEventListener("click", () => {
      renderOrders();
      log("Orders refreshed");
    });
    $("#cust-refresh")?.addEventListener("click", () => {
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
        saveProducts(data.map(norm));
        if (msg) {
          msg.textContent = "Imported " + data.length + " products.";
          msg.className = "msg ok";
        }
        log("Imported " + data.length + " products");
        renderProducts();
      } catch (err) {
        if (msg) {
          msg.textContent = err.message;
          msg.className = "msg err";
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
          msg.className = "msg err";
        }
        return;
      }
      localStorage.removeItem(KEY.products);
      if (window.SKY_CATALOG_VERSION) localStorage.setItem(KEY.catalog, String(window.SKY_CATALOG_VERSION));
      saveProducts(catalog);
      if (msg) {
        msg.textContent = "Loaded " + catalog.length + " products with photos.";
        msg.className = "msg ok";
      }
      log("Seeded " + catalog.length + " products");
      renderProducts();
      renderHome();
    });

    $("#btn-reset")?.addEventListener("click", () => {
      if (!confirm("Reset local catalog overrides and reload defaults?")) return;
      localStorage.removeItem(KEY.products);
      localStorage.removeItem(KEY.catalog);
      saveProducts(seed());
      const msg = $("#seed-msg");
      if (msg) {
        msg.textContent = "Reset to catalog defaults.";
        msg.className = "msg ok";
      }
      log("Reset catalog overrides");
      renderProducts();
      renderHome();
    });
  }

  function boot() {
    initTheme();
    initShowPass();
    bind();
    if (sessionStorage.getItem(KEY.session) === "1") {
      unlock(sessionStorage.getItem(KEY.email) || "Admin");
    } else {
      showGate();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
