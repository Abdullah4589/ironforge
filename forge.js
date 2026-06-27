/* ============================================================
   IRONFORGE — behavior (forge.js)
============================================================ */
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noHover = window.matchMedia('(hover: none)').matches;

  /* ---------- Build loader letters ---------- */
  (function buildLoader(){
    var ironWrap = document.querySelector('.loader-logo .iron');
    var forgeWrap = document.querySelector('.loader-logo .forge');
    if (!ironWrap || !forgeWrap) return;
    var iron = 'IRON'.split('');
    var forge = 'FORGE'.split('');
    var delay = 0;
    iron.forEach(function(ch){
      var s = document.createElement('span');
      s.className = 'ltr'; s.textContent = ch;
      s.style.setProperty('--ld', delay + 'ms');
      ironWrap.appendChild(s); delay += 80;
    });
    forge.forEach(function(ch){
      var s = document.createElement('span');
      s.className = 'ltr'; s.textContent = ch;
      s.style.setProperty('--ld', delay + 'ms');
      forgeWrap.appendChild(s); delay += 80;
    });
  })();

  /* ---------- Counter animation ---------- */
  function animateCounter(el, target, duration, suffix){
    suffix = suffix || '';
    var start = performance.now();
    function step(now){
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }
  var countersDone = false;
  function runCounters(){
    if(countersDone) return; countersDone = true;
    document.querySelectorAll('#stats .num[data-count]').forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'),10);
      var suffix = el.getAttribute('data-suffix') || '';
      if(reduced){ el.textContent = target.toLocaleString() + suffix; }
      else animateCounter(el, target, 1800, suffix);
    });
  }

  /* ---------- Reduced motion: show everything immediately ---------- */
  function revealAllNow(){
    document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.sec-head,.split')
      .forEach(function(el){ el.classList.add('is-visible'); });
    document.querySelectorAll('.split').forEach(function(el){ el.classList.add('run'); });
    runCounters();
  }

  /* ---------- IntersectionObserver reveals ---------- */
  function setupObserver(){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('is-visible');
          if(e.target.classList.contains('split')) e.target.classList.add('run');
          if(e.target.id === 'stats') runCounters();
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12});
    document.querySelectorAll('.reveal,.reveal-up,.reveal-left,.sec-head,.split:not(.hero-h1),#stats')
      .forEach(function(el){ io.observe(el); });
  }

  /* ---------- Cursor spotlight ---------- */
  var spot = document.getElementById('spotlight');
  if(spot && !noHover){
    document.addEventListener('mousemove', function(e){
      spot.style.setProperty('--x', e.clientX + 'px');
      spot.style.setProperty('--y', e.clientY + 'px');
    });
  }

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){
    if (!nav) return;
    if(window.scrollY > 80) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  if (nav) {
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ---------- Magnetic tilt ---------- */
  function setupTilt(){
    if(noHover || reduced) return;
    document.querySelectorAll('.tilt').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'transform .1s ease';
        card.style.transform = 'perspective(600px) rotateY(' + (x*12) + 'deg) rotateX(' + (-y*12) + 'deg) translateZ(8px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
      });
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    var closeMenu = function(){
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', function(){
      var open = mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Nav Active Page Highlight ---------- */
  (function highlightNav(){
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'ironforge.html';
    
    // Fallback for directory indexing
    if(page === '' || page === '/') page = 'ironforge.html';
    
    document.querySelectorAll('.nav-links a, #mobileMenu a').forEach(function(a){
      var href = a.getAttribute('href');
      if (href) {
        var cleanHref = href.split('#')[0];
        if (cleanHref === page) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      }
    });
  })();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Contact form (validation + real submit) ---------- */
  var form = document.getElementById('trialForm');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('trialEmail');
      var btn = document.getElementById('trialBtn');
      var note = document.getElementById('formNote');
      var val = email.value.trim();

      note.classList.remove('error', 'done');
      email.classList.remove('invalid');

      if(!EMAIL_RE.test(val)){
        email.classList.add('invalid');
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('error');
        email.focus();
        return;
      }

      var action = form.getAttribute('action') || '';
      var configured = action && action.indexOf('your-form-id') === -1;

      email.disabled = true;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      function success(){
        btn.textContent = 'Done!';
        note.textContent = "You're in — check your inbox, we'll be in touch within 24 hours.";
        note.classList.add('done');
      }
      function failure(){
        email.disabled = false;
        btn.disabled = false;
        btn.textContent = 'Claim your trial';
        note.textContent = 'Something went wrong — please try again or email hello@ironforge.pk.';
        note.classList.add('error');
      }

      // Endpoint not wired up yet → demo mode (simulate success).
      if(!configured){ setTimeout(success, 600); return; }

      fetch(action, {
        method: 'POST',
        headers: {'Accept': 'application/json'},
        body: new FormData(form)
      }).then(function(r){ r.ok ? success() : failure(); })
        .catch(failure);
    });
  }

  /* ---------- Boot ---------- */
  setupTilt();

  if(reduced){
    document.body.classList.add('loaded');
    revealAllNow();
    return;
  }

  setupObserver();

  // Run the loader, then reveal page + fire hero sequence
  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    if (!loader) {
      document.body.classList.add('loaded', 'hero-in');
      return;
    }
    setTimeout(function(){
      loader.classList.add('gone');
      document.body.classList.add('loaded');
      // fire hero entrance once page is visible
      setTimeout(function(){ document.body.classList.add('hero-in'); }, 100);
    }, 850);
  });
  // Fallback if 'load' already fired or is slow
  setTimeout(function(){
    if(!document.body.classList.contains('loaded')){
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('gone');
      document.body.classList.add('loaded');
      setTimeout(function(){ document.body.classList.add('hero-in'); }, 100);
    }
  }, 1600);
})();
