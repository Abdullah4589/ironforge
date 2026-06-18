# IRONFORGE

A single-page marketing website for **IRONFORGE**, a strength & performance
training facility. Built with plain HTML, CSS, and vanilla JavaScript — no
build step, no frameworks, no dependencies.

> **Train hard. Break limits.**

## Features

- Animated intro loader and split-word headline reveals
- Sticky nav with scroll-spy active-link highlighting
- Responsive design — desktop, tablet, and mobile (hamburger menu)
- Sections: hero, classes, trainers, pricing, testimonials, FAQ accordion, contact
- Scroll-reveal animations, animated stat counters, cursor spotlight, card tilt
- Accessible: keyboard focus styles, ARIA attributes, `prefers-reduced-motion` support
- SEO + social meta (Open Graph / Twitter cards) and an inline SVG favicon

## Project structure

| File | Purpose |
|------|---------|
| `ironforge.html` | Markup |
| `forge.css` | All styles (tokens, layout, animations, responsive) |
| `forge.js` | All behavior (loader, reveals, menu, scroll-spy, FAQ, form) |

## Running locally

It's a static site — just open `ironforge.html` in a browser.

To view it on other devices on your network, serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://<your-computer-ip>:8000/ironforge.html`.

## Notes

- **Contact form** posts to a [Formspree](https://formspree.io) endpoint. Replace
  `your-form-id` in the form's `action` to go live; until then it runs in demo mode.
- Hero and trainer images are hot-linked from Unsplash; self-host them for production.
