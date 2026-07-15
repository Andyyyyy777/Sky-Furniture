# Sky Furniture — Backend Setup (Firebase + Paystack)

This guide turns your static site into a real app with:

1. **User authentication** (sign up / login)  
2. **Admin panel** (add / edit products)  
3. **Firestore** database (products + orders)  
4. **Real Paystack** payments  
5. **Email notifications** on paid orders  

> **Why Firebase?** Works great with static HTML on Vercel, free tier is enough to learn, Auth + DB + Functions in one place.  
> **Supabase alternative:** at the end of this doc.

---

## Architecture

```
Browser (HTML/JS)
  ├── Firebase Auth          → login / signup / session
  ├── Cloud Firestore        → products, orders, users
  ├── Paystack Popup         → card / bank / USSD (NGN)
  └── Cloud Function         → verify payment + send email
        └── Paystack API (secret key)
        └── Gmail / SMTP
```

### New files in this project

| Path | Role |
|------|------|
| `js/firebase-config.js` | Your keys (edit this) |
| `js/firebase-app.js` | Firebase init |
| `js/auth-ui.js` | Login/signup UI + header |
| `js/products-api.js` | Firestore CRUD |
| `js/paystack-checkout.js` | Paystack + order create |
| `js/checkout-firebase.js` | Wires checkout page |
| `login.html` / `signup.html` | Auth pages |
| `account.html` | Customer order history |
| `admin/index.html` | Admin panel |
| `functions/` | Paystack verify + emails |
| `firestore.rules` | Security rules |

---

## Step 0 — Prerequisites

