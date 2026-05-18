/* Animated counters — impact stats. */

import { createEl, animateCounter } from '../utils.js';

export function renderCounter(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-14 md:py-20 bg-gradient-to-br from-brand-50 to-saffron-50 dark:from-brand-900/30 dark:to-saffron-900/20' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });
  if (data.title) inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-10', 'data-reveal': '' }, data.title));

  const items = data.items || [];
  const grid = createEl('div', { class: `grid grid-cols-2 md:grid-cols-${Math.min(items.length, 4)} gap-8` });
  items.forEach((s, i) => {
    const num = createEl('div', { class: 'counter font-serif text-4xl md:text-5xl font-bold text-brand-800 dark:text-brand-300' }, '0');
    grid.append(createEl('div', { class: 'text-center', 'data-reveal': '', 'data-reveal-delay': String(i * 80) },
      num,
      s.unit ? createEl('span', { class: 'font-serif text-2xl md:text-3xl font-bold text-brand-800 dark:text-brand-300 ml-1' }, s.unit) : null,
      createEl('div', { class: 'text-slate-600 dark:text-slate-300 text-sm md:text-base mt-2 font-medium' }, s.label || '')
    ));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(num, s.value || 0);
          obs.unobserve(num);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(num);
  });
  inner.append(grid);
  section.append(inner);
  container.append(section);
}
