/**
 * Real Paystack Popup integration + order write to Firestore
 * Requires: Paystack inline script + firebase modules
 *
 * Include on checkout.html:
 * <script src="https://js.paystack.co/v1/inline.js"></script>
 * <script type="module" src="js/paystack-checkout.js"></script>
 */
import { auth, onAuthStateChanged, PAYSTACK_PUBLIC_KEY } from "./firebase-app.js";
import { createOrder, verifyPaystackAndConfirmOrder } from "./products-api.js";

function formatKobo(naira) {
  return Math.round(Number(naira) * 100);
}

/**
 * @param {object} opts
 * @param {object} opts.orderPayload - order fields (customer, items, totals, delivery…)
 * @param {string} opts.email
 * @param {number} opts.amountNaira - total in NGN
 * @param {function} opts.onSuccess
 * @param {function} opts.onError
 */
export async function payWithPaystack({ orderPayload, email, amountNaira, onSuccess, onError }) {
  if (!window.PaystackPop) {
    onError?.(new Error("Paystack script not loaded. Add js.paystack.co inline.js"));
    return;
  }
  if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes("xxxx")) {
    onError?.(new Error("Set PAYSTACK_PUBLIC_KEY in js/firebase-config.js"));
    return;
  }

  // 1) Create pending order in Firestore
  let orderDoc;
  try {
    orderDoc = await createOrder({
      ...orderPayload,
      payment: "paystack",
      status: "pending_payment",
      currency: "NGN"
    });
  } catch (e) {
    onError?.(e);
    return;
  }

  const reference = `SKY_${orderDoc.id}_${Date.now()}`;

  // 2) Open Paystack
  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: formatKobo(amountNaira),
    currency: "NGN",
    ref: reference,
    metadata: {
      orderId: orderDoc.id,
      custom_fields: [
        {
          display_name: "Order",
          variable_name: "order_id",
          value: orderDoc.id
        }
      ]
    },
    callback: function (response) {
      // 3) Verify on server (Cloud Function) — never trust client alone
      verifyPaystackAndConfirmOrder({
        reference: response.reference,
        orderId: orderDoc.id
      })
        .then((result) => {
          onSuccess?.({ ...result, orderId: orderDoc.id, reference: response.reference });
        })
        .catch((err) => {
          // Payment may have succeeded but verify failed — still show reference
          onError?.(
            new Error(
              `${err.message}. If you were charged, contact support with ref ${response.reference}`
            )
          );
        });
    },
    onClose: function () {
      onError?.(new Error("Payment window closed"));
    }
  });

  handler.openIframe();
}

// Optional: require login before checkout
export function watchAuthForCheckout(loginUrl = "login.html?next=checkout.html") {
  onAuthStateChanged(auth, (user) => {
    const banner = document.getElementById("auth-checkout-banner");
    if (!banner) return;
    if (!user) {
      banner.classList.remove("hidden");
      banner.innerHTML = `Please <a class="underline font-medium" href="${loginUrl}">sign in</a> to save orders to your account. You can still guest-checkout if rules allow.`;
    } else {
      banner.classList.add("hidden");
    }
  });
}
