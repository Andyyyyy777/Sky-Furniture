# Firestore setup — PAUSED / cancelled

**Current mode:** Admin uses **local fake data** (localStorage).  
No Firestore database is required.

To use admin:
1. http://localhost:5500/admin/
2. Password: **admin**
3. Manage products offline in this browser

---

# (Optional later) Set up Firestore

I cannot create the database inside your Google account for you.
You create it once in the Console; then we can deploy rules and seed products.

## Step 1 — Create the database (required)

1. Open: https://console.firebase.google.com/project/sky-furniture/firestore  
2. Click **Create database**  
3. Location: pick the default / closest region → **Next**  
4. **Start in test mode** (easiest for learning) → **Create**  
5. Wait until you see the **Data** tab (empty database)

Done when: Firestore shows with no “Create database” button.

## Step 2 — Deploy security rules (from your PC)

```powershell
cd $HOME\furniture-shop
npx firebase login
npx firebase use sky-furniture
npx firebase deploy --only firestore:rules,firestore:indexes
```

This uploads `firestore.rules` (admin = emekaanderson29@gmail.com).

## Step 3 — Seed products

1. http://localhost:5500/login.html → sign in as **emekaanderson29@gmail.com**  
2. http://localhost:5500/admin/  
3. Open **Seed data** tab → **Seed products to Firestore**  
4. Check Firebase Console → Firestore → `products` collection  

## Collections we use

| Collection | Purpose |
|------------|---------|
| `products` | Store catalog |
| `orders` | Customer orders |
| `users` | User profiles |

## If admin can’t write products

- Email must match admin list  
- Rules must be deployed (Step 2)  
- Or stay in **test mode** temporarily (open rules for 30 days)  
