# RNB Collections — Wearix Design Specification

> **Source of truth:** https://wearix.framer.website/  
> **Audited:** 2026-09-07  
> **Purpose:** Implementation blueprint for cloning the Wearix Framer homepage in Next.js.  
> **Status:** Analysis only — landing page UI is NOT implemented yet.

---

## 1. Page structure (verified)

Exact homepage section order from the live site:

| # | Section | Framer name / label | Notes |
|---|---------|---------------------|-------|
| 01 | Announcement Bar | Desktop ticker nav | Black bar, infinite horizontal ticker |
| 02 | Navigation / Header | Desktop Transparent / Mobile Menu | Overlays hero; logo + links + search + CTAs |
| 03 | Hero | Hero Section + Hero Carousel | Full-viewport split: copy left, image carousel right |
| 04 | Category Strip | Category labels after hero | Text chips: Urban → New Arrivals |
| 05 | New Arrivals | “Fresh fits in our latest drop” | 9 products, badge “New” |
| 06 | Brand Story | “Defining modern style” | Since 2014 + copy + video + CTAs |
| 07 | Best Sellers | Best sellers | 6 products, badge “Best seller” |
| 08 | Collections | Collections wrapper | Men’s / Women’s / Children’s cards |
| 09 | Customer Reviews | Reviews | Testimonial + brand logos + rating |
| 10 | Features | Styles & Wear / “Where style meets ease” | 6 feature cards (Grid 3x) |
| 11 | Blog | Wearix Voice | 1 featured + 2 small posts |
| 12 | Social Gallery | Stay connected + Smooth scroll / Carousel | Community image carousel |
| 13 | Newsletter | “Subscribe to our news later” | Email capture |
| 14 | Footer | Quick links | Links, social, contact |

**Not present as separate top-level sections:** dedicated “Announcement” copy other than the Black Friday ticker; no invented fashion sections beyond the list above.

---

## 2. Breakpoints (from Framer CSS)

| Name | Range | Evidence |
|------|-------|----------|
| Mobile | `max-width: 809.98px` | Framer phone variants |
| Tablet | `810px` – `1199.98px` | Framer tablet variants |
| Desktop | `min-width: 1200px` | Framer desktop variants |

---

## 3. Design tokens — colors (extracted)

From Framer CSS variables on the live page:

```css
--background: #f8f8f8;          /* page canvas */
--foreground: #000000;          /* primary text / black UI */
--muted: #787878;               /* secondary text */
--muted-2: #a1a1a1;             /* tertiary / inactive */
--border: rgba(0, 0, 0, 0.1);   /* subtle borders */
--border-strong: rgba(0, 0, 0, 0.15);
--button: #000000;              /* primary filled button */
--button-text: #ffffff;
--button-secondary-bg: #ffffff;
--button-secondary-text: #000000;
--secondary-background: #ececea; /* warm gray surfaces / cards */
--surface-white: #ffffff;
--accent: #ff6a00;              /* rare accent (Framer token present) */
--link-accent: #0099ff;         /* Framer default link token in rich text */
--overlay: rgba(0, 0, 0, 0.8);
--overlay-soft: rgba(0, 0, 0, 0.3);
--nav-link-on-dark: rgba(255, 255, 255, 0.8);
--glass: rgba(255, 255, 255, 0.15);
--footer-dark: #1f1f1f;         /* dark footer surface token */
```

**Do not invent additional brand colors.** Prefer black / off-white / warm gray.

---

## 4. Typography audit

### Font families (live)

| Family | Role | Source |
|--------|------|--------|
| **Ronzino** | Display / headings (h1–h4, large quotes) | Framer-hosted `woff2` |
| **Inter** | UI, nav, labels, buttons, body meta | Framer-hosted Inter + Inter Variable |
| System fallback | — | `sans-serif` placeholders in Framer |

**Weight usage:** mostly `500` (medium) for UI + headings; body paragraphs often Inter Variable `400`.

### Typography table

