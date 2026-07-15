# Important things to know (Sky Furniture)

Read this once. It will save you headaches.

---

## 1. How the project is layered

| Layer | What it is | Needs setup? |
|-------|------------|--------------|
| **Demo store** | HTML + JS products + localStorage cart | No — works now |
| **Backend** | Firebase Auth, Firestore, Functions | Yes — later (LATER-SETUP.md) |
| **Payments** | Paystack | Yes — later |
| **Hosting** | Vercel or Firebase Hosting | Optional — when you want a public URL |

If something “backend” fails, the **demo shop can still work**.

---

## 2. Always open the site via a local server

Do **not** only double‑click HTML files for auth/backend pages.

```powershell
cd $HOME\furniture-shop
python -m http.server 5500
```

Then use: `http://localhost:5500`

Why: browser modules (`type="module"`) and Firebase block many `file://` features.

---

## 3. Cart is in the browser

Demo cart uses **localStorage**. Clearing browser data empties the cart.  
Real orders (after Firebase) live in the **cloud**.

---

## 4. Secrets vs public keys

| Key | Where it can live |
|-----|-------------------|
| Paystack **public** `pk_…` | Website OK |
| Paystack **secret** `sk_…` | Server/Functions only — never in HTML/JS |
| Firebase **web** config | Website OK (restricted by rules + domains) |
| Email passwords / API keys | Functions only |

---

## 5. Nigeria-specific bits already built

- Prices in **NGN**  
- Checkout: all **states + LGAs**  
- Lagos delivery / Ikeja pickup options  
- Nigerian phone validation on checkout  

---

## 6. Admin is not “magic secure” until rules are deployed

Admin checks your email list **and** Firestore rules.  
Anyone who guesses `/admin/` without your Firebase project can’t see your cloud data — but you must still deploy rules and only list trusted emails.

---

## 7. Two checkouts exist until you fully switch

- **Demo** (`main.js`): fake payment, localStorage order  
- **Real** (`checkout-firebase.js` + Paystack): needs config  

That’s intentional so you can learn without accounts.

---

## 8. Images are placeholders

Unsplash links are for design only. For a real store, use **your photos** (or a CDN you control). Unsplash can change or rate-limit.

---

## 9. Tailwind CDN is for learning

Fine for portfolio/demo. For heavy traffic later, compile Tailwind (see PRODUCTION.md).

---

## 10. Your main docs

| File | When to open it |
|------|------------------|
| `LATER-SETUP.md` | Manual tasks when you’re ready |
| `BACKEND.md` | Firebase + Paystack deep setup |
| `PRODUCTION.md` | Images, SEO, performance, Vercel tips |
| `README.md` | Project map |

---

## If something breaks

1. Did you use `localhost` (not `file://`)?  
2. Hard refresh: Ctrl+F5  
3. Browser console (F12) — read the red error  
4. If Firebase: is config still `YOUR_API_KEY`? → not configured yet, expected  

You’re not failing — that step just isn’t done yet.
