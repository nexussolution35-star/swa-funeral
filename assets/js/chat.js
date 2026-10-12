// SWA chat widget (front-end placeholder).
// Replies are scripted locally. To go live, connect send() to a chat or
// WhatsApp provider and remove the scripted replies.
(function () {
  var me = document.currentScript;
  var ROOT = me ? me.src.replace(/assets\/js\/chat\.js.*$/, '') : '/';
  var PHONE = '064 544 1292', TEL = '+27645441292';

  var QUICK = [
    { label: 'Join a funeral plan', reply: 'Great choice. You can register online in a few minutes, and a consultant will confirm your cover.', link: ['Join a plan online', 'planning/join-online.html'] },
    { label: 'Plan prices', reply: 'Our plans range from R160 to R390 per month. Silver Plan B is R220/month for the main member plus up to 15 dependants, with a free tombstone.', link: ['Compare plans', 'planning/funeral-plans.html'] },
    { label: 'A death in the family', reply: 'We are so sorry for your loss. Please call us now on ' + PHONE + ', day or night, and we will take care of everything from here.', link: ['Call ' + PHONE, 'tel:' + TEL] },
    { label: 'Find a branch', reply: 'We have branches in Giyani, Phalaborwa, Sekgosese, Botlokwa, Saselamani and Soweto.', link: ['View branches', 'about/branches.html'] }
  ];

  var faces = [1, 2, 3].map(function (i) { return '<img src="' + ROOT + 'assets/img/face-' + i + '.jpg" alt="">'; }).join('');

  var wrap = document.createElement('div');
  wrap.className = 'swa-chat';
  wrap.innerHTML =
    '<div class="chat-panel" role="dialog" aria-label="Chat with SWA Funeral Services" aria-hidden="true">' +
      '<div class="chat-head">' +
        '<span class="chat-faces">' + faces + '</span>' +
        '<div class="chat-title"><b>SWA Support</b><small><span class="online"></span>Online · typically replies in minutes</small></div>' +
        '<button class="chat-x" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chat-body" aria-live="polite">' +
        '<div class="chat-day">Today</div>' +
        '<div class="msg bot"><img class="av" src="' + ROOT + 'assets/img/face-2.jpg" alt=""><div class="bubble">Hello 👋 Welcome to SWA Funeral Services. How can we help you today?</div></div>' +
        '<div class="chips">' + QUICK.map(function (q, i) { return '<button class="chip" data-q="' + i + '">' + q.label + '</button>'; }).join('') + '</div>' +
      '</div>' +
      '<form class="chat-input"><input type="text" placeholder="Type your message…" aria-label="Message" autocomplete="off">' +
        '<button type="submit" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M3 11.5 20.5 4l-7.5 17.5-2.2-7.8z"/></svg></button></form>' +
      '<div class="chat-foot">Urgent? Call <a href="tel:' + TEL + '">' + PHONE + '</a> · 24/7</div>' +
    '</div>' +
    '<button class="chat-launch" aria-expanded="false" aria-label="Open chat">' +
      '<span class="launch-ico"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z"/></svg></span>' +
      '<span class="launch-txt">Chat with us</span><span class="badge">1</span>' +
    '</button>';
  document.body.appendChild(wrap);

  var panel = wrap.querySelector('.chat-panel'), launch = wrap.querySelector('.chat-launch'),
      body = wrap.querySelector('.chat-body'), form = wrap.querySelector('.chat-input'), input = form.querySelector('input');

  function toggle(open) {
    wrap.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', !open);
    launch.setAttribute('aria-expanded', open);
    if (open) { var b = launch.querySelector('.badge'); if (b) b.remove(); setTimeout(function () { input.focus(); }, 200); }
  }
  launch.addEventListener('click', function () { toggle(!wrap.classList.contains('open')); });
  wrap.querySelector('.chat-x').addEventListener('click', function () { toggle(false); launch.focus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && wrap.classList.contains('open')) toggle(false); });

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function time() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  function add(html, who) {
    var m = document.createElement('div');
    m.className = 'msg ' + who;
    m.innerHTML = (who === 'bot' ? '<img class="av" src="' + ROOT + 'assets/img/face-2.jpg" alt="">' : '') +
      '<div class="bubble">' + html + '<span class="t">' + time() + '</span></div>';
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }
  function botReply(text, link) {
    var typing = add('<span class="dots"><i></i><i></i><i></i></span>', 'bot');
    typing.classList.add('typing');
    setTimeout(function () {
      typing.remove();
      var html = esc(text);
      if (link) {
        var href = /^tel:/.test(link[1]) ? link[1] : ROOT + link[1];
        html += '<a class="bubble-link" href="' + href + '">' + esc(link[0]) + ' →</a>';
      }
      add(html, 'bot');
    }, 1100);
  }
  function send(text) {
    add(esc(text), 'me');
    var chips = body.querySelector('.chips'); if (chips) chips.remove();
    return text;
  }

  body.addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (!c) return;
    var q = QUICK[+c.dataset.q];
    send(q.label); botReply(q.reply, q.link);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (!v) return;
    input.value = '';
    send(v);
    botReply('Thank you for your message. A consultant from your nearest branch will reply shortly. If it is urgent, please call us on ' + PHONE + '.');
  });
})();
