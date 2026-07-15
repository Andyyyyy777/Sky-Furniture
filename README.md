# Sky Furniture — Production-ready static e‑commerce

HTML · Tailwind CSS (CDN) · Vanilla JS · NGN pricing · Nigeria-wide checkout

## Quick start

```powershell
cd $HOME\furniture-shop
code .
# open index.html or:
python -m http.server 5500
```

## Paystack payments

1. Edit `js/paystack-config.js` → paste your `pk_test_...` key  
2. Follow **[PAYSTACK-SETUP.md](./PAYSTACK-SETUP.md)**  
3. Checkout → **Pay with Paystack**

## Backend (Firebase — optional later)

Full guide: **[BACKEND.md](./BACKEND.md)**

- Auth: `login.html` / `signup.html`
- Admin: `admin/index.html`
- Server verify + emails: `functions/`

## Deploy frontend to Vercel

```powershell
npm i -g vercel
cd $HOME\furniture-shop
vercel login
vercel --prod
```

Also see **[PRODUCTION.md](./PRODUCTION.md)** (images, SEO, performance, dark mode).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, design tool, testimonials, blog teaser, SEO |
| `shop.html` | Catalog, filters, search |
| `product-detail.html` | PDP |
| `cart.html` | Cart (localStorage) |
| `checkout.html` | Full checkout + all NG states/LGAs |

## Features

- Dark mode toggle (persisted)
- Design Your Space room selector
- Testimonials carousel
- Inspiration / blog teaser
- Quick view, cart, fake Paystack/Stripe
- 37 states + 774 LGAs
- SEO meta, OG tags, JSON-LD

## Project layout

```
furniture-shop/
├── index.html
├── shop.html
├── product-detail.html
├── cart.html
├── checkout.html
├── vercel.json
├── PRODUCTION.md
├── css/styles.css
└── js/
    ├── main.js
    └── nigeria-locations.js
```
