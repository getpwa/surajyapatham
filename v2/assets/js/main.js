/* Surajyapatham — homepage interactions */
(function () {
  'use strict';

  var root = document.documentElement;
  var IMG = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 240) + '&h=' + Math.round((w || 240) * .78) + '&q=60'; };

  /* ---------- Article index (powers search; mirrors homepage content) ---------- */
  var ARTICLES = [
    { t: 'COVID Jagratha: Connecting the Response, Not Just the Data', c: 'Governance in Action · Case Study', k: 'covid pandemic health technology kozhikode district', img: '1593113598332-cd288d649433' },
    { t: 'Government Sees a Process. A Citizen Experiences a Journey.', c: 'Foundations · Explainer', k: 'citizen-centric governance dignity rights journey', img: '1544027993-37dbfe43562a' },
    { t: 'Good Governance Is Not an Abstract Idea. We Experience It Every Day.', c: 'Knowledge · Essay', k: 'public value road school hospital', img: '1519003722824-194d4455a60c' },
    { t: 'From the Citizen’s Journey to Public Value: A Six-Part Review', c: 'Foundations · Deep Dive', k: 'public value outcomes framework review', img: '1517048676732-d65bc937f952' },
    { t: 'Udayam: What It Takes to House the Homeless', c: 'Governance in Action · Case Study', k: 'housing homeless dignity', img: '1584515933487-779824d29309' },
    { t: 'The Mission-Mode Playbook: Turning Priorities into Delivery', c: 'Tools & Playbooks', k: 'mission mode implementation playbook delivery', img: '1523240795612-9a054b0db644' },
    { t: 'A Model Project Template for Public Works That Last', c: 'Tools & Playbooks · Template', k: 'project template infrastructure public works playbook', img: '1560493676-04071c5f467b' },
    { t: 'Completion Is Not the Same as Success', c: 'Foundations', k: 'public value outcomes quality', img: '1515162816999-a0c47dc192f7' },
    { t: 'When the Rule and the Right Thing Pull Apart', c: 'Series · Dilemmas of a Public Servant', k: 'ethics dilemmas judgment public servant', img: '1506905925346-21bda4d32df4' },
    { t: 'Nammude Kozhikode: When Citizens Help Shape a District', c: 'Governance in Action · Case Study', k: 'participation citizens district', img: '1529156069898-49953e39b3ac' },
    { t: 'Know Your Rights: What You Can Reasonably Expect from Public Services', c: 'Citizen Hub', k: 'rights entitlements service standards grievance', img: '1532375810709-75b1da00537c' },
    { t: 'Kerala Rescue: Coordination When the Water Rises', c: 'Governance in Action · Case Study', k: 'flood disaster response coordination', img: '1602216056096-3b40cc0c9944' },
    { t: 'Ente Bhoomi: Rebuilding Trust in Land Records', c: 'Governance in Action · Case Study', k: 'land records administration', img: '1500382017468-9049fed747ef' },
    { t: 'Every Rupee Counts: Value for Money in Public Choices', c: 'Foundations', k: 'value for money public value budget', img: '1532629345422-7515f3d16bb6' },
    { t: 'Krishi Samruddhi: Mission-Mode Thinking in Local Agriculture', c: 'Governance in Action · Case Study', k: 'agriculture farmers mission mode', img: '1574943320219-553eb213f72d' },
    { t: 'Forest Rights Settlement: Implementing Equity on the Ground', c: 'Governance in Action · Case Study', k: 'forest rights equity tribal', img: '1441974231531-c6227db76b6e' },
    { t: 'Participate in Local Governance: Ward Sabhas and Beyond', c: 'Citizen Hub · Guide', k: 'ward sabha participation volunteering rights', img: '1599059813005-11265ba4b4ce' },
    { t: 'Systems Thinking in Governance', c: 'Learning · Module', k: 'systems thinking learning convergence', img: '1477959858617-67f85cf4f1df' }
  ];

  /* ---------- Date / year ---------- */
  var today = document.getElementById('today');
  if (today) today.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (light default, remembered per browser) ---------- */
  var themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('sp-theme', next); } catch (e) {}
  });

  /* ---------- Sticky header, progress, back-to-top ---------- */
  var header = document.getElementById('siteHeader');
  var bar = document.querySelector('.scroll-progress span');
  var toTop = document.getElementById('toTop');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop.classList.toggle('is-visible', y > 900);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Hero slider (Swiper) with custom rail ---------- */
  var DELAY = 7000;
  var heroEl = document.querySelector('.hero');
  var railItems = document.querySelectorAll('.rail-item');
  heroEl.style.setProperty('--rail-ms', DELAY + 'ms');

  function setRail(i) {
    railItems.forEach(function (b, j) {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', j === i ? 'true' : 'false');
    });
    void heroEl.offsetWidth; // restart the CSS progress animation
    if (railItems[i]) railItems[i].classList.add('is-active');
  }

  if (window.Swiper) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hero = new Swiper('.hero-swiper', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 1000,
      loop: true,
      autoplay: reduce ? false : { delay: DELAY, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true },
      on: {
        init: function (s) { setRail(s.realIndex); },
        slideChange: function (s) { setRail(s.realIndex); },
        autoplayPause: function () { heroEl.classList.add('is-paused'); },
        autoplayResume: function () { heroEl.classList.remove('is-paused'); }
      }
    });
    railItems.forEach(function (b) {
      b.addEventListener('click', function () { hero.slideToLoop(+b.dataset.index); });
    });
  }

  /* ---------- Trending: week / month swap ---------- */
  var trendList = document.getElementById('trendList');
  var MONTH = [
    ['Citizen Hub', 'citizen', 'Know Your Rights: What You Can Reasonably Expect from Public Services', '5 min', '1532375810709-75b1da00537c'],
    ['Foundations', 'found', 'Government Sees a Process. A Citizen Experiences a Journey.', '4 min', '1544027993-37dbfe43562a'],
    ['Case Study', 'gia', 'COVID Jagratha: Connecting the Response, Not Just the Data', '6 min', '1593113598332-cd288d649433'],
    ['Case Study', 'gia', 'Udayam: What It Takes to House the Homeless', '7 min', '1584515933487-779824d29309'],
    ['Playbook', 'tools', 'The Mission-Mode Playbook: Turning Priorities into Delivery', '8 min', '1523240795612-9a054b0db644'],
    ['Case Study', 'gia', 'Forest Rights Settlement: Implementing Equity on the Ground', '7 min', '1441974231531-c6227db76b6e']
  ];
  var WEEK = trendList ? trendList.innerHTML : '';
  function monthHTML() {
    return MONTH.map(function (r, i) {
      return '<li class="trend is-visible"><span class="trend-no">0' + (i + 1) + '</span><div><span class="cat" style="--c:var(--c-' + r[1] + ')">' + r[0] + '</span><h3><a href="#">' + r[2] + '</a></h3><span class="meta">' + r[3] + '</span></div><img src="' + IMG(r[4], 240).replace(/&h=\d+/, '&h=240') + '" alt="" loading="lazy"></li>';
    }).join('');
  }
  document.querySelectorAll('[data-period]').forEach(function (btn, _, all) {
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

  /* ---------- Search overlay ---------- */
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var lastFocus = null;

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(q) {
    q = q.trim().toLowerCase();
    var list = q ? ARTICLES.filter(function (a) { return (a.t + ' ' + a.c + ' ' + a.k).toLowerCase().indexOf(q) > -1; }) : ARTICLES.slice(0, 5);
    if (!list.length) { results.innerHTML = '<li class="search-empty">No stories match “' + esc(q) + '” yet. Try a broader term.</li>'; return; }
    results.innerHTML = list.map(function (a) {
      return '<li><a href="#"><img src="' + IMG(a.img, 160) + '" alt="" loading="lazy"><div><span class="cat">' + esc(a.c) + '</span><h3>' + esc(a.t) + '</h3></div></a></li>';
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
  document.getElementById('searchOpen').addEventListener('click', openSearch);
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  input.addEventListener('input', function () { render(input.value); });
  overlay.querySelectorAll('[data-q]').forEach(function (b) {
    b.addEventListener('click', function () { input.value = b.dataset.q; render(input.value); input.focus(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) closeSearch();
    var typing = /input|textarea|select/i.test(document.activeElement.tagName);
    if (e.key === '/' && overlay.hidden && !typing) { e.preventDefault(); openSearch(); }
  });

  /* ---------- Category panels: keyboard/touch friendly open state ---------- */
  var panels = document.querySelectorAll('.cat-panel');
  panels.forEach(function (p) {
    p.addEventListener('mouseenter', function () {
      panels.forEach(function (o) { o.classList.remove('is-open'); });
      p.classList.add('is-open');
    });
    p.addEventListener('focus', function () {
      panels.forEach(function (o) { o.classList.remove('is-open'); });
      p.classList.add('is-open');
    });
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
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-visible');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }
})();
