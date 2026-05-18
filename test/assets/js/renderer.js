/* Renderer — walks a page's section list and delegates to component renderers. */

import { createEl, qs, appendKids } from './utils.js';

import { renderHero }       from './components/hero.js';
import { renderCards }      from './components/cards.js';
import { renderSpotlight }  from './components/spotlight.js';
import { renderCaseStudy, renderCaseStudyList } from './components/caseStudy.js';
import { renderGallery }    from './components/gallery.js';
import { renderTimeline }   from './components/timeline.js';
import { renderAccordion }  from './components/accordion.js';
import { renderTabs }       from './components/tabs.js';
import { renderCounter }    from './components/counter.js';
import { renderContact }    from './components/contact.js';
import { renderSearchPage } from './search.js';

/* Maps JSON section `type` → component renderer. */
const SECTION_RENDERERS = {
  hero:          renderHero,
  cards:         renderCards,
  'cards-grid':  renderCards,
  spotlight:     renderSpotlight,
  gallery:       renderGallery,
  timeline:      renderTimeline,
  accordion:     renderAccordion,
  tabs:          renderTabs,
  counters:      renderCounter,
  contact:       renderContact,
  'rich-text':   renderRichText,
  'pillars':     renderPillars,
  'cta-banner':  renderCtaBanner,
  'two-column':  renderTwoColumn,
  'callout':     renderCallout,
  'pull-quote':  renderPullQuote
};

/* ----- inline section renderers for simple structures ----- */

function renderRichText(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-12 md:py-16' });
  const inner = createEl('div', { class: 'container mx-auto px-4 max-w-3xl' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 font-semibold uppercase tracking-wider text-sm mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6', 'data-reveal': '' }, data.title));
  if (data.body) {
    const blocks = Array.isArray(data.body) ? data.body : [data.body];
    blocks.forEach((p, i) => {
      inner.append(createEl('p', {
        class: 'text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-5',
        'data-reveal': '',
        'data-reveal-delay': String(Math.min(i * 100, 400))
      }, p));
    });
  }
  if (data.bullets) {
    const ul = createEl('ul', { class: 'space-y-3 mt-4', 'data-reveal': '' });
    data.bullets.forEach(b => {
      ul.append(createEl('li', { class: 'flex gap-3 items-start text-slate-700 dark:text-slate-300' },
        createEl('span', { class: 'mt-1.5 inline-block w-2 h-2 rounded-full bg-brand-600 flex-shrink-0' }),
        createEl('span', { html: b })
      ));
    });
    inner.append(ul);
  }
  wrap.append(inner);
  container.append(wrap);
}

function renderPillars(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/40' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-12', 'data-reveal': '' }, data.subtitle));

  const grid = createEl('div', { class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' });
  (data.items || []).forEach((item, i) => {
    const card = createEl('div', {
      class: 'pillar-card card-lift bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-soft',
      'data-reveal': '',
      'data-reveal-delay': String(Math.min(i * 100, 500))
    });
    card.append(
      createEl('div', { class: 'inline-flex w-12 h-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mb-4 text-2xl' }, item.icon || '●'),
      createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2' }, item.title),
      createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed' }, item.description)
    );
    grid.append(card);
  });
  inner.append(grid);
  wrap.append(inner);
  container.append(wrap);
}

function renderCtaBanner(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });
  const panel = createEl('div', {
    class: 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-saffron-600 text-white p-10 md:p-16 text-center shadow-card',
    'data-reveal': ''
  });
  panel.append(
    createEl('div', { class: 'absolute inset-0 bg-dots opacity-20 pointer-events-none' }),
    createEl('div', { class: 'relative' },
      data.eyebrow ? createEl('p', { class: 'text-saffron-200 uppercase tracking-wider text-sm font-semibold mb-3' }, data.eyebrow) : null,
      createEl('h2', { class: 'font-serif text-3xl md:text-5xl font-bold mb-4 max-w-3xl mx-auto' }, data.title || ''),
      data.subtitle ? createEl('p', { class: 'text-white/85 text-lg max-w-2xl mx-auto mb-8' }, data.subtitle) : null,
      data.cta ? createEl('a', {
        href: data.cta.link || '#',
        class: 'inline-flex items-center gap-2 bg-white text-brand-800 hover:bg-saffron-50 transition px-7 py-3.5 rounded-full font-semibold shadow-lg'
      }, data.cta.text || 'Learn more', createEl('span', { html: '→' })) : null
    )
  );
  inner.append(panel);
  wrap.append(inner);
  container.append(wrap);
}