| Element | Font | Weight | Desktop | Tablet (approx) | Mobile | Line height | Letter spacing | Color |
|---------|------|--------|---------|-----------------|--------|-------------|----------------|-------|
| Announcement ticker | Inter | 500 | 12px | 12px | 10–12px | 1.3–1.4em | -0.025em to -0.035em | `#fff` on `#000` |
| Nav links | Inter | 500 | 12px | 12px | 12px | 1.4em | -0.025em | `rgba(255,255,255,0.8)` on hero / `#000` scrolled |
| Hero eyebrow tags | Inter | 500 | 12px | 12px | 11–12px | 1.4em | -0.025em | `#000` |
| Hero heading (h1) | Ronzino | 500 | **62px** | **56px** | **40px** | 1.12em | -0.03em | `#000` |
| Hero paragraph | Inter Variable | 400 | 16–18px | 16px | 16px | 1.5em | -0.03em | `#000` / muted |
| Buttons | Inter | 500 | 12px | 12px | 11–12px | 1.5em | -0.03em | depends on variant |
| Section label (eyebrow) | Inter | 500 | 12px | 12px | 11–12px | 1.5em | -0.03em | `#000` or `#787878` |
| Section heading (h2) | Ronzino | 500 | **44–48px** | **44px** | **32px** | 1.165em | -0.03em | `#000` |
| Collection card title (h3) | Ronzino | 500 | **44px** | **35px** | **28px** | 1.18em | -0.03em | `#fff` on image |
| Collection / feature (h4) | Ronzino | 500 | **34–36px** | **34px** | **26px** | 1.22em | -0.03em | `#000` / `#fff` |
| Body / descriptions | Inter Variable | 400 | **15px** (most common) | 15px | 15px | 1.5–1.55em | -0.035em | `#787878` or `#000` |
| Product name | Inter | 500 | 14–15px | 14px | 13–14px | ~1.4em | -0.03em | `#000` |
| Product price | Inter | 500 | 12–14px | 12px | 12px | 1.4em | -0.025em | `#000` |
| Old price | Inter | 500 | 12px | 12px | 12px | 1.4em | -0.025em | `#787878` / `#a1a1a1` + strikethrough |
| Badge (“New” / “Best seller”) | Inter | 500 | 11–12px | 11–12px | 11px | 1.5em | -0.03em | New: `#000` on `#fff`; Best seller: `#fff` on `#000` |
| Testimonial quote | Ronzino | 500 | **20–22px** | 20px | 20px | 1.4–1.5em | -0.03em | `#000` |
| Blog titles | Ronzino / Inter | 500 | 20–34px | — | 20–26px | 1.22–1.4em | -0.03em | `#000` / `#fff` on featured |
| Footer text | Inter | 500 | 12px | 12px | 12px | 1.4em | -0.025em | muted on dark |

**Text transform:** generally none (sentence / title case as authored). Badges use title case as authored (“New”, “Best seller”).

---

## 5. Spacing & container system

| Token | Value | Notes |
|-------|-------|-------|
| Content max width | **1200px** | Dominant Framer width token |
| Occasional max | 1240–1400px | Rare; prefer 1200px |
| Desktop horizontal padding | ~20–25px (announcement uses `9px 25px`) | Approximate from CSS |
| Mobile horizontal padding | ~16–20px | Approximate |
| Common gaps | 8px, 10px, 14px, 16px, 20px, 22px, 24px, 32px | |
| Section vertical rhythm | ~32–80px between major blocks | Mark approximate until pixel-perfect pass |
| Product card width | **~373px** | Desktop card component |
| Product grid | Desktop **3 col**; tablet **2 col**; mobile **1 col** | `repeat(3/2/1, minmax(50px,1fr))` |
| Features grid | Desktop **3×2**; collapses on smaller breakpoints | `Grid 3x` |
| Border radius — pills | **999px** | Search / some chips |
| Border radius — cards/media | **10px** (common), **12px** (some) | |
| Badge padding | `5px 12px` | |
| Button padding | `8px 15px` | Primary CTA component |
| Button gap (icon/text) | `10px` | |

### Image treatment (global)

- `object-fit: cover`
- `object-position: center` (default; rare custom positions exist)
- Product images: portrait-leaning crops inside rounded cards
- Hero carousel: cover, centered, with shadow / bottom fade overlays

---

## 6. Section-by-section measurements

Values marked **(approx)** could not be fully isolated as a single computed style from SSR CSS without a browser inspector.

