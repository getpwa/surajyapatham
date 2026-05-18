# CLAUDE.md — Surajyapatham Governance Portal

This file provides guidance to Claude Code (claude.com/code) when working on this repository.

---

## Project Overview

**Surajyapatham** is a static, JSON-driven governance awareness and citizen empowerment portal. Its purpose is to sensitize citizens, inspire public servants, and bring governance innovators together around the idea of **citizen-centric, ethical, outcome-driven governance**.

- **Tagline:** "Good governance begins with good intentions — but thrives through better practices."
- **Audience:** Citizens, Public Servants, Researchers, Innovators
- **Source content:** `doc.txt` (authoritative content structure — do not deviate from the 9-section IA defined there)

---

## Hard Technical Constraints

ONLY use:
- HTML5 (semantic)
- Tailwind CSS (via CDN; no build step required)
- Vanilla JavaScript (ES modules, no transpilation)
- Fetch API (for JSON loading)
- JSON files (single source of truth for content)

NEVER use:
- React / Vue / Angular / Svelte / Next / Nuxt / any framework
- jQuery, Bootstrap, Material UI, or any UI library
- Any backend, database, or server-side rendering
- npm/bundlers (Vite, webpack, etc.) — the site must run by opening `index.html` over a static server
- Inline `<script>` blocks in HTML (except the single bootstrap module import)
- Monolithic JS — every component lives in its own file under `/assets/js/components/`

---

## Architecture

### JSON-Driven Rendering
Every page is an empty HTML shell. Content is fetched from `/data/*.json` and rendered into the DOM by JavaScript components. No page content is hardcoded in HTML.

Flow:
1. HTML page declares `<div data-page="home">` (or similar) and imports `app.js`
2. `app.js` reads `data-page` attribute and calls `renderer.js`
3. `renderer.js` fetches the relevant JSON file(s) and dispatches sections to component renderers
4. Each component (`hero.js`, `cards.js`, `timeline.js`, etc.) exports a `render(container, data)` function that returns DOM nodes

### Standard Content Object Schema
Every content item across all JSONs follows this shape:

```json
{
  "id": "unique-id",
  "slug": "kebab-case-slug",
  "title": "...",
  "subtitle": "...",
  "description": "...",
  "category": "...",
  "tags": [],
  "featured": true,
  "images": {
    "hero": "",
    "banner": "",
    "thumbnail": "",
    "gallery": [],
    "icon": "",
    "infographics": []
  },
  "cta": { "text": "", "link": "" }
}
```

Case studies extend this with: `citizenSummary`, `officerVersion`, `challenges`, `actions`, `technology`, `outcomes`, `processFlow`, `replicationToolkit`, `timeline`, `downloads`.

---

## Folder Structure

```
/
├── index.html              # Home
├── about.html              # About Surajyapatham
├── governance.html         # Foundations of Good Governance
├── dilemmas.html           # Dilemmas of a Public Servant
├── case-studies.html       # Governance in Action (listing + detail via ?slug=)
├── tools.html              # Tools & Templates
├── citizen-hub.html        # Citizen Empowerment Hub
├── knowledge.html          # Knowledge Centre
├── learning.html           # Learning Hub
├── contact.html            # Contact & Feedback
├── CLAUDE.md               # This file
├── README.md               # Deployment instructions
│
├── assets/
│   ├── css/
│   │   └── styles.css       # Custom CSS supplementing Tailwind (animations, scroll reveal)
│   ├── js/
│   │   ├── app.js           # Entry point, page bootstrap
│   │   ├── router.js        # Reads ?slug= and data-page, dispatches to renderer
│   │   ├── renderer.js      # Orchestrates section rendering for each page
│   │   ├── search.js        # Client-side fuzzy search across all JSON content
│   │   ├── utils.js         # fetchJSON, debounce, escapeHTML, lazyLoad, etc.
│   │   └── components/
│   │       ├── navbar.js
│   │       ├── footer.js
│   │       ├── hero.js
│   │       ├── cards.js
│   │       ├── spotlight.js
│   │       ├── caseStudy.js
│   │       ├── gallery.js
│   │       ├── timeline.js
│   │       ├── modal.js
│   │       ├── accordion.js
│   │       ├── tabs.js
│   │       └── counter.js
│   └── images/
│       ├── home/
│       ├── case-studies/
│       ├── spotlights/
│       ├── citizens/
│       ├── governance/
│       ├── tools/
│       ├── learning/
│       ├── research/
│       ├── icons/
│       └── illustrations/
│
├── data/
│   ├── site.json           # Global: nav, footer, brand
│   ├── home.json
│   ├── about.json
│   ├── governance.json
│   ├── dilemmas.json
│   ├── tools.json
│   ├── citizen-hub.json
│   ├── knowledge.json
│   ├── learning.json
│   ├── contact.json
│   ├── case-studies/
│   │   ├── index.json         # listing manifest
│   │   ├── ente-bhoomi.json
│   │   ├── kerala-rescue.json
│   │   ├── covid-jagrata.json
│   │   ├── udayam.json
│   │   ├── oppam.json
│   │   ├── forest-rights.json
│   │   └── ehealth.json
│   ├── spotlights/
│   │   └── index.json
│   ├── tools/
│   ├── research/
│   ├── governance/
│   └── citizen-rights/
│
└── templates/              # HTML partial fragments used by JS for hydration
```

