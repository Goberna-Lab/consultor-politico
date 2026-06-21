/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== MOBILE MENU ===== */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navCta = document.querySelector('.nav-cta');

toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navCta?.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navCta?.classList.remove('open');
  });
});

/* ===== PROGRAMA ACADÉMICO ACCORDION ===== */
document.querySelectorAll('.etapa-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.etapa-item');
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.etapa-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

/* ===== EGRESADO TABS ===== */
document.querySelectorAll('.etab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.etab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ===== DOCENTES CAROUSEL ===== */
const grid = document.getElementById('docentesGrid');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

if (grid && prevBtn && nextBtn) {
  const cardWidth = () => {
    const card = grid.querySelector('.docente-card');
    if (!card) return 0;
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.gap) || 16;
    return card.offsetWidth + gap;
  };

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });
}

/* ===== COUNTDOWN TIMER ===== */
(function () {
  const deadline = new Date('2026-06-17T23:59:59').getTime();

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      ['days','hours','minutes','seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const dEl = document.getElementById('days');
    const hEl = document.getElementById('hours');
    const mEl = document.getElementById('minutes');
    const sEl = document.getElementById('seconds');

    if (dEl) dEl.textContent = pad(days);
    if (hEl) hEl.textContent = pad(hours);
    if (mEl) mEl.textContent = pad(minutes);
    if (sEl) sEl.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
