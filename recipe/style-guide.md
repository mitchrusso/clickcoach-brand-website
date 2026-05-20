# Style Guide — Azure Stream for ClickCoach

## Typography pairing
| Role | Font | Size (desktop / mobile) | Weight |
|---|---|---|---|
| Display | Montserrat | 48 / 36 | 700 |
| H2 | Montserrat | 32 / 28 | 600 |
| H3 | Montserrat | 24 / 22 | 600 |
| Body L | Plus Jakarta Sans | 18 / 17 | 400 |
| Body | Plus Jakarta Sans | 16 / 16 | 400 |
| Label | Plus Jakarta Sans | 14 | 600, +0.05em |
| Caption | Plus Jakarta Sans | 12 | 500 |

Line-height: 1.1 display, 1.3 headlines, 1.6 body.

## Spacing scale (8px base)
4 · 8 · 16 · 24 · 32 · 48 · 64 · 80 · 120

- Section gap: 80px desktop / 48px tablet / 32px mobile
- Container max: 1200px, padded 32px desktop / 16px mobile
- Card interior padding: 24px

## Color application
- Backgrounds: surface (#F8FAFC) main, surface-subtle (#F1F5F9) for alternating sections.
- Buttons: primary blue solid, secondary blue-outline, lime CTA reserved for Sign Up.
- Lime is rare — never two limes in one viewport.
- Body text on light surfaces uses #0C0C0D, never pure black.

## Do
- Generous whitespace between sections.
- 1px hairline borders for definition over drop shadows.
- Real product screenshots floated as flat cards into hero.
- Pill badges for tags / stats.
- Underline links on hover (primary blue).

## Don't
- Don't use heavy shadows or glassmorphism.
- Don't pair sharp corners with rounded — radius is consistent.
- Don't use lorem ipsum or generic "diverse business team" stock photos.
- Don't make the lime do more than one job per page.
- Don't drop below 16px body text.

## Buttons
```html
<a class="btn btn-primary">Start your free trial</a>      <!-- #2463EB / white -->
<a class="btn btn-secondary">Watch the demo</a>           <!-- transparent / #2463EB border -->
<a class="btn btn-accent">Sign up — $497/yr</a>           <!-- #D9F99D / #0C0C0D -->
```

## Imagery direction
- Designer-led (Lena).
- Photography of real coaches, not models. Candid 1:1 conversations, laptops with product UI visible, founder portrait, mobile phone close-ups.
- Product UI cards floated as flat layers in hero comps (no skeuomorphic device frames).
