/**
 * Site-wide auth header + account dropdown
 * Works with Firebase Auth (config/firebase-keys.js)
 */
import {
  firebaseReady,
  onUserChanged,
  logOut,
  isAdminUser
} from "./firebase.js";
import { trackSiteUser } from "./cloud-store.js";

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayLabel(user) {
  const name = (user.displayName || "").trim();
  if (name) return name;
  const email = user.email || "";
  return email.split("@")[0] || "Account";
}

function initialOf(user) {
  const label = displayLabel(user);
  return (label.charAt(0) || "?").toUpperCase();
}

function signedOutHtml() {
  return `
    <a href="login.html" class="text-sm font-medium text-stone-600 hover:text-ink transition whitespace-nowrap">Sign in</a>
    <a href="signup.html" class="hidden sm:inline-flex text-sm font-medium bg-ink text-cream px-3 py-1.5 hover:bg-stone-800 transition whitespace-nowrap">Sign up</a>
  `;
}

function signedInHtml(user) {
  const name = escapeHtml(displayLabel(user));
  const email = escapeHtml(user.email || "");
  const initial = escapeHtml(initialOf(user));
  const admin = isAdminUser(user);

  return `
    <div class="relative user-menu-wrap" data-user-menu>
      <button type="button"
        class="user-menu-btn flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-ink transition max-w-[180px]"
        aria-expanded="false"
        aria-haspopup="true"
        aria-controls="user-menu-panel"
        data-user-menu-btn>
        <span class="user-avatar w-8 h-8 rounded-full bg-sand dark:bg-stone-700 flex items-center justify-center text-xs font-semibold text-ink dark:text-cream shrink-0 border border-sand dark:border-stone-600">${initial}</span>
        <span class="hidden sm:inline truncate">${name}</span>
        <svg class="w-3.5 h-3.5 shrink-0 opacity-60 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="user-menu-panel"
        class="user-menu-panel hidden absolute right-0 mt-2 w-60 rounded-xl border border-sand dark:border-stone-600 bg-white dark:bg-[#221f1c] shadow-lg z-50 overflow-hidden"
        role="menu"
        data-user-menu-panel>
        <div class="px-4 py-3 border-b border-sand dark:border-stone-600 bg-cream/50 dark:bg-stone-900/40">
          <p class="text-sm font-medium text-ink dark:text-[#f3efe9] truncate">${name}</p>
          <p class="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">${email}</p>
        </div>
        <div class="py-1.5">
          <a href="account.html" role="menuitem" class="user-menu-item">
            <span class="user-menu-ico">◎</span> My account
          </a>
          <a href="account.html#orders" role="menuitem" class="user-menu-item">
            <span class="user-menu-ico">◈</span> My orders
          </a>
          <a href="cart.html" role="menuitem" class="user-menu-item">
            <span class="user-menu-ico">▣</span> Cart
          </a>
          <a href="shop.html" role="menuitem" class="user-menu-item">
            <span class="user-menu-ico">◇</span> Continue shopping
          </a>
          ${
            admin
              ? `<a href="admin.html" role="menuitem" class="user-menu-item">
                  <span class="user-menu-ico">⚙</span> Admin panel
                </a>`
              : ""
          }
        </div>
        <div class="border-t border-sand dark:border-stone-600 py-1.5">
          <button type="button" role="menuitem" class="user-menu-item user-menu-item--danger w-full text-left" data-sign-out>
            <span class="user-menu-ico">↩</span> Sign out
          </button>
        </div>
      </div>
    </div>
  `;
}

function closeAllMenus() {
  document.querySelectorAll("[data-user-menu]").forEach((wrap) => {
    const panel = wrap.querySelector("[data-user-menu-panel]");
    const btn = wrap.querySelector("[data-user-menu-btn]");
    panel?.classList.add("hidden");
    btn?.setAttribute("aria-expanded", "false");
  });
}

function bindMenu(slot) {
  const wrap = slot.querySelector("[data-user-menu]");
  if (!wrap) return;

  const btn = wrap.querySelector("[data-user-menu-btn]");
  const panel = wrap.querySelector("[data-user-menu-panel]");
  if (!btn || !panel) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = panel.classList.contains("hidden");
    closeAllMenus();
    if (open) {
      panel.classList.remove("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  panel.addEventListener("click", (e) => e.stopPropagation());

  wrap.querySelector("[data-sign-out]")?.addEventListener("click", async () => {
    try {
      await logOut();
    } catch (_) {}
    location.href = "index.html";
  });
}

function renderSlot(slot, user) {
  if (!user) {
    slot.innerHTML = signedOutHtml();
    return;
  }
  slot.innerHTML = signedInHtml(user);
  bindMenu(slot);
}

function renderMobileAuth(user) {
  document.querySelectorAll("[data-auth-mobile]").forEach((el) => {
    if (!user) {
      el.innerHTML = `
        <a href="login.html" class="py-2 text-stone-600 block">Sign in</a>
        <a href="signup.html" class="py-2 text-stone-600 block">Create account</a>
        <a href="account.html" class="py-2 text-stone-600 block">My account</a>
      `;
      return;
    }
    const name = escapeHtml(displayLabel(user));
    const admin = isAdminUser(user)
      ? `<a href="admin.html" class="py-2 text-stone-600 block">Admin panel</a>`
      : "";
    el.innerHTML = `
      <p class="py-2 text-xs text-stone-400 truncate">Signed in as ${name}</p>
      <a href="account.html" class="py-2 text-stone-600 block">My account</a>
      <a href="account.html#orders" class="py-2 text-stone-600 block">My orders</a>
      <a href="cart.html" class="py-2 text-stone-600 block">Cart</a>
      ${admin}
      <button type="button" class="py-2 text-red-700 dark:text-red-400 block w-full text-left" data-mobile-sign-out>Sign out</button>
    `;
    el.querySelector("[data-mobile-sign-out]")?.addEventListener("click", async () => {
      try {
        await logOut();
      } catch (_) {}
      location.href = "index.html";
    });
  });
}

let outsideBound = false;

function ensureGlobalListeners() {
  if (outsideBound) return;
  outsideBound = true;

  document.addEventListener("click", () => closeAllMenus());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllMenus();
  });
}

export function bindAuthHeader() {
  const slots = document.querySelectorAll("[data-auth-slot]");
  const mobile = document.querySelectorAll("[data-auth-mobile]");
  if (!slots.length && !mobile.length) return;

  ensureGlobalListeners();

  if (!firebaseReady) {
    slots.forEach((slot) => {
      slot.innerHTML = signedOutHtml();
    });
    renderMobileAuth(null);
    return;
  }

  onUserChanged((user) => {
    slots.forEach((slot) => renderSlot(slot, user));
    renderMobileAuth(user);
    // Keep admin customer list current for every signed-in site user
    if (user?.email) {
      trackSiteUser(user).catch(() => {});
    }
  });
}

// Auto-run on pages that include this module
bindAuthHeader();
