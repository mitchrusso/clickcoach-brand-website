---

name: Azure Stream

colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053da'
  primary: '#004bc6'
  on-primary: '#ffffff'
  primary-container: '#2463eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#445d12'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b762a'
  on-tertiary-container: '#dcfca0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea7'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ceee93'
  tertiary-fixed-dim: '#b3d17a'
  on-tertiary-fixed: '#131f00'
  on-tertiary-fixed-variant: '#364e03'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-subtle: '#F1F5F9'
  text-main: '#0C0C0D'
  text-muted: '#475569'
  success-mint: '#10B981'
  error-rose: '#E11D48'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-edge: 32px
  section-gap: 80px
---

## Brand & Style

The design system prioritizes a **Professional / Modern** SaaS aesthetic that balances technical reliability with an approachable, friendly personality. It targets creators, marketers, and small businesses who require powerful tools without the complexity of enterprise bloat. 

The visual style is characterized by "High-Clarity Minimalism"—utilizing generous whitespace, crisp geometric shapes, and a highly functional color palette. By transitioning from the original purple to a vibrant blue, the brand moves toward a more "utility-first" trust model while retaining its distinctive personality through high-contrast accent colors and bold typography. 

Key attributes include:
- **Clarity:** Uncluttered layouts that prioritize the primary call-to-action.
- **Trust:** A dependable blue-based palette that suggests stability.
- **Vibrancy:** Sharp, energetic accents (Lime) to ensure the interface doesn't feel overly corporate or stagnant.

## Colors

The palette is anchored by **Vibrant Blue**, serving as the primary driver for interaction and brand identification. 

- **Primary (#2463EB):** Used for primary buttons, active states, and key brand markers.
- **Secondary (#0F172A):** A deep navy used for navigation bars, headings, and high-contrast footers to ground the design.
- **Tertiary (#D9F99D):** A recalibrated Lime-Yellow accent. This is used sparingly for high-attention callouts, "New" badges, or secondary decorative elements to maintain the original's energetic flair.
- **Neutrals:** The background moves from a purple-tinted white to a clean, cool-gray base (`#F8FAFC`), ensuring the blue primary pops without color-clashing.

**Color Application:**
- Backgrounds should primarily use `neutral_color_hex` with `surface-subtle` for container differentiation.
- Text uses `text-main` for high readability on light surfaces.

## Typography

The system utilizes a dual-font strategy to balance marketing impact with application legibility.

1.  **Montserrat (Headlines):** Used for all display and headline roles. Its geometric construction provides a confident, modern, and friendly tone. Tighten letter spacing on larger sizes to maintain visual density.
2.  **Plus Jakarta Sans (Body & UI):** Replaces the display-heavy secondary font for better screen readability. It is soft and welcoming, ensuring that long-form text (like email campaign previews or documentation) remains highly legible.

**Usage Notes:**
- Use `display-lg` for hero sections with a primary-to-secondary gradient or solid secondary color.
- Labels should always be in `Plus Jakarta Sans` with a semi-bold weight for clear hierarchy in forms and buttons.

## Layout & Spacing

The design system employs a **Fixed Grid** model for marketing pages and a **Fluid Grid** for the application dashboard.

- **Grid System:** A 12-column grid with a 24px gutter. On desktop, the content is centered with a max-width of 1200px. 
- **Rhythm:** Spacing follows an 8px base unit. Component internal padding should use 16px (2x) or 24px (3x) to ensure a spacious, "breathable" feel.
- **Responsive Behavior:** 
    - **Desktop (>1024px):** 12 columns, 80px section gaps.
    - **Tablet (768px - 1023px):** 8 columns, 24px margins, 48px section gaps.
    - **Mobile (<767px):** 4 columns, 16px margins, 32px section gaps. Content stacks vertically.

## Elevation & Depth

To maintain a "Clean & Friendly" aesthetic, the design system avoids heavy shadows, opting instead for **Tonal Layering** and **Low-Contrast Outlines**.

- **Surface Tiers:** Use `neutral_color_hex` for the main background and `surface-subtle` for sidebars or card containers.
- **Outlines:** Use 1px solid borders in a slightly darker shade of the background (e.g., `#E2E8F0`) to define boundaries without adding visual weight.
- **Shadows:** Only used for interactive elements like dropdowns or hovering over cards. Use a soft, "Ambient" shadow: `0 4px 20px -2px rgba(15, 23, 42, 0.08)`.
- **Depth:** Cards should feel flat on the page until interacted with, emphasizing the "systematic" nature of the product.

## Shapes

The shape language is consistently **Rounded**, reinforcing the "friendly" brand pillar.

- **Base Radius:** 0.5rem (8px) for standard components like buttons, input fields, and small cards.
- **Large Radius:** 1rem (16px) for main containers and large promotional sections.
- **Full Radius:** Used exclusively for tags, badges, and avatars to create a distinctive "pill" shape that contrasts against the rectangular grid.
- **Consistency:** Avoid mixing sharp corners with rounded corners; all interactive containers must have at least the base radius.

## Components

### Buttons
- **Primary:** Background `#2463EB`, white text, 8px border radius. Bold Montserrat text.
- **Secondary:** Transparent background with `#2463EB` border and text.
- **Accent/CTA:** Background `#D9F99D`, dark `#0C0C0D` text. Use this for the "Sign Up" button in the navigation bar to draw immediate attention.

### Input Fields
- White background, 1px border (`#E2E8F0`). On focus, the border changes to Primary Blue with a 2px soft outer glow (the same blue at 15% opacity).

### Cards
- Use a white background with a subtle border. No shadow by default. On hover, apply the ambient shadow and a slight 2px vertical lift to indicate interactivity.

### Chips & Badges
- Small, pill-shaped (`rounded-xl`). For status (e.g., "Active"), use a subtle tint of the status color (Success-Mint at 10% opacity) with dark text.

### Lists
- Use generous vertical padding (16px) between items with a light divider line. Use icons in a circular blue container to lead list items in feature sections.
