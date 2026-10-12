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

// Contact form: open the visitor's email app with the message filled in (no server needed)
document.querySelectorAll('form[data-mailto]').forEach(function (f) {
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = new FormData(f);
    var body = 'Name: ' + d.get('name') + '\nPhone: ' + d.get('phone') + '\n\n' + (d.get('message') || '');
    location.href = 'mailto:' + f.dataset.mailto + '?subject=' + encodeURIComponent('Website enquiry from ' + d.get('name')) + '&body=' + encodeURIComponent(body);
  });
});
