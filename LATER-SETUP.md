# Do this later — manual setup checklist

You do **not** need these to keep learning or demoing the site.
Do them when you want **real accounts, real payments, or a public store**.

---

## Priority order (when you’re ready)

### A. When you want a live link to share (do first)

- [ ] Install Node.js (if you don’t have it): https://nodejs.org  
- [ ] Create a free [GitHub](https://github.com) account  
- [ ] Create a free [Vercel](https://vercel.com) account  
- [ ] Deploy the site (see commands below)  
- [ ] Open your `https://….vercel.app` link and test shop → cart → demo checkout  

```powershell
cd $HOME\furniture-shop
npm i -g vercel
vercel login
vercel --prod
```

---

### B. When you want real login + admin + database

- [ ] Create a [Firebase](https://console.firebase.google.com) project  
- [ ] Enable **Authentication → Email/Password**  
- [ ] Create **Firestore** database  
- [ ] Register a **Web app** and copy config  
- [ ] Paste config into `js/firebase-config.js`  
- [ ] Put **your email** in `ADMIN_EMAILS` and in `firestore.rules`  
- [ ] Set project id in `.firebaserc`  
- [ ] Install CLI: `npm i -g firebase-tools` → `firebase login`  
- [ ] Deploy rules: `firebase deploy --only firestore:rules,firestore:indexes`  
- [ ] Sign up on the site with your admin email  
- [ ] Open `/admin/` → **Seed data** → manage products  

Full detail: **BACKEND.md**

---

### C. When you want real money (Paystack)

- [ ] Create a [Paystack](https://paystack.com) account  
- [ ] Copy **public** key → `PAYSTACK_PUBLIC_KEY` in `js/firebase-config.js`  
- [ ] Never put the **secret** key in the website — only in Cloud Functions  
- [ ] Deploy functions + set secrets (see BACKEND.md)  
- [ ] Set `FUNCTIONS_BASE_URL` after deploy  
- [ ] Test with Paystack **test** card before going live  
- [ ] For live payments: complete Paystack business verification, switch to `pk_live_` / `sk_live_`  

---

### D. When you want order emails

- [ ] Set up Gmail App Password **or** Resend/SendGrid  
- [ ] Configure Firebase Functions email settings (BACKEND.md Step 7)  
- [ ] Redeploy functions  
- [ ] Place a test paid order and confirm customer + admin emails  

---

### E. Before real customers (production)

- [ ] Replace Unsplash placeholders with **your** product photos  
- [ ] Update all copy (about, shipping policy, returns, contact)  
- [ ] Update canonical/OG URLs to your real domain  
- [ ] Add privacy policy + terms pages  
- [ ] Harden Firestore rules; use admin custom claims  
- [ ] Switch Paystack to **live** keys only after testing  
- [ ] Test on phone (Chrome/Safari) end-to-end  
- [ ] Run Lighthouse once (performance/SEO)  

---

## Quick “am I ready?” tests

| Goal | Test |
|------|------|
| Demo only | Shop works, cart works, fake checkout completes |
| Auth ready | Signup/login works, `/account.html` loads |
| Admin ready | Only your email can open `/admin/` and edit products |
| Payments ready | Test card pays → order status `paid` in Firestore |
| Emails ready | You receive confirmation email after test pay |

---

## Do NOT rush these

1. Putting Paystack **secret** key in HTML/JS  
2. Leaving Firestore **open** (anyone can delete data)  
3. Going **live** with Paystack before test mode works  
4. Committing real API secrets to a **public** GitHub repo  
