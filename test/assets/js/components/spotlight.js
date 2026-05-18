/* Spotlight — featured stories. Visually richer than plain cards. */

import { createEl, appendKids } from '../utils.js';

export function renderSpotlight(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });

  /* Header */
  const head = createEl('div', { class: 'flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12', 'data-reveal': '' });
  const headLeft = createEl('div', {});
  if (data.eyebrow) headLeft.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm mb-2' }, data.eyebrow));
  headLeft.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white' }, data.title || 'Spotlight Stories'));
  if (data.subtitle) headLeft.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 mt-3 max-w-2xl' }, data.subtitle));
  head.append(headLeft);
  if (data.viewAll) {
    head.append(createEl('a', {
      href: data.viewAll.link || '#',
      class: 'inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold link-underline whitespace-nowrap'
    }, data.viewAll.text || 'View all', createEl('span', { html: '→' })));
  }
  inner.append(head);

  /* Grid */
  const grid = createEl('div', { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' });
  (data.items || []).forEach((s, i) => grid.append(buildSpotlightCard(s, i)));
  inner.append(grid);

  section.append(inner);
  container.append(section);
}

function buildSpotlightCard(item, i) {
  const tones = {
    'citizen':     'from-brand-600 to-brand-800',
    'innovation':  'from-saffron-500 to-saffron-700',
    'public-servant': 'from-earth-600 to-earth-800'
  };
  const tone = tones[item.tone] || 'from-brand-700 to-saffron-600';

  const card = createEl(item.link ? 'a' : 'div', {
    href: item.link || null,
    class: 'group block relative rounded-2xl overflow-hidden card-lift bg-white dark:bg-slate-800 shadow-soft',
    'data-reveal': '',
    'data-reveal-delay': String(Math.min(i * 150, 500))
  });

  /* Image */
  const imgWrap = createEl('div', { class: 'aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-700' });
  if (item.images?.thumbnail || item.images?.hero) {
    const img = document.createElement('img');
    img.src = item.images.thumbnail || item.images.hero;
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover group-hover:scale-105 transition duration-700';
    img.addEventListener('error', () => {
      img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%231e40af'/><stop offset='100%' stop-color='%23d97706'/></linearGradient></defs><rect width='800' height='600' fill='url(%23g)'/></svg>`;
    });
    imgWrap.append(img);
  }
  imgWrap.append(createEl('div', { class: `absolute inset-0 bg-gradient-to-t ${tone} opacity-30 group-hover:opacity-20 transition` }));
  imgWrap.append(createEl('span', {
    class: 'absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 text-brand-800 dark:text-brand-300 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur'
  }, item.label || 'Spotlight'));
  card.append(imgWrap);

  /* Body */
  const body = createEl('div', { class: 'p-6' });
  appendKids(body,
    createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition' }, item.title || ''),
    createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-4' }, item.description || ''),
    item.attribution ? createEl('p', { class: 'text-slate-500 dark:text-slate-400 text-xs italic mb-3' }, item.attribution) : null,
    createEl('div', { class: 'inline-flex items-center gap-1.5 text-brand-700 dark:text-brand-300 font-semibold text-sm group-hover:gap-2.5 transition-all' },
      item.cta?.text || 'Read the story', createEl('span', { html: '→' }))
  );
  card.append(body);
  return card;
}