function renderTwoColumn(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center' });

  const text = createEl('div', { 'data-reveal': '' });
  if (data.eyebrow) text.append(createEl('p', { class: 'text-saffron-600 font-semibold uppercase tracking-wider text-sm mb-3' }, data.eyebrow));
  text.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-5' }, data.title || ''));
  if (data.body) {
    const blocks = Array.isArray(data.body) ? data.body : [data.body];
    blocks.forEach(p => text.append(createEl('p', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-4' }, p)));
  }
  if (data.bullets) {
    const ul = createEl('ul', { class: 'space-y-3 mt-6' });
    data.bullets.forEach(b => {
      ul.append(createEl('li', { class: 'flex gap-3 items-start text-slate-700 dark:text-slate-300' },
        createEl('span', { class: 'mt-1 text-earth-600 dark:text-earth-400', html: '✓' }),
        createEl('span', { html: b })
      ));
    });
    text.append(ul);
  }
  if (data.cta) {
    text.append(createEl('a', {
      href: data.cta.link || '#',
      class: 'inline-flex items-center gap-2 mt-7 bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-full font-semibold transition'
    }, data.cta.text || 'Read more', createEl('span', { html: '→' })));
  }

  const imgWrap = createEl('div', {
    class: 'relative rounded-3xl overflow-hidden shadow-card aspect-[4/3] bg-slate-100 dark:bg-slate-800',
    'data-reveal': '',
    'data-reveal-delay': '200'
  });
  if (data.image) {
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.imageAlt || data.title || '';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover';
    img.addEventListener('error', () => {
      img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%23dbeafe'/><stop offset='100%' stop-color='%23fed7aa'/></linearGradient></defs><rect width='800' height='600' fill='url(%23g)'/></svg>`;
    });
    imgWrap.append(img);
  }

  if (data.imagePosition === 'left') {
    inner.append(imgWrap, text);
  } else {
    inner.append(text, imgWrap);
  }
  wrap.append(inner);
  container.append(wrap);
}

function renderCallout(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-10' });
  const inner = createEl('div', { class: 'container mx-auto px-4 max-w-4xl' });
  const tone = data.tone === 'warm' ? 'from-saffron-50 to-amber-50 border-saffron-200 dark:from-saffron-900/30 dark:to-amber-900/20 dark:border-saffron-700/40' :
               data.tone === 'earth' ? 'from-earth-50 to-emerald-50 border-earth-200 dark:from-earth-900/30 dark:to-emerald-900/20 dark:border-earth-700/40' :
                                       'from-brand-50 to-sky-50 border-brand-200 dark:from-brand-900/30 dark:to-sky-900/20 dark:border-brand-700/40';
  const panel = createEl('div', {
    class: `bg-gradient-to-br ${tone} border rounded-2xl p-6 md:p-8 flex gap-4 items-start`,
    'data-reveal': ''
  });
  panel.append(
    createEl('div', { class: 'text-3xl' }, data.icon || '💡'),
    createEl('div', {},
      data.title ? createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2' }, data.title) : null,
      createEl('p', { class: 'text-slate-700 dark:text-slate-200 leading-relaxed', html: data.body || '' })
    )
  );
  inner.append(panel);
  wrap.append(inner);
  container.append(wrap);
}

function renderPullQuote(container, data) {
  const wrap = createEl('section', { id: data.id || null, class: 'py-16' });
  const inner = createEl('div', { class: 'container mx-auto px-4 max-w-3xl text-center', 'data-reveal': '' });
  appendKids(inner,
    createEl('div', { class: 'text-6xl text-brand-300 dark:text-brand-700 font-serif leading-none mb-4' }, '“'),
    createEl('blockquote', { class: 'font-serif text-2xl md:text-3xl text-slate-800 dark:text-slate-100 leading-snug italic' }, data.quote || ''),
    data.attribution ? createEl('p', { class: 'mt-6 text-slate-500 dark:text-slate-400 font-medium' }, `— ${data.attribution}`) : null
  );
  wrap.append(inner);
  container.append(wrap);
}

/* ---------- Main entry ---------- */

export function renderPage(pageName, payload) {
  const main = qs('main[data-page]');
  if (!main) return;
  main.innerHTML = '';

  /* Search page is special — owned by search.js */
  if (pageName === 'search') {
    renderSearchPage(main, payload);
    return;
  }

  /* Case studies — either listing or detail */
  if (pageName === 'case-studies') {
    if (payload.view === 'detail') {
      renderCaseStudy(main, payload.data);
      return;
    }
    renderCaseStudyList(main, payload.data);
    return;
  }

  /* Standard sections-driven page */
  const sections = payload.sections || [];
  sections.forEach(section => {
    const renderer = SECTION_RENDERERS[section.type];
    if (!renderer) {
      console.warn(`No renderer for section type: ${section.type}`);
      return;
    }
    try {
      renderer(main, section);
    } catch (err) {
      console.error(`Failed to render section "${section.type}":`, err);
    }
  });

  /* Update document title if provided */
  if (payload.meta?.title) document.title = payload.meta.title;
}
