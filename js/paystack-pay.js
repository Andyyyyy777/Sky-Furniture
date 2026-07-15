/**
 * Sky Furniture — Paystack Popup payment
 * Depends on: Paystack inline.js, paystack-config.js, main.js (cart helpers)
 */
(function () {
  const ORDERS_KEY = "sky_furniture_paid_orders";

  function cfg() {
    return window.SKY_PAYSTACK || {};
  }

  function isConfigured() {
    const key = (cfg().publicKey || "").trim();
    return (
      key.startsWith("pk_") &&
      !key.includes("xxxx") &&
      !key.includes("PASTE_YOUR") &&
      key.length > 20
    );
  }

  function toKobo(naira) {
    return Math.round(Number(naira) * 100);
  }

  function makeReference() {
    return "SKY_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function saveLocalOrder(order) {
    try {
      const list = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      list.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(list.slice(0, 200)));
    } catch (_) {}
  }

  /** Save order locally + Firestore so admin sees all payments */
  function persistOrder(order) {
    saveLocalOrder(order);
    // Prefer already-loaded module helper
    if (window.SkyCloudStore?.saveOrderToCloud) {
      window.SkyCloudStore.saveOrderToCloud(order).catch(() => {});
      return;
    }
    // Dynamic import relative to the page URL (root pages)
    import("./assets/js/cloud-store.js")
      .then((mod) => mod.saveOrderToCloud(order))
      .catch(() => {});
  }

  function collectCheckoutData() {
    if (typeof window.validateCheckoutForm === "function") {
      return window.validateCheckoutForm();
    }
    if (window.SkyFurniture?.validateCheckoutForm) {
      return window.SkyFurniture.validateCheckoutForm();
    }
    return { valid: false, errors: { form: "Checkout not ready" }, data: {} };
  }

  function getCartSnapshot() {
    const delivery =
      document.querySelector('input[name="delivery"]:checked')?.value || "home";
    const getItems =
      window.getCartItemsWithProducts || window.SkyFurniture?.getCartItemsWithProducts;
    const getTotals = window.getCartTotals || window.SkyFurniture?.getCartTotals;

    if (!getItems || !getTotals) {
      return { items: [], totals: { total: 0, subtotal: 0, shipping: 0, tax: 0 }, delivery };
    }

    const items = getItems().map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
      image: i.image
    }));
    const totals = getTotals({ delivery });
    return { items, totals, delivery };
  }

  function showConfigHelp() {
    const msg =
      "Paystack is not configured yet.\n\n" +
      "1. Open config/paystack-keys.js\n" +
      "2. Paste your public key (pk_test_... from Paystack dashboard)\n" +
      "3. Save the file and refresh this page\n" +
      "4. Click Pay with Paystack again\n\n" +
      "Guide: PAYSTACK-SETUP.md";
    alert(msg);
  }

  function setButtonsBusy(busy, label) {
    ["btn-paystack", "btn-place-order"].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      if (busy) {
        btn.dataset._label = btn.dataset._label || btn.textContent;
        btn.disabled = true;
        btn.textContent = label || "Opening Paystack…";
      } else {
        btn.disabled = false;
        if (btn.dataset._label) btn.textContent = btn.dataset._label;
      }
    });
  }

  function finishSuccess(order) {
    const clear = window.clearCart || window.SkyFurniture?.clearCart;
    if (typeof clear === "function") clear();
    else localStorage.removeItem("sky_furniture_cart");

    // Attach signed-in user if available
    try {
      if (window.SkyFirebase?.auth?.currentUser) {
        order.userId = window.SkyFirebase.auth.currentUser.uid;
        order.userEmail = window.SkyFirebase.auth.currentUser.email;
      }
    } catch (_) {}

    persistOrder(order);

    document.getElementById("checkout-form-wrap")?.classList.add("hidden");

    const confirmFn = window.openConfirmModal || window.SkyFurniture?.openConfirmModal;
    if (typeof confirmFn === "function") {
      confirmFn(order);
    } else {
      alert(
        "Payment successful!\n\nOrder: " +
          order.orderNumber +
          "\nReference: " +
          (order.paymentRef || "—")
      );
    }

    const badge = document.querySelectorAll("[data-cart-count]");
    badge.forEach((el) => {
      el.textContent = "0";
      el.classList.add("hidden");
    });
  }

  /**
   * Start Paystack payment for current checkout form + cart
   */
  async function startPaystackPayment(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Ensure Paystack method is selected
    const payRadio = document.querySelector('input[name="payment"][value="paystack"]');
    if (payRadio) payRadio.checked = true;
    if (typeof window.SkyFurniture === "object") {
      /* payment UI may update via change event */
    }
    document.querySelector('input[name="payment"][value="paystack"]')?.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    const { valid, errors, data } = collectCheckoutData();
    if (!valid) {
      if (typeof window.showValidationErrors === "function") {
        window.showValidationErrors(errors);
      } else {
        alert("Please complete the form correctly before paying.");
      }
      return;
    }

    const { items, totals, delivery } = getCartSnapshot();
    if (!items.length || !totals.total) {
      alert("Your cart is empty.");
      return;
    }

    if (!isConfigured()) {
      if (cfg().allowDemoFallback) {
        // Soft fallback: offer demo only if user confirms
        const useDemo = confirm(
          "Paystack public key not set yet.\n\n" +
            "Click OK to run DEMO payment (no real charge).\n" +
            "Click Cancel to open setup instructions."
        );
        if (!useDemo) {
          showConfigHelp();
          return;
        }
        // Use existing demo flow
        if (typeof window.processCheckout === "function") {
          window.processCheckout("paystack");
        } else if (window.SkyFurniture?.processCheckout) {
          window.SkyFurniture.processCheckout("paystack");
        }
        return;
      }
      showConfigHelp();
      return;
    }

    if (!window.PaystackPop) {
      alert("Paystack script failed to load. Check your internet connection and refresh.");
      return;
    }

    const reference = makeReference();
    const orderId = reference;
    const orderPayload = {
      orderNumber: orderId,
      payment: "paystack",
      paymentRef: reference,
      status: "pending_payment",
      delivery,
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
      items,
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total
      },
      currency: "NGN",
      createdAt: new Date().toISOString()
    };

    setButtonsBusy(true, "Opening Paystack…");

    try {
      const handler = window.PaystackPop.setup({
        key: cfg().publicKey.trim(),
        email: data.email,
        amount: toKobo(totals.total),
        currency: cfg().currency || "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer",
              variable_name: "customer_name",
              value: data.fullName
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: data.phone
            },
            {
              display_name: "Delivery",
              variable_name: "delivery",
              value: delivery
            }
          ]
        },
        callback: function (response) {
          // Payment approved by Paystack (client). Optionally verify on server.
          const paidOrder = {
            ...orderPayload,
            status: "paid",
            paymentRef: response.reference,
            orderNumber: response.reference,
            paystackResponse: {
              reference: response.reference,
              status: response.status,
              message: response.message
            }
          };

          const verifyUrl = (cfg().verifyUrl || "").trim();
          if (verifyUrl) {
            setButtonsBusy(true, "Verifying payment…");
            fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                reference: response.reference,
                orderId: response.reference,
                order: paidOrder
              })
            })
              .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
              .then(({ ok, j }) => {
                if (!ok) throw new Error(j.error || "Verification failed");
                paidOrder.status = j.status || "paid";
                finishSuccess(paidOrder);
              })
              .catch((err) => {
                // Still mark local success but warn
                console.error(err);
                paidOrder.verifyWarning = err.message;
                finishSuccess(paidOrder);
                alert(
                  "Payment received (ref: " +
                    response.reference +
                    ").\nServer verification failed: " +
                    err.message +
                    "\nSave this reference."
                );
              })
              .finally(() => setButtonsBusy(false));
          } else {
            finishSuccess(paidOrder);
            setButtonsBusy(false);
          }
        },
        onClose: function () {
          setButtonsBusy(false);
          // User closed popup — not necessarily an error
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      setButtonsBusy(false);
      alert(err.message || "Could not start Paystack");
    }
  }

  function updatePaystackUiBanner() {
    let banner = document.getElementById("paystack-status-banner");
    const wrap = document.getElementById("checkout-form-wrap");
    if (!wrap) return;

    if (!banner) {
      banner = document.createElement("div");
      banner.id = "paystack-status-banner";
      banner.className = "mb-6 max-w-3xl text-sm px-4 py-3 border";
      const anchor = wrap.querySelector("h1")?.parentElement || wrap;
      // insert after demo notice if present
      const notices = wrap.querySelectorAll(".bg-amber-50, #form-global-error");
      if (notices.length) notices[0].after(banner);
      else wrap.insertBefore(banner, wrap.children[1] || wrap.firstChild);
    }

    if (isConfigured()) {
      banner.className =
        "mb-6 max-w-3xl text-sm px-4 py-3 border border-green-200 bg-green-50 text-green-900";
      banner.innerHTML =
        "<strong>Paystack connected</strong> — payments open the official Paystack popup (NGN). " +
        "Use test cards while on <code class='bg-green-100 px-1'>pk_test_</code> keys.";
    } else {
      banner.className =
        "mb-6 max-w-3xl text-sm px-4 py-3 border border-amber-200 bg-amber-50 text-amber-950";
      banner.innerHTML =
        "<strong>Paystack not configured</strong> — paste your public key in " +
        "<code class='bg-amber-100 px-1'>config/paystack-keys.js</code>. " +
        "Until then, you can still use demo payment. See <strong>PAYSTACK-SETUP.md</strong>.";
    }
  }

  function wireButtons() {
    const payBtn = document.getElementById("btn-paystack");
    if (payBtn) {
      // Replace demo handler: capture phase so we run first
      payBtn.addEventListener("click", startPaystackPayment, true);
    }

    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener(
        "submit",
        function (e) {
          const method =
            document.querySelector('input[name="payment"]:checked')?.value || "paystack";
          if (method === "paystack") {
            e.preventDefault();
            e.stopPropagation();
            startPaystackPayment(e);
          }
          // stripe still uses demo path from main.js
        },
        true
      );
    }

    // Place order button
    const place = document.getElementById("btn-place-order");
    if (place) {
      place.addEventListener(
        "click",
        function (e) {
          const method =
            document.querySelector('input[name="payment"]:checked')?.value || "paystack";
          if (method === "paystack") {
            e.preventDefault();
            e.stopPropagation();
            startPaystackPayment(e);
          }
        },
        true
      );
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.body || document.body.dataset.page !== "checkout") {
      // Still wire if checkout form exists
      if (!document.getElementById("checkout-form")) return;
    }
    updatePaystackUiBanner();
    wireButtons();
  });

  // Public API
  window.SkyPaystack = {
    startPayment: startPaystackPayment,
    isConfigured: isConfigured,
    getPaidOrders: function () {
      try {
        return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      } catch {
        return [];
      }
    }
  };
})();
