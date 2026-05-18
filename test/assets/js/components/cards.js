/* Cards grid — flexible renderer for audience cards, feature cards, image cards. */

import { createEl, appendKids } from '../utils.js';

export function renderCards(container, data) {
  const section = createEl('section', { id: data.id || null, class: data.background === 'muted' ? 'py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/40' : 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });

  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-12', 'data-reveal': '' }, data.subtitle));

  const cols = data.columns || 3;
  const gridCls = {
    2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
  }[cols] || 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  const grid = createEl('div', { class: gridCls });
  (data.items || []).forEach((item, i) => grid.append(buildCard(item, data.style, i)));
  inner.append(grid);

  section.append(inner);
  container.append(section);
}

function buildCard(item, style = 'default', i = 0) {
  const delay = String(Math.min(i * 100, 500));
  const link = item.link || item.cta?.link;

  /* --- Image card (with photo) --- */
  if (style === 'image' || item.images?.thumbnail) {
    const card = createEl(link ? 'a' : 'div', {
      href: link || null,
      class: 'group block card-lift bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-soft',
      'data-reveal': '', 'data-reveal-delay': delay
    });
    const imgWrap = createEl('div', { class: 'aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700 relative' });
    const img = document.createElement('img');
    img.src = item.images?.thumbnail || item.images?.hero || '';
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.className = 'w-full h-full object-cover group-hover:scale-105 transition duration-500';
    img.addEventListener('error', () => {
      img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%23dbeafe'/><stop offset='100%' stop-color='%23fed7aa'/></linearGradient></defs><rect width='800' height='500' fill='url(%23g)'/></svg>`;
    });
    imgWrap.append(img);
    if (item.category) {
      imgWrap.append(createEl('span', {
        class: 'absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-brand-800 dark:text-brand-300 uppercase tracking-wider'
      }, item.category));
    }
    card.append(imgWrap);
    const body = createEl('div', { class: 'p-6' });
    appendKids(body,
      createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition' }, item.title || ''),
      item.subtitle ? createEl('p', { class: 'text-slate-500 dark:text-slate-400 text-sm mb-3 font-medium' }, item.subtitle) : null,
      createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed text-sm' }, item.description || ''),
      link ? createEl('div', { class: 'inline-flex items-center gap-1.5 mt-4 text-brand-700 dark:text-brand-300 font-semibold text-sm group-hover:gap-2.5 transition-all' }, item.cta?.text || 'Read more', createEl('span', { html: '→' })) : null
    );
    card.append(body);
    return card;
  }

  /* --- Audience / icon card --- */
  if (style === 'audience') {
    const card = createEl(link ? 'a' : 'div', {
      href: link || null,
      class: 'group block card-lift bg-white dark:bg-slate-800 rounded-2xl p-7 shadow-soft border border-slate-100 dark:border-slate-700',
      'data-reveal': '', 'data-reveal-delay': delay
    });
    appendKids(card,
      createEl('div', { class: 'inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-saffron-100 dark:from-brand-900/40 dark:to-saffron-900/30 text-brand-800 dark:text-brand-200 text-2xl mb-5' }, item.icon || '◆'),
      createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-3' }, item.title || ''),
      item.bullets ? renderBullets(item.bullets) : createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed' }, item.description || ''),
      link ? createEl('div', { class: 'inline-flex items-center gap-1.5 mt-5 text-brand-700 dark:text-brand-300 font-semibold text-sm group-hover:gap-2.5 transition-all' }, item.cta?.text || 'Explore', createEl('span', { html: '→' })) : null
    );
    return card;
  }

  /* --- Minimal feature card --- */
  const card = createEl(link ? 'a' : 'div', {
    href: link || null,
    class: 'group block card-lift bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft',
    'data-reveal': '', 'data-reveal-delay': delay
  });
  appendKids(card,
    item.icon ? createEl('div', { class: 'text-3xl mb-3' }, item.icon) : null,
    createEl('h3', { class: 'font-serif text-lg font-bold text-slate-900 dark:text-white mb-2' }, item.title || ''),
    createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed text-sm' }, item.description || ''),
    link ? createEl('div', { class: 'inline-flex items-center gap-1.5 mt-4 text-brand-700 dark:text-brand-300 font-semibold text-sm' }, item.cta?.text || 'Learn more', createEl('span', { html: '→' })) : null
  );
  return card;
}

function renderBullets(arr) {
  const ul = createEl('ul', { class: 'space-y-2' });
  arr.forEach(b => {
    ul.append(createEl('li', { class: 'flex gap-2.5 items-start text-slate-600 dark:text-slate-300 text-sm leading-relaxed' },
      createEl('span', { class: 'mt-1 w-1.5 h-1.5 rounded-full bg-saffron-500 flex-shrink-0' }),
      createEl('span', {}, b)
    ));
  });
  return ul;
}
