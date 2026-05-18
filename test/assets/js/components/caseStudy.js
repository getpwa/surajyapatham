/* Case Study — listing view + detail view with citizen/officer tabs. */

import { createEl, qs, appendKids } from '../utils.js';
import { openLightbox } from './gallery.js';

/* ---------- Listing ---------- */
export function renderCaseStudyList(container, data) {
  /* Hero */
  const hero = createEl('section', { class: 'hero-gradient py-16 md:py-24 relative overflow-hidden' });
  hero.append(createEl('div', { class: 'absolute inset-0 bg-dots opacity-50' }));
  const heroInner = createEl('div', { class: 'container mx-auto px-4 relative max-w-4xl text-center', 'data-reveal': '' });
  heroInner.append(
    createEl('span', { class: 'inline-block bg-saffron-100 text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5' }, data.eyebrow || 'Governance in Action'),
    createEl('h1', { class: 'font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-5' }, data.title || 'Case Studies'),
    createEl('p', { class: 'text-lg text-slate-600 dark:text-slate-300 leading-relaxed' }, data.subtitle || '')
  );
  hero.append(heroInner);
  container.append(hero);

  /* Category filters */
  const categories = ['All', ...new Set((data.items || []).map(i => i.category).filter(Boolean))];

  const filterWrap = createEl('div', { class: 'container mx-auto px-4 pt-12' });
  const filterBar = createEl('div', { class: 'flex flex-wrap gap-2 justify-center mb-10', 'data-reveal': '' });
  categories.forEach((cat, idx) => {
    filterBar.append(createEl('button', {
      type: 'button',
      class: `tab-btn px-4 py-2 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition`,
      'data-filter': cat,
      'aria-selected': idx === 0 ? 'true' : 'false'
    }, cat));
  });
  filterWrap.append(filterBar);
  container.append(filterWrap);

  /* Grid */
  const gridSection = createEl('section', { class: 'pb-20' });
  const gridInner = createEl('div', { class: 'container mx-auto px-4' });
  const grid = createEl('div', { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', id: 'case-study-grid' });

  (data.items || []).forEach((cs, i) => grid.append(buildCaseStudyCard(cs, i)));
  gridInner.append(grid);
  gridSection.append(gridInner);
  container.append(gridSection);

  /* Filter wiring */
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    const cat = btn.dataset.filter;
    filterBar.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    grid.querySelectorAll('[data-category]').forEach(card => {
      const show = cat === 'All' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
    });
  });
}

function buildCaseStudyCard(cs, i) {
  const card = createEl('a', {
    href: `case-studies.html?slug=${cs.slug}`,
    class: 'group block card-lift bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-soft',
    'data-reveal': '',
    'data-reveal-delay': String(Math.min(i * 80, 400)),
    'data-category': cs.category || ''
  });
  const imgWrap = createEl('div', { class: 'aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700 relative' });
  const img = document.createElement('img');
  img.src = cs.images?.thumbnail || cs.images?.hero || '';
  img.alt = cs.title || '';
  img.loading = 'lazy';
  img.className = 'w-full h-full object-cover group-hover:scale-105 transition duration-500';
  img.addEventListener('error', () => {
    img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%23dbeafe'/><stop offset='100%' stop-color='%23fed7aa'/></linearGradient></defs><rect width='800' height='500' fill='url(%23g)'/></svg>`;
  });
  imgWrap.append(img);
  if (cs.category) {
    imgWrap.append(createEl('span', {
      class: 'absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-brand-800 dark:text-brand-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider'
    }, cs.category));
  }
  card.append(imgWrap);
  const body = createEl('div', { class: 'p-6' });
  appendKids(body,
    cs.location ? createEl('p', { class: 'text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold' }, cs.location) : null,
    createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition' }, cs.title || ''),
    cs.subtitle ? createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4' }, cs.subtitle) : null,
    createEl('div', { class: 'inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold text-sm group-hover:gap-2.5 transition-all' },
      'Read case study', createEl('span', { html: '→' }))
  );
  card.append(body);
  return card;
}