---

## Design System

### Color Palette (Tailwind custom config via inline `tailwind.config`)
- **Primary (Trust Blue):** `#1e40af` — institutional, calm
- **Accent (Warm Saffron):** `#d97706` — Indian governance heritage
- **Earth (Soft Green):** `#15803d` — sustainability, growth
- **Neutral:** Slate scale (50–900) for typography and surfaces
- **Background:** soft gradients from `slate-50` → `blue-50` → `amber-50`

### Typography
- **Headings:** "Fraunces" or "Playfair Display" (serif, institutional)
- **Body:** "Inter" (sans, readable)
- Loaded via Google Fonts in each HTML `<head>`

### Visual Patterns
- Soft gradients, generous whitespace
- Card-based layouts with subtle elevation (`shadow-sm` → `shadow-xl` on hover)
- Scroll-reveal animations via IntersectionObserver
- Sticky navbar with shadow on scroll
- Reading progress bar (top of page) on long-form pages
- Animated counters for impact stats

---

## Required Pages & Their JSON Sources

| Page | HTML | JSON | Key Sections |
|------|------|------|--------------|
| Home | `index.html` | `home.json` | Hero, mission, 4 audience cards, spotlights, pillars, featured case studies, innovation, empowerment, knowledge, CTA |
| About | `about.html` | `about.json` | Hero, problem statement, mission, how-it-helps, founder's message |
| Foundations | `governance.html` | `governance.json` | Citizen-centric, core values, ethical service, systems thinking, sustainability |
| Dilemmas | `dilemmas.html` | `dilemmas.json` | 5 reflective dilemmas as story cards |
| Case Studies | `case-studies.html` | `case-studies/index.json` + individual files | Filterable grid + detail view (`?slug=`) |
| Tools | `tools.html` | `tools.json` | Planning tools, disaster toolkits, monitoring |
| Citizen Hub | `citizen-hub.html` | `citizen-hub.json` | Rights, standards, participation, redressal, explainers |
| Knowledge | `knowledge.html` | `knowledge.json` | Innovation digest, playbooks, columns, whitepapers |
| Learning | `learning.html` | `learning.json` | Modules, webinars, mentorship |
| Contact | `contact.html` | `contact.json` | Citizen / officer / researcher forms |

---

## Component Contracts

Every component module under `assets/js/components/` exports:

```js
export function render(container, data, options = {}) { /* mounts into container */ }
```

`renderer.js` looks up sections in JSON by `type` field (e.g. `"type": "hero"`, `"type": "cards-grid"`, `"type": "timeline"`) and delegates to the matching component.

---

## Image Strategy

- All images are **placeholder paths** (`/assets/images/...`) referenced in JSON
- Provide an `images/README.md` explaining what each image should be
- Implement `loading="lazy"` on every `<img>`
- Use `<picture>`/`srcset` only where two sizes are needed (hero banners)
- Galleries open in a vanilla JS lightbox modal (no external library)
- For now, use Unsplash governance/India-themed URLs as live placeholders so the demo renders nicely out of the box

---

## Search

- Build a custom lightweight client-side search (no Fuse.js dependency)
- On first invocation, fetch and concatenate all JSON files into an in-memory index
- Tokenize by word; score by title-match (3x), tag-match (2x), description-match (1x)
- Render results in a dropdown under the navbar search input
- Support `?q=` URL param for deep-linkable search

---

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- Skip-to-main link
- Focus rings (Tailwind `focus-visible:` utilities)
- All images have `alt` text from JSON
- Color contrast ≥ WCAG AA
- ARIA attributes on tabs, accordions, modals, mobile menu

---

## SEO

- Each HTML file has unique `<title>`, `<meta name="description">`, OpenGraph tags
- JSON-LD `Organization` markup in `index.html`
- Canonical URLs

---

## Deployment

The site is deployable to any static host:
- Open `index.html` directly **will not work** because of `fetch()` CORS on `file://`
- Local preview: `python3 -m http.server 8000` from project root
- Hosts: GitHub Pages, Netlify, Vercel (static), Cloudflare Pages — no build command needed

---

## When Adding Content

1. Add the content as a JSON object in the appropriate `/data/*.json` file
2. If it's a new case study, add the slug to `/data/case-studies/index.json` AND create `/data/case-studies/<slug>.json`
3. Add image placeholders under `/assets/images/<category>/`
4. No HTML or JS changes needed for new content — the renderer handles it

## When Adding New Section Types

1. Create a new component in `/assets/js/components/<name>.js` exporting `render(container, data)`
2. Register it in `renderer.js`'s `SECTION_RENDERERS` map
3. Use `"type": "<name>"` in JSON to invoke it
