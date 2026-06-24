/* Docentes: bio toggle + dots autoplay — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
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
});
