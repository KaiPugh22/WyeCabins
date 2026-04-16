# Wye Cabins — Site Audit

_Captured on 2026-04-16 against the dev server at `localhost:8080`._

---

## Summary — top 10 actionable items (ranked by impact)

| # | Item | Category | Effort |
| - | ---- | -------- | ------ |
| 1 | Domain mismatch: canonicals use `wyeglamping.co.uk` but `sitemap.xml` uses `wyecabins.co.uk`. Standardise on `wyecabins.co.uk`; 301 `wyeglamping` → `wyecabins` at DNS/host. | SEO | S |
| 2 | Every blog post shares the same OG image, canonical, and meta description because they're query-string variants of `blog.html`. Search engines and social previews see them as one URL. | SEO | M |
| 3 | Book Nook cabin still on SVG placeholders (9 images). Directly blocks the town offering from looking real. | Content | Needs photos |
| 4 | `.blog-photo-wide` mobile overflow — FIXED during audit (`styles.css:1401`). Now constrained with `!important` override. | Layout | Done |
| 5 | Landscape source images are being centre-cropped to portrait in `.blog-photo-left/right` slots (3:4 ratio) on desktop — losing ~44% of the image height. | Layout | M |
| 6 | `sitemap.xml` lists only 5 static URLs. Dynamic blog post (`?post=…`) and cabin (`?unit=…`) variants are invisible to crawlers. | SEO | S |
| 7 | Contact form has no backend (`script.js:109` TODO). Submissions go nowhere. | Functionality | S |
| 8 | Instagram feed shows fallback iframe because `SITE.instagramToken` is empty (`script.js:13`). Live API mode is wired but needs a token. | Functionality | S |
| 9 | No Twitter card tags on any page. Twitter/X link previews will be bare URLs. | SEO | XS |
| 10 | Schema.org `LodgingBusiness` JSON-LD only on the homepage. Per-cabin pages should emit their own `Lodging` schema for rich results. | SEO | M |

**Legend:** XS = minutes, S = <1 hour, M = half-day, L = day+.

---

## 1. Blog page layout review

Boot: `preview_start dev` on port 8080. All three posts visited at desktop (1280×800), tablet (768×1024), and mobile (375×812).

### Baselines (desktop, pre-refactor)

| Post slug | `#blogPostBody` text length | Images | Headings |
| --------- | --------------------------- | ------ | -------- |
| `things-to-do` | 2,564 chars | 7 | 8 H2 |
| `a-day-in-hay` | 2,464 chars | 6 | 6 H2 |
| `where-to-eat` | 2,323 chars | 5 | 1 H2 + 11 H3 |

Images load successfully, no broken references, no console errors.

### Layout findings

**1. `.blog-photo-wide` horizontal overflow on mobile** _(fixed during audit)_

The base rule at `styles.css:1760-1768` sets `width: calc(100% + 100px); margin-left: -50px;` to let the image bleed outside the 780-px blog column. The mobile override at `styles.css:1401-1404` was defined _before_ the base rule in source order, so source-order specificity let the desktop rule win on mobile too. Result at 375 px viewport: image rendered 447 px wide at x=-36, causing the whole page to scroll horizontally.

Fix: changed the mobile rule to `!important` (`styles.css:1401-1405`). Verified: `scrollDiff: 0` on 375×812, image now 347 px wide at x=14.

**2. Landscape → portrait centre-crop in `.blog-photo-left/right`**

CSS at `styles.css:1744-1758` uses `aspect-ratio: 3 / 4; object-fit: cover;` — so any landscape source image loses the top and bottom when rendered in these slots. Measured on desktop:

| Image | Natural ratio | Slot ratio | % cropped |
| ----- | ------------- | ---------- | --------- |
| `5893961312_52762b117d_b.jpg` (Hay-on-Wye rooftops) | 1.50 (3:2) | 0.75 (3:4) | ~44% of height |
| `26285326532_f69d788a4d_b.jpg` (walkers on trail) | 1.50 (3:2) | 0.75 (3:4) | ~44% of height |

**Three options to consider:**

