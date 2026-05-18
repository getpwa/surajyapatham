/* Lightweight client-side search across all JSON content.
   - Indexes lazily on first use.
   - Scores: title 3x, tags 2x, description 1x.
   - Tokenized, case-insensitive, partial match. */

import { createEl, fetchJSON, debounce, escapeHTML, highlight, qs, qsa } from './utils.js';

const INDEX_SOURCES = [
  { path: 'data/home.json',         page: 'index.html',        bucket: 'Home' },
  { path: 'data/about.json',        page: 'about.html',        bucket: 'About' },
  { path: 'data/governance.json',   page: 'governance.html',   bucket: 'Foundations of Good Governance' },
  { path: 'data/dilemmas.json',     page: 'dilemmas.html',     bucket: 'Dilemmas of a Public Servant' },
  { path: 'data/tools.json',        page: 'tools.html',        bucket: 'Tools & Templates' },
  { path: 'data/citizen-hub.json',  page: 'citizen-hub.html',  bucket: 'Citizen Empowerment Hub' },
  { path: 'data/knowledge.json',    page: 'knowledge.html',    bucket: 'Knowledge Centre' },
  { path: 'data/learning.json',     page: 'learning.html',     bucket: 'Learning Hub' },
  { path: 'data/contact.json',      page: 'contact.html',      bucket: 'Contact & Feedback' }
];

let _index = null;
let _indexPromise = null;

async function buildIndex() {
  if (_index) return _index;
  if (_indexPromise) return _indexPromise;

  _indexPromise = (async () => {
    const docs = [];

    /* Section JSONs */
    for (const src of INDEX_SOURCES) {
      try {
        const data = await fetchJSON(src.path);
        crawl(data, src, docs);
      } catch (err) { /* ignore missing */ }
    }

    /* Case studies */
    try {
      const idx = await fetchJSON('data/case-studies/index.json');
      (idx.items || []).forEach(cs => {
        docs.push({
          title: cs.title,
          description: cs.subtitle || cs.description || '',
          tags: cs.tags || [],
          bucket: 'Case Study',
          link: `case-studies.html?slug=${cs.slug}`,
          image: cs.images?.thumbnail || cs.images?.hero || ''
        });
      });
    } catch (err) { /* ignore */ }

    _index = docs;
    return docs;
  })();

  return _indexPromise;
}

/* Walk a page JSON and extract searchable units from each section. */
function crawl(data, src, docs) {
  const sections = data.sections || [];
  sections.forEach(section => {
    const { type, title, subtitle, eyebrow, items } = section;
    if (title) {
      docs.push({
        title: title,
        description: subtitle || eyebrow || '',
        tags: [type, src.bucket],
        bucket: src.bucket,
        link: src.page
      });
    }
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (!item.title && !item.question) return;
        docs.push({
          title: item.title || item.question || '',
          description: item.description || item.subtitle || item.answer || item.body || '',
          tags: [...(item.tags || []), src.bucket],
          bucket: src.bucket,
          link: item.link || src.page,
          image: item.images?.thumbnail || ''
        });
      });
    }
  });
}

/* Score documents against a query. */
function search(query, docs) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const results = [];
  docs.forEach(d => {
    let score = 0;
    const title = (d.title || '').toLowerCase();
    const desc  = (d.description || '').toLowerCase();
    const tags  = (d.tags || []).join(' ').toLowerCase();
    tokens.forEach(t => {
      if (title.includes(t)) score += 3;
      if (tags.includes(t))  score += 2;
      if (desc.includes(t))  score += 1;
    });
    if (score > 0) results.push({ ...d, _score: score });
  });
  return results.sort((a, b) => b._score - a._score);
}

/* ---------- Navbar search input ---------- */

export function mountSearchInput(container, { placeholder = 'Search…', layout = 'desktop' } = {}) {
  if (!container) return;
  container.innerHTML = '';

  const wrap = createEl('div', { class: 'relative' });
  const input = createEl('input', {
    type: 'search',
    placeholder,
    'aria-label': 'Search the portal',
    class: layout === 'mobile'
      ? 'w-full pl-10 pr-3 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30'
      : 'w-56 lg:w-64 pl-9 pr-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:bg-white dark:focus:bg-slate-700 transition'
  });
  const icon = createEl('span', {
    class: 'absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none',
    html: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
  });
  wrap.append(icon, input);

  const dropdown = createEl('div', { class: 'search-results hidden text-left' });
  wrap.append(dropdown);
  container.append(wrap);

  const onInput = debounce(async () => {
    const q = input.value.trim();
    if (q.length < 2) { dropdown.classList.add('hidden'); dropdown.innerHTML = ''; return; }
    const idx = await buildIndex();
    const results = search(q, idx).slice(0, 8);
    renderDropdown(dropdown, results, q);
  }, 150);

  input.addEventListener('input', onInput);
  input.addEventListener('focus', () => { if (input.value.trim().length >= 2) dropdown.classList.remove('hidden'); });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) dropdown.classList.add('hidden');
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    }
    if (e.key === 'Escape') { dropdown.classList.add('hidden'); input.blur(); }
  });
}

