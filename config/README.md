# Config — paste your keys here

| File | What to paste | Required now? |
|------|----------------|---------------|
| **`paystack-keys.js`** | Paystack **public** key (`pk_test_...`) | Yes, for real Paystack popup |
| **`firebase-keys.js`** | Firebase web config + admin email | Later (login/admin/database) |

## Paystack (do this for payments)

1. Open `config/paystack-keys.js`
2. Replace `pk_test_PASTE_YOUR_PUBLIC_KEY_HERE` with your key from  
   https://dashboard.paystack.com → Settings → API Keys
3. Save → refresh checkout → **Pay with Paystack**

**Never** put `sk_...` (secret key) in these files.

## Firebase (later)

1. Open `config/firebase-keys.js`
2. Paste values from Firebase Console → Project settings → Web app
3. Put your email in `ADMIN_EMAILS`
4. See `BACKEND.md`