- Node.js 18+ ([nodejs.org](https://nodejs.org))  
- A Google account  
- A [Paystack](https://paystack.com) account (Nigeria)  
- Firebase CLI:

```powershell
npm install -g firebase-tools
firebase login
```

---

## Step 1 — Create Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**  
2. Name it e.g. `sky-furniture`  
3. Disable Google Analytics if you want (optional)  
4. Open the project  

### Enable Authentication

1. **Build → Authentication → Get started**  
2. **Sign-in method → Email/Password → Enable** → Save  

### Create Firestore

1. **Build → Firestore Database → Create database**  
2. Start in **production mode** (we’ll deploy rules next)  
3. Choose a region (e.g. `europe-west1` or closest to you)  

### Register a Web app

1. Project Overview → **</>** Web  
2. App nickname: `sky-furniture-web`  
3. Copy the `firebaseConfig` object  

### Paste config

Edit `js/firebase-config.js`:

```js
export const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "sky-furniture.firebaseapp.com",
  projectId: "sky-furniture",
  storageBucket: "sky-furniture.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123:web:abc"
};

export const PAYSTACK_PUBLIC_KEY = "pk_test_...";  // from Paystack dashboard
export const FUNCTIONS_BASE_URL = "https://us-central1-sky-furniture.cloudfunctions.net";
export const ADMIN_EMAILS = ["your-real-email@gmail.com"];
```

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "sky-furniture"
  }
}
```

Also put the same admin email in `firestore.rules` under `isAdmin()`.

---

## Step 2 — User authentication

### Pages

| URL | Purpose |
|-----|---------|
| `/signup.html` | Create account |
| `/login.html` | Sign in (+ forgot password) |
| `/account.html` | My orders (logged-in) |

### What happens on signup

1. `createUserWithEmailAndPassword`  
2. Optional `updateProfile({ displayName })`  
3. Write `users/{uid}` in Firestore  

### Test locally

```powershell
cd $HOME\furniture-shop
# Must use a local server (modules + Firebase need http:// not file://)
python -m http.server 5500
```

Open `http://localhost:5500/signup.html` → create account → check Firebase Auth users.

### Header “Sign in”

Homepage loads `auth-ui.js` and fills `[data-auth-slot]`.  
Add the same slot + module to other pages when you want:

```html
<div data-auth-slot></div>
<script type="module" src="js/auth-ui.js"></script>
```

---

## Step 3 — Deploy Firestore rules & indexes

```powershell
cd $HOME\furniture-shop
firebase use YOUR_PROJECT_ID
firebase deploy --only firestore:rules,firestore:indexes
```

### Collections

```
products/{id}
  name, category, price, image, description, active, inStock, ...

orders/{id}
  userId, customer{}, items[], totals{}, status, payment, paymentRef, ...

users/{uid}
  email, displayName, role, createdAt
```

---

## Step 4 — Admin panel (add / edit products)

1. Add **your email** to `ADMIN_EMAILS` in `firebase-config.js` **and** `firestore.rules`  
2. Sign up / login with that email  
3. Open `http://localhost:5500/admin/`  
4. Tab **Seed data** → seed sample products  
5. Tab **Products** → Add / Edit / Delete  
6. Tab **Orders** → change status  

### Security note

Email allowlist is fine for learning. For production, set **custom claims**:

```js
// After deploying setAdminClaim function (see functions/index.js)
// or use a one-off Node script with Admin SDK:
admin.auth().setCustomUserClaims(uid, { admin: true });
```

Then check `request.auth.token.admin == true` in rules (already supported).

---

## Step 5 — Load products from Firestore (optional)

By default the shop still uses the local `PRODUCTS` array in `main.js` (works offline).

To prefer Firestore, add this module load after `main.js` on `shop.html` / `index.html`:

```html
<script type="module">
  import { fetchProductsFromFirestore } from "./js/products-api.js";
  try {
    const remote = await fetchProductsFromFirestore();
    if (remote.length && window.SkyFurniture) {
      // Replace in-memory catalog if you expose a setter, or:
      window.PRODUCTS_REMOTE = remote;
      console.log("Loaded", remote.length, "products from Firestore");
      // Re-render shop if needed:
      if (typeof window.__renderShop === "function") {
        // map into global products used by shop — advanced wiring
      }
    }
  } catch (e) {
    console.warn("Firestore products unavailable, using local demo data", e);
  }
</script>
```

**Practical approach:** manage catalog in **Admin → Firestore**, and keep seeding from local until you’re ready to switch the shop fully.

---

## Step 6 — Real Paystack payments

### 6.1 Paystack dashboard

1. [dashboard.paystack.com](https://dashboard.paystack.com) → **Settings → API Keys & Webhooks**  
2. Copy **Public key** → `PAYSTACK_PUBLIC_KEY` in `firebase-config.js`  
3. Copy **Secret key** → only in Cloud Functions config (never in frontend)  

### 6.2 Checkout flow (already wired)

On `checkout.html`:

1. Customer fills form (validated)  
2. Clicks **Pay with Paystack**  
3. Creates `orders/{id}` with `status: pending_payment`  
4. Opens Paystack popup (amount in **kobo**)  
5. On success → calls Cloud Function `verifyPaystackPayment`  
6. Function verifies with Paystack API, sets `status: paid`, sends emails  
7. Cart cleared + confirmation UI  

### 6.3 Deploy Cloud Functions

```powershell
cd $HOME\furniture-shop\functions
npm install

cd ..
firebase functions:config:set paystack.secret="sk_test_YOUR_SECRET"

# Email (Gmail App Password recommended)
firebase functions:config:set email.user="you@gmail.com" email.pass="your-app-password" email.from="Sky Furniture <you@gmail.com>" email.admin="you@gmail.com"

firebase deploy --only functions
```

After deploy, note the URL:

```
https://us-central1-YOUR_PROJECT.cloudfunctions.net/verifyPaystackPayment
```

Set in `firebase-config.js`:

```js
export const FUNCTIONS_BASE_URL = "https://us-central1-YOUR_PROJECT.cloudfunctions.net";
```

### 6.4 Test cards (Paystack test mode)

| Card | Result |
|------|--------|
| `4084084084084081` | Success |
| CVV any 3 digits | |
| Expiry any future date | |
| PIN `0000` if asked | |

### 6.5 Go live

1. Complete Paystack business activation  
2. Swap `pk_test_` → `pk_live_` and `sk_test_` → `sk_live_`  
3. Redeploy functions with live secret  

---

## Step 7 — Email notifications

The function `verifyPaystackPayment` sends:

1. **Customer** — order confirmation  
2. **Admin** — new order alert  

### Gmail setup

1. Google Account → Security → 2-Step Verification ON  
2. App passwords → generate for Mail  
3. Use that as `email.pass`  

### Better for production: Resend / SendGrid

Replace `nodemailer` transport in `functions/index.js` with their SMTP or API. Example (Resend SMTP):

```js
nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  auth: { user: "resend", pass: process.env.RESEND_API_KEY }
});
```

---

## Step 8 — Deploy the full stack

### Option A — Firebase Hosting

```powershell
cd $HOME\furniture-shop
firebase deploy
```

### Option B — Vercel (frontend) + Firebase (backend)

```powershell
# Frontend
vercel --prod

# Backend only
firebase deploy --only firestore,functions
```

Add your Vercel domain to Firebase Auth → **Authorized domains**.

---

## Security checklist

- [ ] Secret Paystack key **only** in Functions config  
- [ ] Firestore rules deployed (not open to the world)  
- [ ] Admin emails / custom claims set  
- [ ] Auth authorized domains include production URL  
- [ ] Never commit real keys to public GitHub (use env / local untracked config)  

Add to `.gitignore`:

```
functions/.env
**/serviceAccount*.json
js/firebase-config.local.js
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `api-key-not-valid` | Paste real web config into `firebase-config.js` |
| CORS error on verify | Function already sets CORS; check `FUNCTIONS_BASE_URL` |
| Admin panel “not in ADMIN_EMAILS” | Same email in config + rules; re-login |
| Orders query failed | Deploy `firestore.indexes.json` |
| Emails not sending | App password / check Functions logs: `firebase functions:log` |
| Paystack amount error | Totals must be whole Naira; amount = Naira × 100 kobo |
| ES modules not loading | Use `http://localhost` not `file://` |

---

## Supabase alternative (short)

If you prefer Postgres + Supabase:

1. Create project at [supabase.com](https://supabase.com)  
2. **Auth** → Email provider  
3. Tables: `products`, `orders`, `profiles`  
4. Row Level Security policies (similar to Firestore rules)  
5. Edge Function for Paystack verify + email  
6. JS client: `@supabase/supabase-js` from CDN  

Collections map roughly:

| Firebase | Supabase |
|----------|----------|
| Auth users | `auth.users` |
| `products` | `products` table |
| `orders` | `orders` table |
| Cloud Functions | Edge Functions |
| Firestore rules | RLS policies |

Stick with **Firebase** for this repo’s ready-made code.

---

## Quick test script

1. Configure `firebase-config.js`  
2. `firebase deploy --only firestore:rules,functions`  
3. `python -m http.server 5500`  
4. Sign up with admin email  
5. Admin → Seed products  
6. Shop → Cart → Checkout → Pay with Paystack test card  
7. Check Firestore `orders` = `paid`  
8. Check email inbox  

---

## Support files reference

**Verify payment (server)** — `functions/index.js` → `verifyPaystackPayment`  

**Create order + popup (client)** — `js/paystack-checkout.js`  

**Admin CRUD** — `admin/admin.js`  

You’re done when a real test payment creates a `paid` order and you receive the confirmation email.
