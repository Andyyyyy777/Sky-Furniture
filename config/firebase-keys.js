/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SKY FURNITURE — Firebase web config
 * ═══════════════════════════════════════════════════════════════════════════
 * Project: sky-furniture
 * Paste updates from: Console → Project settings → Your apps → Web
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDToXvHEZy3vm2tVGy3tKma4GokmMSozjE",
  authDomain: "sky-furniture.firebaseapp.com",
  projectId: "sky-furniture",
  storageBucket: "sky-furniture.firebasestorage.app",
  messagingSenderId: "1056030093566",
  appId: "1:1056030093566:web:00d7662a82aeaf89b0f5af"
};

// Cloud Functions base URL (after you deploy functions)
export const FUNCTIONS_BASE_URL =
  "https://us-central1-sky-furniture.cloudfunctions.net";

// Put the email YOU will use to sign up (for admin panel later)
export const ADMIN_EMAILS = [
  "emekaanderson29@gmail.com"
];

if (typeof window !== "undefined") {
  window.SKY_FIREBASE = {
    firebaseConfig,
    FUNCTIONS_BASE_URL,
    ADMIN_EMAILS
  };
}
