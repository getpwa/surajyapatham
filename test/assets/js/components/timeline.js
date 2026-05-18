/* Timeline — reusable vertical timeline (separate from case-study timeline). */

import { createEl } from '../utils.js';

export function renderTimeline(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4 max-w-4xl' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-12', 'data-reveal': '' }, data.subtitle));

  const tl = createEl('div', { class: 'timeline' });
  (data.items || []).forEach((event, i) => {
    const item = createEl('div', { class: 'timeline-item', 'data-reveal': '', 'data-reveal-delay': String(i * 80) });
    if (event.label) item.append(createEl('div', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold text-sm uppercase tracking-wider mb-1' }, event.label));
    item.append(createEl('h3', { class: 'font-serif text-xl font-bold text-slate-900 dark:text-white mb-2' }, event.title || ''));
    if (event.description) item.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed' }, event.description));
    tl.append(item);
  });
  inner.append(tl);
  section.append(inner);
  container.append(section);
}
