// Mobile navigation toggle (no dependencies)
(function () {
  var btn = document.querySelector('.nav-toggle'), nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('.has-sub > a').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      if (window.innerWidth > 1000) return;
      var li = a.parentNode;
      if (!li.classList.contains('open')) { ev.preventDefault(); li.classList.add('open'); }
    });
  });
})();
