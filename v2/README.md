# Surajyapatham website

Static site: HTML5, Bootstrap 5.3, Bootstrap Icons, Swiper (homepage slider). No server code.

## Pages
| Page | File | Content source |
|---|---|---|
| Home | `index.html` | hand-built + blocks from `_src/data/home.json` |
| About | `about.html` | hand-built (About PDF) |
| Foundations | `foundations.html` | `_src/data/governance.json` |
| Dilemmas of a Public Servant | `dilemmas.html` | `_src/data/dilemmas.json` |
| Case studies (list) | `case-studies.html` | `_src/data/case-studies/index.json` |
| Case study detail ×7 | `case-study-<slug>.html` | `_src/data/case-studies/<slug>.json` |
| Citizen Hub | `citizen-hub.html` | `_src/data/citizen-hub.json` |
| Tools | `tools.html` | `_src/data/tools.json` |
| Knowledge | `knowledge.html` | `_src/data/knowledge.json` |
| Learning | `learning.html` | `_src/data/learning.json` |
| Contact | `contact.html` | `_src/data/contact.json` |
| Not found | `404.html` | generated |

## Editing content
1. Edit the JSON in `_src/data/` (or the hand-built `index.html` / `about.html` main content).
2. Run `python3 _src/build.py` — regenerates pages, shared header/footer on every page, `assets/js/search-index.js`, `sitemap.xml`, `robots.txt`.
3. Photos are real Kerala / India photographs (taken 2024 or later) from Wikimedia Commons, listed in `_src/photos.json` (slot key → Commons file, alt text, author, licence). To change one, edit its `file`/`alt` (copy author/licence/source from the Commons page), run `python3 _src/fetch_commons.py`, then rebuild. Credits are generated automatically on `credits.html` — keep it published (CC BY / CC BY-SA require attribution).
4. Checks: `python3 _src/check.py` (links, anchors, images, emails) and `python3 _src/coverage.py` (every JSON text appears on its page).

Contact email everywhere: **we4samatvam@gmail.com** (set as `EMAIL` in `_src/build.py`).

## Deploying
Upload everything **except** `_src/` and `README.md` to any static host (Netlify, GitHub Pages, cPanel, S3).
Point the host's 404 page to `404.html`. If the domain is not `https://surajyapatham.in/`, change `SITE_URL` in `_src/build.py` and rebuild (used for canonical links, Open Graph and the sitemap).
After changing CSS/JS, bump `VERSION` in `_src/build.py` and rebuild so browsers fetch the new files.
