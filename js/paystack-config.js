/**
 * Loads Paystack keys from config/paystack-keys.js
 * Prefer editing: config/paystack-keys.js
 *
 * This file is a thin fallback if the config folder file is missing.
 */
(function () {
  // If config/paystack-keys.js already set SKY_PAYSTACK, keep it
  if (window.SKY_PAYSTACK && window.SKY_PAYSTACK.publicKey) {
    return;
  }

  // Fallback only if config/paystack-keys.js was not loaded — no real keys here
  window.SKY_PAYSTACK = {
    publicKey: "",
    verifyUrl: "",
    currency: "NGN",
    allowDemoFallback: true
  };
})();
