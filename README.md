# kllctbls website

A static, SEO-ready, mobile-optimised build of the "Kllctbls Ghost Slate v3" design. There is no framework and nothing to install. Everything you deploy is in `public/`.

## Run it locally

```bash
npm run dev        # rebuilds the pages, then serves http://localhost:4173
```

## Edit content

All copy, services, case studies and SEO settings live in **`build.mjs`**. After editing, run `npm run build`. Styles are in `public/assets/css/site.css` and interactions are in `public/assets/js/site.js`.

Settings at the top of `build.mjs`:

| Setting | What it does |
|---|---|
| `SITE.url` | The production domain, used for canonical URLs, Open Graph tags, the sitemap and structured data. **Set this before launch.** |
| `SITE.formEndpoint` | Where the contact form sends submissions (for example Formspree or Basin). If it's empty, the form opens the visitor's email app instead. |
| `SITE.sameAs` | Social profile URLs added to the Organization schema. |
| `SITE.lastmod` | The date written to the sitemap. |

## Pages

`/` · `/sponsorship/` · `/design/` · `/tech/` · `/portfolio/` · `/portfolio/{sportswaxpromotions,metis,stima}/` · `/contact/` · `404.html`

## Deploy

**Vercel:** import the GitHub repo; `vercel.json` sets the build (`node build.mjs`), output folder (`public`), trailing-slash URLs, security/cache headers and `/exhibits/` → `/portfolio/` redirects, so no settings need changing. Other static hosts (Netlify, Cloudflare Pages) can serve `public/` as is; `_headers` covers those.

After launch, submit `https://<domain>/sitemap.xml` in Google Search Console.

## SEO included

- A real URL for every page, each with a unique title, meta description and canonical tag.
- Open Graph and Twitter cards with a 1200×630 share image.
- JSON-LD structured data: Organization, WebSite, Service + OfferCatalog, Article, CollectionPage, ContactPage and BreadcrumbList.
- `sitemap.xml`, `robots.txt`, a web manifest and favicons.
- Semantic HTML with one `<h1>` per page, alt text on every image, and set image dimensions so the layout doesn't shift while loading.
- Service details use native `<details>`, so the content is crawlable and works without JavaScript. Panels slide open on their own as you scroll to them.
- Performance: the display font is subset to 24 KB, the hero's first frame is preloaded, and phones load a separate cropped frame set (2.2 MB instead of 8.9 MB). Other images load lazily.

## Interactions, desktop → mobile

| Interaction | Desktop | Mobile / touch |
|---|---|---|
| Hero video | Looping video (`assets/video/hero.mp4`) with a light purple tint and the headline on the left | Portrait-cropped video (`hero-m.mp4`), headline at the bottom; pauses when scrolled past |
| Pack tear | Hold the page, then scroll, click or press a key to tear; drag a card down to reseal | Tears automatically as it scrolls into view (never traps scrolling); cards stack; "Reseal the pack" button |
| 3D tilt cards | Follow the mouse | Follow the finger |
| Holo sheen on tiles and CTAs | On hover | On touch, and illustrations shine once as they scroll into view |
| Service pills | Fan out around the card on hover | Shown as a row of tappable chips |
| Show-pass steps | Sticky panel driven by scroll | Stacked; steps advance as you scroll |
| Gallery | Staggered 2×4 grid | 4 columns on tablet, 2 on phone |
| Count-up stats | Roll in on view; roll again on hover | Roll in on view; roll again on tap |

All motion respects `prefers-reduced-motion`.