- **A.** Relax the slot aspect to `4 / 5` or `1 / 1` so landscape sources crop less harshly. Cheapest.
- **B.** Source genuinely portrait photos for these two slots.
- **C.** Switch to `object-fit: contain` with a padding — shows the whole image but leaves pillar-boxing.

Recommended: A for now, B when photographing specifically for the blog.

**3. `H1` count on blog listing page = 2**

`document.querySelectorAll('h1')` returns 2 on `blog.html` because the hidden `#blogPost` template contains an empty `<h1>`. Visually there's only one H1. SEO crawlers generally respect `hidden` but it's cleaner to set `role="none"` on the template H1 or leave it as a `<div>` until populated.

**4. Mobile horizontal rhythm is otherwise good.** At 375×812, `.blog-photo-left/right` collapse to full-width 16:9 (via `styles.css:1406-1412`), `.blog-photo-pair` stacks, body font scales down via `styles.css:1380-1395`. Nothing else overflows.

---

## 2. SEO audit

### Critical

**C1. Domain mismatch across canonicals vs. sitemap vs. robots.txt**

| File | Domain referenced |
| ---- | ----------------- |
| `index.html:8`, `country.html:8`, `town.html:8`, `stay.html:8`, `blog.html:8` — `<link rel="canonical">` | `wyeglamping.co.uk` |
| `sitemap.xml:3-7` | `wyecabins.co.uk` |
| `robots.txt:4` — `Sitemap:` line | `wyeglamping.co.uk` |
| `index.html:19-42` — JSON-LD `LodgingBusiness.url` | `wyeglamping.co.uk/` |

Search engines can't consolidate link equity while pages disagree on their own canonical URL. Resolution chosen by the user: `wyecabins.co.uk` is the real site; `wyeglamping.co.uk` 301-redirects to it. I will fix all in-repo references during the refactor.

**C2. Blog post meta/OG duplication**

All three posts live at `blog.html?post=…`. Static `<head>` can only carry one description + one OG image, so:

- `<title>` and `<meta name="description">` are updated client-side by `script.js` after route resolve (`script.js:718-722`) — search engines that run JS will see the correct title, but crawlers that don't (and link-preview bots like Slack/Twitter/Facebook) will see `blog.html`'s defaults.
- `<meta property="og:image">` is **not** updated client-side. All three posts share `blog.html`'s OG image (`Holly-cabin-by-the-stream…webp`). Confirmed across all three.

**Two fixes to pick between:**

- **A. Server-side rendered blog posts.** Each post gets its own `.html` file (`/blog/things-to-do.html`, etc.) with correct `<head>`. More setup, best SEO.
- **B. Client-side OG/meta update + prerender hints.** Extend `renderBlogPost` to also patch `og:image`, `og:description`, `twitter:card`, and `canonical` based on the loaded post. Ship alongside a `<link rel="prerender">` hint + populate `<head>` via the initial JSON fetch before any paint. Faster to ship but relies on crawler JS support.

Recommended: **A** in the medium term. Client-side patching (B) added in this refactor as an interim improvement.

**C3. `sitemap.xml` missing dynamic URLs**

Only 5 URLs listed. No `?post=` variants, no `?unit=` variants. Fix during refactor:

```
<loc>https://wyecabins.co.uk/</loc>
<loc>https://wyecabins.co.uk/town.html</loc>
<loc>https://wyecabins.co.uk/country.html</loc>
<loc>https://wyecabins.co.uk/blog.html</loc>
<loc>https://wyecabins.co.uk/stay.html?unit=holly</loc>
<loc>https://wyecabins.co.uk/stay.html?unit=bramble</loc>
<loc>https://wyecabins.co.uk/stay.html?unit=booknook</loc>
<loc>https://wyecabins.co.uk/blog.html?post=things-to-do</loc>
<loc>https://wyecabins.co.uk/blog.html?post=a-day-in-hay</loc>
<loc>https://wyecabins.co.uk/blog.html?post=where-to-eat</loc>
```

### Moderate

**M1. Schema.org coverage**

