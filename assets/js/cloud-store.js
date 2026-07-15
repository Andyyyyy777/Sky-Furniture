/**
 * Sky Furniture — shared cloud store (Firestore)
 * Orders + customers sync so admin stays updated across browsers.
 * Falls back gracefully when Firebase/Firestore is unavailable.
 */
import {
  firebaseReady,
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "./firebase.js";

const LOCAL_ORDERS_KEY = "sky_furniture_paid_orders";
const LOCAL_CUSTOMERS_KEY = "sky_furniture_customers";

export function isCloudReady() {
  return Boolean(firebaseReady && db);
}

function safeJsonParse(raw, fallback) {
  try {
    const v = JSON.parse(raw || "null");
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function emailKey(email) {
  return String(email || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, "")
    .replace(/[@.]/g, "_")
    .slice(0, 120);
}

function orderDocId(order) {
  const ref = order.paymentRef || order.orderNumber || order.id;
  if (ref) {
    return String(ref)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 120);
  }
  return "ord_" + Date.now();
}

function stripUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ─── Local helpers ────────────────────────────────────────────────────────
export function getLocalOrders() {
  const list = safeJsonParse(localStorage.getItem(LOCAL_ORDERS_KEY), []);
  return Array.isArray(list) ? list : [];
}

export function saveLocalOrders(list) {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify((list || []).slice(0, 200)));
}

export function getLocalCustomers() {
  const list = safeJsonParse(localStorage.getItem(LOCAL_CUSTOMERS_KEY), []);
  return Array.isArray(list) ? list : [];
}

export function saveLocalCustomers(list) {
  localStorage.setItem(LOCAL_CUSTOMERS_KEY, JSON.stringify(list || []));
}

function upsertLocalCustomer(customer) {
  const email = String(customer.email || "").toLowerCase().trim();
  if (!email) return;
  const list = getLocalCustomers();
  const idx = list.findIndex((c) => c.email === email);
  const prev = idx >= 0 ? list[idx] : {};
  const next = {
    ...prev,
    ...customer,
    email,
    name: customer.name || customer.displayName || prev.name || "",
    phone: customer.phone || prev.phone || "",
    orderCount: Math.max(Number(prev.orderCount) || 0, Number(customer.orderCount) || 0),
    totalSpent: Math.max(Number(prev.totalSpent) || 0, Number(customer.totalSpent) || 0),
    lastSeenAt: customer.lastSeenAt || new Date().toISOString(),
    firstSeenAt: prev.firstSeenAt || customer.firstSeenAt || new Date().toISOString(),
    source: customer.source || prev.source || "site"
  };
  if (customer.incrementOrders) {
    next.orderCount = (Number(prev.orderCount) || 0) + 1;
  }
  if (customer.addSpent) {
    next.totalSpent = (Number(prev.totalSpent) || 0) + Number(customer.addSpent || 0);
  }
  if (idx >= 0) list[idx] = next;
  else list.unshift(next);
  saveLocalCustomers(list);
  return next;
}

// ─── Orders ───────────────────────────────────────────────────────────────
export async function saveOrderToCloud(order) {
  if (!order) return null;
  const clean = stripUndefined({
    ...order,
    updatedAt: new Date().toISOString()
  });

  // Always keep a local copy (admin offline / same browser)
  const local = getLocalOrders().filter(
    (o) =>
      (o.paymentRef || o.orderNumber) !== (clean.paymentRef || clean.orderNumber)
  );
  local.unshift(clean);
  saveLocalOrders(local);

  // Enrich customer from order
  if (clean.customer?.email) {
    await upsertCustomer({
      email: clean.customer.email,
      name: clean.customer.fullName || clean.customer.name || "",
      phone: clean.customer.phone || "",
      source: "checkout",
      lastOrderAt: clean.createdAt || new Date().toISOString(),
      incrementOrders: clean.status !== "pending_payment",
      addSpent:
        clean.status !== "cancelled" && clean.status !== "pending_payment"
          ? Number(clean.totals?.total) || 0
          : 0
    });
  }

  if (!isCloudReady()) return clean;

  try {
    const id = orderDocId(clean);
    const ref = doc(db, "orders", id);
    const existing = await getDoc(ref);
    const payload = {
      ...clean,
      id,
      userId: clean.userId || auth?.currentUser?.uid || null,
      cloudSavedAt: serverTimestamp()
    };
    if (existing.exists()) {
      await setDoc(ref, payload, { merge: true });
    } else {
      await setDoc(ref, payload);
    }
    return { ...clean, id };
  } catch (err) {
    console.warn("[SkyCloud] saveOrder failed — kept local only:", err.message);
    return clean;
  }
}

export async function updateOrderStatusCloud(orderId, status) {
  const local = getLocalOrders();
  const next = local.map((o) => {
    const oid = String(o.orderNumber || o.paymentRef || o.id || "");
    if (oid === String(orderId)) return { ...o, status, updatedAt: new Date().toISOString() };
    return o;
  });
  saveLocalOrders(next);

  if (!isCloudReady() || !orderId) return next;

  try {
    const id = String(orderId).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120);
    await setDoc(
      doc(db, "orders", id),
      { status, updatedAt: new Date().toISOString(), cloudSavedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.warn("[SkyCloud] updateOrderStatus failed:", err.message);
  }
  return next;
}

export async function fetchCloudOrders() {
  const local = getLocalOrders();
  if (!isCloudReady()) return local;

  try {
    const snap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
    const cloud = [];
    snap.forEach((d) => {
      const data = d.data();
      cloud.push({
        ...data,
        id: d.id,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString?.() ||
          data.createdAt ||
          null
      });
    });
    return mergeOrders(cloud, local);
  } catch (err) {
    // Fallback without orderBy if index missing
    try {
      const snap = await getDocs(collection(db, "orders"));
      const cloud = [];
      snap.forEach((d) => {
        const data = d.data();
        cloud.push({
          ...data,
          id: d.id,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString?.() ||
            data.createdAt ||
            null
        });
      });
      cloud.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
      return mergeOrders(cloud, local);
    } catch (err2) {
      console.warn("[SkyCloud] fetchOrders failed:", err2.message || err.message);
      return local;
    }
  }
}

function mergeOrders(cloud, local) {
  const map = new Map();
  [...cloud, ...local].forEach((o) => {
    const key = String(o.paymentRef || o.orderNumber || o.id || Math.random());
    if (!map.has(key)) map.set(key, o);
    else {
      const prev = map.get(key);
      // Prefer newer status updates
      const prevT = prev.updatedAt || prev.createdAt || "";
      const nextT = o.updatedAt || o.createdAt || "";
      map.set(key, nextT >= prevT ? { ...prev, ...o } : { ...o, ...prev });
    }
  });
  return [...map.values()].sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );
}

export function subscribeOrders(callback) {
  if (!isCloudReady()) {
    callback(getLocalOrders());
    return () => {};
  }
  try {
    return onSnapshot(
      collection(db, "orders"),
      (snap) => {
        const cloud = [];
        snap.forEach((d) => {
          const data = d.data();
          cloud.push({
            ...data,
            id: d.id,
            createdAt:
              data.createdAt?.toDate?.()?.toISOString?.() ||
              data.createdAt ||
              null
          });
        });
        cloud.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
        callback(mergeOrders(cloud, getLocalOrders()));
      },
      (err) => {
        console.warn("[SkyCloud] orders listener:", err.message);
        callback(getLocalOrders());
      }
    );
  } catch (err) {
    callback(getLocalOrders());
    return () => {};
  }
}

// ─── Customers ────────────────────────────────────────────────────────────
export async function upsertCustomer(input) {
  if (!input?.email) return null;
  const email = String(input.email).trim().toLowerCase();
  const local = upsertLocalCustomer({ ...input, email });

  if (!isCloudReady()) return local;

  try {
    const id = emailKey(email);
    const ref = doc(db, "customers", id);
    const existing = await getDoc(ref);
    const prev = existing.exists() ? existing.data() : {};
    let orderCount = Number(prev.orderCount) || 0;
    let totalSpent = Number(prev.totalSpent) || 0;
    if (input.incrementOrders) orderCount += 1;
    if (input.addSpent) totalSpent += Number(input.addSpent) || 0;
    if (input.orderCount != null) orderCount = Math.max(orderCount, Number(input.orderCount) || 0);
    if (input.totalSpent != null) totalSpent = Math.max(totalSpent, Number(input.totalSpent) || 0);

    const payload = stripUndefined({
      email,
      name: input.name || input.displayName || prev.name || "",
      phone: input.phone || prev.phone || "",
      uid: input.uid || prev.uid || auth?.currentUser?.uid || null,
      source: input.source || prev.source || "site",
      orderCount,
      totalSpent,
      lastSeenAt: new Date().toISOString(),
      firstSeenAt: prev.firstSeenAt || new Date().toISOString(),
      lastOrderAt: input.lastOrderAt || prev.lastOrderAt || null,
      updatedAt: serverTimestamp()
    });
    await setDoc(ref, payload, { merge: true });
    return { id, ...payload, orderCount, totalSpent };
  } catch (err) {
    console.warn("[SkyCloud] upsertCustomer failed:", err.message);
    return local;
  }
}

/** Record a site user (signed-in) so admin customer list stays current */
export async function trackSiteUser(user) {
  if (!user?.email) return;
  return upsertCustomer({
    email: user.email,
    name: user.displayName || "",
    uid: user.uid || null,
    source: "account",
    lastSeenAt: new Date().toISOString()
  });
}

export async function fetchCloudCustomers() {
  const local = getLocalCustomers();
  const fromOrders = customersFromOrders(getLocalOrders());
  let merged = mergeCustomers(local, fromOrders);

  if (!isCloudReady()) return merged;

  try {
    const snap = await getDocs(collection(db, "customers"));
    const cloud = [];
    snap.forEach((d) => cloud.push({ id: d.id, ...d.data() }));

    // Also pull Firebase Auth profile docs written at signup
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      usersSnap.forEach((d) => {
        const u = d.data();
        if (!u.email) return;
        cloud.push({
          email: u.email,
          name: u.displayName || u.name || "",
          uid: d.id,
          source: "account",
          firstSeenAt: u.createdAt?.toDate?.()?.toISOString?.() || u.createdAt || null,
          lastSeenAt: u.updatedAt?.toDate?.()?.toISOString?.() || null
        });
      });
    } catch (_) {}

    merged = mergeCustomers(cloud, merged);
    // Recompute spend/orders from all known orders
    const orders = await fetchCloudOrders();
    const fromCloudOrders = customersFromOrders(orders);
    return mergeCustomers(merged, fromCloudOrders).sort(
      (a, b) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0)
    );
  } catch (err) {
    console.warn("[SkyCloud] fetchCustomers failed:", err.message);
    return merged;
  }
}

