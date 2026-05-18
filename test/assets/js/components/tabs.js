/* Tabs — generic tab section (used by Citizen Hub for rights/standards). */

import { createEl } from '../utils.js';

export function renderTabs(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });
  if (data.eyebrow) inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)   inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-10', 'data-reveal': '' }, data.subtitle));

  const tabs = data.items || [];

  const bar = createEl('div', { class: 'flex flex-wrap gap-2 justify-center mb-8', role: 'tablist', 'data-reveal': '' });
  const panels = createEl('div', {});

  tabs.forEach((tab, i) => {
    const btn = createEl('button', {
      type: 'button', role: 'tab',
      class: 'tab-btn px-4 py-2 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition',
      'aria-selected': i === 0 ? 'true' : 'false',
      'data-tab-index': String(i)
    }, tab.label || tab.title || `Tab ${i + 1}`);
    bar.append(btn);

    const panel = createEl('div', {
      class: `tab-panel ${i === 0 ? '' : 'hidden'} max-w-4xl mx-auto`,
      'data-panel-index': String(i)
    });
    if (tab.body) {
      const blocks = Array.isArray(tab.body) ? tab.body : [tab.body];
      blocks.forEach(p => panel.append(createEl('p', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-4' }, p)));
    }
    if (tab.bullets) {
      const ul = createEl('ul', { class: 'space-y-3 mt-4' });
      tab.bullets.forEach(b => {
        ul.append(createEl('li', { class: 'flex gap-3 items-start' },
          createEl('span', { class: 'mt-1.5 w-2 h-2 rounded-full bg-brand-600 flex-shrink-0' }),
          createEl('span', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed', html: b })
        ));
      });
      panel.append(ul);
    }
    if (tab.cards) {
      const grid = createEl('div', { class: 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-2' });
      tab.cards.forEach(c => {
        grid.append(createEl('div', { class: 'p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-soft' },
          c.icon ? createEl('div', { class: 'text-2xl mb-2' }, c.icon) : null,
          createEl('h4', { class: 'font-serif text-lg font-bold text-slate-900 dark:text-white mb-2' }, c.title || ''),
          createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm leading-relaxed' }, c.description || '')
        ));
      });
      panel.append(grid);
    }
    panels.append(panel);
  });

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tab-index]');
    if (!btn) return;
    const idx = btn.dataset.tabIndex;
    bar.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    panels.querySelectorAll('[data-panel-index]').forEach(p => {
      p.classList.toggle('hidden', p.dataset.panelIndex !== idx);
    });
  });

  inner.append(bar, panels);
  section.append(inner);
  container.append(section);
}
