/* Contact — email-based. No forms.
   Each audience card shows the email address with two actions:
     1. Open in email client (mailto: with prefilled subject + body)
     2. Copy email address to clipboard */

import { createEl, appendKids } from '../utils.js';

export function renderContact(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'py-16 md:py-24' });
  const inner = createEl('div', { class: 'container mx-auto px-4' });

  if (data.eyebrow)  inner.append(createEl('p', { class: 'text-saffron-600 dark:text-saffron-400 font-semibold uppercase tracking-wider text-sm text-center mb-3', 'data-reveal': '' }, data.eyebrow));
  if (data.title)    inner.append(createEl('h2', { class: 'font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4', 'data-reveal': '' }, data.title));
  if (data.subtitle) inner.append(createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-center max-w-2xl mx-auto mb-12', 'data-reveal': '' }, data.subtitle));

  const audiences = data.audiences || [];

  /* Audience grid */
  const cols = audiences.length >= 3 ? 'md:grid-cols-3' : audiences.length === 2 ? 'md:grid-cols-2' : '';
  const grid = createEl('div', { class: `grid grid-cols-1 ${cols} gap-6 max-w-6xl mx-auto` });
  audiences.forEach((a, i) => grid.append(buildAudienceCard(a, i)));
  inner.append(grid);

  /* Contact info row */
  if (data.contactInfo) {
    const info = createEl('div', { class: 'mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto', 'data-reveal': '' });
    data.contactInfo.forEach(c => {
      info.append(createEl('div', { class: 'text-center p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl' },
        createEl('div', { class: 'text-2xl mb-2' }, c.icon || '✉'),
        createEl('div', { class: 'font-semibold text-slate-900 dark:text-white mb-1' }, c.label || ''),
        c.value
          ? (c.link
              ? createEl('a', { href: c.link, class: 'text-brand-700 dark:text-brand-300 hover:underline text-sm break-all' }, c.value)
              : createEl('p', { class: 'text-slate-600 dark:text-slate-300 text-sm' }, c.value))
          : null
      ));
    });
    inner.append(info);
  }

  section.append(inner);
  container.append(section);
}

function buildAudienceCard(audience, i) {
  const email = audience.toEmail || 'hello@surajyapatham.in';
  const subject = audience.subject || `Surajyapatham — ${audience.label || 'Message'}`;
  const body = audience.body || '';
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

  const card = createEl('div', {
    class: 'bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 shadow-soft flex flex-col',
    'data-reveal': '',
    'data-reveal-delay': String(Math.min(i * 120, 400))
  });

  appendKids(card,
    createEl('div', { class: 'inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-saffron-100 dark:from-brand-900/40 dark:to-saffron-900/30 text-brand-800 dark:text-brand-200 text-2xl mb-5' }, audience.icon || '✉'),
    createEl('h3', { class: 'font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2' }, audience.title || audience.label || ''),
    audience.description ? createEl('p', { class: 'text-slate-600 dark:text-slate-300 leading-relaxed mb-5' }, audience.description) : null
  );

  /* Hints / topics */
  if (audience.hints && audience.hints.length) {
    const heading = audience.hintsTitle || 'What to write about';
    card.append(createEl('p', { class: 'text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2' }, heading));
    const ul = createEl('ul', { class: 'space-y-2 mb-6' });
    audience.hints.forEach(h => {
      ul.append(createEl('li', { class: 'flex gap-2.5 items-start text-slate-600 dark:text-slate-300 text-sm leading-relaxed' },
        createEl('span', { class: 'mt-1.5 w-1.5 h-1.5 rounded-full bg-saffron-500 flex-shrink-0' }),
        createEl('span', {}, h)
      ));
    });
    card.append(ul);
  }

  /* Email + actions pinned to bottom */
  const footer = createEl('div', { class: 'mt-auto' });

  const emailPill = createEl('div', { class: 'flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700 mb-3' });
  emailPill.append(
    createEl('span', { class: 'text-slate-400 flex-shrink-0', html: '✉' }),
    createEl('span', { class: 'text-sm text-slate-700 dark:text-slate-200 font-mono break-all flex-1 select-all' }, email)
  );
  footer.append(emailPill);

  const actions = createEl('div', { class: 'flex flex-wrap gap-2 items-center' });

  const openBtn = createEl('a', {
    href: mailto,
    class: 'inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-md shadow-brand-700/20'
  }, createEl('span', { html: '✉' }), 'Open in email');

  const copyBtn = createEl('button', {
    type: 'button',
    class: 'inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-5 py-2.5 rounded-full font-semibold text-sm transition'
  }, createEl('span', { html: '⧉' }), createEl('span', { class: 'copy-btn-label' }, 'Copy email'));

  copyBtn.addEventListener('click', async () => {
    const label = copyBtn.querySelector('.copy-btn-label');
    const success = await copyToClipboard(email);
    if (success) {
      label.textContent = 'Copied!';
      copyBtn.classList.add('text-earth-700', 'dark:text-earth-400', 'border-earth-300', 'dark:border-earth-700');
    } else {
      label.textContent = 'Press Ctrl/Cmd-C';
    }
    setTimeout(() => {
      label.textContent = 'Copy email';
      copyBtn.classList.remove('text-earth-700', 'dark:text-earth-400', 'border-earth-300', 'dark:border-earth-700');
    }, 2000);
  });

  actions.append(openBtn, copyBtn);
  footer.append(actions);

  card.append(footer);
  return card;
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
