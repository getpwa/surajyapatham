/* Navbar — sticky, mobile-friendly, with theme toggle and search. */

import { createEl, toggleTheme, qsa } from '../utils.js';
import { mountSearchInput } from '../search.js';

export function mountNavbar(container, site) {
  if (!container) return;
  container.innerHTML = '';

  const navLinks = site.nav || [];
  const brand = site.brand || { name: 'Surajyapatham', tagline: '' };
  const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* shadow on scroll */
  const header = createEl('div', {
    class: 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 transition-shadow',
    id: 'navbar-inner'
  });

  const nav = createEl('nav', {
    class: 'container mx-auto px-4 flex items-center justify-between h-16 lg:h-20 gap-4',
    'aria-label': 'Primary navigation'
  });

  /* Brand */
  const brandLink = createEl('a', {
    href: 'index.html',
    class: 'flex items-center gap-2.5 group flex-shrink-0',
    'aria-label': brand.name
  });
  brandLink.append(
    createEl('span', {
      class: 'inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700 to-saffron-600 text-white font-serif font-bold text-lg shadow-md',
      'aria-hidden': 'true'
    }, 'S'),
    createEl('div', { class: 'leading-tight' },
      createEl('div', { class: 'font-serif font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-700 dark:group-hover:text-brand-300 transition' }, brand.name),
      brand.tagline ? createEl('div', { class: 'text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:block' }, brand.tagline) : null
    )
  );
  nav.append(brandLink);

  /* Desktop links — only on xl+ (1280px+). Below that, the hamburger drawer is used. */
  const linksWrap = createEl('div', { class: 'hidden xl:flex items-center gap-0.5' });
  navLinks.forEach(link => {
    const isActive = currentPath === link.href.toLowerCase();
    linksWrap.append(createEl('a', {
      href: link.href,
      class: `px-2.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
        isActive
          ? 'text-brand-800 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/30'
          : 'text-slate-700 dark:text-slate-200 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`,
      'aria-current': isActive ? 'page' : null
    }, link.label));
  });
  nav.append(linksWrap);

  /* Right cluster — search + theme + mobile */
  const right = createEl('div', { class: 'flex items-center gap-2' });

  /* Search input wrapper — visible at xl+ alongside the desktop nav.
     Below xl the search lives inside the hamburger drawer (mounted further below). */
  const searchWrap = createEl('div', { class: 'relative hidden xl:block' });
  right.append(searchWrap);

  /* Theme toggle */
  const themeBtn = createEl('button', {
    type: 'button',
    class: 'inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition',
    'aria-label': 'Toggle dark mode',
    title: 'Toggle dark mode'
  });
  const updateThemeIcon = () => {
    const isDark = document.documentElement.classList.contains('dark');
    themeBtn.innerHTML = isDark
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  };
  updateThemeIcon();
  themeBtn.addEventListener('click', () => { toggleTheme(); updateThemeIcon(); });
  right.append(themeBtn);

  /* Mobile / drawer menu button — visible below xl */
  const mobileBtn = createEl('button', {
    type: 'button',
    class: 'inline-flex xl:hidden items-center justify-center w-10 h-10 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition',
    'aria-label': 'Open menu',
    'aria-controls': 'mobile-nav',
    'aria-expanded': 'false'
  });
  mobileBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  right.append(mobileBtn);

  nav.append(right);
  header.append(nav);
  container.append(header);

  /* Mobile nav drawer */
  const drawer = createEl('div', {
    id: 'mobile-nav',
    class: 'mobile-nav fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-[70] flex flex-col',
    'aria-hidden': 'true'
  });
  const drawerHeader = createEl('div', { class: 'flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800' });
  drawerHeader.append(
    createEl('span', { class: 'font-serif font-bold text-slate-900 dark:text-white' }, 'Menu'),
    createEl('button', {
      type: 'button',
      class: 'w-9 h-9 inline-flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
      'aria-label': 'Close menu',
      onclick: () => closeMobileNav()
    }, createEl('span', { html: '✕' }))
  );
  drawer.append(drawerHeader);

  const drawerLinks = createEl('div', { class: 'flex-1 overflow-y-auto px-4 py-4' });
  navLinks.forEach(link => {
    const isActive = currentPath === link.href.toLowerCase();
    drawerLinks.append(createEl('a', {
      href: link.href,
      class: `block px-4 py-3 rounded-xl font-medium mb-1 ${
        isActive
          ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
      }`
    }, link.label));
  });
  drawer.append(drawerLinks);

  /* Mobile search */
  const mobileSearchWrap = createEl('div', { class: 'px-4 py-4 border-t border-slate-100 dark:border-slate-800 relative' });
  drawer.append(mobileSearchWrap);

  const backdrop = createEl('div', {
    id: 'mobile-nav-backdrop',
    class: 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[65] hidden',
    onclick: () => closeMobileNav()
  });
  document.body.append(backdrop, drawer);

  const openMobileNav = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.remove('hidden');
    mobileBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeMobileNav = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.add('hidden');
    mobileBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  mobileBtn.addEventListener('click', openMobileNav);

  /* Esc to close */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeMobileNav();
  });

  /* Sticky shadow on scroll */
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 8) header.classList.add('shadow-soft');
    else header.classList.remove('shadow-soft');
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mount search input AFTER navbar is in DOM */
  mountSearchInput(searchWrap, { placeholder: 'Search…' });
  mountSearchInput(mobileSearchWrap, { placeholder: 'Search the portal', layout: 'mobile' });
}
