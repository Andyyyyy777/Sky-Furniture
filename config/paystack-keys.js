/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  SKY FURNITURE — PASTE YOUR PAYSTACK KEYS HERE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * WHERE TO GET THEM:
 *   1. Go to https://dashboard.paystack.com
 *   2. Settings → API Keys & Webhooks
 *   3. Copy the PUBLIC key (starts with pk_test_ or pk_live_)
 *
 * RULES:
 *   ✅ Paste PUBLIC key (pk_...) below
 *   ❌ NEVER paste SECRET key (sk_...) in this file or any frontend file
 *
 * After pasting: save this file, refresh checkout, try "Pay with Paystack"
 * Full guide: PAYSTACK-SETUP.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

window.SKY_PAYSTACK = {
  // ┌─────────────────────────────────────────────────────────────────────┐
  // │  PASTE YOUR PUBLIC KEY BETWEEN THE QUOTES BELOW                     │
  // └─────────────────────────────────────────────────────────────────────┘
  publicKey: "pk_test_c91670f5b03f817a9696594615ad27eb4eca06a8",

  // Optional later (server verification after Firebase Functions deploy):
  // Example: "https://us-central1-YOUR_PROJECT.cloudfunctions.net/verifyPaystackPayment"
  verifyUrl: "",

  currency: "NGN",

  // If public key is still a placeholder, allow demo payment fallback
  allowDemoFallback: true
};
