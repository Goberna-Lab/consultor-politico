/* FAQ accordion — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
  // FAQ accordion
  document.querySelectorAll('.faq__question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = this.closest('.faq__item');
      var isOpen = item.classList.toggle('faq__item--open');
      var icon = this.querySelector('.faq__icon');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });
});