### 01 — Announcement Bar

| Property | Value |
|----------|-------|
| Background | `#000000` |
| Width | 100% |
| Padding | `9px 25px` **(measured from CSS var `--y6nudw`)** |
| Content | Infinite ticker: **“Black friday sale 50% off”** (repeated) |
| Text | Inter 500, ~12px, white |
| Motion | Horizontal `translateX` marquee / ticker (`ticker-item`) |
| Height | Content-driven, compact **(approx 36–44px)** |

### 02 — Navigation

| Property | Value |
|----------|-------|
| Desktop | Transparent over hero; logo left; links; search (blur `10px`); CTAs |
| Links | About, Shop, Blog, Contact |
| CTAs | “Shop all items”, “Contact Wearix” (variants) |
| Mobile | Hamburger `Menu`; stacked links |
| Logo asset | `/Images/wearix-001.svg` |

### 03 — Hero (critical)

| Property | Value |
|----------|-------|
| Height | Desktop **100vh**; Mobile **90vh** |
| Layout | Desktop: `flex-direction: row`; Mobile: `column` |
| Gap | `10px` |
| Width | 100% |
| Padding | `0` on section shell |
| Background | Inherits page `#f8f8f8` / imagery on right |
| Eyebrow tags | “Soft”, “Warm Winter Layers”, “Premium” |
| Heading | “Premium wear for modern living” — Ronzino 62/56/40 |
| Heading line breaks | Soft wrap; treat as 2-line display on desktop **(approx)** |
| Paragraph | “Discover our new range of soft clothes made for your daily look and your best days with the finest fabrics.” |
| Paragraph max-width | Constrained in left text column **(approx 420–520px)** |
| Buttons | “See all collections” (primary/dark) + “Contact us” (secondary/light) |
| Button padding | `8px 15px`; gap between buttons **~10–14px (approx)** |
| Right side | **Hero Carousel** — multi-image stack/carousel with shadows + bottom fade |

#### Hero assets (MD5-matched to live Framer images)

Carousel order as first-seen in live HTML:

1. `/Images/wearix-006.png`
2. `/Images/wearix-009.png`
3. `/Images/wearix-011.png`
4. `/Images/wearix-002.jpg`
5. `/Images/wearix-014.png`
6. `/Images/wearix-016.png`
7. `/Images/wearix-018.jpg`

**Primary / default hero visual (first carousel slide):**  
`/Images/wearix-006.png`

### 04 — Category Strip

| Property | Value |
|----------|-------|
| Labels (exact) | Urban, Latest, Premium, Arctic, Casual, Iconic, Unique, New Arrivals |
| Layout | Horizontal strip / chips after hero **(approx)** |
| Imagery | Shares / continues fashion photography language with hero set; no separate unique category product SKUs required for v1 |

### 05 — New Arrivals

| Property | Value |
|----------|-------|
| Eyebrow | (section context) New Arrivals |
| Heading | “Fresh fits in our latest drop” |
| CTA | “See all collections” |
| Grid | 3 / 2 / 1 columns |
| Card width | ~373px desktop |
| Image | `object-fit: cover`; `object-position: center` |
| Badge | “New” — white pill, black text |
| Count | **9 products** |

### 06 — Brand Story

| Property | Value |
|----------|-------|
| Brand mark | “Wearix” |
| Eyebrow | “Since 2014” |
| Heading | “Defining modern style” |
| Body | “A decade ago, we set out to redefine the modern silhouette. Today, we merge urban utility with high-end aesthetics in a resilient, beautiful collection.” |
| CTAs | “More about us”, “Contact us” |
| Media | Embedded **video** (`framerusercontent` mp4). Local poster PNG from live CDN was **not** in `/public/Images` as an exact hash match — use video later or a closest local frame; do not invent a stock replacement. |

### 07 — Best Sellers

| Property | Value |
|----------|-------|
| Eyebrow | “Best sellers” |
| Heading | “Our signature best selling pieces” |
| CTA | “See all collections” |
| Badge | “Best seller” — black pill, white text |
| Count | **6 products** |
| Grid | Same product card system as New Arrivals |

### 08 — Collections