function customersFromOrders(orders) {
  const map = new Map();
  (orders || []).forEach((o) => {
    const email = (o.customer?.email || o.userEmail || "").toLowerCase().trim();
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
    if (o.status !== "cancelled" && o.status !== "pending_payment") {
      prev.totalSpent += Number(o.totals?.total) || 0;
    }
    if (o.customer?.fullName) prev.name = o.customer.fullName;
    if (o.customer?.phone) prev.phone = o.customer.phone;
    prev.lastOrderAt = o.createdAt || prev.lastOrderAt;
    prev.lastSeenAt = o.createdAt || prev.lastSeenAt;
    map.set(email, prev);
  });
  return [...map.values()];
}

function mergeCustomers(a, b) {
  const map = new Map();
  [...(a || []), ...(b || [])].forEach((c) => {
    const email = String(c.email || "").toLowerCase().trim();
    if (!email) return;
    const prev = map.get(email) || { email, orderCount: 0, totalSpent: 0 };
    map.set(email, {
      ...prev,
      ...c,
      email,
      name: c.name || c.displayName || prev.name || "",
      phone: c.phone || prev.phone || "",
      orderCount: Math.max(Number(prev.orderCount) || 0, Number(c.orderCount) || 0),
      totalSpent: Math.max(Number(prev.totalSpent) || 0, Number(c.totalSpent) || 0),
      lastSeenAt: [c.lastSeenAt, prev.lastSeenAt].filter(Boolean).sort().reverse()[0] || null,
      firstSeenAt: [c.firstSeenAt, prev.firstSeenAt].filter(Boolean).sort()[0] || null,
      source: c.source || prev.source || "site"
    });
  });
  return [...map.values()];
}

export function subscribeCustomers(callback) {
  const push = async () => {
    callback(await fetchCloudCustomers());
  };

  if (!isCloudReady()) {
    push();
    return () => {};
  }

  let unsubC = () => {};
  let unsubO = () => {};
  try {
    unsubC = onSnapshot(collection(db, "customers"), () => push(), () => push());
    unsubO = onSnapshot(collection(db, "orders"), () => push(), () => push());
  } catch {
    push();
  }
  return () => {
    unsubC();
    unsubO();
  };
}

// Expose for non-module scripts (Paystack checkout)
if (typeof window !== "undefined") {
  window.SkyCloudStore = {
    isCloudReady,
    saveOrderToCloud,
    updateOrderStatusCloud,
    fetchCloudOrders,
    fetchCloudCustomers,
    upsertCustomer,
    trackSiteUser,
    subscribeOrders,
    subscribeCustomers,
    getLocalOrders,
    getLocalCustomers
  };
}
