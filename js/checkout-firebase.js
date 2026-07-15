/**
 * Bridges existing checkout UI → Firestore orders + real Paystack.
 * Load on checkout.html AFTER nigeria-locations + main.js concepts.
 *
 * <script src="https://js.paystack.co/v1/inline.js"></script>
 * <script type="module" src="js/checkout-firebase.js"></script>
 */
import { payWithPaystack, watchAuthForCheckout } from "./paystack-checkout.js";
import { bindAuthHeader } from "./auth-ui.js";

bindAuthHeader();
watchAuthForCheckout("login.html?next=checkout.html");

function collectFromDom() {
  // Reuse validation from main.js if available
  if (typeof window.SkyFurniture?.validateCheckoutForm === "function") {
    return window.SkyFurniture.validateCheckoutForm();
  }
  // Minimal fallback
  return {
    valid: true,
    errors: {},
    data: {
      fullName: document.getElementById("fullName")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      phone: document.getElementById("phone")?.value.trim(),
      address: document.getElementById("address")?.value.trim(),
      lga: document.getElementById("lga")?.value,
      city: document.getElementById("city")?.value.trim(),
      state: document.getElementById("state")?.value,
      country: "Nigeria",
      landmark: document.getElementById("landmark")?.value.trim(),
      notes: document.getElementById("notes")?.value.trim(),
      delivery: document.querySelector('input[name="delivery"]:checked')?.value || "home",
      payment: "paystack",
      terms: document.getElementById("terms")?.checked
    }
  };
}

function getCartSnapshot() {
  // Prefer main.js helpers if present
  if (typeof getCartItemsWithProducts === "function" && typeof getCartTotals === "function") {
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value || "home";
    const items = getCartItemsWithProducts().map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      image: i.image
    }));
    const totals = getCartTotals({ delivery });
    return { items, totals, delivery };
  }
  return { items: [], totals: { total: 0 }, delivery: "home" };
}

function wirePaystackButtons() {
  const run = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const { valid, errors, data } = collectFromDom();
    if (!valid) {
      if (typeof showValidationErrors === "function") showValidationErrors(errors);
      else alert("Please fix the form errors first.");
      return;
    }

    const { items, totals, delivery } = getCartSnapshot();
    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    const orderPayload = {
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        lga: data.lga,
        city: data.city,
        state: data.state,
        country: data.country || "Nigeria",
        landmark: data.landmark,
        notes: data.notes
      },
      delivery,
      items,
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total
      },
      currency: "NGN"
    };

    const btn = e?.currentTarget;
    const prev = btn?.textContent;
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Opening Paystack…";
    }

    await payWithPaystack({
      orderPayload,
      email: data.email,
      amountNaira: totals.total,
      onSuccess: (result) => {
        try {
          if (typeof clearCart === "function") clearCart();
          localStorage.removeItem("sky_furniture_cart");
        } catch (_) {}
        // Show confirmation using existing modal if present
        const order = {
          orderNumber: result.orderId,
          payment: "paystack",
          paymentRef: result.reference,
          delivery,
          customer: orderPayload.customer,
          items,
          totals: orderPayload.totals,
          createdAt: new Date().toISOString()
        };
        const confirmFn = window.openConfirmModal || window.SkyFurniture?.openConfirmModal;
        if (typeof confirmFn === "function") {
          document.getElementById("checkout-form-wrap")?.classList.add("hidden");
          confirmFn(order);
        } else {
          alert(`Payment successful!\nOrder: ${result.orderId}\nRef: ${result.reference}`);
          window.location.href = "account.html";
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = prev;
        }
      },
      onError: (err) => {
        console.error(err);
        alert(err.message || "Payment failed");
        if (btn) {
          btn.disabled = false;
          btn.textContent = prev;
        }
      }
    });
  };

  document.getElementById("btn-paystack")?.addEventListener("click", run, true);

  // Optional: make Place order use Paystack when Firebase is configured
  const placeBtn = document.getElementById("btn-place-order");
  if (placeBtn && placeBtn.dataset.usePaystack !== "false") {
    placeBtn.addEventListener(
      "click",
      (e) => {
        // Only intercept if user selected paystack
        const pay = document.querySelector('input[name="payment"]:checked')?.value;
        if (pay === "paystack" || !pay) {
          e.preventDefault();
          e.stopPropagation();
          run(e);
        }
      },
      true
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Inject auth banner if missing
  if (!document.getElementById("auth-checkout-banner")) {
    const wrap = document.getElementById("checkout-form-wrap");
    if (wrap) {
      const banner = document.createElement("div");
      banner.id = "auth-checkout-banner";
      banner.className =
        "hidden mb-6 max-w-3xl text-sm bg-blue-50 border border-blue-100 text-blue-900 px-4 py-3";
      wrap.insertBefore(banner, wrap.firstChild?.nextSibling || wrap.firstChild);
    }
  }
  wirePaystackButtons();
});
