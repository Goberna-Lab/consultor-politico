/* Acordeón Programa académico — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
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
});
