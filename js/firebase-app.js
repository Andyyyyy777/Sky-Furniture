/**
 * Firebase app bootstrap — only connects when real keys are present.
 * If keys are placeholders, exports firebaseReady = false (no API calls).
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
import {
  firebaseConfig,
  ADMIN_EMAILS,
  PAYSTACK_PUBLIC_KEY,
  FUNCTIONS_BASE_URL
} from "./firebase-config.js";

export function isFirebaseConfigured() {
  const key = String(firebaseConfig?.apiKey || "");
  return (
    key.startsWith("AIza") &&
    !key.includes("PASTE") &&
    !key.includes("YOUR_") &&
    String(firebaseConfig.projectId || "").length > 2 &&
    !String(firebaseConfig.projectId).includes("PASTE")
  );
}

export const firebaseReady = isFirebaseConfigured();

let app = null;
let auth = null;
let db = null;

if (firebaseReady) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.info(
    "[Sky Furniture] Firebase keys not configured. Using local accounts (js/local-auth.js). See config/firebase-keys.js"
  );
  // Minimal stubs so accidental imports don't call the real API with a bad key
  auth = {
    currentUser: null
  };
  const noopUnsub = () => {};
  // onAuthStateChanged stub
  const _onAuthStateChanged = (_auth, cb) => {
    queueMicrotask(() => cb(null));
    return noopUnsub;
  };
  // Replace named exports usage via wrapper functions below
  auth._stub = true;
}

function notReadyError() {
  return new Error(
    "Firebase is not set up yet. Use local signup/login (already on this site), or paste keys in config/firebase-keys.js — see BACKEND.md"
  );
}

async function safeCreateUser(authInst, email, password) {
  if (!firebaseReady) throw notReadyError();
  return createUserWithEmailAndPassword(authInst, email, password);
}

async function safeSignIn(authInst, email, password) {
  if (!firebaseReady) throw notReadyError();
  return signInWithEmailAndPassword(authInst, email, password);
}

async function safeSignOut(authInst) {
  if (!firebaseReady) return;
  return signOut(authInst);
}

function safeOnAuthStateChanged(authInst, cb) {
  if (!firebaseReady) {
    queueMicrotask(() => cb(null));
    return () => {};
  }
  return onAuthStateChanged(authInst, cb);
}

export {
  app,
  auth,
  db,
  safeCreateUser as createUserWithEmailAndPassword,
  safeSignIn as signInWithEmailAndPassword,
  safeSignOut as signOut,
  safeOnAuthStateChanged as onAuthStateChanged,
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
  onSnapshot,
  ADMIN_EMAILS,
  PAYSTACK_PUBLIC_KEY,
  FUNCTIONS_BASE_URL
};

export function isAdminUser(user) {
  if (!user?.email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(user.email.toLowerCase());
}

export async function requireAuth() {
  return new Promise((resolve) => {
    if (!firebaseReady) {
      resolve(null);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(user);
    });
  });
}
