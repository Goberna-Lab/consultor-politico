/* Consultor Político — interacciones */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* ---------- Menú mobile (drawer funcional) ---------- */
  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.header-burger');
  var drawer = document.querySelector('.header-drawer');
  if (header && burger) {
    var setMenu = function (open) {
      header.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', function () { setMenu(!header.classList.contains('nav-open')); });
    if (drawer) drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Countdown ---------- */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  document.querySelectorAll('.countdown').forEach(function (cd) {
    var deadline = new Date(cd.getAttribute('data-deadline')).getTime();
    if (isNaN(deadline)) return;
    var out = {
      days: cd.querySelector('[data-cd="days"]'),
      hours: cd.querySelector('[data-cd="hours"]'),
      mins: cd.querySelector('[data-cd="mins"]'),
      secs: cd.querySelector('[data-cd="secs"]')
    };
    function tick() {
      var diff = Math.max(0, deadline - Date.now());
      var s = Math.floor(diff / 1000);
      var d = Math.floor(s / 86400); s -= d * 86400;
      var h = Math.floor(s / 3600); s -= h * 3600;
      var m = Math.floor(s / 60); s -= m * 60;
      if (out.days) out.days.textContent = pad(d);
      if (out.hours) out.hours.textContent = pad(h);
      if (out.mins) out.mins.textContent = pad(m);
      if (out.secs) out.secs.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ---------- Acordeón (temario / FAQ) ---------- */
  document.addEventListener('click', function (e) {
    var head = e.target.closest('.acc-head');
    if (!head) return;
    var item = head.closest('.acc-item');
    if (!item) return;
    var group = item.closest('.acc');
    var wasOpen = item.classList.contains('open');
    if (group && group.hasAttribute('data-single')) {
      group.querySelectorAll('.acc-item.open').forEach(function (i) {
        i.classList.remove('open');
        var b = i.querySelector('.acc-head'); if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
    item.classList.toggle('open', !wasOpen);
    head.setAttribute('aria-expanded', String(!wasOpen));
  });

  /* ---------- Tabs (¿Por qué especializarte?) ---------- */
  document.querySelectorAll('.tabs').forEach(function (tabs) {
    var btns = tabs.querySelectorAll('.tab-btn');
    var panels = tabs.querySelectorAll('.tab-panel');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab');
        btns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', String(on));
        });
        panels.forEach(function (p) {
          var on = p.getAttribute('data-panel') === key;
          p.classList.toggle('is-active', on);
          if (on) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
        });
      });
    });
  });

  /* ---------- Carrusel docentes (marquee auto-scroll lento, pausa en hover) ---------- */
  document.querySelectorAll('.docentes-track').forEach(function (track) {
    if (track.dataset.cloned) return;
    var cards = Array.prototype.slice.call(track.children);
    if (cards.length < 2) return;
    // Duplicamos el set para un loop infinito sin saltos (translateX -50%)
    cards.forEach(function (c) {
      var clone = c.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('tabindex', '-1');
      clone.querySelectorAll('[tabindex],a,button').forEach(function (e) { e.setAttribute('tabindex', '-1'); });
      track.appendChild(clone);
    });
    track.dataset.cloned = '1';
    // Velocidad suave: ~9s por docente
    track.style.animationDuration = (cards.length * 9) + 's';
  });

  /* ---------- Form lead (stub) ---------- */
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'ENVIANDO…';
      btn.disabled = true;
      // TODO: conectar a endpoint real / CRM
      setTimeout(function () {
        btn.textContent = '¡GRACIAS! TE CONTACTAREMOS';
        form.reset();
        setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 3000);
      }, 700);
    });
  }

  /* ---------- Tabs principales (Programa/Para quién/Plan/Docentes/Inversión) ---------- */
  (function () {
    var tabBtns = document.querySelectorAll('.sn-tab[data-tab]');
    var panels = document.querySelectorAll('.ptab-panel');
    if (!tabBtns.length || !panels.length) return;

    function activate(key, scroll) {
      tabBtns.forEach(function (b) {
        var on = b.getAttribute('data-tab') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
        if (on) b.scrollIntoView({ inline: 'nearest', block: 'nearest' });
      });
      panels.forEach(function (p) {
        var on = p.getAttribute('data-panel') === key;
        p.classList.toggle('is-active', on);
        p.hidden = !on;
        if (on) p.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('in'); });
      });
      if (scroll) {
        var wrap = document.getElementById('tabs');
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 100;
        var top = wrap.getBoundingClientRect().top + window.scrollY - headerH;
        if (window.scrollY > top + 4) window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    tabBtns.forEach(function (b) {
      b.addEventListener('click', function () { activate(b.getAttribute('data-tab'), true); });
    });
    // Enlaces (drawer / ¿sabías que?) que apuntan a un tab
    document.querySelectorAll('a[data-tab]').forEach(function (link) {
      link.addEventListener('click', function () { activate(link.getAttribute('data-tab'), true); });
    });
  })();

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    // Fallback: nunca dejar contenido oculto permanentemente
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
