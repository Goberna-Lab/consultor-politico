// === Integración con Bravo (panel Goberna) ===
// El endpoint público /v1/public/contact ya resuelve CORS para cualquier origen,
// así que esta landing puede postear cross-origin sin configuración extra.
// BRAVO_TENANT debe coincidir EXACTO con el slug del tenant en Bravo.
var BRAVO_API = 'https://bravo.goberna.us';
var BRAVO_TENANT = 'consultor-politico';

// Metadatos POR-LANDING (Sheets / redirect de gracias).
var PRODUCTO = 'Diploma Internacional del Consultor Político';
var DIVISION = 'Estrategia Política';
var CURSO = 'Consultor Político';

// === Integración con Google Sheets (Apps Script) ===
// Va en paralelo a Bravo, no la reemplaza. El Apps Script espera el campo
// "País" como "Nombre código" (ej. "Perú 51") para poder separar el
// prefijo telefónico, así que aquí lo armamos con este mapa sin tocar
// el <select> de Bravo (que solo guarda el nombre del país).
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz806STQakb81T3SteJpcPbp8JUJBHSVwSrdPvUx7A9-60pTi4HaFLweZlKTTboQbh2/exec';
var PHONE_CODES = {
  'Perú': '51',
  'Argentina': '54',
  'Bolivia': '591',
  'Chile': '56',
  'Colombia': '57',
  'Costa Rica': '506',
  'Ecuador': '593',
  'El Salvador': '503',
  'España': '34',
  'Estados Unidos': '1',
  'Guatemala': '502',
  'Honduras': '504',
  'México': '52',
  'Nicaragua': '505',
  'Panamá': '507',
  'Paraguay': '595',
  'República Dominicana': '1',
  'Uruguay': '598',
  'Venezuela': '58'
};