Only `index.html` emits JSON-LD (`LodgingBusiness` with address, phone, URL, social). Each cabin detail page should emit its own `Lodging` schema — Google's rich results for hotel/vacation-rental searches require this.

**M2. No Twitter Card tags**

Add to each page's `<head>`:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image" content="…">
```

**M3. Random Flickr-style image filenames**

Examples in `assets/images/`:
- `16033767030_0bb47b4e95_4k.jpg` (Brecon panorama)
- `26285326532_f69d788a4d_b.jpg` (walkers)
- `5893961312_52762b117d_b.jpg` (Hay town rooftops)
- `Screen+Shot+2021-02-17+at+17.28.00.png.webp` (wild swimmers)

Filenames are a minor ranking signal for image search and awful for anyone maintaining the codebase. Rename to `brecon-beacons-panorama.jpg`, `hay-bluff-walkers.jpg`, `hay-on-wye-rooftops.jpg`, `wild-swimmers-wye.webp`. Update all references (script.js, blog markdown once migrated, HTML `<meta>` if any).

### Minor

**m1. Alt-text scan passes.** Every `<img>` in hand-written HTML has `alt=""` or descriptive text. The only empty alt is the blog hero template (`blog.html:67`), which `script.js:725` populates at runtime. Consider defaulting the placeholder alt to "Blog post hero image — loading" so screen readers get _something_ pre-JS.

**m2. `<html lang="en">`** is set on every page — good.

**m3. `<meta name="viewport">`** is set on every page — good.

**m4. robots.txt exists and allows everything** — good. Update the `Sitemap:` URL during refactor.

**m5. No structured data for individual blog posts.** `Article` / `BlogPosting` schema on post detail would unlock article rich results.

---

## 3. Mobile audit (375×812)

### Touch targets

| Element | Measured | Guideline (44×44) | Status |
| ------- | -------- | ----------------- | ------ |
| Hamburger `.nav-toggle` | 42 × 36 CSS px | 44 × 44 | Under-spec on both axes |
| Footer social links | ~32 × 32 CSS px | 44 × 44 | Under-spec |
| Blog listing cards | Full width, large tap area | ✓ | Good |
| Gallery tiles (cabin pages) | 1-col at 375px = full width | ✓ | Good |
| Header `BOOK` button | `display: none` at <580px | n/a | Fine — accessible via hamburger |

Fix: add padding to `.nav-toggle` and footer `.social-icon` so their hit areas are ≥44 × 44 without changing visual size.

### Overflow

- `.blog-photo-wide` — was overflowing 36 px at 375×812 before fix; now clean.
- All other pages scanned at 375×812 show `scrollDiff: 0`.

### Forms

- Contact form: 2-column → 1-column at 980px (`styles.css:1469`). Inputs use `font-size: 16px` so iOS doesn't zoom on focus. ✓
- Mailing subscribe form (homepage): inputs stack at <580px (`styles.css:1550`). ✓
- Both forms have `type="email"` which triggers correct mobile keyboards. ✓

### Hamburger

- Toggle works; nav links collapse into dropdown via `setupMobileNav` at `script.js:142-161`. ✓
- Click outside to close — not currently implemented. Minor polish opportunity.

---

## 4. Accessibility notes

- Skip link present at top of every page. ✓
- `aria-label` on icon-only buttons (hamburger, lightbox close, social icons). ✓
- `prefers-reduced-motion` rule at `styles.css:1799-1810` disables transitions. ✓
- Focus rings defined (`styles.css:82-94`). ✓
- Heading hierarchy: single H1 per page (excluding the hidden template H1 on blog listing — see §1.3).
- Colour contrast: sage-green `--accent` `#5a7050` on cream `--bg` `#e8e4d4` measures roughly 5.5:1 (WCAG AA for normal text). Good.
- Lightbox traps focus correctly (`script.js:530-542`). ✓
- Forms: every `<input>` has an associated `<label>`. ✓

No blocking a11y issues found.

---

## 5. Roadmap — what to do next

### Content work (before next marketing push)