| Property | Value |
|----------|-------|
| Eyebrow | “Our Collections” |
| Heading | “Modern collections defined by simplicity” |
| CTA | “Shop all items” |
| Cards | 3 — Men’s / Women’s / Children’s |
| Card content | Title, description, price range, “All collections”, badge (New / year) |
| Media | Multi-image slideshow per card |

**Copy (exact):**

1. **Men’s wear** — “Premium modern collection for men” — from **$45.00** to **$180.00** — badge “New”
2. **Women’s wear** — “Modern daily wear for women” — from **$35.00** to **$150.00** — badge “New”
3. **Children’s wear** — “Modern easy styles for children” — from **$25.00** to **$90.00** — badge “2026”

### 09 — Customer Reviews

| Property | Value |
|----------|-------|
| Eyebrow | “Customer reviews” |
| Heading | “The voice of quality” |
| Intro | “Experience the difference through the words of customers who value premium fabrics and timeless design.” |
| Quote | “The premium quality of the men's collection is truly unmatched lately. The fabrics feel incredibly premium and soft. This specific tailored fit is perfect for my busy office. A very sharp look. I love it every day.” |
| Author | James Carter, Creative Director |
| Rating | 4.9/5 from 1k+ reviews |
| Logos | Brand/logo SVGs in `/Images/wearix-121.svg` … `wearix-127.svg` (+ related) |
| Avatar | `/Images/wearix-122.png` |

### 10 — Features (“What defines our wear”)

| Property | Value |
|----------|-------|
| Heading | “Where style meets ease” |
| Sub | “Thoughtful design blending modern style, comfort, and versatility for everyday living across lifestyles.” |
| Layout | 6 cards in 3-column grid (desktop) |
| Cards | Everyday Comfort; Modern Silhouettes; Effortless Styling; Daily Essentials; Wearable Design; Clean Aesthetic |
| Each card | Image(s), title, short description, 3 tags |

### 11 — Blog / Wearix Voice

| Property | Value |
|----------|-------|
| Eyebrow | “Wearix Voice” |
| Heading | “Elevating your daily style journey” |
| CTA | “Read all blogs” |
| Layout | 1 featured (dark) + 2 compact posts |

**Homepage posts (exact):**

1. Style Guide — “How to master the art of minimal street style” — 8 min read — Jan 29, 2026 — `/Images/wearix-155.jpg`
2. Fashion Tips — “Elevate everyday outfits using modern minimalist styling” — 8 min read — 12/30/25 — `/Images/wearix-157.png`
3. Style Guide — “Build a capsule wardrobe that works year round” — 5 min read — 11/22/25 — `/Images/wearix-158.png`

### 12 — Social Gallery

| Property | Value |
|----------|-------|
| Eyebrow | “Stay connected” |
| Heading | “See our community in modern silhouettes” |
| Body | “Connect with us on social media for a daily dose of fresh style, featuring exclusive looks from our community.” |
| CTAs | “See collections”, “Contact us” |
| Media | Horizontal / 3D-ish carousel (“Arms”) with community images |
| Assets | `/Images/wearix-162.png`, `163.jpg`, `166.png`, `167.png`, `168.png`, `169.png`, `171.png` |

### 13 — Newsletter

| Property | Value |
|----------|-------|
| Heading / prompt | “Subscribe to our news later” *(exact live copy)* |
| Field | Email input placeholder “Enter your email” |
| Layout | Compact form under / near social **(approx)** |

### 14 — Footer

| Property | Value |
|----------|-------|
| Groups | Quick links (About, Blog, Shop, Reviews, Styles), social (Instagram, Dribbble, Facebook, Twitter, Youtube), contact |
| Email | test@gmail.com |
| Phone | +001 234 567 890 |
| Surface | Dark token `#1f1f1f` / black family **(approx application)** |

---

## 7. Product information (exact from live site)

### New Arrivals

