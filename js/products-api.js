/**
 * Products & orders API — Firestore with local fallback
 */
import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  auth,
  FUNCTIONS_BASE_URL
} from "./firebase-app.js";

const PRODUCTS_COL = "products";
const ORDERS_COL = "orders";

/** Map Firestore doc → site product shape */
export function mapProduct(id, data) {
  return {
    id: data.numericId || id,
    firestoreId: id,
    name: data.name || "",
    category: data.category || "living",
    price: Number(data.price) || 0,
    originalPrice: data.originalPrice != null ? Number(data.originalPrice) : null,
    rating: Number(data.rating) || 4.5,
    reviews: Number(data.reviews) || 0,
    image: data.image || "",
    images: data.images || (data.image ? [data.image] : []),
    description: data.description || "",
    details: data.details || [],
    inStock: data.inStock !== false,
    badge: data.badge || null,
    active: data.active !== false
  };
}

export async function fetchProductsFromFirestore() {
  const snap = await getDocs(query(collection(db, PRODUCTS_COL), orderBy("name")));
  const list = [];
  snap.forEach((d) => {
    const p = mapProduct(d.id, d.data());
    if (p.active) list.push(p);
  });
  return list;
}

export async function fetchProductById(id) {
  // Try as Firestore doc id first
  const byDoc = await getDoc(doc(db, PRODUCTS_COL, String(id)));
  if (byDoc.exists()) return mapProduct(byDoc.id, byDoc.data());

  // Fallback: numericId field
  const q = query(collection(db, PRODUCTS_COL), where("numericId", "==", Number(id)));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const d = snap.docs[0];
    return mapProduct(d.id, d.data());
  }
  return null;
}

export async function createProduct(data) {
  const payload = {
    ...data,
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
    rating: Number(data.rating) || 4.5,
    reviews: Number(data.reviews) || 0,
    inStock: data.inStock !== false,
    active: data.active !== false,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, PRODUCTS_COL), payload);
  return ref.id;
}

export async function updateProduct(firestoreId, data) {
  await updateDoc(doc(db, PRODUCTS_COL, firestoreId), {
    ...data,
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
    updatedAt: serverTimestamp()
  });
}

export async function deleteProduct(firestoreId) {
  await deleteDoc(doc(db, PRODUCTS_COL, firestoreId));
}

export async function fetchAllProductsAdmin() {
  const snap = await getDocs(query(collection(db, PRODUCTS_COL), orderBy("name")));
  return snap.docs.map((d) => mapProduct(d.id, d.data()));
}

/**
 * Create order in Firestore (client). Payment verification should use Cloud Function.
 */
export async function createOrder(order) {
  const user = auth.currentUser;
  const payload = {
    ...order,
    userId: user?.uid || null,
    userEmail: user?.email || order.customer?.email || null,
    status: order.status || "pending_payment",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, ORDERS_COL), payload);
  return { id: ref.id, ...payload };
}

export async function fetchUserOrders(uid) {
  const q = query(collection(db, ORDERS_COL), where("userId", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchAllOrdersAdmin() {
  const snap = await getDocs(query(collection(db, ORDERS_COL), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, ORDERS_COL, orderId), {
    status,
    updatedAt: serverTimestamp()
  });
}

/**
 * Call Cloud Function to verify Paystack payment + send emails
 */
export async function verifyPaystackAndConfirmOrder({ reference, orderId }) {
  const token = await auth.currentUser?.getIdToken?.();
  const res = await fetch(`${FUNCTIONS_BASE_URL}/verifyPaystackPayment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ reference, orderId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Verification failed (${res.status})`);
  }
  return res.json();
}

/**
 * Seed local PRODUCTS array into Firestore (run once from admin).
 */
export async function seedProductsFromLocal(localProducts) {
  let n = 0;
  for (const p of localProducts) {
    await setDoc(doc(db, PRODUCTS_COL, `product_${p.id}`), {
      numericId: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      rating: p.rating,
      reviews: p.reviews,
      image: p.image,
      images: p.images || [p.image],
      description: p.description,
      details: p.details || [],
      inStock: p.inStock !== false,
      badge: p.badge,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    n++;
  }
  return n;
}
