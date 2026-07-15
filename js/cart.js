// Simple localStorage cart helpers
const CART_KEY = "sky_furniture_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === Number(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: Number(productId), quantity });
  }
  saveCart(cart);
  showToast("Added to cart");
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== Number(productId));
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  if (!item) return;
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartItemsWithProducts() {
  return getCart()
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { ...product, quantity: item.quantity, lineTotal: product.price * item.quantity };
    })
    .filter(Boolean);
}

function getCartTotals() {
  const items = getCartItemsWithProducts();
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const shipping = subtotal >= 500 || subtotal === 0 ? 0 : 49;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, itemCount: items.length };
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const count = getCartCount();
  badges.forEach((el) => {
    el.textContent = count;
    el.classList.toggle("hidden", count === 0);
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-50 px-5 py-3 rounded-full text-sm shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
