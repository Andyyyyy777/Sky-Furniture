/**
 * Auth UI — prefers local accounts (local-auth) when Firebase is not configured.
 * If something still loads this module with bad Firebase keys, we never call Firebase Auth.
 */
import { isFirebaseConfigured } from "./firebase-app.js";

function showAuthToast(message, isError = false) {
  let el = document.getElementById("auth-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "auth-toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-full text-sm shadow-lg " +
    (isError ? "bg-red-700 text-white" : "bg-stone-900 text-stone-50");
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity = "0";
  }, 2800);
}

document.addEventListener("DOMContentLoaded", async () => {
  // Always prefer local-auth if available (loaded as classic script)
  if (window.SkyLocalAuth) {
    console.info("[Sky Furniture] Using local auth (no Firebase).");
    return;
  }

  if (!isFirebaseConfigured()) {
    console.warn(
      "[Sky Furniture] Firebase not configured. Load js/local-auth.js on this page. Redirecting signup/login to local flow."
    );
    // If we're on signup/login without local-auth, inject it
    const s = document.createElement("script");
    s.src = "js/local-auth.js";
    s.onload = () => {
      showAuthToast("Using local accounts (Firebase not set up)");
    };
    document.body.appendChild(s);
    return;
  }

  // Real Firebase path only when keys are valid
  const {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    doc,
    setDoc,
    db,
    serverTimestamp,
    isAdminUser
  } = await import("./firebase-app.js");

  // ... minimal header bind for Firebase mode
  const slot = document.querySelector("[data-auth-slot]");
  if (slot) {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        slot.innerHTML = `<a href="login.html" class="text-sm font-medium">Sign in</a>`;
        return;
      }
      slot.innerHTML = `<span class="text-sm">${user.email}</span>
        <button type="button" id="btn-sign-out" class="text-sm text-red-700">Sign out</button>`;
      document.getElementById("btn-sign-out")?.addEventListener("click", () => signOut(auth));
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value);
        window.location.href = "index.html";
      } catch (err) {
        showAuthToast(err.message, true);
      }
    });
  }

  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          signupForm.email.value,
          signupForm.password.value
        );
        if (signupForm.fullName?.value) {
          await updateProfile(cred.user, { displayName: signupForm.fullName.value });
        }
        await setDoc(doc(db, "users", cred.user.uid), {
          email: cred.user.email,
          displayName: signupForm.fullName?.value || "",
          createdAt: serverTimestamp()
        });
        window.location.href = "index.html";
      } catch (err) {
        showAuthToast(err.message, true);
      }
    });
  }
});
