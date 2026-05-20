# ClickCoach Brand Website

A 7-page marketing site for **ClickCoach.io** — the coaching operating system. Built via the ClickCampaigns GodMode brand-website pipeline. Fully static HTML/CSS, deploy-ready.

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
├── styles.css              # global stylesheet (Azure Stream design system)
├── assets/
│   ├── images/             # all hero + section imagery (Pexels, CC0)
│   ├── brand/              # logo / favicon (currently inline SVG)
│   └── fonts/              # reserved for self-hosting Montserrat / Plus Jakarta
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
- **Adding a page**: create a new folder + `index.html`, copy the nav/footer block from any existing page, add the link to the nav menu and footer columns.

## Tech notes

- 100% static HTML/CSS/inline JS — no framework, no build.
- Google Fonts via `<link>` (Montserrat + Plus Jakarta Sans).
- Theme toggle persists via `localStorage` (`[data-theme="dark"]`).
- All images use `loading="lazy"` / `decoding="async"` (hero images eager + high-priority).
- Hover affordances wrapped in `@media (hover: hover)` to avoid sticky-tap on touch.
- `prefers-reduced-motion` honored globally.
- `viewport-fit=cover` enabled; `touch-action: manipulation` on interactive elements.

## Brand & content sources

Content was synthesized from the uploaded brand kit and knowledge documents (see `recipe/knowledge-docs/`). Voice is Mitch Russo's direct-response register — sharp, evidence-led, low on coaching theater.

---

ClickCampaigns brand website id: `47`. Deploy-ready as-is.
