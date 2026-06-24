/* "El perfil del estratega político" — activación de capacidades (hover / focus).
   Cada nodo se enciende de forma persistente; al activar los 4 se revela el CTA. */
document.addEventListener('DOMContentLoaded', function () {
  var stage = document.getElementById('spy-stage');
  if (!stage) return;
  var perfil = stage.closest('.perfil');
  var nodes = [].slice.call(stage.querySelectorAll('.skill-node'));
  var links = stage.querySelectorAll('.perfil__link');

  nodes.forEach(function (node, i) { node.style.setProperty('--i', i); });

  function linkFor(skill) {
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-skill') === skill) return links[i];
    }
    return null;
  }

  // tooltip transitorio: solo uno visible mientras se hace hover/focus
  function showTip(target) {
    nodes.forEach(function (n) { n.classList.toggle('is-hovered', n === target); });
  }

  // activación persistente: queda encendida aunque saques el cursor
  function activate(node) {
    if (node.classList.contains('is-active')) return;
    node.classList.add('is-active');
    node.classList.remove('just-toggled');
    void node.offsetWidth;
    node.classList.add('just-toggled');
    var btn = node.querySelector('.skill-node__btn');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    var lk = linkFor(node.getAttribute('data-skill'));
    if (lk) lk.classList.add('is-active');
    var count = nodes.filter(function (n) { return n.classList.contains('is-active'); }).length;
    stage.setAttribute('data-active', count);
    if (count === nodes.length && perfil) perfil.classList.add('is-complete');
  }

  nodes.forEach(function (node) {
    var btn = node.querySelector('.skill-node__btn');
    if (!btn) return;
    btn.addEventListener('pointerenter', function () { showTip(node); activate(node); });
    btn.addEventListener('pointerleave', function () { showTip(null); });
    btn.addEventListener('focus', function () { showTip(node); activate(node); });
    btn.addEventListener('blur', function () { showTip(null); });
  });
});
