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

// ---------------------------------------------------------------------------
// Forms: enquiries, callbacks and online plan registration.
// Set FORM_ENDPOINT to a form backend (e.g. Formspree, Web3Forms, a Supabase
// function or SWA's CRM webhook) to receive submissions as JSON. Until it is
// set, submissions open the visitor's email app addressed to SWA.
// ---------------------------------------------------------------------------
var FORM_ENDPOINT = '';
var FORM_EMAIL = 'swafuneralservices48@gmail.com';

function validSAID(id) {
  if (!/^\d{13}$/.test(id)) return false;
  var sum = 0;
  for (var i = 0; i < 13; i++) {
    var d = +id[12 - i];
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}

function formToObject(f) {
  var o = {};
  new FormData(f).forEach(function (v, k) {
    if (k.slice(-2) === '[]') { k = k.slice(0, -2); (o[k] = o[k] || []).push(v); }
    else o[k] = v;
  });
  return o;
}

function toText(o) {
  var lines = [];
  Object.keys(o).forEach(function (k) {
    if (Array.isArray(o[k])) return;
    lines.push(k.replace(/_/g, ' ') + ': ' + o[k]);
  });
  if (o.dep_name) {
    lines.push('', 'Dependants:');
    o.dep_name.forEach(function (n, i) { lines.push((i + 1) + '. ' + n + ' | ' + o.dep_id[i] + ' | ' + o.dep_rel[i]); });
  }
  return lines.join('\n');
}

function showDone(f, ref) {
  var box = document.createElement('div');
  box.className = 'form-done';
  box.setAttribute('role', 'status');
  box.innerHTML = '<div class="tickmark">&#10003;</div><h3>Thank you, we have your details</h3>' +
    '<p>Your reference is <b>' + ref + '</b>. A consultant from your nearest branch will contact you shortly.</p>' +
    '<p class="small">For a death in the family, please call 064 544 1292 at any time.</p>';
  f.replaceWith(box);
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.querySelectorAll('.swa-form').forEach(function (f) {
  // Pre-select a plan from ?plan=...
  var plan = new URLSearchParams(location.search).get('plan');
  if (plan) f.querySelectorAll('input[name=plan]').forEach(function (r) { if (r.value === plan) r.checked = true; });

  // SA ID: validate and fill in date of birth
  f.querySelectorAll('[data-said]').forEach(function (inp) {
    inp.addEventListener('input', function () {
      inp.value = inp.value.replace(/\D/g, '');
      inp.setCustomValidity(inp.value.length === 13 && !validSAID(inp.value) ? 'Please check the ID number.' : '');
      var dob = f.querySelector('[name=dob]');
      if (validSAID(inp.value) && dob && !dob.value) {
        var yy = +inp.value.slice(0, 2), now = new Date().getFullYear() % 100;
        dob.value = (yy > now ? '19' : '20') + inp.value.slice(0, 2) + '-' + inp.value.slice(2, 4) + '-' + inp.value.slice(4, 6);
      }
    });
  });

  // Dependants (up to data-max)
  var deps = f.querySelector('.deps'), add = f.querySelector('.add-dep'), tpl = f.querySelector('#dep-row');
  if (deps && add && tpl) {
    var max = +deps.dataset.max || 15;
    var sync = function () {
      var n = deps.children.length;
      add.disabled = n >= max;
      add.textContent = n >= max ? 'Maximum of ' + max + ' family members' : '+ Add a family member (' + n + '/' + max + ')';
    };
    add.addEventListener('click', function () {
      deps.appendChild(tpl.content.cloneNode(true));
      deps.lastElementChild.querySelector('input').focus();
      sync();
    });
    deps.addEventListener('click', function (ev) {
      if (ev.target.classList.contains('rm')) { ev.target.closest('.dep').remove(); sync(); }
    });
    sync();
  }

  // Step indicator follows the section in view
  var steps = document.querySelectorAll('.mini-steps li'), sets = f.querySelectorAll('fieldset');
  if (steps.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = Math.min([].indexOf.call(sets, en.target), steps.length - 1);
        steps.forEach(function (s, j) { s.classList.toggle('on', j <= i); });
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sets.forEach(function (s) { io.observe(s); });
  }

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!f.checkValidity()) {
      f.classList.add('tried');
      var bad = f.querySelector(':invalid');
      if (bad) { bad.focus(); bad.reportValidity && bad.reportValidity(); }
      return;
    }
    var data = formToObject(f);
    var ref = 'SWA-' + Date.now().toString(36).toUpperCase().slice(-6);
    data.form = f.dataset.form; data.reference = ref; data.page = location.pathname; data.submitted = new Date().toISOString();
    var btn = f.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';

    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw r; showDone(f, ref); })
        .catch(function () { btn.disabled = false; btn.textContent = 'Try again'; alert('Sorry, something went wrong. Please call 064 544 1292.'); });
    } else {
      location.href = 'mailto:' + FORM_EMAIL + '?subject=' + encodeURIComponent(data.form + ' ' + ref) + '&body=' + encodeURIComponent(toText(data));
      showDone(f, ref);
    }
  });
});