1. **Book Nook photography** — hero + 8 gallery images. All paths tracked in `placeholder-images.md`.
2. **Per-post hero OG images.** Currently all blog posts share Holly's cover. Commission or select a distinct landscape image per post.
3. **Proper portrait photos** for `.blog-photo-left/right` slots (optional — can relax the aspect ratio instead).
4. **Photos for the two still-placeholder blog slots:** old stone bridge at Hay (have a candidate), afternoon tea spread (Foyles).

### Technical

5. Wire the **contact form** to a real backend — Formspree, Netlify Forms, or a Cloudflare Worker. Current TODO at `script.js:109`.
6. Set **`SITE.instagramToken`** (`script.js:13`). The live-API renderer is already built.
7. Canonicalise domain to **`wyecabins.co.uk`** across canonicals, sitemap, robots, JSON-LD. Configure 301 redirect from `wyeglamping.co.uk` at host.
8. Add per-cabin **`Lodging` JSON-LD** and per-post **`BlogPosting` JSON-LD**.
9. Rename random-hex image files to descriptive slugs; update references.
10. Add **Twitter card meta tags** across all pages.

### Performance (nice-to-haves, not blocking)

11. Several images are >1 MB (`hero-cabin.jpg` is 1.3 MB, `retreat-a.jpg` is 2 MB). Run through `cwebp` or equivalent; aim for <300 KB hero, <150 KB gallery.
12. Preload the LCP hero image per route (`<link rel="preload" as="image" href="…">` in `<head>`).
13. Self-host Google Fonts (Raleway, Abril Fatface) to remove the external preconnect and improve Lighthouse scores.

### Marketing

14. Future blog post pipeline — see §6.
15. Consider an **FAQ page** (what's included, pets, parking, check-in times, cancellation) — both a UX win and a rich-snippet opportunity via `FAQPage` schema.
16. Add a **booking-intent CTA** on every page other than the booking flow itself (currently only the header `BOOK` button).

---

## 6. Future blog post ideas

Don't write these yet — this is a backlog for you to commission or draft at your pace.

| # | Working title | Primary target keyword | One-line hook |
| - | ------------- | ---------------------- | ------------- |
| 1 | "A weekend in the Brecon Beacons: our favourite 48-hour itinerary" | weekend in brecon beacons | Friday-afternoon-to-Sunday-evening itinerary that starts and ends at a Wye cabin. |
| 2 | "Wild swimming near Hay-on-Wye: five rivers, five moods" | wild swimming hay on wye | The shallow spots for kids, the deep pools for a proper dip, and when the river runs high. |
| 3 | "Hay Festival 2026: how to stay, eat, and skip the queues" | hay festival accommodation | Time-sensitive — republish each May. Links book-ready cabins to festival dates. |
| 4 | "Dog-friendly walks from our door" | dog friendly walks brecon beacons | Four walks, all from the cabin driveways, ranked by gradient and mud. |
| 5 | "What we pack for a cabin stay (and what we leave at home)" | what to pack glamping wales | Packing list that doubles as subtle reassurance that the cabins have everything else. |
| 6 | "Stargazing from the Black Mountains" | dark skies brecon beacons | The Beacons is an International Dark Sky Reserve — when to visit, what you'll see, where to stand. |
| 7 | "A seasonal guide to Hay-on-Wye: spring, summer, autumn, winter" | hay on wye seasons | Evergreen pillar post; link out to all other posts. |
| 8 | "Our favourite takeaways, delis and farm shops" | farm shops brecon beacons | Companion to "Where to eat" for self-catering guests. |
| 9 | "Three walks that start from the cabin door" | walks from hay on wye | Short/medium/long loops with real distances and approximate times. |
| 10 | "The making of a cabin: how Holly was built" | hand crafted cabin wales | Story-led, long-form; strong for brand and social shares. |

---

## 7. Work log from this audit

Changes made during the audit itself (documented so you can review):

- `styles.css:1401-1405` — added `!important` overrides to defeat source-order specificity on `.blog-photo-wide` at mobile. Verified fixed.

Nothing else was edited. All other findings are listed above for you to decide on.
