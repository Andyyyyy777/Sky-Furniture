# Sky Furniture — Production Guide

## Image optimization tips

1. **Serve the right size**  
   Unsplash URLs already use width params (`?w=600`, `?w=1600`). Match size to layout:
   - Product cards: 600–800px wide  
   - Hero: 1400–1600px  
   - Thumbnails: 120–200px  

2. **Compress quality**  
   Use `q=75` (or lower) instead of `q=80–100` for web photos. You rarely need max quality.

3. **Modern formats**  
   When you host your own assets, convert to **WebP** or **AVIF** (Squoosh, ImageOptim, or Cloudinary).

4. **Lazy load below the fold**  
   Always set `loading="lazy"` and `decoding="async"` on non-hero images. Hero: `fetchpriority="high"`.

5. **Width & height attributes**  
   Reduce layout shift (CLS) by setting `width` and `height` on `<img>` tags.

6. **Descriptive `alt` text**  
   Bad: `alt="image"`  
   Good: `alt="Green linen sofa for living room seating"`  

7. **CDN / self-host for production**  
   Move off hotlinked Unsplash to your own bucket (S3, Cloudflare R2, Vercel Blob) for reliability and cache control.

8. **Don’t ship 4MB photos**  
   Target **&lt; 200KB** for cards, **&lt; 400KB** for heroes after compression.

---

## Performance tips

| Tip | Why |
|-----|-----|
| `defer` on `main.js` | Non-blocking parse |
| Preconnect fonts + image CDN | Faster first paint |
| Tailwind CDN is fine for demos | For scale, build Tailwind with purge |
| Split large data (`nigeria-locations.js`) | Only load on checkout |
| Cache static assets (`vercel.json`) | Faster repeat visits |
| Prefer CSS over heavy JS animations | Cheaper on mobile CPU |
| Avoid layout thrashing in carousels | Use opacity/transform only |
| Keep product arrays lean | Don’t embed base64 images in JS |

### Measure

- Chrome DevTools → Lighthouse (mobile)
- Aim for: LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms

### Next-level (when you grow)

- Replace Tailwind CDN with a built CSS file  
- Add a real backend + Paystack live keys  
- Service worker / PWA for offline shell  
- Image CDN with automatic resizing  

---

## SEO checklist (already partly done)

- [x] Unique `<title>` and meta description  
- [x] Open Graph + Twitter cards  
- [x] Canonical URL (update to your domain)  
- [x] JSON-LD `FurnitureStore`  
- [x] Meaningful heading hierarchy (one H1)  
- [x] Alt text on images  
- [ ] Submit sitemap after deploy (`/sitemap.xml` optional)  
- [ ] Google Search Console verification  

Update `canonical` and `og:url` in each HTML file to your live domain.

---

## Deploy to Vercel

### Option A — CLI (recommended)

```powershell
# 1. Install Vercel CLI once
npm i -g vercel

# 2. Go to the project
cd $HOME\furniture-shop

# 3. Login (browser)
vercel login

# 4. Deploy preview
vercel

# 5. Production
vercel --prod
```

Follow prompts:
- **Set up and deploy?** Yes  
- **Which scope?** your account  
- **Link to existing project?** No (first time)  
- **Project name?** e.g. `sky-furniture`  
- **Directory?** `./` (current)  
- **Override settings?** No  

### Option B — GitHub + Vercel Dashboard

1. Create a GitHub repo and push:

```powershell
cd $HOME\furniture-shop
git init
git add .
git commit -m "Sky Furniture production site"
# create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USER/sky-furniture.git
git branch -M main
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)  
3. Import the repo  
4. Framework Preset: **Other**  
5. Build Command: leave empty  
6. Output Directory: leave empty (static HTML root)  
7. Deploy  

### After deploy

1. Visit `https://your-project.vercel.app`  
2. Update canonical / OG URLs in HTML to that domain  
3. Optional: add custom domain in Vercel → Project → Settings → Domains  
4. Test cart + checkout (localStorage works on HTTPS)  

### Note on Tailwind CDN

Fine for portfolio/demo. For high traffic production, compile Tailwind:

```bash
npx tailwindcss -i ./src/input.css -o ./css/tailwind.css --minify
```

Then remove the CDN script.

---

## Dark mode

- Toggle in header (sun/moon)  
- Preference stored in `localStorage` key `sky_furniture_theme`  
- FOUC prevented with inline script in `<head>`  

---

## Feature map (production)

| Feature | Location |
|---------|----------|
| Dark mode | All pages with toggle + CSS |
| Design Your Space | Homepage `#design-space` |
| Testimonials | Homepage carousel |
| Inspiration / blog teaser | Homepage journal grid |
| SEO meta + JSON-LD | Homepage (extend to others) |
| Checkout + NG states/LGAs | `checkout.html` |
| Cart localStorage | `js/main.js` |
