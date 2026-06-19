# Build Recipe — ClickCoach Brand Website



This is the **GodMode equivalent of the SaaS workspace's "Recipe" tab**: every ingredient that went into the build, in markdown you can read, edit, and check into git.

## Index

| File | What it is |
|---|---|
| [brand-kit.md](brand-kit.md) | Identity, pricing, brand colors, typography, voice, creative direction |
| [style-guide.md](style-guide.md) | Typography pairing, spacing scale, color application, do/don'ts |
| [industry-analysis.md](industry-analysis.md) | Alex's analysis — industry, audience, tone, conversion goals, page count |
| [creative-direction.md](creative-direction.md) | The user's free-text note (EmailOctopus reference) |
| [sitemap.md](sitemap.md) | Jordan's sitemap — 7 pages with paths and purposes |
| [knowledge-docs/](knowledge-docs/) | Full extracted text of every uploaded brand document |
| `../design.md` | The resolved design law (Azure Stream) — Cassidy's source of truth |

## Build phases (as executed)

1. **Alex — analyze** · industry, audience, tone, goals, page count, design.md selection
2. **Dylan + Jordan — architect** · SEO intent + sitemap (7 pages, all in-nav)
3. **Jordan — global layout** · `styles.css` + inline nav/footer partials, light/dark theme tokens
4. **Jordan + Cassidy — wireframe** · page strategy briefs held in working context (not artifacts)
5. **Ryan — copy** · founder-voice direct-response copy fitted to each page brief
6. **Lena — art direction** · 14 Pexels stock images selected, downloaded to `assets/images/`
7. **Cassidy — render** · 7 full HTML documents written to disk
8. **Mobile Mastery polish** · global stylesheet pass — `@media (hover: hover)` guards, `touch-action: manipulation`, fluid `clamp()` typography, `viewport-fit=cover`, lazy images, `prefers-reduced-motion`

> Mobile Mastery polish was applied at the **stylesheet level** (single source shared by all 7 pages) — semantically equivalent to running the pass per-page but eliminates drift between pages.

## Pages shipped

1. `/` — Home
2. `/features` — Features (14 capability buckets)
3. `/pricing` — Flat $497/yr + stack-replacement math + objection FAQ
4. `/for-coaches` — Solo, multi-coach firms, certification networks
5. `/about` — Mitch Russo founder story + credentials
6. `/testimonials` — Real client quotes + outcome timeline
7. `/contact` — Sales / support / affiliate / directory / partner

## Imagery

All hero & section imagery sourced from Pexels (CC0). Files live in `../assets/images/`. To swap: drop a new file with the same name (and matching aspect ratio) and the page picks it up.

## Reproducibility

If you regenerate this site, every input you need is in this folder. The recipe is the build.
