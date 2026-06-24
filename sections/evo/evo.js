/* Carrusel Evolución — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
  // Carrusel Evolución
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
  initCarousel('evo-track', '.evo__prev', '.evo__next');
});
