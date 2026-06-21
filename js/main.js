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

  /* ---------- Form lead -> Google Sheet + Bravo + redirect a gracias (conversión) ---------- */
  var form = document.getElementById('lead-form');
  if (form) {
    var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz806STQakb81T3SteJpcPbp8JUJBHSVwSrdPvUx7A9-60pTi4HaFLweZlKTTboQbh2/exec';
    var BRAVO_API = 'https://bravo.goberna.us';
    var BRAVO_TENANT = 'consultor-politico';
    var GRACIAS_URL = 'https://grupogoberna.com/pagina-de-agradecimiento/';
    var CURSO = 'Consultor Político';
    var PRODUCTO = 'Diploma Internacional del Consultor Político';
    var NEGOCIO = 'Escuela', CATEGORIA = 'Curso Online', DIVISION = 'Estrategia Política';

    // Atribución de campaña: UTM desde la URL (?utm_source=...&utm_campaign=...&utm_content=...)
    var qs = new URLSearchParams(window.location.search);
    var utm = {
      source: qs.get('utm_source') || 'Sin dato',
      campaign: qs.get('utm_campaign') || 'Sin dato',
      content: qs.get('utm_content') || 'ORGANICO'
    };
    function field(n) { return form.elements[n] ? String(form.elements[n].value).trim() : ''; }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'ENVIANDO…'; btn.disabled = true; }

      var nombre = field('nombre'), correo = field('email'), telefono = field('telefono');
      var pais = field('pais'), cargo = field('cargo');

      // 1) Google Sheet (Apps Script) — claves del FIELD_RENAMES. no-cors fire-and-forget.
      var sheet = new URLSearchParams();
      sheet.append('Nombres Completos', nombre);
      sheet.append('País', pais);
      sheet.append('Telefono', telefono);
      sheet.append('Cargo', cargo);
      sheet.append('Correo Electrónico', correo);
      sheet.append('pagina', PRODUCTO);
      sheet.append('negocio', NEGOCIO);
      sheet.append('categoria', CATEGORIA);
      sheet.append('division', DIVISION);
      sheet.append('source', utm.source);
      sheet.append('campaign', utm.campaign);
      sheet.append('content', utm.content);
      var sheetWrite = fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: sheet }).catch(function () {});

      // 2) Bravo (panel) — best-effort, no bloquea.
      var message = [
        'Inscripción — Diploma Internacional del Consultor Político',
        'País: ' + (pais || '-'),
        'Cargo: ' + (cargo || '-'),
        '',
        'Origen: ' + utm.source + ' | Campaña: ' + utm.campaign + ' | Flyer: ' + utm.content
      ].join('\n');
      var bravoWrite = fetch(BRAVO_API + '/v1/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant: BRAVO_TENANT, name: nombre, email: correo, phone: telefono, message: message, website: '' })
      }).catch(function () {});

      // 3) Redirect a la página de gracias -> su pixel dispara la conversión "Lead General - Gracias".
      Promise.race([
        Promise.allSettled([sheetWrite, bravoWrite]),
        new Promise(function (r) { setTimeout(r, 2500); })
      ]).then(function () {
        if (btn) btn.textContent = '¡LISTO! REDIRIGIENDO…';
        var p = new URLSearchParams({ fullname: nombre, curso: CURSO });
        window.location.href = GRACIAS_URL + '?' + p.toString();
      });
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
