/* Router — decides which JSON to load for the current page. */
import { fetchJSON, getParam } from './utils.js';

/* Page → JSON source mapping.
   For pages that depend on a query param (case studies), the function form is used. */
const PAGE_SOURCES = {
  home:           () => fetchJSON('data/home.json'),
  about:          () => fetchJSON('data/about.json'),
  governance:     () => fetchJSON('data/governance.json'),
  dilemmas:       () => fetchJSON('data/dilemmas.json'),
  'case-studies': async () => {
    const slug = getParam('slug');
    if (slug) {
      return {
        view: 'detail',
        data: await fetchJSON(`data/case-studies/${slug}.json`)
      };
    }
    return {
      view: 'list',
      data: await fetchJSON('data/case-studies/index.json')
    };
  },
  tools:        () => fetchJSON('data/tools.json'),
  'citizen-hub': () => fetchJSON('data/citizen-hub.json'),
  knowledge:    () => fetchJSON('data/knowledge.json'),
  learning:     () => fetchJSON('data/learning.json'),
  contact:      () => fetchJSON('data/contact.json'),
  search:       () => Promise.resolve({ query: getParam('q') || '' })
};

export async function loadPage(name) {
  const loader = PAGE_SOURCES[name];
  if (!loader) throw new Error(`Unknown page: ${name}`);
  return loader();
}

export function currentPage() {
  const main = document.querySelector('main[data-page]');
  return main ? main.dataset.page : null;
}