| Name | Price | Compare-at | Badge | Slug |
|------|-------|------------|-------|------|
| Textured Knitted Shirt | $59.00 | $79.00 | New | textured-knitted-shirt |
| Structured Trench Coat | $210.00 | $280.00 | New | structured-trench-coat |
| Mini Denim Overalls | $45.00 | $60.00 | New | mini-denim-overalls |
| Riviera Collar Shirt | $45.00 | $60.00 | New | riviera-collar-shirt |
| Stretch Jersey Tee | $65.00 | $95.00 | New | stretch-jersey-tee |
| Urban Utility Cargo | $90.00 | $120.00 | New | urban-utility-cargo |
| Classic Boxy Tee | $35.00 | $45.00 | New | classic-boxy-tee |
| Pleated Smart Trousers | $76.00 | $100.00 | New | pleated-smart-trousers |
| French Terry Shorts | $40.00 | $55.00 | New | french-terry-shorts |

### Best Sellers

| Name | Price | Compare-at | Badge | Slug |
|------|-------|------------|-------|------|
| Heavyweight Oversized Hoodie | $85.00 | $110.00 | Best seller | heavyweight-oversized-hoodie |
| Patterned Knit Sweater | $45.00 | $90.00 | Best seller | patterned-knit-sweater |
| Quilted Bomber Jacket | $145.00 | $180.00 | Best seller | quilted-bomber-jacket |
| Hooded Puffer Vest | $45.00 | $75.00 | Best seller | hooded-puffer-vest |
| Vegan Leather Leggings | $75.00 | $99.00 | Best seller | vegan-leather-leggings |
| Cropped Boxy Blazer | $130.00 | $175.00 | Best seller | cropped-boxy-blazer |

### Other shop products (exist on live `/shop` but not in homepage grids)

High Waisted Palazzo, Relaxed Tapered Chinos, Ribbed Knit Midi, Silk Slip Dress, V-Neck Satin Cami — **do not invent homepage placement**; map later if needed.

---

## 8. Asset mapping

> Matching method: downloaded live Framer CDN images and **MD5-matched** to `/public/Images`.  
> Path prefix is capital **`/Images/`**. Physical files were **not** renamed or moved.

### Identity

```ts
logo: "/Images/wearix-001.svg"
```

### Hero

```ts
hero: "/Images/wearix-006.png" // default / first carousel slide
heroCarousel: [
  "/Images/wearix-006.png",
  "/Images/wearix-009.png",
  "/Images/wearix-011.png",
  "/Images/wearix-002.jpg",
  "/Images/wearix-014.png",
  "/Images/wearix-016.png",
  "/Images/wearix-018.jpg",
]
```

### New Arrivals (image + hover pair per product; DOM order)

| Product | image | hoverImage |
|---------|-------|------------|
| Textured Knitted Shirt | wearix-020.jpg | wearix-023.jpg |
| Structured Trench Coat | wearix-028.jpg | wearix-031.jpg |
| Mini Denim Overalls | wearix-034.jpg | wearix-037.jpg |
| Riviera Collar Shirt | wearix-040.jpg | wearix-043.jpg |
| Stretch Jersey Tee | wearix-046.jpg | wearix-049.jpg |
| Urban Utility Cargo | wearix-051.png | wearix-054.png |
| Classic Boxy Tee | wearix-057.jpg | wearix-060.jpg |
| Pleated Smart Trousers | wearix-062.webp | wearix-064.png |
| French Terry Shorts | wearix-066.webp | wearix-067.jpg |

### Best Sellers

| Product | image | hoverImage |
|---------|-------|------------|
| Heavyweight Oversized Hoodie | wearix-069.jpg | wearix-073.jpg |
| Patterned Knit Sweater | wearix-075.png | wearix-077.png |
| Quilted Bomber Jacket | wearix-079.webp | wearix-081.jpg |
| Hooded Puffer Vest | wearix-083.png | wearix-085.png |
| Vegan Leather Leggings | wearix-088.jpg | wearix-091.jpg |
| Cropped Boxy Blazer | wearix-093.jpg | wearix-096.jpg |

### Collections (slideshow frames; confident groupings)

```ts
collections: {
  mens: ["/Images/wearix-099.png","/Images/wearix-100.jpg","/Images/wearix-102.png","/Images/wearix-103.png","/Images/wearix-104.png"],
  womens: ["/Images/wearix-107.png","/Images/wearix-108.png","/Images/wearix-111.png","/Images/wearix-112.png","/Images/wearix-113.png"],
  children: ["/Images/wearix-114.png","/Images/wearix-115.png","/Images/wearix-116.png","/Images/wearix-117.jpg","/Images/wearix-120.png"],
}
```

