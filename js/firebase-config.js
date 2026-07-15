/**
 * Firebase config — re-exports from config/firebase-keys.js
 *
 * Prefer pasting keys in:  config/firebase-keys.js
 * This file keeps older import paths working.
 */
export {
  firebaseConfig,
  FUNCTIONS_BASE_URL,
  ADMIN_EMAILS
} from "../config/firebase-keys.js";

// Paystack public key for modules that still import from here
// Prefer config/paystack-keys.js for the browser payment flow
export const PAYSTACK_PUBLIC_KEY =
  (typeof window !== "undefined" && window.SKY_PAYSTACK?.publicKey) ||
  "pk_test_PASTE_YOUR_PUBLIC_KEY_HERE";
