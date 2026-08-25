# ClickCoach Brand Website


A static marketing and resource site for **ClickCoach.io** — the coaching operating system. It includes the core product experience, high-intent solution pages, SlipMeter, the partner program, and a growing coaching resource library.

## What's in here

```
.
├── index.html              # /
├── features/index.html     # /features
├── pricing/index.html      # /pricing
├── for-coaches/index.html  # /for-coaches
├── about/index.html        # /about
├── testimonials/index.html # /testimonials
├── contact/index.html      # /contact
├── group-coaching-software/# high-intent solution page
├── resources/              # resource hub and published articles
├── scripts/                # SEO checks and article synchronization
├── docs/                   # generated SEO route/indexation ledger
├── styles.css              # global stylesheet (Azure Stream design system)
├── styles-resources.min.css# reduced stylesheet for the resource library
├── assets/
│   ├── images/             # all hero + section imagery (Pexels, CC0)
│   ├── brand/              # logo / favicon (currently inline SVG)
│   └── fonts/              # self-hosted Montserrat / Plus Jakarta Sans
├── partials/               # reference nav.html / footer.html (inlined per page)
├── design.md               # the design law — Azure Stream tokens
└── recipe/                 # full GodMode build recipe (read recipe/README.md)
```

## Local preview

```bash
python3 -m http.server 4173
# or: npx serve .
```

Then open <http://localhost:4173>.

## Deploy

### Vercel

```bash
npm i -g vercel   # if not installed
vercel            # follow prompts; pure static, no build step
```

### Netlify

```bash
npx netlify-cli deploy --dir . --prod
```

### Cloudflare Pages

`Build command:` (leave blank) · `Output directory:` `.`

### Plain S3 / nginx

Upload contents to your bucket / webroot. No build step.

## Editing

- **Copy** lives inline in each `index.html`.
- **Design tokens** live in `:root { ... }` at the top of `styles.css`.
- **Dark mode** is automatic via the 🌗 toggle in the nav (persists per visitor).
- **Adding a page**: create a new folder + `index.html`, copy the nav/footer block from an existing page, add relevant internal links, and update `sitemap.xml` and `llms.txt`.
- **SEO verification**: run `npm test` before publishing. Regenerate the route ledger with `npm run seo:matrix`.
- **Resource CSS**: resource routes use the checked-in `styles-resources.min.css` bundle. After changing shared or resource styles, regenerate it with:

```bash
mkdir -p /tmp/clickcoach-resource-css
npx --yes purgecss --css styles.css --content 'resources/**/*.html' 'js/*.js' 'partials/*.html' --output /tmp/clickcoach-resource-css
npx --yes lightningcss-cli --minify --output-file styles-resources.min.css /tmp/clickcoach-resource-css/styles.css
```

## Tech notes

- 100% static HTML/CSS/inline JS — no framework, no build.
- Montserrat and Plus Jakarta Sans are self-hosted from `/fonts/` with `font-display: swap`.
- Theme toggle persists via `localStorage` (`[data-theme="dark"]`).
- All images use `loading="lazy"` / `decoding="async"` (hero images eager + high-priority).
- Hover affordances wrapped in `@media (hover: hover)` to avoid sticky-tap on touch.
- `prefers-reduced-motion` honored globally.
- `viewport-fit=cover` enabled; `touch-action: manipulation` on interactive elements.

## Brand & content sources

Content was synthesized from the uploaded brand kit and knowledge documents (see `recipe/knowledge-docs/`). Voice is Mitch Russo's direct-response register — sharp, evidence-led, low on coaching theater.

---

ClickCampaigns brand website id: `47`. Deploy-ready as-is.