*Note: Women’s/Children’s frame boundaries are approximate across SSR variants; refine during visual QA.*

### Reviews

```ts
testimonialAvatar: "/Images/wearix-122.png"
testimonialLogos: [
  "/Images/wearix-121.svg",
  "/Images/wearix-123.svg",
  "/Images/wearix-124.svg",
  "/Images/wearix-125.svg",
  "/Images/wearix-126.svg",
  "/Images/wearix-127.svg",
]
```

### Features (image pairs per card)

| Card | images |
|------|--------|
| Everyday Comfort | wearix-129.jpg, wearix-132.jpg |
| Modern Silhouettes | wearix-135.png, wearix-136.jpg |
| Effortless Styling | wearix-138.jpg, wearix-141.jpg |
| Daily Essentials | wearix-143.png, wearix-144.png |
| Wearable Design | wearix-146.jpg, wearix-148.png |
| Clean Aesthetic | wearix-150.jpg, wearix-153.jpg |

### Blog

```ts
blog: [
  "/Images/wearix-155.jpg",
  "/Images/wearix-157.png",
  "/Images/wearix-158.png",
]
```

### Social gallery

```ts
social: [
  "/Images/wearix-162.png",
  "/Images/wearix-163.jpg",
  "/Images/wearix-166.png",
  "/Images/wearix-167.png",
  "/Images/wearix-168.png",
  "/Images/wearix-169.png",
  "/Images/wearix-171.png",
]
```

### Unmapped / unused locals

Many remaining files under `/public/Images` (icons, alternate crops, shop-only SKUs, etc.) are retained untouched for later pages. **Do not delete.**

### Confidence gaps

- Brand story video poster CDN file did not MD5-match a local file.
- Exact Women’s vs Children’s slideshow membership should be confirmed in a browser during implementation QA.
- Hover vs default image polarity should be confirmed visually (pairs are correct; which is default may swap).

---

## 9. Responsive behavior

| Area | Desktop (≥1200) | Tablet (810–1199) | Mobile (≤809) |
|------|-----------------|-------------------|----------------|
| Announcement | Full-width ticker | Same | Same, tighter type |
| Nav | Horizontal links + search + CTAs | Condensed | Hamburger menu |
| Hero | Row, 100vh, text + carousel | Intermediate type sizes | Column, 90vh, stack image |
| Grids (products) | 3 columns | 2 columns | 1 column |
| Features | 3 columns | 2 columns **(approx)** | 1 column |
| Collections | 3 cards in row/slider | Fewer visible | Stack / swipe |
| Blog | Featured + 2 side | Stack adjusts | Stack |
| Social | Multi-image carousel | Fewer visible | Touch carousel |
| Type | Ronzino 62 / 48 / 44 | 56 / 44 / 35 | 40 / 32 / 28 |
| Images | Cover crops | Cover | Cover; expect taller stack |

Reproduce Framer breakpoints; do not invent a separate Tailwind-only scale that fights these widths.

---

## 10. Animation / interaction audit

| Element | Trigger | Animation | Approx duration | Easing |
|---------|---------|-----------|-----------------|--------|
| Announcement ticker | Auto | Horizontal loop (`translateX`, `ticker-item`) | Continuous | Linear **(approx)** |
| Hero carousel | Auto / interaction | Slide / stack crossfade between photos | ~400–700ms **(approx)** | Ease-out **(approx)** |
| Product card image | Hover | Swap to secondary image (Image 01/02) | ~200–400ms **(approx)** | Ease |
| Product card | Hover | Slight lift / opacity **(approx)** | ~200–300ms | Ease |
| Buttons | Hover | Background / contrast invert or darken | ~150–250ms **(approx)** | Ease |
| Section content | Scroll into view | `translateY(50px)` → rest / fade (Motion handoff present) | ~500–800ms **(approx)** | Ease-out |
| Features cards | Scroll | Staggered rise | ~500ms **(approx)** | Ease-out |
| Reviews logos | Auto / drag | Horizontal logo row | Continuous or draggable **(approx)** | — |
| Social gallery | Auto | Carousel / 3D arm rotation hints (`rotateY`, perspective) | Continuous **(approx)** | — |
| Mobile menu | Click | Panel open/close | ~250–400ms **(approx)** | Ease |
| Search bar | Focus | Backdrop blur already on control | — | — |
| Nav | Scroll | Transparent → solid **(likely)** | — | Confirm in browser |

