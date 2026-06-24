/* Tabs ¿Por qué especializarte? — handler de sección (verbatim de main.js) */
document.addEventListener('DOMContentLoaded', function () {
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
});
