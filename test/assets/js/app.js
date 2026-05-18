/* App entry — bootstraps navbar, footer, runs router for current page. */

import { fetchJSON, initScrollReveal, initReadingProgress, initTheme, jumpToHash, qs } from './utils.js';
import { currentPage, loadPage } from './router.js';
import { renderPage } from './renderer.js';
import { mountNavbar } from './components/navbar.js';
import { mountFooter } from './components/footer.js';

async function bootstrap() {
  initTheme();

  let siteConfig = null;
  try {
    siteConfig = await fetchJSON('data/site.json');
  } catch (err) {
    console.error('Failed to load site config:', err);
    siteConfig = { brand: { name: 'Surajyapatham' }, nav: [], footer: {} };
  }

  mountNavbar(qs('#navbar-mount'), siteConfig);
  mountFooter(qs('#footer-mount'), siteConfig);

  const page = currentPage();
  if (page) {
    try {
      const payload = await loadPage(page);
      renderPage(page, payload);
    } catch (err) {
      console.error('Failed to render page:', err);
      const main = qs('main[data-page]');
      if (main) {
        main.innerHTML = `
          <div class="container mx-auto px-4 py-24 text-center">
            <h1 class="font-serif text-3xl font-bold text-slate-900 dark:text-white mb-3">Content not available</h1>
            <p class="text-slate-600 dark:text-slate-400">We couldn't load this page right now. Please try again.</p>
            <a href="index.html" class="inline-block mt-6 text-brand-700 dark:text-brand-300 font-semibold link-underline">← Back to home</a>
          </div>`;
      }
    }
  }

  /* After dynamic content lands in the DOM, wire up animations & progress. */
  requestAnimationFrame(() => {
    initScrollReveal();
    initReadingProgress();
    jumpToHash();
  });
}

document.addEventListener('DOMContentLoaded', bootstrap);