Framer Motion runtime is present in page JS (`MotionHandoffAnimation`). Prefer CSS + light motion later; **do not install Framer Motion unless required after UI pass**.

---

## 11. Design system summary

### Container
- Max width: **1200px**
- Desktop pad: **~20–25px**
- Mobile pad: **~16–20px**

### Type
- Display: **Ronzino 500**
- UI/Body: **Inter / Inter Variable 400–500**
- Tracking: **-0.03em** typical; labels **-0.035em**

### Spacing
- Section gaps: **32–80px (approx)**
- Card/grid gaps: **10–24px**
- Product grid gap: **~16–24px (approx)**

### Buttons
- Padding: **8px 15px**
- Radius: pill or soft **10px / 999px** depending on variant (confirm per instance)
- Type: Inter 500 ~12px
- Primary: black bg / white text
- Secondary: white bg / black text (often on imagery)

### Cards
- Radius: **~10px**
- Image: cover, center
- Text stack gap: **~8–14px**
- Product card width: **~373px** desktop

---

## 12. Component architecture (recommended)

Only components justified by the live page:

```text
src/components/
├── AnnouncementBar.tsx
├── Header.tsx
├── MobileMenu.tsx
├── Hero.tsx
├── CategoryStrip.tsx
├── SectionHeader.tsx      # eyebrow + heading + optional CTA
├── ProductCard.tsx
├── ProductGrid.tsx
├── NewArrivals.tsx
├── BrandStory.tsx
├── BestSellers.tsx
├── CollectionCard.tsx
├── Collections.tsx
├── Testimonials.tsx
├── FeatureCard.tsx
├── Features.tsx
├── BlogCard.tsx
├── BlogSection.tsx
├── SocialGallery.tsx
├── Newsletter.tsx
├── Footer.tsx
└── ui/
    ├── Button.tsx
    ├── Badge.tsx
    └── Container.tsx
```

Data modules (already prepared / to be filled):

```text
src/data/
├── assets.ts
├── products.ts
├── collections.ts
├── testimonials.ts
├── features.ts
└── blog.ts
```

---

## 13. Implementation order (next coding step — not now)

1. Design tokens in `globals.css` (colors + font CSS variables only)
2. `Container`, `Button`, `Badge`
3. `AnnouncementBar` + `Header` + `MobileMenu`
4. `Hero` (copy + carousel using mapped assets)
5. `CategoryStrip`
6. `ProductCard` + `ProductGrid` → `NewArrivals` → `BestSellers`
7. `BrandStory`
8. `Collections` + `CollectionCard`
9. `Testimonials`
10. `Features`
11. `BlogSection`
12. `SocialGallery` + `Newsletter`
13. `Footer`
14. Responsive QA at 1200 / 810 / 390 widths against live site
15. Motion pass last

---

## 14. Project constraints (do not violate)

- Next.js **16.3.4**, React **19.2.8**, App Router, `src/app`
- Tailwind CSS v4 already installed
- Images live in **`public/Images/`** (capital I) → use `/Images/...`
- **Do not** rename, move, compress, or delete downloaded assets
- **Do not** invent sections, colors, fonts, or products
- **Do not** install packages until a concrete need appears
- Fonts: Ronzino must be obtained/self-hosted carefully (licensing); Inter via `next/font/google` is acceptable for Inter only after implementation starts

---

## 15. Open QA checklist for coding phase

- [ ] Confirm default vs hover image for each product card in browser
- [ ] Confirm collection slideshow image sets for Women vs Children
- [ ] Measure exact hero text column width and button heights in DevTools
- [ ] Confirm nav solid-background scroll threshold
- [ ] Confirm social carousel 3D behavior necessity vs simplified horizontal scroller
- [ ] Resolve brand video poster asset (download or use video-only)
- [ ] License/host **Ronzino** or approved substitute only if legally clear

---

*End of DESIGN_SPEC.md — wait for implementation instruction before writing UI.*