function renderDropdown(container, results, query) {
  container.innerHTML = '';
  if (!results.length) {
    container.append(createEl('div', { class: 'px-4 py-5 text-sm text-slate-500 dark:text-slate-400' },
      `No results for "${query}". Try fewer or different words.`
    ));
    container.classList.remove('hidden');
    return;
  }
  results.forEach(r => {
    const link = createEl('a', {
      href: r.link || '#',
      class: 'block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition border-b border-slate-100 dark:border-slate-800 last:border-0'
    });
    link.append(
      createEl('div', { class: 'text-[11px] uppercase tracking-wider text-saffron-600 dark:text-saffron-400 font-bold mb-0.5' }, r.bucket || ''),
      createEl('div', { class: 'hit-title font-semibold text-slate-900 dark:text-white text-sm', html: highlight(r.title || '', query) }),
      r.description ? createEl('div', { class: 'text-slate-500 dark:text-slate-400 text-xs mt-0.5 line-clamp-1', html: highlight(r.description.slice(0, 140), query) }) : null
    );
    container.append(link);
  });
  container.append(createEl('a', {
    href: `search.html?q=${encodeURIComponent(query)}`,
    class: 'block px-4 py-3 text-center text-sm font-semibold text-brand-700 dark:text-brand-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition'
  }, `See all results for "${query}" →`));
  container.classList.remove('hidden');
}

/* ---------- Dedicated /search.html page ---------- */

export async function renderSearchPage(container, { query = '' } = {}) {
  /* Hero */
  const hero = createEl('section', { class: 'hero-gradient py-14 md:py-20' });
  const heroInner = createEl('div', { class: 'container mx-auto px-4 max-w-3xl text-center' });
  heroInner.append(createEl('h1', { class: 'font-serif text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4' }, 'Search Surajyapatham'));
  heroInner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 mb-6' }, 'Look across case studies, citizen rights, tools, and governance frameworks.'));

  /* Big search input */
  const form = createEl('form', { class: 'relative max-w-2xl mx-auto' });
  const input = createEl('input', {
    type: 'search', name: 'q', value: query,
    placeholder: 'Search the portal…',
    autocomplete: 'off', autofocus: '',
    class: 'w-full pl-12 pr-5 py-4 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-base shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500'
  });
  form.append(
    createEl('span', { class: 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none', html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` }),
    input
  );
  heroInner.append(form);
  hero.append(heroInner);
  container.append(hero);

  /* Results area */
  const resultsSec = createEl('section', { class: 'py-12 md:py-16' });
  const resultsInner = createEl('div', { class: 'container mx-auto px-4 max-w-3xl' });
  const status = createEl('p', { class: 'text-slate-500 dark:text-slate-400 mb-6 text-sm' }, '');
  const list = createEl('div', { class: 'space-y-3' });
  resultsInner.append(status, list);
  resultsSec.append(resultsInner);
  container.append(resultsSec);

  async function run(q) {
    if (!q || q.length < 2) {
      status.textContent = 'Type at least 2 characters to search.';
      list.innerHTML = '';
      return;
    }
    status.textContent = 'Searching…';
    const idx = await buildIndex();
    const results = search(q, idx);
    list.innerHTML = '';
    status.textContent = `${results.length} result${results.length === 1 ? '' : 's'} for "${q}"`;
    results.forEach(r => {
      list.append(createEl('a', {
        href: r.link || '#',
        class: 'block p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-soft transition'
      },
        createEl('div', { class: 'text-[11px] uppercase tracking-wider text-saffron-600 dark:text-saffron-400 font-bold mb-1' }, r.bucket || ''),
        createEl('h3', { class: 'font-serif text-lg font-bold text-slate-900 dark:text-white mb-1', html: highlight(r.title, q) }),
        r.description ? createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed', html: highlight(r.description, q) }) : null
      ));
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    history.replaceState(null, '', v ? `?q=${encodeURIComponent(v)}` : 'search.html');
    run(v);
  });
  const onInput = debounce(() => {
    const v = input.value.trim();
    history.replaceState(null, '', v ? `?q=${encodeURIComponent(v)}` : 'search.html');
    run(v);
  }, 200);
  input.addEventListener('input', onInput);

  run(query);
}