/* ---------- Detail ---------- */
export function renderCaseStudy(container, cs) {
  /* Hero */
  const hero = createEl('section', { class: 'relative overflow-hidden h-[60vh] min-h-[420px]' });
  const img = document.createElement('img');
  img.src = cs.images?.hero || cs.images?.banner || '';
  img.alt = cs.title || '';
  img.loading = 'eager';
  img.fetchPriority = 'high';
  img.className = 'absolute inset-0 w-full h-full object-cover';
  img.addEventListener('error', () => {
    img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%231e40af'/><stop offset='100%' stop-color='%23d97706'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/></svg>`;
  });
  hero.append(img);
  hero.append(createEl('div', { class: 'absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent' }));

  const heroInner = createEl('div', { class: 'absolute inset-x-0 bottom-0 container mx-auto px-4 pb-12 text-white' });
  appendKids(heroInner,
    createEl('div', { class: 'flex flex-wrap items-center gap-2 mb-4 text-xs uppercase tracking-wider font-bold' },
      createEl('a', { href: 'case-studies.html', class: 'opacity-80 hover:opacity-100 link-underline' }, '← All case studies'),
      cs.category ? createEl('span', { class: 'opacity-50' }, '•') : null,
      cs.category ? createEl('span', { class: 'bg-saffron-500/90 px-3 py-1 rounded-full' }, cs.category) : null,
      cs.location ? createEl('span', { class: 'opacity-90' }, cs.location) : null
    ),
    createEl('h1', { class: 'font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl mb-3' }, cs.title || ''),
    cs.subtitle ? createEl('p', { class: 'text-lg md:text-xl text-white/85 max-w-3xl' }, cs.subtitle) : null
  );
  hero.append(heroInner);
  container.append(hero);

  /* Quick stats */
  if (cs.stats && cs.stats.length) {
    const statsSec = createEl('section', { class: 'py-10 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900' });
    const statsInner = createEl('div', { class: 'container mx-auto px-4' });
    const grid = createEl('div', { class: `grid grid-cols-2 md:grid-cols-${Math.min(cs.stats.length, 4)} gap-6` });
    cs.stats.forEach((s, i) => {
      grid.append(createEl('div', { class: 'text-center', 'data-reveal': '', 'data-reveal-delay': String(i * 80) },
        createEl('div', { class: 'font-serif text-3xl md:text-4xl font-bold text-brand-800 dark:text-brand-300' }, s.value || ''),
        createEl('div', { class: 'text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-wider mt-1 font-semibold' }, s.label || '')
      ));
    });
    statsInner.append(grid);
    statsSec.append(statsInner);
    container.append(statsSec);
  }

  /* Citizen / Officer tabs */
  const tabsSec = createEl('section', { class: 'py-14 md:py-20' });
  const tabsInner = createEl('div', { class: 'container mx-auto px-4 max-w-5xl' });
  const tabBar = createEl('div', { class: 'inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-10', role: 'tablist' });
  const citizenTab = createEl('button', {
    type: 'button', role: 'tab', class: 'tab-btn px-5 py-2 rounded-full text-sm font-semibold transition',
    'aria-selected': 'true', 'data-target': 'citizen-view'
  }, '👥 Citizen Summary');
  const officerTab = createEl('button', {
    type: 'button', role: 'tab', class: 'tab-btn px-5 py-2 rounded-full text-sm font-semibold transition',
    'aria-selected': 'false', 'data-target': 'officer-view'
  }, '🏛 Officer Detail');
  tabBar.append(citizenTab, officerTab);
  tabsInner.append(tabBar);

  /* Citizen view */
  const citizenView = createEl('div', { id: 'citizen-view', class: 'space-y-6', 'data-reveal': '' });
  if (cs.citizen?.summary) {
    citizenView.append(createEl('p', { class: 'font-serif text-2xl md:text-3xl text-slate-800 dark:text-slate-100 leading-snug' }, cs.citizen.summary));
  }
  if (cs.citizen?.story) {
    const paragraphs = Array.isArray(cs.citizen.story) ? cs.citizen.story : [cs.citizen.story];
    paragraphs.forEach(p => citizenView.append(createEl('p', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed text-lg' }, p)));
  }
  if (cs.citizen?.changes && cs.citizen.changes.length) {
    citizenView.append(createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mt-8 mb-3' }, 'What changed for citizens'));
    const ul = createEl('ul', { class: 'space-y-3' });
    cs.citizen.changes.forEach(c => {
      ul.append(createEl('li', { class: 'flex gap-3 items-start' },
        createEl('span', { class: 'mt-1.5 inline-flex w-6 h-6 items-center justify-center rounded-full bg-earth-100 dark:bg-earth-900/40 text-earth-700 dark:text-earth-300 flex-shrink-0 text-xs font-bold' }, '✓'),
        createEl('span', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed' }, c)
      ));
    });
    citizenView.append(ul);
  }

  /* Officer view */
  const officerView = createEl('div', { id: 'officer-view', class: 'space-y-10 hidden' });
  if (cs.officer?.overview) {
    officerView.append(createEl('div', { class: 'prose-block' },
      createEl('h3', { class: 'font-serif text-2xl font-bold text-slate-900 dark:text-white mb-3' }, 'Overview'),
      ...(Array.isArray(cs.officer.overview) ? cs.officer.overview : [cs.officer.overview])
        .map(p => createEl('p', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed text-base mb-3' }, p))
    ));
  }
  if (cs.officer?.challenges) officerView.append(renderListBlock('Challenges', cs.officer.challenges, '⚠'));
  if (cs.officer?.actions)    officerView.append(renderListBlock('Actions Taken', cs.officer.actions, '▶'));
  if (cs.officer?.technology) officerView.append(renderListBlock('Technology Used', cs.officer.technology, '⚙'));
  if (cs.officer?.outcomes)   officerView.append(renderListBlock('Outcomes', cs.officer.outcomes, '★'));
  if (cs.officer?.processFlow) officerView.append(renderProcessFlow(cs.officer.processFlow));
  if (cs.officer?.replicationToolkit) officerView.append(renderListBlock('Replication Toolkit', cs.officer.replicationToolkit, '📋'));

  tabsInner.append(citizenView, officerView);

  /* Tab switching */
  [citizenTab, officerTab].forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      [citizenTab, officerTab].forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
      citizenView.classList.toggle('hidden', target !== 'citizen-view');
      officerView.classList.toggle('hidden', target !== 'officer-view');
    });
  });

  tabsSec.append(tabsInner);
  container.append(tabsSec);

  /* Timeline */
  if (cs.timeline && cs.timeline.length) {
    const tSec = createEl('section', { class: 'py-14 md:py-20 bg-slate-50/60 dark:bg-slate-900/40' });
    const tInner = createEl('div', { class: 'container mx-auto px-4 max-w-4xl' });
    tInner.append(createEl('h2', { class: 'font-serif text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center', 'data-reveal': '' }, 'How it unfolded'));
    const tl = createEl('div', { class: 'timeline' });
    cs.timeline.forEach((event, i) => {
      const item = createEl('div', { class: 'timeline-item', 'data-reveal': '', 'data-reveal-delay': String(i * 80) });
      item.append(
        createEl('div', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold text-sm uppercase tracking-wider mb-1' }, event.date || ''),
        createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2' }, event.title || ''),
        createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed' }, event.description || '')
      );
      tl.append(item);
    });
    tInner.append(tl);
    tSec.append(tInner);
    container.append(tSec);
  }

  /* Gallery */
  if (cs.images?.gallery && cs.images.gallery.length) {
    const gSec = createEl('section', { class: 'py-14 md:py-20' });
    const gInner = createEl('div', { class: 'container mx-auto px-4' });
    gInner.append(createEl('h2', { class: 'font-serif text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center', 'data-reveal': '' }, 'Gallery'));
    const grid = createEl('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' });
    cs.images.gallery.forEach((g, i) => {
      const btn = createEl('button', {
        type: 'button',
        class: 'group block aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 cursor-zoom-in',
        'data-reveal': '', 'data-reveal-delay': String(Math.min(i * 50, 400)),
        onclick: () => openLightbox(cs.images.gallery, i)
      });
      const im = document.createElement('img');
      im.src = (typeof g === 'string' ? g : g.src) || '';
      im.alt = (typeof g === 'string' ? '' : g.alt) || cs.title || '';
      im.loading = 'lazy';
      im.className = 'w-full h-full object-cover group-hover:scale-110 transition duration-500';
      im.addEventListener('error', () => {
        im.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23dbeafe'/></svg>`;
      });
      btn.append(im);
      grid.append(btn);
    });
    gInner.append(grid);
    gSec.append(gInner);
    container.append(gSec);
  }

  /* Downloads */
  if (cs.downloads && cs.downloads.length) {
    const dSec = createEl('section', { class: 'py-14 md:py-20 bg-slate-50/60 dark:bg-slate-900/40' });
    const dInner = createEl('div', { class: 'container mx-auto px-4 max-w-4xl' });
    dInner.append(createEl('h2', { class: 'font-serif text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center', 'data-reveal': '' }, 'Resources & Downloads'));
    const list = createEl('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' });
    cs.downloads.forEach(d => {
      list.append(createEl('a', {
        href: d.link || '#',
        target: '_blank', rel: 'noopener',
        class: 'flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-soft transition'
      },
        createEl('div', { class: 'inline-flex w-10 h-10 items-center justify-center rounded-lg bg-saffron-100 dark:bg-saffron-900/40 text-saffron-700 dark:text-saffron-300 text-lg flex-shrink-0' }, d.icon || '📄'),
        createEl('div', { class: 'flex-1 min-w-0' },
          createEl('div', { class: 'font-semibold text-slate-900 dark:text-white truncate' }, d.title || ''),
          createEl('div', { class: 'text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider' }, d.type || 'PDF')
        ),
        createEl('span', { class: 'text-slate-400', html: '↓' })
      ));
    });
    dInner.append(list);
    dSec.append(dInner);
    container.append(dSec);
  }

  /* Share + back */
  const ctaSec = createEl('section', { class: 'py-14 md:py-20' });
  const ctaInner = createEl('div', { class: 'container mx-auto px-4 text-center', 'data-reveal': '' });
  ctaInner.append(
    createEl('p', { class: 'text-slate-600 dark:text-slate-300 mb-6' }, 'Found this useful? Share or explore more.'),
    createEl('div', { class: 'flex flex-wrap gap-3 justify-center' },
      createEl('a', { href: 'case-studies.html', class: 'bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-full font-semibold transition' }, '← More case studies'),
      createEl('a', { href: 'contact.html', class: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-3 rounded-full font-semibold transition' }, 'Request a replication toolkit')
    )
  );
  ctaSec.append(ctaInner);
  container.append(ctaSec);
}

function renderListBlock(title, items, icon = '•') {
  const wrap = createEl('div', { 'data-reveal': '' });
  wrap.append(createEl('h3', { class: 'font-serif text-2xl font-bold text-slate-900 dark:text-white mb-4' }, title));
  const ul = createEl('ul', { class: 'space-y-3' });
  items.forEach(item => {
    if (typeof item === 'string') {
      ul.append(createEl('li', { class: 'flex gap-3 items-start' },
        createEl('span', { class: 'mt-1 text-saffron-600 dark:text-saffron-400 flex-shrink-0 font-bold' }, icon),
        createEl('span', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed' }, item)
      ));
    } else {
      ul.append(createEl('li', { class: 'p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700' },
        createEl('h4', { class: 'font-semibold text-slate-900 dark:text-white mb-1' }, item.title || ''),
        createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed' }, item.description || '')
      ));
    }
  });
  wrap.append(ul);
  return wrap;
}

function renderProcessFlow(steps) {
  const wrap = createEl('div', { 'data-reveal': '' });
  wrap.append(createEl('h3', { class: 'font-serif text-2xl font-bold text-slate-900 dark:text-white mb-6' }, 'Process Flow'));
  const grid = createEl('div', { class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' });
  steps.forEach((step, i) => {
    grid.append(createEl('div', { class: 'relative p-5 bg-gradient-to-br from-brand-50 to-saffron-50 dark:from-brand-900/30 dark:to-saffron-900/20 rounded-xl border border-brand-100 dark:border-brand-800/40' },
      createEl('div', { class: 'absolute -top-3 -left-3 w-9 h-9 inline-flex items-center justify-center rounded-full bg-brand-700 text-white text-sm font-bold' }, String(i + 1)),
      createEl('h4', { class: 'font-semibold text-slate-900 dark:text-white mb-1.5 mt-1' }, step.title || ''),
      createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed' }, step.description || '')
    ));
  });
  wrap.append(grid);
  return wrap;
}
