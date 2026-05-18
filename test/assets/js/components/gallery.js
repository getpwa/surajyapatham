/* Gallery + lightbox modal. */

import { createEl, qs } from '../utils.js';

export function renderGallery(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-10', 'data-reveal': '' }, data.subtitle));

  const items = data.items || [];
  const grid = createEl('div', { class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' });
  items.forEach((g, i) => {
    const btn = createEl('button', {
      type: 'button',
      class: 'group block aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 cursor-zoom-in relative',
      'data-reveal': '', 'data-reveal-delay': String(Math.min(i * 60, 400)),
      onclick: () => openLightbox(items, i)
    });
    const im = document.createElement('img');
    im.src = (typeof g === 'string' ? g : g.src) || '';
    im.alt = (typeof g === 'string' ? '' : g.alt) || '';
    im.loading = 'lazy';
    im.className = 'w-full h-full object-cover group-hover:scale-110 transition duration-500';
    im.addEventListener('error', () => {
      im.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23dbeafe'/></svg>`;
    });
    btn.append(im);
    if (typeof g !== 'string' && g.caption) {
      btn.append(createEl('div', {
        class: 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-3 text-white text-xs text-left opacity-0 group-hover:opacity-100 transition'
      }, g.caption));
    }
    grid.append(btn);
  });
  inner.append(grid);
  section.append(inner);
  container.append(section);
}

/* ---------- Lightbox ---------- */
export function openLightbox(items, startIndex = 0) {
  const root = qs('#modal-root');
  if (!root) return;

  let idx = startIndex;

  const backdrop = createEl('div', {
    class: 'modal-backdrop',
    onclick: (e) => { if (e.target === backdrop) close(); }
  });
  const panel = createEl('div', { class: 'relative max-w-5xl', onclick: (e) => e.stopPropagation() });

  const img = createEl('img', { class: 'lightbox-img', alt: '' });
  const caption = createEl('div', { class: 'text-white/90 text-sm text-center mt-3 px-4' });

  const prevBtn = createEl('button', {
    type: 'button',
    class: 'absolute top-1/2 -left-2 md:-left-14 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/95 text-slate-800 hover:bg-white shadow-lg',
    'aria-label': 'Previous image',
    onclick: () => { idx = (idx - 1 + items.length) % items.length; update(); }
  }, '‹');
  const nextBtn = createEl('button', {
    type: 'button',
    class: 'absolute top-1/2 -right-2 md:-right-14 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-full bg-white/95 text-slate-800 hover:bg-white shadow-lg',
    'aria-label': 'Next image',
    onclick: () => { idx = (idx + 1) % items.length; update(); }
  }, '›');
  const closeBtn = createEl('button', {
    type: 'button',
    class: 'absolute -top-12 right-0 w-9 h-9 inline-flex items-center justify-center rounded-full bg-white/95 text-slate-800 hover:bg-white',
    'aria-label': 'Close lightbox',
    onclick: () => close()
  }, '✕');

  panel.append(img, caption, prevBtn, nextBtn, closeBtn);
  if (items.length <= 1) { prevBtn.style.display = 'none'; nextBtn.style.display = 'none'; }

  backdrop.append(panel);
  root.append(backdrop);
  document.body.style.overflow = 'hidden';

  function update() {
    const g = items[idx];
    const src = typeof g === 'string' ? g : g.src;
    const alt = typeof g === 'string' ? '' : g.alt;
    const cap = typeof g === 'string' ? '' : g.caption;
    img.src = src || '';
    img.alt = alt || '';
    caption.textContent = cap || `${idx + 1} / ${items.length}`;
  }
  function close() {
    backdrop.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  }
  document.addEventListener('keydown', onKey);

  update();
}
