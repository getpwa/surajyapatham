# Surajyapatham — Governance Portal

A static, JSON-driven governance awareness and citizen empowerment portal.

> "Good governance begins with good intentions — but thrives through better practices."

## What this is

A nine-section portal sensitising citizens, inspiring public servants, and bringing governance innovators together. Audience: citizens, public servants, researchers, innovators.

Architecture: every HTML page is an empty shell; content is fetched from `/data/*.json` and rendered by vanilla-JS components in `/assets/js/components/`.

## Tech stack

- HTML5, Tailwind CSS (CDN), vanilla JS (ES modules)
- Fetch API + JSON files — no backend, no build step, no framework
- Open `index.html` over a static server (not `file://`)

See [CLAUDE.md](CLAUDE.md) for the full architectural constraints and folder convention.

## Local preview

The site uses `fetch()` to load JSON, which fails on `file://`. Use any static server:

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Other options: `npx serve`, `php -S localhost:8000`, or any VS Code Live Server extension.

## Deployment

No build step. Push the repository as-is to any static host:

- **GitHub Pages** — push to `main`, enable Pages on the root.
- **Netlify** — drag-and-drop the folder, or connect the repo with no build command and publish directory `.`.
- **Vercel** — import the repo, framework preset "Other", no build command, output directory `.`.
- **Cloudflare Pages** — same as above.

## Project layout

```
index.html              # Home
about.html              # About Surajyapatham
governance.html         # Foundations of Good Governance
dilemmas.html           # Dilemmas of a Public Servant
case-studies.html       # Governance in Action (listing + detail via ?slug=)
tools.html              # Tools & Templates
citizen-hub.html        # Citizen Empowerment Hub
knowledge.html          # Knowledge Centre
learning.html           # Learning Hub
contact.html            # Contact & Feedback
search.html             # Site search (?q=…)

assets/css/             # styles.css (Tailwind supplement)
assets/js/              # app.js, router.js, renderer.js, search.js, utils.js
assets/js/components/   # navbar, footer, hero, cards, spotlight, caseStudy, gallery, timeline, accordion, tabs, counter, contact
assets/images/          # placeholder folder structure

data/                   # JSON source of truth for every page
data/site.json          # nav, footer, brand
data/case-studies/      # index.json + one file per slug
data/spotlights/        # index.json
```

## Adding content

- **New page section** — add an object to the relevant `data/*.json` `sections[]` with a `type` matching a registered renderer in [assets/js/renderer.js](assets/js/renderer.js).
- **New case study** — add an item to [data/case-studies/index.json](data/case-studies/index.json) AND create `data/case-studies/<slug>.json`. No HTML/JS changes required.
- **New section type** — create `assets/js/components/<name>.js` exporting `render(container, data)`, then register it in `SECTION_RENDERERS` in [assets/js/renderer.js](assets/js/renderer.js).

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). ES modules and the Fetch API are used directly — no polyfills are bundled.

## License

Content and code released for non-commercial public-interest use. See site footer / contact form for collaboration requests.
