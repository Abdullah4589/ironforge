# IRONFORGE — Project Notes

## What this is
A single-page marketing website for **IRONFORGE**, a fictional strength &
performance training gym in Karachi, Pakistan. Tagline: *"Train hard. Break
limits."*

## Structure
The site is split across three files (no build step, no dependencies, no
framework — just open the HTML in a browser):
- **`ironforge.html`** — markup only. Links the stylesheet in `<head>` and
  loads the script with `<script src="forge.js" defer>` before `</body>`.
- **`forge.css`** — all styles (design tokens, layout, animations,
  responsive, reduced-motion). Was previously an inline `<style>` block.
- **`forge.js`** — all behavior, wrapped in one IIFE. Was previously an
  inline `<script>` block.

Naming note: the user explicitly asked NOT to use generic names like
`style.css` — hence the project-themed `forge.css` / `forge.js`.

External resources: Google Fonts (`Barlow Condensed`, `Inter`) and Unsplash
images (see "Assets" below).

## Sections (top to bottom)
1. **Loader** — letter-by-letter animated "IRONFORGE" intro that slides away.
2. **Nav** — fixed top bar; drops in on load, gains a blurred background once
   scrolled past 80px. Links: Classes, Trainers, Pricing, Results, FAQ, Join
   now. Active link highlights via scroll-spy. Below 860px it collapses to a
   hamburger that opens a full-screen mobile menu.
3. **Hero** — gym background photo with a dark left-to-right gradient overlay,
   animated split-word headline, sub-copy, two CTAs, and a row of animated
   count-up stats (2,400+ members, 18 trainers, hours, 12 yrs).
4. **Classes** — 6 program cards (Powerlifting, Combat HIIT, Athletic
   Performance, Metabolic Forge, Mobility & Recovery, 1-on-1 Coaching).
5. **Trainers** — 4 coach cards with grayscale portrait photos (color on
   hover); falls back to initials if an image fails to load.
6. **Pricing** — 3 tiers: Grind (Rs 4,500/mo), Forge (Rs 8,500/mo, "Most
   popular"), Elite (Rs 15,000/mo).
7. **Testimonials** — 3 member reviews with 5-star ratings.
8. **FAQ** — 5-item accordion (hours, free trial, cancellation, beginners,
   location/parking).
9. **Contact** — free-trial email capture form with validation.
10. **Footer** — 3-column (brand+socials, visit/hours, contact) + copyright bar.

## Design system (CSS custom properties in `:root`)
- Dark theme: near-black backgrounds (`--bg:#0A0A0A`), white text,
  single orange accent (`--accent:#E84C1E`).
- Shared easing curve `--ease:cubic-bezier(0.16,1,0.3,1)`, max content
  width `--maxw:1180px`.
- Condensed uppercase display type for headings; Inter for body.

## Interactions / JS behavior
- **Scroll reveals** via `IntersectionObserver` (`.reveal`, `.reveal-up`,
  `.reveal-left`, split-word headings).
- **Scroll-spy** — highlights the current section's nav link.
- **Count-up stat animation** when the hero stats scroll into view.
- **Cursor spotlight** — radial glow follows the mouse (disabled on touch).
- **Magnetic tilt** — cards rotate slightly toward the cursor (disabled on
  touch / reduced motion).
- **Mobile menu** — hamburger toggles a full-screen overlay; closes on link
  click or Escape, and locks body scroll while open.
- **FAQ accordion** — click to expand/collapse, animated max-height, with
  `aria-expanded` toggling.
- **Contact form** — validates email format (inline error state), then
  submits. See "form wiring" below.
- **Loader sequence** — runs on `load`, then reveals page + fires hero
  entrance; fallback timer so the page never stays hidden.
- **Reduced motion** — `prefers-reduced-motion` fully supported.
- **Responsive** — 860px (nav → hamburger, footer → 2-col) and 640px (stats
  2-col, contact form stacks, footer 1-col).

## Form wiring (IMPORTANT)
The contact form posts to a **Formspree** endpoint set in the form's `action`
attribute (`https://formspree.io/f/your-form-id`). Until that placeholder is
replaced with a real Formspree form ID, the JS runs in **demo mode** — it
validates the email and simulates a success message without sending anything.
To go live: create a Formspree (or similar) form and swap `your-form-id` for
the real ID. Real submits use `fetch` + `FormData` and show an error state on
failure.

## Assets / external dependencies
- Google Fonts (Barlow Condensed, Inter).
- **Unsplash** images for the hero background and the 4 trainer portraits
  (hot-linked URLs). Trainer `<img>`s have `onerror="this.remove()"` so the
  initials fallback shows if a URL ever breaks. For production, download and
  self-host these (and replace trainers with real coach photos).
- Favicon is an inline SVG data-URI (no file needed).

## Known limitations / not yet done
- **Form endpoint not configured** — demo mode until a Formspree ID is set
  (see "Form wiring" above).
- **Trainer photos are stock** — generic Unsplash portraits, not real coaches.
- **Content is sample/placeholder** — names, testimonials, stats, address,
  phone are filler.
- **Social links** in the footer point to `#` (no real profiles yet).
- **No real OG share image hosted** — currently points at the Unsplash hero.

## How to run
Open `ironforge.html` directly in any modern browser. No server required.
