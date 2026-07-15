/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  Sky Furniture — assets/js/firebase.js
 *  Central Firebase helper (Auth + Firestore)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * KEYS: prefer pasting in  config/firebase-keys.js
 *       (this file loads them automatically)
 *
 * USAGE (ES module):
 *   <script type="module">
 *     import { auth, db, firebaseReady, signUp, signIn } from "./assets/js/firebase.js";
 *   </script>
 *
 * Or from project root pages:
 *   import { ... } from "./assets/js/firebase.js";
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
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
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ─── Load keys from config/firebase-keys.js ───────────────────────────────
import {
  firebaseConfig,
  ADMIN_EMAILS,
  FUNCTIONS_BASE_URL
} from "../../config/firebase-keys.js";

// ─── Is config real? ──────────────────────────────────────────────────────
export function isFirebaseConfigured() {
  const key = String(firebaseConfig?.apiKey || "");
  const projectId = String(firebaseConfig?.projectId || "");
  return (
    key.startsWith("AIza") &&
    !key.includes("PASTE") &&
    !key.includes("YOUR_") &&
    projectId.length > 2 &&
    !projectId.includes("PASTE")
  );
}

export const firebaseReady = isFirebaseConfigured();

export { firebaseConfig, ADMIN_EMAILS, FUNCTIONS_BASE_URL };

// ─── Init only with valid keys ────────────────────────────────────────────
let app = null;
let auth = null;
let db = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.info("[Sky Furniture] Firebase ready — project:", firebaseConfig.projectId);
} else {
  console.warn(
    "[Sky Furniture] Firebase keys not set. Paste them in config/firebase-keys.js — see BACKEND.md"
  );
}

export { app, auth, db };

function requireReady() {
  if (!firebaseReady || !auth) {
    throw new Error(
      "Firebase is not configured. Open config/firebase-keys.js and paste your web app keys from the Firebase Console."
    );
  }
}

// ─── Auth helpers ─────────────────────────────────────────────────────────
export async function signUp(email, password, displayName = "") {
  requireReady();
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  if (db) {
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || "",
      role: isAdminEmail(email) ? "admin" : "customer",
      createdAt: serverTimestamp()
    });
    // Shared customers list for admin
    try {
      const key = String(email)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9@._+-]/g, "")
        .replace(/[@.]/g, "_")
        .slice(0, 120);
      await setDoc(
        doc(db, "customers", key),
        {
          email: String(email).trim().toLowerCase(),
          name: displayName || "",
          uid: cred.user.uid,
          source: "signup",
          orderCount: 0,
          totalSpent: 0,
          firstSeenAt: new Date().toISOString(),
          lastSeenAt: new Date().toISOString(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (_) {}
  }
  return cred.user;
}

export async function signIn(email, password) {
  requireReady();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (db && cred.user?.email) {
    try {
      const key = String(cred.user.email)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9@._+-]/g, "")
        .replace(/[@.]/g, "_")
        .slice(0, 120);
      await setDoc(
        doc(db, "customers", key),
        {
          email: String(cred.user.email).trim().toLowerCase(),
          name: cred.user.displayName || "",
          uid: cred.user.uid,
          source: "login",
          lastSeenAt: new Date().toISOString(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (_) {}
  }
  return cred.user;
}

export async function logOut() {
  if (!firebaseReady || !auth) return;
  await signOut(auth);
}

export function onUserChanged(callback) {
  if (!firebaseReady || !auth) {
    queueMicrotask(() => callback(null));
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function resetPassword(email) {
  requireReady();
  await sendPasswordResetEmail(auth, email);
}

export function isAdminEmail(email) {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => String(e).toLowerCase()).includes(
    String(email).toLowerCase()
  );
}

export function isAdminUser(user) {
  return isAdminEmail(user?.email);
}

// ─── Re-export Firebase building blocks ───────────────────────────────────
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
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
  onSnapshot
};

// ─── Global (optional) for classic scripts ────────────────────────────────
if (typeof window !== "undefined") {
  window.SkyFirebase = {
    get ready() {
      return firebaseReady;
    },
    get auth() {
      return auth;
    },
    get db() {
      return db;
    },
    signUp,
    signIn,
    logOut,
    onUserChanged,
    isAdminUser,
    config: firebaseConfig
  };
}
