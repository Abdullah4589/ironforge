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
    var delay = 0;
    'IRON'.split('').forEach(function(ch){
      var s = document.createElement('span');
      s.className = 'ltr'; s.textContent = ch;
      s.style.setProperty('--ld', delay + 'ms');
      ironWrap.appendChild(s); delay += 80;
    });
    'FORGE'.split('').forEach(function(ch){
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
      var eased = 1 - Math.pow(1 - progress, 3);
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
    if(!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }
  if(nav){
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* ---------- Magnetic tilt ---------- */
  function setupTilt(){
    if(noHover || reduced) return;
    document.querySelectorAll('.tilt').forEach(function(card){
      var isFeatured = card.classList.contains('featured');
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var sc = isFeatured ? ' scale(1.03)' : '';
        card.style.transition = 'transform .1s ease';
        card.style.transform = 'perspective(600px) rotateY(' + (x*12) + 'deg) rotateX(' + (-y*12) + 'deg) translateZ(8px)' + sc;
      });
      card.addEventListener('mouseleave', function(){
        var sc = isFeatured ? ' scale(1.03)' : '';
        card.style.transition = 'transform .5s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)' + sc;
      });
    });
  }

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if(navToggle && mobileMenu){
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

  /* ---------- Nav active page highlight ---------- */
  (function highlightNav(){
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'ironforge.html';
    if(page === '' || page === '/') page = 'ironforge.html';
    document.querySelectorAll('.nav-links a, #mobileMenu a').forEach(function(a){
      var href = a.getAttribute('href');
      if(href){
        var cleanHref = href.split('#')[0];
        if(cleanHref === page) a.classList.add('active');
        else a.classList.remove('active');
      }
    });
  })();

  /* ---------- Plan selection → pre-fill contact form ---------- */
  (function(){
    var hiddenPlan = document.getElementById('trialPlan');
    var contactSub = document.querySelector('.contact-sub');
    var defaultSub = contactSub ? contactSub.textContent : '';
    document.querySelectorAll('[data-plan]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var plan = btn.getAttribute('data-plan');
        if(hiddenPlan) hiddenPlan.value = plan;
        if(contactSub && plan){
          contactSub.textContent = 'You selected the ' + plan + ' plan — drop your details and we\'ll set up your free session.';
        }
      });
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
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nameEl  = document.getElementById('trialName');
      var email   = document.getElementById('trialEmail');
      var btn     = document.getElementById('trialBtn');
      var note    = document.getElementById('formNote');

      note.classList.remove('error','done');
      if(nameEl) nameEl.classList.remove('invalid');
      email.classList.remove('invalid');

      if(nameEl && !nameEl.value.trim()){
        nameEl.classList.add('invalid');
        note.textContent = 'Please enter your name.';
        note.classList.add('error');
        nameEl.focus();
        return;
      }

      if(!EMAIL_RE.test(email.value.trim())){
        email.classList.add('invalid');
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('error');
        email.focus();
        return;
      }

      var action = form.getAttribute('action') || '';
      var configured = action && action.indexOf('your-form-id') === -1;

      if(nameEl) nameEl.disabled = true;
      email.disabled = true;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      function success(){
        btn.textContent = 'Done!';
        note.textContent = "You're in — check your inbox, we'll be in touch within 24 hours.";
        note.classList.add('done');
      }
      function failure(){
        if(nameEl) nameEl.disabled = false;
        email.disabled = false;
        btn.disabled = false;
        btn.textContent = 'Claim your trial';
        note.textContent = 'Something went wrong — please try again or email hello@ironforge.pk.';
        note.classList.add('error');
      }

      if(!configured){ setTimeout(success, 600); return; }

      fetch(action, {
        method:'POST',
        headers:{'Accept':'application/json'},
        body:new FormData(form)
      }).then(function(r){ r.ok ? success() : failure(); }).catch(failure);
    });
  }

  /* ---------- Back to top ---------- */
  (function(){
    var btt = document.getElementById('backToTop');
    if(!btt) return;
    window.addEventListener('scroll', function(){
      btt.classList.toggle('visible', window.scrollY > 600);
    }, {passive:true});
    btt.addEventListener('click', function(){
      window.scrollTo({top:0, behavior: reduced ? 'instant' : 'smooth'});
    });
  })();

  /* ---------- Cookie consent ---------- */
  (function(){
    var bar = document.getElementById('cookieBar');
    var acceptBtn = document.getElementById('cookieAccept');
    if(!bar || !acceptBtn) return;
    try {
      if(!localStorage.getItem('ironforge_cookie_ok')){
        setTimeout(function(){ bar.classList.add('visible'); }, 1800);
      }
    } catch(e){}
    acceptBtn.addEventListener('click', function(){
      try { localStorage.setItem('ironforge_cookie_ok','1'); } catch(e){}
      bar.classList.remove('visible');
    });
  })();

  /* ---------- Boot ---------- */
  setupTilt();

  if(reduced){
    document.body.classList.add('loaded');
    revealAllNow();
    return;
  }

  setupObserver();

  window.addEventListener('load', function(){
    var loader = document.getElementById('loader');
    if(!loader){
      document.body.classList.add('loaded','hero-in');
      return;
    }
    setTimeout(function(){
      loader.classList.add('gone');
      document.body.classList.add('loaded');
      setTimeout(function(){ document.body.classList.add('hero-in'); }, 100);
    }, 850);
  });

  setTimeout(function(){
    if(!document.body.classList.contains('loaded')){
      var loader = document.getElementById('loader');
      if(loader) loader.classList.add('gone');
      document.body.classList.add('loaded');
      setTimeout(function(){ document.body.classList.add('hero-in'); }, 100);
    }
  }, 1600);
})();
