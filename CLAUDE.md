# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
A multi-page marketing website for **IRONFORGE**, a strength & performance training gym in Karachi, Pakistan. No build step, no dependencies, no framework — open `ironforge.html` directly in any browser.

## How to run
Open `ironforge.html` in any modern browser. No server, no install, no CLI needed.

## File structure
| File | Purpose |
|---|---|
| `ironforge.html` | Main landing page — all sections live here |
| `forge.css` | All styles — tokens, layout, animations, responsive, reduced-motion |
| `forge.js` | All behavior — one IIFE, no modules |
| `classes.html` / `trainers.html` / `pricing.html` / `about.html` | Subpages linked from nav |

**Naming rule:** never rename `forge.css` / `forge.js` to generic names — project-themed names are intentional.

Cache-busting is manual: bump `?v=N` on the `<link>` and `<script>` tags in every HTML file when either asset changes.

## Architecture

### CSS (`forge.css`)
All design tokens live in `:root`. The dark theme is defined by a small set of variables — touch only these when changing the palette:
- `--bg` / `--bg-2` / `--card` / `--card-2` — background layers (darkest → slightly lighter)
- `--accent: #E84C1E` — the single orange accent; used for CTAs, highlights, icons
- `--border: #2A2A2A` — subtle dividers
- `--ease: cubic-bezier(0.16,1,0.3,1)` — shared spring easing

Section backgrounds alternate in this order to create seamless gradient blends between them: `--bg` → `--bg-2` → `--bg` → `--card` → `--bg-2` → `--bg` → `--bg`. Each section uses a `::before` pseudo-element that gradients FROM the previous section's background color; keep these in sync when reordering sections.

Reveal animations use three CSS classes (`.reveal`, `.reveal-up`, `.reveal-left`) that start hidden and animate to visible when `.is-visible` is added. The `--d` custom property on each element sets its stagger delay.

### JS (`forge.js`)
Single IIFE. Key behaviors and where to find them:

| Behavior | Location |
|---|---|
| Loader letter build + animation | top of IIFE |
| Stat count-up animation | `animateCounter()` / `runCounters()` |
| Scroll reveals | `setupObserver()` — `IntersectionObserver` adds `.is-visible` |
| Cursor spotlight | `mousemove` on `document`, sets CSS vars `--x` / `--y` on `#spotlight` |
| Card magnetic tilt | `setupTilt()` — inline style on `mousemove`, reset on `mouseleave` |
| Mobile hamburger menu | `navToggle` / `mobileMenu` — toggles `.open`, locks `body.overflow` |
| Nav active page highlight | `highlightNav()` — matches `location.pathname` filename to `href` |
| Plan → form pre-fill | `[data-plan]` click handler — sets hidden `#trialPlan` input + updates `.contact-sub` text |
| FAQ accordion | `.faq-q` click — toggles `.open`, animates `max-height` via `scrollHeight` |
| Contact form submit | validates name + email, posts to Formspree via `fetch` + `FormData` |
| Back-to-top button | `#backToTop` — visible after 600px scroll |
| Cookie consent | `#cookieBar` — shown after 1.8s if `localStorage` key absent |

Two guard variables at the top of the IIFE control conditional behavior:
- `reduced` — `prefers-reduced-motion`: skips all animations, shows everything immediately
- `noHover` — touch devices: disables spotlight and tilt

### Page sections (ironforge.html, top → bottom)
Loader → Nav → WhatsApp float → Hero → Classes → Trainers → Pricing → Testimonials → FAQ → Location → Contact → Footer → Back-to-top → Cookie bar

## Integrations (live / configured)
- **Formspree** `https://formspree.io/f/xeeblgwz` — contact form endpoint. Form collects `name`, `phone`, `email`, and hidden `plan` field. JS detects `your-form-id` in the action to determine demo vs. live mode.
- **Google Analytics** `G-R44Y9C6731` — already uncommented and active in `<head>`.
- **WhatsApp** `https://wa.me/922135001234` — floating button and footer link.
- **Social links** — Instagram, Facebook, X, YouTube all wired to real profiles in the footer.

## Design rules (do not break these)
- Dark theme only — do not introduce light backgrounds or white cards.
- `--accent` (#E84C1E) is the only color accent. Do not add a second accent color.
- Headings use `Barlow Condensed` (900 weight, uppercase). Body uses `Inter`.
- All new cards should follow the existing pattern: dark gradient background, `1px solid rgba(255,255,255,0.04)` border, `border-radius:12px`, orange border + glow on hover.
- Featured pricing card has a `featuredGlow` CSS animation — preserve this when editing the pricing section.
- Tilt effect (`setupTilt()`) must preserve `scale(1.03)` for `.featured` cards — see the `isFeatured` check in the JS.

## Known remaining placeholders
- Trainer photos are stock Unsplash portraits — replace with real coach photos for production.
- OG share image (`og:image`) still points at Unsplash — self-host a real 1200×630 image.
- Social profiles in footer point to the owner's personal accounts, not dedicated IRONFORGE brand accounts.
