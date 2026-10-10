/* Shen Sheng — personal site behaviour. No dependencies except lazy-loaded Leaflet/Firebase for the visitor map. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- language & theme ---- */
  document.getElementById('lang').addEventListener('click', function () {
    var next = root.dataset.lang === 'zh' ? 'en' : 'zh';
    root.dataset.lang = next; root.lang = next === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('lang', next);
  });
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  document.getElementById('theme').addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next; localStorage.setItem('theme', next);
    paletteChanged();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paletteChanged);
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- nav: border on scroll, brand appears once the intro name scrolls away, section spy ---- */
  var nav = document.getElementById('nav');
  var menu = document.getElementById('menu');
  var h1 = document.querySelector('.intro h1');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    if (menu) menu.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menu) {
    menu.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    nav.querySelectorAll('.ds-nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 734) setMenu(false);
    });
  }
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 8);
    nav.classList.toggle('show-brand', h1.getBoundingClientRect().bottom < 56);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var links = [].slice.call(document.querySelectorAll('.nav nav a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

    var els = [].slice.call(document.querySelectorAll('.block h2, .news li, .pub, .cols > div'));
    els.forEach(function (el) { el.classList.add('reveal'); });
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { rv.observe(el); });
  }

  /* ---- figure lightbox ---- */
  var lbox = document.getElementById('lightbox'), limg = lbox.querySelector('img');
  function closeLb() { lbox.hidden = true; limg.removeAttribute('src'); document.body.style.overflow = ''; }
  [].forEach.call(document.querySelectorAll('.zoom'), function (b) {
    b.addEventListener('click', function () {
      limg.src = b.dataset.full; limg.alt = b.querySelector('img').alt; lbox.hidden = false; document.body.style.overflow = 'hidden';
    });
  });
  lbox.addEventListener('click', closeLb);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lbox.hidden) closeLb(); });

  /* ---- avatar placeholder: a small flow field that settles from noise into flow (hidden by a real photo) ---- */
  var canvas = document.getElementById('field');
  var ctx = canvas.getContext('2d');
  var S, parts = [], t = 0, raf = 0, ink, paper;
  function readPalette() {
    var cs = getComputedStyle(root);
    ink = cs.getPropertyValue('--accent').trim() || '#2b50ff';
    paper = cs.getPropertyValue('--surface').trim() || '#fffdf9';
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    S = canvas.clientWidth || 176;
    canvas.width = S * dpr; canvas.height = S * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readPalette(); ctx.fillStyle = paper; ctx.fillRect(0, 0, S, S);
    parts = [];
    for (var i = 0; i < 260; i++) parts.push({ x: Math.random() * S, y: Math.random() * S, life: Math.random() * 160 });
  }
  function angle(x, y, tt) {
    var k = 0.022, u = tt * 0.004;
    var n = Math.sin(x * k + u) * Math.cos(y * k * 1.2 - u) + 0.5 * Math.sin((x - y) * k * 1.9 + u * 1.5);
    var jitter = Math.sin(x * .6 + y * .53 + tt * .05) * Math.max(0, 1 - tt / 420);
    return (n + jitter * 1.3) * Math.PI * 1.4;
  }
  function step() {
    ctx.globalAlpha = .07; ctx.fillStyle = paper; ctx.fillRect(0, 0, S, S);
    ctx.globalAlpha = isDark() ? .7 : .55; ctx.strokeStyle = ink; ctx.lineWidth = 1; ctx.beginPath();
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], a = angle(p.x, p.y, t), ox = p.x, oy = p.y;
      p.x += Math.cos(a) * .7; p.y += Math.sin(a) * .7;
      ctx.moveTo(ox, oy); ctx.lineTo(p.x, p.y);
      if (--p.life < 0 || p.x < 0 || p.x > S || p.y < 0 || p.y > S) { p.x = Math.random() * S; p.y = Math.random() * S; p.life = 80 + Math.random() * 140; }
    }
    ctx.stroke(); ctx.globalAlpha = 1; t++;
  }
  function loop() { step(); raf = requestAnimationFrame(loop); }
  function paletteChanged() { readPalette(); ctx.globalAlpha = 1; ctx.fillStyle = paper; ctx.fillRect(0, 0, S, S); }
  function start() { cancelAnimationFrame(raf); if (reduce) { for (var i = 0; i < 300; i++) step(); return; } loop(); }
  resize(); start();
  window.addEventListener('resize', function () { resize(); start(); });
  if ('IntersectionObserver' in window && !reduce) {
    new IntersectionObserver(function (es) {
      cancelAnimationFrame(raf); if (es[0].isIntersecting && !document.hidden) loop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', function () { cancelAnimationFrame(raf); if (!document.hidden) loop(); });
  }

  /* ---- visitor map: only shown if the backend actually answers ---- */
  var section = document.getElementById('visitors');
  var fb = {
    apiKey: 'AIzaSyD8aGgc6CLLJju-g6rNrYXZhQOBcsvhBUo',
    authDomain: 'codyshen-io.firebaseapp.com',
    databaseURL: 'https://codyshen-io-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'codyshen-io'
  };
  function loadScript(src) {
    return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  }
  function loadCss(href) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }

  function initVisitors() {
    // sequential: firebase-database needs firebase-app to be executed first
    loadScript('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js').then(function () {
      return loadScript('https://www.gstatic.com/firebasejs/8.6.1/firebase-database.js');
    }).then(function () {
      firebase.initializeApp(fb);
      var db = firebase.database();
      // read first: if rules deny reads we show nothing and write nothing
      return db.ref('visitors').once('value').then(function (snap) { return { db: db, snap: snap }; });
    }).then(function (r) {
      return loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js').then(function () {
        loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
        section.hidden = false;
        document.getElementById('total-visits').textContent = r.snap.numChildren();
        var cs = {}, ts = {};
        r.snap.forEach(function (c) { var v = c.val() || {}; if (v.country) cs[v.country] = 1; if (v.city) ts[v.country + '/' + v.city] = 1; });
        [].forEach.call(document.querySelectorAll('.v-c'), function (e) { e.textContent = Object.keys(cs).length; });
        [].forEach.call(document.querySelectorAll('.v-t'), function (e) { e.textContent = Object.keys(ts).length; });
        var map = L.map('map', { worldCopyJump: true, scrollWheelZoom: false }).setView([25, 10], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 6 }).addTo(map);
        r.snap.forEach(function (c) {
          var v = c.val(); if (!v || typeof v.lat !== 'number') return;
          L.circleMarker([v.lat, v.lon], { color: '#2b50ff', weight: 1, fillOpacity: .5, radius: 5 }).addTo(map).bindPopup('Visitor from ' + (v.city || '?') + ', ' + (v.country || '?'));
        });
        // record this visit (city-level, coordinates rounded to 1 decimal, no IP)
        if (!sessionStorage.getItem('visited')) {
          fetch('https://ipinfo.io/json?token=0b130fa67909e2').then(function (x) { return x.json(); }).then(function (g) {
            var loc = (g.loc || '').split(',');
            return r.db.ref('visitors').push().set({
              lat: Math.round(parseFloat(loc[0]) * 10) / 10, lon: Math.round(parseFloat(loc[1]) * 10) / 10,
              city: g.city || '', region: g.region || '', country: g.country || '', timestamp: new Date().toISOString()
            });
          }).then(function () { sessionStorage.setItem('visited', '1'); }).catch(function () {});
        }
      });
    }).catch(function () { /* backend unavailable or read denied: keep the section hidden */ });
  }
  if ('requestIdleCallback' in window) requestIdleCallback(initVisitors); else setTimeout(initVisitors, 1500);
})();
