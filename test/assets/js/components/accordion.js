/* Accordion — semantic <details>/<summary> for FAQs and explainers. */

import { createEl } from '../utils.js';

export function renderAccordion(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4 max-w-3xl' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-10', 'data-reveal': '' }, data.subtitle));

  const list = createEl('div', { class: 'space-y-3' });
  (data.items || []).forEach((item, i) => {
    const details = createEl('details', {
      class: 'group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-soft',
      'data-reveal': '', 'data-reveal-delay': String(Math.min(i * 60, 400))
    });
    const summary = createEl('summary', {
      class: 'cursor-pointer flex items-center justify-between gap-4 px-6 py-5 select-none'
    });
    summary.append(
      createEl('span', { class: 'font-serif text-lg font-semibold text-slate-900 dark:text-white' }, item.question || item.title || ''),
      createEl('span', { class: 'flex-shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 transition group-open:rotate-45 text-lg font-bold' }, '+')
    );
    details.append(summary);
    const body = createEl('div', { class: 'px-6 pb-6 text-slate-700 dark:text-slate-300 leading-relaxed', html: item.answer || item.body || '' });
    details.append(body);
    list.append(details);
  });
  inner.append(list);
  section.append(inner);
  container.append(section);
}