document.addEventListener('DOMContentLoaded', function () {

  // Countdown timer - target: preventa consultor político (21 jun 2026 23:59 GMT-5)
  const targetDate = new Date('2026-06-21T23:59:59-05:00');

  function setField(ids, value) {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    });
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      setField(['countdown-days', 'inv-days'], '00');
      setField(['countdown-hours', 'inv-hours'], '00');
      setField(['countdown-minutes', 'inv-minutes'], '00');
      setField(['countdown-seconds', 'inv-seconds'], '00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setField(['countdown-days', 'inv-days'], String(days).padStart(2, '0'));
    setField(['countdown-hours', 'inv-hours'], String(hours).padStart(2, '0'));
    setField(['countdown-minutes', 'inv-minutes'], String(minutes).padStart(2, '0'));
    setField(['countdown-seconds', 'inv-seconds'], String(seconds).padStart(2, '0'));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Header: al pasar el hero, los links se reemplazan por la fila de info
  var navEl = document.getElementById('nav');
  var heroEl = document.getElementById('hero');
  function onNavScroll() {
    if (!navEl) return;
    var threshold = (heroEl ? heroEl.offsetHeight : 500) - 80;
    navEl.classList.toggle('nav--scrolled', window.scrollY > threshold);
  }
  window.addEventListener('scroll', onNavScroll, { passive: true });
  window.addEventListener('resize', onNavScroll);
  onNavScroll();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') { e.preventDefault(); return; } // CTAs con href="#" (abren modal): no scrollear ni romper querySelector
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Tab navigation
  var tabItems = document.querySelectorAll('.tabs__item');
  var tabContents = document.querySelectorAll('.tab-content');

  tabItems.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      var target = this.getAttribute('data-tab');

      tabItems.forEach(function (t) { t.classList.remove('tabs__item--active'); });
      this.classList.add('tabs__item--active');

      tabContents.forEach(function (c) { c.classList.remove('tab-content--active'); });
      var activeContent = document.querySelector('[data-tab-content="' + target + '"]');
      if (activeContent) activeContent.classList.add('tab-content--active');

      document.getElementById('programs').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Infinite carousel with dots
  var track = document.getElementById('carousel-track');
  var dotsContainer = document.getElementById('carousel-dots');

  if (track && dotsContainer) {
    var totalReal = 5;
    var origHTML = track.innerHTML;
    track.innerHTML = origHTML + origHTML + origHTML;

    var allSlides = track.querySelectorAll('.carousel__slide');
    var dots = dotsContainer.querySelectorAll('.carousel__dot');
    var currentReal = 0;
    var autoplayInterval;

    function getSlideStep() {
      return 342 + 20;
    }

    function centerSlide(index, animate) {
      if (!animate) track.style.transition = 'none';
      else track.style.transition = 'transform 0.5s ease';

      var containerWidth = track.parentElement.offsetWidth;
      var offset = index * getSlideStep() - (containerWidth / 2) + (342 / 2);
      track.style.transform = 'translateX(' + (-offset) + 'px)';

      allSlides.forEach(function (s) { s.classList.remove('carousel__slide--active'); });
      allSlides[index].classList.add('carousel__slide--active');

      currentReal = index % totalReal;
      dots.forEach(function (d, i) {
        d.classList.toggle('carousel__dot--active', i === currentReal);
      });
    }

    var currentIndex = totalReal;
    centerSlide(currentIndex, false);

    function nextSlide() {
      currentIndex++;
      centerSlide(currentIndex, true);

      if (currentIndex >= totalReal * 2) {
        setTimeout(function () {
          currentIndex = totalReal;
          centerSlide(currentIndex, false);
        }, 520);
      }
    }

    function goToSlide(realIndex) {
      currentIndex = totalReal + realIndex;
      centerSlide(currentIndex, true);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(this.getAttribute('data-index'));
        goToSlide(idx);
        resetAutoplay();
      });
    });

    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 3000);
    }

    function resetAutoplay() {
      clearInterval(autoplayInterval);
      startAutoplay();
    }

    startAutoplay();

    var carousel = document.getElementById('carousel');
    carousel.addEventListener('mouseenter', function () {
      clearInterval(autoplayInterval);
    });
    carousel.addEventListener('mouseleave', function () {
      startAutoplay();
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq__question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = this.closest('.faq__item');
      var isOpen = item.classList.toggle('faq__item--open');
      var icon = this.querySelector('.faq__icon');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });

  // Carruseles (flechas que hacen scroll por ítem)
  function initCarousel(trackId, prevSel, nextSel) {
    var track = document.getElementById(trackId);
    if (!track) return;
    var prev = document.querySelector(prevSel);
    var next = document.querySelector(nextSel);
    function step() {
      var item = track.firstElementChild;
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      return item ? item.getBoundingClientRect().width + gap : 320;
    }
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  }
  initCarousel('obtendras-track', '.obtendras__carousel .caro-arrow--prev', '.obtendras__carousel .caro-arrow--next');
  initCarousel('evo-track', '.evo__prev', '.evo__next');

  // Docentes: click en la card superpone la bio (toggle)
  document.querySelectorAll('#docentes-track .doc-card').forEach(function (card) {
    card.addEventListener('click', function () {
      this.classList.toggle('doc-card--open');
    });
  });

  // Docentes: desplazamiento automático suave + barra de pastillas navegable
  (function initDocentesDots() {
    var track = document.getElementById('docentes-track');
    var dots = document.getElementById('docentes-dots');
    if (!track || !dots) return;
    var cards = track.children;
    if (!cards.length) return;
    var pills = [];
    var AUTO_MS = 3500;
    var timer = null;

    function cardStep() {
      var first = track.firstElementChild;
      var gap = parseFloat(getComputedStyle(track).gap) || 20;
      return first ? first.getBoundingClientRect().width + gap : 320;
    }
    function visibleCount() {
      return Math.max(1, Math.round(track.clientWidth / cardStep()));
    }
    function maxStart() {
      return Math.max(0, cards.length - visibleCount());
    }
    function update() {
      var start = Math.round(track.scrollLeft / cardStep());
      var visible = visibleCount();
      for (var i = 0; i < pills.length; i++) {
        pills[i].classList.toggle('docentes__dot--on', i >= start && i < start + visible);
      }
    }
    function goTo(idx) {
      track.scrollTo({ left: idx * cardStep(), behavior: 'smooth' });
    }
    function tick() {
      var next = Math.round(track.scrollLeft / cardStep()) + 1;
      if (next > maxStart()) next = 0;
      goTo(next);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function play() {
      stop();
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) timer = setInterval(tick, AUTO_MS);
    }

    for (var i = 0; i < cards.length; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'docentes__dot';
      b.setAttribute('aria-label', 'Ver docente ' + (i + 1));
      (function (idx) {
        b.addEventListener('click', function () { goTo(Math.min(idx, maxStart())); play(); });
      })(i);
      dots.appendChild(b);
      pills.push(b);
    }

    track.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', play);
    update();
    play();
  })();

  // Tabs "¿Por qué llevar este diplomado?"
  var porqueTabs = document.getElementById('porque-tabs');
  if (porqueTabs) {
    porqueTabs.querySelectorAll('.porque__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = this.getAttribute('data-tab');
        porqueTabs.querySelectorAll('.porque__tab').forEach(function (t) { t.classList.remove('porque__tab--active'); });
        this.classList.add('porque__tab--active');
        document.querySelectorAll('.porque__panel').forEach(function (p) {
          p.classList.toggle('porque__panel--active', p.getAttribute('data-panel') === key);
        });
      });
    });
  }

  // Acordeón "Programa académico"
  var progAcc = document.getElementById('prog-acc');
  if (progAcc) {
    progAcc.querySelectorAll('.prog-item--open .prog-item__icon').forEach(function (el) { el.textContent = '−'; });
    progAcc.querySelectorAll('.prog-item__head').forEach(function (head) {
      head.addEventListener('click', function () {
        var item = this.closest('.prog-item');
        var wasOpen = item.classList.contains('prog-item--open');
        progAcc.querySelectorAll('.prog-item').forEach(function (i) {
          i.classList.remove('prog-item--open');
          var ic = i.querySelector('.prog-item__icon');
          if (ic) ic.textContent = '+';
        });
        if (!wasOpen) {
          item.classList.add('prog-item--open');
          var ic = item.querySelector('.prog-item__icon');
          if (ic) ic.textContent = '−';
        }
      });
    });
  }

  // Carrusel de "phones" (reels) — flechas + dots interactivos
  (function () {
    var track = document.getElementById('reels-phones');
    if (!track) return;
    var prev = document.querySelector('.reels__prev');
    var next = document.querySelector('.reels__next');
    var dots = Array.prototype.slice.call(document.querySelectorAll('#reels-dots .reels__dot'));
    var phones = Array.prototype.slice.call(track.children);

    function step() {
      var it = phones[0];
      var gap = parseFloat(getComputedStyle(track).gap) || 20;
      return it ? it.getBoundingClientRect().width + gap : 200;
    }
    function current() {
      return Math.max(0, Math.min(phones.length - 1, Math.round(track.scrollLeft / step())));
    }
    // Centra la card index i dentro del track
    function go(i) {
      i = Math.max(0, Math.min(phones.length - 1, i));
      var it = phones[i];
      if (!it) return;
      var left = track.scrollLeft + it.getBoundingClientRect().left - track.getBoundingClientRect().left
               - (track.clientWidth - it.offsetWidth) / 2;
      track.scrollTo({ left: left, behavior: 'smooth' });
    }
    if (next) next.addEventListener('click', function () { go(current() + 1); });
    if (prev) prev.addEventListener('click', function () { go(current() - 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });

    function syncDots() {
      var idx = current();
      dots.forEach(function (d, j) { d.classList.toggle('reels__dot--active', j === idx); });
    }
    var ticking;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { syncDots(); ticking = false; });
    });
    window.requestAnimationFrame(syncDots);
  })();

  // Toggle Videos/Fotos (sección reels)
  var reelsTabs = document.getElementById('reels-tabs');
  if (reelsTabs) {
    reelsTabs.querySelectorAll('.reels__tab').forEach(function (t) {
      t.addEventListener('click', function () {
        reelsTabs.querySelectorAll('.reels__tab').forEach(function (x) { x.classList.remove('reels__tab--active'); });
        this.classList.add('reels__tab--active');
      });
    });
  }

  // Modal del formulario (abre con los botones "Inscribirme ahora")
  var formModal = document.getElementById('form-modal');
  if (formModal) {
    var openModal = function () {
      formModal.classList.add('is-open');
      formModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeModal = function () {
      formModal.classList.remove('is-open');
      formModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-open-modal]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    });
    formModal.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && formModal.classList.contains('is-open')) closeModal();
    });
  }

  // Modal de imagen del certificado (abre al click en la imagen de la certificación)
  var certModal = document.getElementById('cert-modal');
  if (certModal) {
    var openCert = function () {
      certModal.classList.add('is-open');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    var closeCert = function () {
      certModal.classList.remove('is-open');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('[data-open-cert]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openCert(); });
    });
    certModal.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', closeCert);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && certModal.classList.contains('is-open')) closeCert();
    });
  }

  // Form submit handler — envía el lead a Bravo (/v1/public/contact).
  var form = document.getElementById('contact-form');
  if (form) {
    function showFormFeedback(msg, isError) {
      var el = form.querySelector('.form__feedback');
      if (!el) {
        el = document.createElement('p');
        el.className = 'form__feedback';
        el.style.marginTop = '8px';
        el.style.fontSize = '14px';
        el.style.textAlign = 'center';
        var actions = form.querySelector('.mform__actions');
        if (actions) actions.insertAdjacentElement('afterend', el);
        else form.appendChild(el);
      }
      el.textContent = msg;
      el.style.color = isError ? '#ff6b6b' : '#ffc800';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación nativa del browser (required, pattern, email, privacy).
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var prevLabel = btn ? btn.textContent : '';

      function field(n) {
        return form.elements[n] ? String(form.elements[n].value).trim() : '';
      }

      // Payload para Bravo. `pais` y `cargo` viajan como extras adaptables.
      var payload = {
        tenant: BRAVO_TENANT,
        name: field('name'),
        email: field('email'),
        phone: field('phone'),
        pais: field('pais'),
        cargo: field('cargo'),
        website: field('website') // honeypot
      };

      if (btn) { btn.disabled = true; btn.textContent = 'ENVIANDO…'; }

      // Atribución de campaña: UTM desde la URL (?utm_source=...&utm_campaign=...&utm_content=...).
      // Defaults = data orgánica (ORIGEN/CAMPAÑA "Sin dato", FLYER "ORGANICO").
      var qs = new URLSearchParams(window.location.search);
      var utm = {
        source: qs.get('utm_source') || 'Sin dato',
        campaign: qs.get('utm_campaign') || 'Sin dato',
        content: qs.get('utm_content') || 'ORGANICO'
      };

      // Envío paralelo a Google Sheets vía Apps Script (no bloquea ni
      // afecta el flujo/feedback de Bravo, que sigue siendo la fuente
      // oficial de candidatos).
      var paisNombre = field('pais');
      var codigo = PHONE_CODES[paisNombre] || '';
      var sheetParams = new URLSearchParams();
      sheetParams.append('Nombres Completos', field('name'));
      sheetParams.append('País', codigo ? (paisNombre + ' ' + codigo) : paisNombre);
      sheetParams.append('Telefono', field('phone'));
      sheetParams.append('Cargo', field('cargo'));
      sheetParams.append('Correo Electrónico', field('email'));
      sheetParams.append('pagina', PRODUCTO);
      sheetParams.append('negocio', 'Escuela');
      sheetParams.append('categoria', 'Curso Online');
      sheetParams.append('division', DIVISION);
      sheetParams.append('source', utm.source);     // -> ORIGEN
      sheetParams.append('campaign', utm.campaign);  // -> CAMPAÑA
      sheetParams.append('content', utm.content);    // -> FLYER

      var sheetWrite = fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: sheetParams
      }).catch(function (err) {
        console.error('sheets webhook error', err);
      });

      fetch(BRAVO_API + '/v1/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok) {
            // Éxito (201 registrado / 200 honeypot) -> redirige a la página de gracias.
            // Su pixel dispara la conversión "Lead General - Gracias" (regla: la URL contiene
            // "pagina-de-agradecimiento"). Esperamos a que el envío a la hoja salga (máx 2.5s).
            if (btn) { btn.textContent = '¡LISTO! REDIRIGIENDO…'; }
            Promise.race([sheetWrite, new Promise(function (r) { setTimeout(r, 2500); })]).then(function () {
              var p = new URLSearchParams({ fullname: field('name'), curso: CURSO });
              window.location.href = 'https://grupogoberna.com/pagina-de-agradecimiento/?' + p.toString();
            });
          } else {
            res.json().catch(function () { return {}; }).then(function (body) {
              console.error('contact error', res.status, body);
            });
            showFormFeedback('No pudimos enviar tu información. Revisa los datos e intenta de nuevo.', true);
            if (btn) { btn.disabled = false; btn.textContent = prevLabel; }
          }
        })
        .catch(function (err) {
          console.error('contact network error', err);
          showFormFeedback('Hubo un problema de conexión. Intenta de nuevo en unos minutos.', true);
          if (btn) { btn.disabled = false; btn.textContent = prevLabel; }
        });
    });
  }
});

// WhatsApp -> evento "Contact" en Meta (detecta el lead del click a WhatsApp)
document.addEventListener('click', function (e) {
  var a = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
  if (a && window.fbq) { fbq('track', 'Contact'); }
});
