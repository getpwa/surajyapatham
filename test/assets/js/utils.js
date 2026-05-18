/* Shared utilities — kept tiny and dependency-free. */

export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const createEl = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (val === null || val === undefined || val === false) continue;
    if (key === 'class') el.className = val;
    else if (key === 'dataset') Object.assign(el.dataset, val);
    else if (key === 'html') el.innerHTML = val;
    else if (key.startsWith('on') && typeof val === 'function') el.addEventListener(key.slice(2).toLowerCase(), val);
    else el.setAttribute(key, val);
  }
  appendKids(el, ...children);
  return el;
};

/* Append children to an element, skipping null/undefined/false.
   Native Element.append(null) stringifies to the literal text "null" —
   route every conditional append through this helper to avoid that. */
export const appendKids = (parent, ...children) => {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child.nodeType ? child : document.createTextNode(child));
  }
  return parent;
};

export const escapeHTML = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

const fetchCache = new Map();
export async function fetchJSON(path) {
  if (fetchCache.has(path)) return fetchCache.get(path);
  const promise = fetch(path, { cache: 'no-cache' })
    .then(r => {
      if (!r.ok) throw new Error(`Failed to load ${path}: ${r.status}`);
      return r.json();
    })
    .catch(err => {
      fetchCache.delete(path);
      throw err;
    });
  fetchCache.set(path, promise);
  return promise;
}

export const getParam = (name) => new URLSearchParams(window.location.search).get(name);

/* Image fallback: when remote image fails to load, swap to an SVG placeholder. */
export const onImageError = (e) => {
  const img = e.target;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = '1';
  const label = encodeURIComponent(img.alt || 'image');
  img.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
    <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='%23dbeafe'/><stop offset='100%' stop-color='%23fed7aa'/>
    </linearGradient></defs>
    <rect width='800' height='500' fill='url(%23g)'/>
    <text x='400' y='260' font-family='Inter,sans-serif' font-size='28' text-anchor='middle' fill='%231e40af' opacity='0.7'>${label}</text>
  </svg>`;
};

/* Render an image with lazy-loading and graceful fallback. */
export function renderImage({ src, alt = '', className = '', loading = 'lazy', sizes = '' } = {}) {
  const img = createEl('img', {
    src: src || '',
    alt,
    loading,
    decoding: 'async',
    class: className,
    sizes: sizes || null,
    onerror: onImageError
  });
  return img;
}

/* IntersectionObserver — reveal on scroll. */
export function initScrollReveal() {
  const els = qsa('[data-reveal]');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* Reading progress bar — updates on scroll. */
export function initReadingProgress() {
  const bar = qs('#reading-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = `${pct}%`;
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* Dark mode — class on <html>, persisted in localStorage. */
const THEME_KEY = 'suraj.theme';
export function initTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored ? stored === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', dark);
}
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  return isDark;
}

/* Animated counter — increments to target over duration ms. */
export function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const startVal = 0;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(tick);
}

/* Highlight matching tokens in a string (for search results). */
export function highlight(text, query) {
  if (!query) return escapeHTML(text);
  const safe = escapeHTML(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').split(/\s+/).filter(Boolean).join('|')})`, 'ig');
  return safe.replace(re, '<mark>$1</mark>');
}

/* Smooth scroll to a hash target if present on page load. */
export function jumpToHash() {
  if (!window.location.hash) return;
  setTimeout(() => {
    const el = qs(window.location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 300);
}
