# IRONFORGE

A marketing website for **IRONFORGE**, a strength & performance training facility in Karachi, Pakistan. Built with plain HTML, CSS, and vanilla JavaScript — no build step, no frameworks, no dependencies.

> **Train hard. Break limits.**

## Live Site

**[https://ironforgm.netlify.app/](https://ironforgm.netlify.app/)**

## Features

- Animated intro loader and split-word headline reveals
- Sticky nav with active page highlighting
- Responsive design — desktop, tablet, and mobile (hamburger menu)
- Sections: hero, classes, trainers, pricing, testimonials, FAQ accordion, location map, contact
- Scroll-reveal animations, animated stat counters, cursor spotlight, card tilt
- WhatsApp floating button for instant customer contact
- Cookie consent bar and Google Analytics integration
- Plan pre-selection — pricing buttons pass chosen plan into the trial form
- Accessible: keyboard focus styles, ARIA attributes, `prefers-reduced-motion` support
- SEO: Open Graph / Twitter cards, JSON-LD LocalBusiness structured data, canonical URL

## Project structure

| File | Purpose |
|------|---------|
| `ironforge.html` | Main landing page |
| `forge.css` | All styles (tokens, layout, animations, responsive) |
| `forge.js` | All behavior (loader, reveals, menu, FAQ, form, back-to-top, cookies) |
| `classes.html` / `trainers.html` / `pricing.html` / `about.html` | Subpages |
| `_redirects` | Netlify routing — serves `ironforge.html` at the root URL |

## Running locally

Open `ironforge.html` directly in any modern browser. No server required.

To view on other devices on your network:

```bash
python -m http.server 8000
```

Then visit `http://<your-ip>:8000/ironforge.html`.

## Integrations

| Service | Status |
|---------|--------|
| Formspree (`xeeblgwz`) | Live — collects name, phone, email, plan |
| Google Analytics (`G-R44Y9C6731`) | Active |
| WhatsApp (`+92 337 3815939`) | Live floating button + footer link |
