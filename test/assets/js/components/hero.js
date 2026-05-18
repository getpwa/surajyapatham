/* Hero — full-width hero with gradient overlay, dual CTA, optional stats. */

import { createEl, animateCounter } from '../utils.js';

export function renderHero(container, data) {
  const variant = data.variant || 'split';

  if (variant === 'centered') {
    return renderCenteredHero(container, data);
  }
  return renderSplitHero(container, data);
}

function renderSplitHero(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'hero-gradient relative overflow-hidden' });

  /* Decorative dots */
  section.append(createEl('div', { class: 'absolute inset-0 bg-dots opacity-50 pointer-events-none', 'aria-hidden': 'true' }));

  const inner = createEl('div', {
    class: 'container mx-auto px-4 py-16 md:py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative'
  });

  /* Text column */
  const text = createEl('div', { 'data-reveal': '' });
  if (data.eyebrow) {
    text.append(createEl('span', {
      class: 'inline-block bg-saffron-100 text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5'
    }, data.eyebrow));
  }
  text.append(createEl('h1', {
    class: 'font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6',
    html: data.title || ''
  }));
  if (data.subtitle) {
    text.append(createEl('p', {
      class: 'text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl'
    }, data.subtitle));
  }
  if (data.tagline) {
    text.append(createEl('p', {
      class: 'font-serif italic text-brand-800 dark:text-brand-300 text-lg md:text-xl mb-8 max-w-xl border-l-4 border-saffron-500 pl-4'
    }, data.tagline));
  }

  /* CTAs */
  if (data.primaryCta || data.secondaryCta) {
    const cta = createEl('div', { class: 'flex flex-wrap gap-3' });
    if (data.primaryCta) {
      cta.append(createEl('a', {
        href: data.primaryCta.link || '#',
        class: 'inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-7 py-3.5 rounded-full font-semibold transition shadow-lg shadow-brand-700/20'
      }, data.primaryCta.text, createEl('span', { html: '→' })));
    }
    if (data.secondaryCta) {
      cta.append(createEl('a', {
        href: data.secondaryCta.link || '#',
        class: 'inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3.5 rounded-full font-semibold transition'
      }, data.secondaryCta.text));
    }
    text.append(cta);
  }

  /* Stats row */
  if (data.stats && data.stats.length) {
    const stats = createEl('div', { class: 'grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-700/60' });
    data.stats.forEach((s, i) => {
      const num = createEl('div', {
        class: 'counter font-serif text-3xl md:text-4xl font-bold text-brand-800 dark:text-brand-300',
        'data-counter-target': String(s.value || 0)
      }, '0');
      stats.append(createEl('div', { 'data-reveal': '', 'data-reveal-delay': String(i * 150) },
        num,
        createEl('div', { class: 'text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mt-1 font-semibold' }, s.label)
      ));
      /* Animate when visible */
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
    text.append(stats);
  }

  inner.append(text);

  /* Image / illustration column */
  const visual = createEl('div', {
    class: 'relative aspect-[5/4] rounded-3xl overflow-hidden shadow-card animate-float',
    'data-reveal': '',
    'data-reveal-delay': '200'
  });
  if (data.image) {
    const img = document.createElement('img');
    img.src = data.image;
    img.alt = data.imageAlt || data.title || 'Hero image';
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.className = 'w-full h-full object-cover';
    img.addEventListener('error', () => {
      img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0%' stop-color='%23bfdbfe'/><stop offset='100%' stop-color='%23fed7aa'/></linearGradient></defs><rect width='800' height='600' fill='url(%23g)'/></svg>`;
    });
    visual.append(img);
    visual.append(createEl('div', { class: 'absolute inset-0 bg-gradient-to-tr from-brand-900/30 via-transparent to-saffron-500/10' }));
  }
  inner.append(visual);

  section.append(inner);
  container.append(section);
}

function renderCenteredHero(container, data) {
  const section = createEl('section', { id: data.id || null, class: 'hero-gradient relative overflow-hidden' });
  section.append(createEl('div', { class: 'absolute inset-0 bg-dots opacity-50', 'aria-hidden': 'true' }));

  const inner = createEl('div', { class: 'container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl relative', 'data-reveal': '' });

  if (data.eyebrow) {
    inner.append(createEl('span', {
      class: 'inline-block bg-saffron-100 text-saffron-800 dark:bg-saffron-900/40 dark:text-saffron-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-5'
    }, data.eyebrow));
  }
  inner.append(createEl('h1', {
    class: 'font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6',
    html: data.title || ''
  }));
  if (data.subtitle) {
    inner.append(createEl('p', { class: 'text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto' }, data.subtitle));
  }
  if (data.primaryCta || data.secondaryCta) {
    const cta = createEl('div', { class: 'flex flex-wrap gap-3 justify-center' });
    if (data.primaryCta) {
      cta.append(createEl('a', {
        href: data.primaryCta.link || '#',
        class: 'inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white px-7 py-3.5 rounded-full font-semibold transition shadow-lg shadow-brand-700/20'
      }, data.primaryCta.text, createEl('span', { html: '→' })));
    }
    if (data.secondaryCta) {
      cta.append(createEl('a', {
        href: data.secondaryCta.link || '#',
        class: 'inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 px-7 py-3.5 rounded-full font-semibold transition'
      }, data.secondaryCta.text));
    }
    inner.append(cta);
  }

  section.append(inner);
  container.append(section);
}
