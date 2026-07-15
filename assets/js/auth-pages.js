/**
 * Firebase signup / login page logic
 * Uses assets/js/firebase.js — requires real keys in config/firebase-keys.js
 */
import {
  firebaseReady,
  firebaseConfig,
  signUp,
  signIn,
  resetPassword,
  onUserChanged
} from "./firebase.js";

function showError(msg) {
  const el = document.getElementById("auth-error");
  if (!el) {
    alert(msg);
    return;
  }
  el.textContent = msg;
  el.classList.remove("hidden");
}

function clearError() {
  const el = document.getElementById("auth-error");
  if (el) {
    el.textContent = "";
    el.classList.add("hidden");
  }
}

function showStatusBanner() {
  let banner = document.getElementById("firebase-status");
  const box = document.querySelector("main .max-w-md") || document.querySelector("main");
  if (!box) return;

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "firebase-status";
    banner.className = "mb-4 text-xs px-3 py-2 border";
    const h1 = box.querySelector("h1");
    if (h1?.nextElementSibling) h1.nextElementSibling.after(banner);
    else box.insertBefore(banner, box.firstChild);
  }

  if (firebaseReady) {
    banner.className =
      "mb-4 text-xs px-3 py-2 border border-green-200 bg-green-50 text-green-900";
    banner.innerHTML = `<strong>Firebase connected</strong> — project: <code>${firebaseConfig.projectId}</code>`;
  } else {
    banner.className =
      "mb-4 text-xs px-3 py-2 border border-red-200 bg-red-50 text-red-900";
    banner.innerHTML =
      `<strong>Firebase keys missing</strong> — open <code>config/firebase-keys.js</code> and paste your Web app config from Firebase Console (apiKey must start with <code>AIza</code>). That is how you fix <code>auth/api-key-not-valid</code>.`;
  }
}

function nextUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("next") || "index.html";
}

function friendlyFirebaseError(err) {
  const code = err?.code || "";
  const map = {
    "auth/api-key-not-valid":
      "Invalid API key. Paste the real apiKey from Firebase Console into config/firebase-keys.js (must start with AIza).",
    "auth/email-already-in-use": "That email is already registered. Try signing in.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account with that email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/too-many-requests": "Too many attempts. Wait a bit and try again.",
    "auth/network-request-failed": "Network error. Check internet and that you use http://localhost not file://",
    "auth/operation-not-allowed":
      "Email/Password is not enabled. Firebase Console → Authentication → Sign-in method → Email/Password → Enable."
  };
  if (map[code]) return map[code];
  if (err?.message?.includes("not configured")) {
    return err.message;
  }
  return err?.message || "Authentication failed.";
}

function initPasswordToggles() {
  document.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputId = btn.getAttribute("data-toggle-password");
      const input = document.getElementById(inputId);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.textContent = showing ? "Show" : "Hide";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showStatusBanner();
  initPasswordToggles();

  // If already signed in, go home
  onUserChanged((user) => {
    if (user && (location.pathname.endsWith("login.html") || location.pathname.endsWith("signup.html"))) {
      // don't auto-redirect on signup page before they submit — only login
    }
  });

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError();

      if (!firebaseReady) {
        showError(
          "Firebase is not configured yet. Open config/firebase-keys.js and paste your keys from the Firebase Console, then refresh."
        );
        return;
      }

      const fullName = signupForm.fullName?.value?.trim() || "";
      const email = signupForm.email.value.trim();
      const password = signupForm.password.value;
      const confirm = signupForm.confirmPassword?.value;

      if (fullName.length < 2) {
        showError("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        showError("Password must be at least 6 characters.");
        return;
      }
      if (confirm && password !== confirm) {
        showError("Passwords do not match.");
        return;
      }

      const btn = signupForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Creating account…";

      try {
        await signUp(email, password, fullName);
        window.location.href = nextUrl();
      } catch (err) {
        console.error(err);
        showError(friendlyFirebaseError(err));
        btn.disabled = false;
        btn.textContent = "Create account";
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError();

      if (!firebaseReady) {
        showError(
          "Firebase is not configured yet. Open config/firebase-keys.js and paste your keys, then refresh."
        );
        return;
      }

      const btn = loginForm.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Signing in…";

      try {
        await signIn(loginForm.email.value.trim(), loginForm.password.value);
        window.location.href = nextUrl();
      } catch (err) {
        console.error(err);
        showError(friendlyFirebaseError(err));
        btn.disabled = false;
        btn.textContent = "Sign in";
      }
    });

    document.getElementById("forgot-password")?.addEventListener("click", async (e) => {
      e.preventDefault();
      clearError();
      if (!firebaseReady) {
        showError("Configure Firebase keys first (config/firebase-keys.js).");
        return;
      }
      const email = loginForm.email.value.trim();
      if (!email) {
        showError("Enter your email above, then click Forgot password.");
        return;
      }
      try {
        await resetPassword(email);
        showError("Password reset email sent. Check your inbox.");
        document.getElementById("auth-error")?.classList.remove("bg-red-50", "text-red-700", "border-red-100");
        document.getElementById("auth-error")?.classList.add("bg-green-50", "text-green-800", "border-green-100");
      } catch (err) {
        showError(friendlyFirebaseError(err));
      }
    });
  }
});
