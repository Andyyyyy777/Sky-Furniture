/**
 * Sky Furniture — Local accounts (works without Firebase)
 * Users are stored in this browser's localStorage only.
 * Later you can switch to Firebase Auth (BACKEND.md).
 */
(function () {
  const USERS_KEY = "sky_users";
  const SESSION_KEY = "sky_session";

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setSession(user) {
    if (!user) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt
      })
    );
  }

  function normalizeEmail(email) {
    return String(email || "")
      .trim()
      .toLowerCase();
  }

  /** Simple hash — demo only, not secure for production */
  function hashPassword(password) {
    let h = 0;
    const s = "sky_salt_" + String(password);
    for (let i = 0; i < s.length; i++) {
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    }
    return "h" + Math.abs(h).toString(16) + "_" + s.length;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function signup({ fullName, email, password }) {
    email = normalizeEmail(email);
    fullName = String(fullName || "").trim();
    password = String(password || "");

    if (!fullName || fullName.length < 2) {
      throw new Error("Please enter your full name.");
    }
    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("That email is already registered. Try signing in.");
    }

    const user = {
      id: "u_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      email,
      displayName: fullName,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setSession(user);
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  function login({ email, password }) {
    email = normalizeEmail(email);
    password = String(password || "");
    const users = getUsers();
    const user = users.find((u) => u.email === email);
    if (!user || user.passwordHash !== hashPassword(password)) {
      throw new Error("Invalid email or password.");
    }
    setSession(user);
    return { id: user.id, email: user.email, displayName: user.displayName };
  }

  function logout() {
    setSession(null);
  }

  function currentUser() {
    return getSession();
  }

  function showToast(message, isError) {
    let el = document.getElementById("auth-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "auth-toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-full text-sm shadow-lg transition-opacity " +
      (isError ? "bg-red-700 text-white" : "bg-stone-900 text-stone-50");
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.style.opacity = "0";
    }, 2800);
  }

  function showError(msg) {
    const errEl = document.getElementById("auth-error");
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.remove("hidden");
    } else {
      showToast(msg, true);
    }
  }

  function clearError() {
    const errEl = document.getElementById("auth-error");
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.add("hidden");
    }
  }

  function bindHeader() {
    const slot = document.querySelector("[data-auth-slot]");
    if (!slot) return;

    const user = currentUser();
    if (!user) {
      slot.innerHTML = `
        <a href="login.html" class="text-sm font-medium text-stone-600 hover:text-ink transition">Sign in</a>
        <a href="signup.html" class="hidden sm:inline-flex text-sm font-medium bg-ink text-cream px-3 py-1.5 hover:bg-stone-800 transition">Sign up</a>
      `;
      return;
    }

    const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
    slot.innerHTML = `
      <div class="relative" id="user-menu-wrap">
        <button type="button" id="user-menu-btn" class="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-ink max-w-[160px]">
          <span class="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-xs font-semibold text-ink">${initial}</span>
          <span class="hidden sm:inline truncate">${user.displayName || user.email}</span>
        </button>
        <div id="user-menu" class="hidden absolute right-0 mt-2 w-52 bg-white border border-sand shadow-lg z-50 py-1">
          <p class="px-4 py-2 text-xs text-stone-400 truncate border-b border-sand">${user.email}</p>
          <a href="account.html" class="block px-4 py-2 text-sm hover:bg-sand">My account</a>
          <button type="button" id="btn-sign-out" class="w-full text-left px-4 py-2 text-sm hover:bg-sand text-red-700">Sign out</button>
        </div>
      </div>
    `;

    document.getElementById("user-menu-btn")?.addEventListener("click", () => {
      document.getElementById("user-menu")?.classList.toggle("hidden");
    });
    document.getElementById("btn-sign-out")?.addEventListener("click", () => {
      logout();
      showToast("Signed out");
      window.location.href = "index.html";
    });
    document.addEventListener("click", (e) => {
      const wrap = document.getElementById("user-menu-wrap");
      if (wrap && !wrap.contains(e.target)) {
        document.getElementById("user-menu")?.classList.add("hidden");
      }
    });
  }

  function initSignupForm() {
    const form = document.getElementById("signup-form");
    if (!form) return;

    // Notice about local accounts
    if (!document.getElementById("local-auth-note")) {
      const note = document.createElement("p");
      note.id = "local-auth-note";
      note.className = "mb-4 text-xs text-stone-500 bg-sand/50 border border-sand px-3 py-2";
      note.innerHTML =
        "Accounts are saved in <strong>this browser</strong> (demo mode). No Firebase required.";
      form.parentNode.insertBefore(note, form);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();
      const btn = form.querySelector('[type="submit"]');
      const fullName = form.fullName?.value || "";
      const email = form.email?.value || "";
      const password = form.password?.value || "";
      const confirm = form.confirmPassword?.value || "";

      if (confirm && password !== confirm) {
        showError("Passwords do not match.");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Creating account…";
      try {
        signup({ fullName, email, password });
        showToast("Account created!");
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get("next") || "index.html";
      } catch (err) {
        showError(err.message || "Could not create account.");
        btn.disabled = false;
        btn.textContent = "Create account";
      }
    });
  }

  function initLoginForm() {
    const form = document.getElementById("login-form");
    if (!form) return;

    if (!document.getElementById("local-auth-note")) {
      const note = document.createElement("p");
      note.id = "local-auth-note";
      note.className = "mb-4 text-xs text-stone-500 bg-sand/50 border border-sand px-3 py-2";
      note.innerHTML =
        "Sign in with an account you created on this site (saved in this browser).";
      form.parentNode.insertBefore(note, form);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearError();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Signing in…";
      try {
        login({ email: form.email.value, password: form.password.value });
        showToast("Welcome back!");
        const params = new URLSearchParams(window.location.search);
        window.location.href = params.get("next") || "index.html";
      } catch (err) {
        showError(err.message || "Sign in failed.");
        btn.disabled = false;
        btn.textContent = "Sign in";
      }
    });

    document.getElementById("forgot-password")?.addEventListener("click", (e) => {
      e.preventDefault();
      showError(
        "Password reset needs email (Firebase). For demo: create a new account or clear site data."
      );
    });
  }

  function initAccountPage() {
    const root = document.getElementById("orders-list");
    if (!root || !document.body) return;
    // Only enhance if this looks like account page
    if (!window.location.pathname.includes("account")) return;

    const user = currentUser();
    if (!user) {
      root.innerHTML = `<p class="text-stone-600">Please <a class="underline" href="login.html?next=account.html">sign in</a> to view your account.</p>`;
      return;
    }

    const paid = (() => {
      try {
        return JSON.parse(localStorage.getItem("sky_furniture_paid_orders") || "[]");
      } catch {
        return [];
      }
    })();

    const fmt = (n) =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
      }).format(n || 0);

    root.innerHTML = `
      <div class="bg-white border border-sand p-5 mb-6">
        <p class="text-xs uppercase tracking-wide text-stone-400">Signed in as</p>
        <p class="font-medium mt-1">${user.displayName || "Customer"}</p>
        <p class="text-sm text-stone-500">${user.email}</p>
      </div>
      <h2 class="font-display text-2xl mb-4">Recent payments</h2>
      ${
        paid.length
          ? paid
              .map(
                (o) => `
        <article class="bg-white border border-sand p-5 mb-3">
          <p class="font-medium tabular-nums text-sm">${o.orderNumber || o.paymentRef || "Order"}</p>
          <p class="text-sm mt-1">${fmt(o.totals?.total)} · ${o.status || "paid"}</p>
          <p class="text-xs text-stone-400 mt-1">${o.createdAt ? new Date(o.createdAt).toLocaleString("en-NG") : ""}</p>
        </article>`
              )
              .join("")
          : `<p class="text-stone-500 text-sm">No payments yet. <a href="shop.html" class="underline">Shop now</a></p>`
      }
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindHeader();
    initSignupForm();
    initLoginForm();
    initAccountPage();
  });

  window.SkyLocalAuth = {
    signup,
    login,
    logout,
    currentUser,
    getUsers
  };
})();
