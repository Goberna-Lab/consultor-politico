/* Reels: phones carousel + tabs — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
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
});
