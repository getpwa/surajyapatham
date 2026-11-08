/* Surajyapatham — site interactions (shared by every page) */
(function () {
  'use strict';

  var root = document.documentElement;
  var PHOTO = function (id) { return 'assets/img/photos/' + id + '-sm.jpg'; };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Date ---------- */
  var today = $('#today');
  if (today) today.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (light default, remembered per browser) ---------- */
  var themeBtn = $('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('sp-theme', next); } catch (e) {}
  });

  /* ---------- Sticky header, progress, back-to-top ---------- */
  var header = $('#siteHeader');
  var bar = $('.scroll-progress span');
  var toTop = $('#toTop');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('is-visible', y > 900);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Homepage hero slider (Swiper) with custom rail ---------- */
  var DELAY = 7000;
  var heroEl = $('.hero');
  var railItems = $$('.rail-item');
  if (heroEl && window.Swiper) {
    heroEl.style.setProperty('--rail-ms', DELAY + 'ms');
    var setRail = function (i) {
      railItems.forEach(function (b, j) { b.classList.remove('is-active'); b.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      void heroEl.offsetWidth;
      if (railItems[i]) railItems[i].classList.add('is-active');
    };
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hero = new window.Swiper('.hero-swiper', {
      effect: 'fade', fadeEffect: { crossFade: true }, speed: 1000, loop: true,
      autoplay: reduce ? false : { delay: DELAY, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true },
      on: {
        init: function (s) { setRail(s.realIndex); },
        slideChange: function (s) { setRail(s.realIndex); },
        autoplayPause: function () { heroEl.classList.add('is-paused'); },
        autoplayResume: function () { heroEl.classList.remove('is-paused'); }
      }
    });
    railItems.forEach(function (b) { b.addEventListener('click', function () { hero.slideToLoop(+b.dataset.index); }); });
  }

  /* ---------- Homepage trending: week / month swap ---------- */
  var trendList = $('#trendList');
  var MONTH = [
    ['Citizen Hub', 'citizen', 'Know Your Rights: What You Can Reasonably Expect from Public Services', '5 min', '1532375810709-75b1da00537c', 'citizen-hub.html#rights'],
    ['Foundations', 'found', 'Government Sees a Process. A Citizen Experiences a Journey.', '4 min', '1544027993-37dbfe43562a', 'foundations.html#citizen-centric-governance'],
    ['Case Study', 'gia', 'Covid Jagrata: An Integrated Digital Command System', '6 min', '1584036561566-baf8f5f1b144', 'case-study-covid-jagrata.html'],
    ['Case Study', 'gia', 'Udayam — Housing the Homeless', '7 min', '1568605114967-8130f3a36994', 'case-study-udayam.html'],
    ['Case Study', 'gia', 'eHealth Kerala: One Health Record Across Facilities', '6 min', '1576091160550-2173dba999ef', 'case-study-ehealth.html'],
    ['Case Study', 'gia', 'Forest Rights Act Implementation', '7 min', '1448375240586-882707db888b', 'case-study-forest-rights.html']
  ];
  if (trendList) {
    var WEEK = trendList.innerHTML;
    var monthHTML = function () {
      return MONTH.map(function (r, i) {
        return '<li class="trend is-visible"><span class="trend-no">0' + (i + 1) + '</span><div><span class="cat" style="--c:var(--c-' + r[1] + ')">' + r[0] + '</span><h3><a href="' + r[5] + '">' + r[2] + '</a></h3><span class="meta">' + r[3] + '</span></div><img src="' + PHOTO(r[4]) + '" alt="" loading="lazy" width="72" height="72"></li>';
      }).join('');
    };
    $$('[data-period]').forEach(function (btn, _, all) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('is-active')) return;
        all.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        trendList.classList.add('is-swapping');
        setTimeout(function () {
          trendList.innerHTML = btn.dataset.period === 'month' ? monthHTML() : WEEK.replace(/class="trend reveal"/g, 'class="trend reveal is-visible"');
          trendList.classList.remove('is-swapping');
        }, 280);
      });
    });
  }

  /* ---------- Site search (index generated by _src/build.py) ---------- */
  var overlay = $('#searchOverlay');
  var input = $('#searchInput');
  var results = $('#searchResults');
  var INDEX = window.SP_SEARCH || [];
  var lastFocus = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(q) {
    q = q.trim().toLowerCase();
    var list = q ? INDEX.filter(function (a) { return (a.t + ' ' + a.c).toLowerCase().indexOf(q) > -1; }).slice(0, 30)
                 : INDEX.filter(function (a) { return a.c.indexOf('Case Study') === 0; }).slice(0, 6);
    if (!list.length) { results.innerHTML = '<li class="search-empty">Nothing matches “' + esc(q) + '” yet. Try a broader term.</li>'; return; }
    results.innerHTML = list.map(function (a) {
      var thumb = a.i ? '<img src="' + esc(a.i) + '" alt="" loading="lazy">' : '<span class="search-ico"><i class="bi bi-journal-text"></i></span>';
      return '<li><a href="' + esc(a.h) + '">' + thumb + '<div><span class="cat">' + esc(a.c) + '</span><h3>' + esc(a.t) + '</h3></div></a></li>';
    }).join('');
  }
  function openSearch() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    render(input.value);
    setTimeout(function () { input.focus(); }, 30);
  }
  function closeSearch() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (overlay && input && results) {
    $('#searchOpen').addEventListener('click', openSearch);
    $('#searchClose').addEventListener('click', closeSearch);
    input.addEventListener('input', function () { render(input.value); });
    results.addEventListener('click', function (e) { if (e.target.closest('a')) closeSearch(); });
    $$('[data-q]', overlay).forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.dataset.q; render(input.value); input.focus(); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hidden) closeSearch();
      var typing = /input|textarea|select/i.test(document.activeElement.tagName);
      if (e.key === '/' && overlay.hidden && !typing) { e.preventDefault(); openSearch(); }
    });
  }

  /* ---------- Homepage category panels ---------- */
  var panels = $$('.cat-panel');
  panels.forEach(function (p) {
    ['mouseenter', 'focus'].forEach(function (ev) {
      p.addEventListener(ev, function () { panels.forEach(function (o) { o.classList.remove('is-open'); }); p.classList.add('is-open'); });
    });
  });

  /* ---------- Case studies: filter by theme ---------- */
  var chips = $$('.chips .chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active'); chip.setAttribute('aria-pressed', 'true');
      var cat = chip.dataset.cat;
      $$('.cs-card').forEach(function (card) { card.hidden = !(cat === 'all' || card.dataset.cat === cat); });
    });
  });

  /* ---------- Share buttons ---------- */
  $$('[data-share]').forEach(function (a) {
    var url = encodeURIComponent(location.href.split('#')[0]);
    var text = encodeURIComponent(document.title);
    var map = {
      x: 'https://twitter.com/intent/tweet?url=' + url + '&text=' + text,
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
      whatsapp: 'https://wa.me/?text=' + text + '%20' + url
    };
    a.href = map[a.dataset.share] || '#';
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Copy buttons (link / email) ---------- */
  function copy(text, btn, done) {
    var restore = btn.innerHTML;
    var ok = function () { btn.innerHTML = done; setTimeout(function () { btn.innerHTML = restore; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () { window.prompt('Copy:', text); });
    } else { window.prompt('Copy:', text); }
  }
  var copyLink = $('#copyLink');
  if (copyLink) copyLink.addEventListener('click', function (e) { e.preventDefault(); copy(location.href.split('#')[0], copyLink, '<i class="bi bi-check2"></i>'); });
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () { copy(b.dataset.copy, b, '<i class="bi bi-check2"></i> Copied'); });
  });

  /* ---------- Reveal on scroll + stat counters ---------- */
  function countUp(el) {
    var end = +el.dataset.count, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var reveals = $$('.reveal');
  function showAll() {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io.observe(el); });
    // Safety net: never leave content hidden (e.g. printing, jump links, very tall elements).
    window.addEventListener('beforeprint', showAll);
    window.addEventListener('hashchange', function () { setTimeout(showAll, 50); });
  } else {
    showAll();
  }
})();
