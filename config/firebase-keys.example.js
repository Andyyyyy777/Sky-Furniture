/**
 * EXAMPLE — copy to firebase-keys.js and fill with your Firebase web app config.
 * Web apiKey is public by design; lock it down in Google Cloud API key restrictions.
 */
export const firebaseConfig = {
  apiKey: "AIzaSy_PASTE_YOUR_WEB_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxxx"
};

export const FUNCTIONS_BASE_URL =
  "https://us-central1-your-project.cloudfunctions.net";

/** Emails allowed into /admin and admin menu */
export const ADMIN_EMAILS = ["you@example.com"];

if (typeof window !== "undefined") {
  window.SKY_FIREBASE = {
    firebaseConfig,
    FUNCTIONS_BASE_URL,
    ADMIN_EMAILS
  };
}
