# Security notes — Sky Furniture

## What is safe in the frontend (public repo / browser)

| Item | Why |
|------|-----|
| Firebase **web** `apiKey`, `appId`, etc. | Designed for client apps. Restrict by HTTP referrer in Google Cloud Console. |
| Paystack **public** key `pk_test_…` / `pk_live_…` | Meant for browser checkout. |
| Product images, prices, catalog JS | Public storefront data |

## What must NEVER go in HTML/JS or GitHub

| Item | Where it belongs |
|------|------------------|
| Paystack **secret** `sk_…` | Cloud Functions / server env only |
| Firebase **service account** JSON | Server only, never commit |
| Gmail / SMTP app passwords | Functions secrets only |
| Admin local password | `config/admin-access.local.js` (gitignored) only |

## Admin access (after hardening)

1. **Preferred:** Sign in with an email in `ADMIN_EMAILS` → open `/admin/`
2. **Local machine only:** copy `config/admin-access.example.js` → `admin-access.local.js` and set a strong password  
3. There is **no** default public password (`admin` was removed)

## After this repo was public — recommended actions

1. **Firebase Console** → Project settings → your Web API key → restrict to your domains (`localhost`, `sky-furniture.vercel.app`, custom domain).
2. **Paystack** → if the public test key was widely shared, you can roll/regenerate keys in the dashboard (optional for `pk_test_`).
3. **Never** rotate by pasting `sk_` into the website.
4. Add live domain under Firebase Authentication → Authorized domains.
5. Deploy updated `firestore.rules` when you enable Firestore (orders/customers are not world-readable).

## File layout

```
config/firebase-keys.js          # Web config + ADMIN_EMAILS (client OK)
config/paystack-keys.js          # Public key only
config/admin-access.js           # Empty default (no shared password)
config/admin-access.local.js     # Gitignored — your machine only
config/*.example.js              # Safe templates for new machines
```
