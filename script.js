// Notifiqo website - vanilla JS, no dependencies.
// Languages and strings come from i18n.js (same 10 languages as the app).

(function () {
  var I18N = window.NOTIFIQO_I18N || {};
  var RTL = { ar: true, ur: true };
  var root = document.documentElement;

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  function applyLang(code) {
    var d = I18N[code] || I18N.en;
    if (!d) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-html')];
      if (v != null) el.innerHTML = v; // our own strings, only <b> tags
    });
    root.lang = code;
    root.dir = RTL[code] ? 'rtl' : 'ltr';
    var sel = document.getElementById('lang');
    if (sel) sel.value = code;
    store('notifiqo-lang', code);
  }

  function pickInitial() {
    var saved = store('notifiqo-lang');
    if (saved && I18N[saved]) return saved;
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : 'en';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('lang');
    var initial = pickInitial();
    if (initial !== 'en') applyLang(initial); else if (sel) sel.value = 'en';
    if (sel) sel.addEventListener('change', function () { applyLang(sel.value); });

    // Scroll-reveal.
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // Light/dark theme toggle.
    var toggleBtn = document.getElementById('theme-toggle');
    var prefersDark = function () { return window.matchMedia('(prefers-color-scheme: dark)').matches; };
    function icon(theme) { if (toggleBtn) toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙'; }
    var storedTheme = store('notifiqo-theme');
    if (storedTheme) root.setAttribute('data-theme', storedTheme);
    icon(storedTheme || (prefersDark() ? 'dark' : 'light'));
    if (toggleBtn) toggleBtn.addEventListener('click', function () {
      var cur = root.getAttribute('data-theme');
      var dark = cur ? cur === 'dark' : prefersDark();
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store('notifiqo-theme', next);
      icon(next);
    });

    // Mobile menu.
    var btn = document.getElementById('menu-btn');
    var links = document.getElementById('nav-links');
    if (btn && links) {
      btn.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
      });
    }
  });
})();
