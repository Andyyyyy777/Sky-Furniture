# Paystack setup for Sky Furniture

Follow these steps to take **real** (or test-mode) payments in NGN.

---

## What you need

1. A free [Paystack](https://paystack.com) account  
2. About 10 minutes  
3. Your site opened via `http://localhost:5500` (not `file://`)

---

## Step 1 — Create Paystack account

1. Go to https://dashboard.paystack.com/signup  
2. Verify your email  
3. Log in to the dashboard  

---

## Step 2 — Copy your public key

1. Dashboard → **Settings** → **API Keys & Webhooks**  
2. Under **Test mode** (toggle Test ON for learning):  
   - Copy **Public Key** → starts with `pk_test_`  
3. Keep **Secret Key** (`sk_test_`) private — do **not** put it in the website  

---

## Step 3 — Paste key into the project

Open this file:

```
config/paystack-keys.js
```

Replace the placeholder:

```js
publicKey: "pk_test_PASTE_YOUR_PUBLIC_KEY_HERE",
```

with your real key:

```js
publicKey: "pk_test_abc123yourrealkey",
```

Save the file.

---

## Step 4 — Test the payment

```powershell
cd $HOME\furniture-shop
python -m http.server 5500
```

1. Open http://localhost:5500/shop.html  
2. Add items to cart  
3. Go to checkout → fill the form (valid Nigerian phone, state, LGA, terms)  
4. Click **Pay with Paystack**  
5. Paystack popup should open  

### Test card (test mode)

| Field | Value |
|--------|--------|
| Card number | `4084 0840 8408 4081` |
| Expiry | Any future date (e.g. `12/30`) |
| CVV | `408` |
| PIN (if asked) | `0000` |
| OTP (if asked) | `123456` |

After success: cart clears and confirmation shows with a Paystack **reference**.

---

## Step 5 — Go live (when selling for real)

1. Complete Paystack business activation  
2. Switch dashboard to **Live**  
3. Copy `pk_live_...` into `js/paystack-config.js`  
4. Test a small real payment once  
5. For strong security, add **server verification** (Firebase Function in `functions/`) and set `verifyUrl` in `paystack-config.js`  

---

## How it works in this project

```
Customer clicks Pay with Paystack
        ↓
Form validated (name, email, phone, address, LGA…)
        ↓
Paystack popup opens (amount in kobo = Naira × 100)
        ↓
Customer pays
        ↓
Order saved locally + confirmation modal
        ↓
(Optional) Server verifies payment via verifyUrl
```

Files:

| File | Role |
|------|------|
| `js/paystack-config.js` | Your public key |
| `js/paystack-pay.js` | Opens Paystack + handles success |
| `checkout.html` | Loads Paystack scripts |
| `functions/` | Optional server verify + email (later) |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| “Paystack not configured” banner | Paste real `pk_test_` key and refresh |
| Popup doesn’t open | Use localhost server; check internet; disable blockers |
| Wrong amount | Totals are in NGN; Paystack uses kobo automatically |
| CORS / module errors | Don’t open as `file://` |
| Live key fails | Account not activated for live mode yet |

---

## Security reminders

- Public key in the website = OK  
- Secret key in the website = **never**  
- For production stores, always verify payments on a server before marking “fulfilled”  
