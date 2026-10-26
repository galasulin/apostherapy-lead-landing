/* ============================================================
   Demo build of the lead form (portfolio copy).
   Keeps the production behaviour the visitor sees - the mobile
   form overlay, field validation and warnings - but a valid
   submit only shows a demo notice. Nothing is sent anywhere:
   no network request, no tag-manager events, no CRM.
   ============================================================ */
(function () {
  'use strict';

  var DEMO_MSG = 'זה דף הדגמה – הטופס לא שולח פרטים לשום מקום.';
  var LINK_MSG = 'זה דף הדגמה – הקישור והחיוג מנותקים בעותק הזה.';

  /* ---------- toast (phone CTA, outbound links) ---------- */
  var toastEl = null, toastTimer = null;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'demo-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    // force a reflow so the transition replays on repeated clicks
    toastEl.classList.remove('show');
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3600);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-demo-phone]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toast(DEMO_MSG); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-demo-link]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toast(LINK_MSG); });
  });

  /* ---------- mobile form overlay (same as production) ---------- */
  var openBtn = document.querySelector('.open-btn');
  var closeBtn = document.querySelector('.close-btn');
  if (openBtn) openBtn.addEventListener('click', function () { document.body.classList.add('form-open'); });
  if (closeBtn) closeBtn.addEventListener('click', function () { document.body.classList.remove('form-open'); });

  /* ---------- validation (same rules as production) ---------- */
  var form = document.querySelector('.form-container form');
  var msg = form ? form.querySelector('.demo-msg') : null;

  function show(sel, on) {
    var el = form.querySelector(sel);
    if (el) el.style.display = on ? 'block' : 'none';
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(value).trim().toLowerCase());
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot: bots fill hidden fields, people do not
      var hp = form.querySelector('input[name="company"]');
      if (hp && hp.value) return;

      var name = (form.querySelector('input[name="name"]').value || '').trim();
      var phone = (form.querySelector('input[name="phone"]').value || '').trim();
      var email = (form.querySelector('input[name="email"]').value || '').trim();

      var parts = name.split(/\s+/).filter(Boolean);
      var nameBad = parts.length < 2;          // first + last name
      var phoneBad = phone.length < 9;
      var emailBad = !validEmail(email);

      show('.name.warning', nameBad);
      show('.phone.warning', phoneBad);
      show('.email.warning', emailBad);

      if (nameBad || phoneBad || emailBad) {
        if (msg) msg.hidden = true;
        return;
      }

      // valid: in production this is where the lead was posted - here we only say so
      if (msg) {
        msg.textContent = DEMO_MSG;
        msg.hidden = false;
      }
    });
  }

  /* ---------- click-to-load video (no YouTube request until play) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.video-facade[data-yt]'), function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-yt');
      if (!/^[\w-]{6,20}$/.test(id)) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('data-title') || 'YouTube';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.allowFullscreen = true;
      btn.replaceWith(f);
      f.focus();
    });
  });
})();
