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

  // Fallback placeholder (same as config/paystack-keys.js)
  window.SKY_PAYSTACK = {
    publicKey: "pk_test_c91670f5b03f817a9696594615ad27eb4eca06a8",
    verifyUrl: "",
    currency: "NGN",
    allowDemoFallback: true
  };
})();
