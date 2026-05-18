/* Footer — quick links, brand statement, social, legal. */

import { createEl } from '../utils.js';

export function mountFooter(container, site) {
  if (!container) return;
  container.innerHTML = '';
  const brand = site.brand || { name: 'Surajyapatham' };
  const footer = site.footer || {};

  const wrap = createEl('div', { class: 'bg-slate-900 text-slate-300 mt-20' });

  /* Top band */
  const inner = createEl('div', { class: 'container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10' });

  /* Brand column */
  const brandCol = createEl('div', { class: 'lg:col-span-1' });
  brandCol.append(
    createEl('div', { class: 'flex items-center gap-2.5 mb-4' },
      createEl('span', { class: 'inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-saffron-500 text-white font-serif font-bold text-lg' }, 'S'),
      createEl('span', { class: 'font-serif font-bold text-white text-lg' }, brand.name)
    ),
    createEl('p', { class: 'text-slate-400 leading-relaxed text-sm' },
      brand.statement || 'Reimagining the purpose of citizen-centric governance.'
    )
  );

  if (footer.social && footer.social.length) {
    const socialRow = createEl('div', { class: 'flex gap-3 mt-5' });
    footer.social.forEach(s => {
      socialRow.append(createEl('a', {
        href: s.link || '#',
        'aria-label': s.label,
        target: '_blank', rel: 'noopener noreferrer',
        class: 'w-9 h-9 inline-flex items-center justify-center rounded-full bg-slate-800 hover:bg-brand-700 transition text-slate-300 hover:text-white text-sm font-bold'
      }, s.icon || s.label?.charAt(0) || '•'));
    });
    brandCol.append(socialRow);
  }
  inner.append(brandCol);

  /* Link columns */
  (footer.columns || []).forEach(col => {
    const colDiv = createEl('div');
    colDiv.append(createEl('h4', { class: 'text-white font-semibold text-sm uppercase tracking-wider mb-4' }, col.title));
    const ul = createEl('ul', { class: 'space-y-2.5' });
    (col.links || []).forEach(l => {
      ul.append(createEl('li', {},
        createEl('a', {
          href: l.href || '#',
          class: 'text-slate-400 hover:text-white transition text-sm link-underline'
        }, l.label)
      ));
    });
    colDiv.append(ul);
    inner.append(colDiv);
  });

  wrap.append(inner);

  /* Bottom band */
  const bottom = createEl('div', { class: 'border-t border-slate-800' });
  const bInner = createEl('div', { class: 'container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500' });
  bInner.append(
    createEl('div', {}, `© ${new Date().getFullYear()} ${brand.name}. ${footer.legal || 'All rights reserved.'}`),
    createEl('div', { class: 'flex gap-5' },
      ...(footer.bottomLinks || []).map(l => createEl('a', { href: l.href, class: 'hover:text-slate-300 transition' }, l.label))
    )
  );
  bottom.append(bInner);
  wrap.append(bottom);

  container.append(wrap);
}
