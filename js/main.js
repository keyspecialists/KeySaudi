/* ===== AL-AFDAL Keys - Main JS ===== */
(function(){
  // ===== Splash screen (first visit per session, 4s) =====
  try{
    // Compute base path from this script's own URL so it works at any depth
    var base = '';
    var scripts = document.getElementsByTagName('script');
    for(var i=0;i<scripts.length;i++){
      var s = scripts[i].getAttribute('src')||'';
      if(s.indexOf('js/main.js')!==-1){ base = s.replace(/js\/main\.js.*$/,''); break; }
    }
    var shown = sessionStorage.getItem('alafdal_splash_shown');
    if(!shown){
      sessionStorage.setItem('alafdal_splash_shown','1');
      var splash = document.createElement('div');
      splash.id = 'splashScreen';
      splash.innerHTML = '<div class="splash-inner"><video autoplay muted playsinline preload="auto"><source src="' + base + 'images/splash.mp4" type="video/mp4"></video></div>';
      // Inject as soon as possible
      if(document.body){ document.body.appendChild(splash); }
      else { document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(splash); }); }
      setTimeout(function(){
        splash.classList.add('fade-out');
        setTimeout(function(){ if(splash && splash.parentNode) splash.parentNode.removeChild(splash); }, 600);
      }, 4000);
    }
  }catch(e){}

  // Preloader (hide quickly to avoid double overlay with splash)
  window.addEventListener('load', function(){
    setTimeout(function(){
      var p = document.getElementById('preloader');
      if(p) p.classList.add('hide');
    }, 300);
  });

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if(toggle && nav){ toggle.addEventListener('click', function(){ nav.classList.toggle('open'); }); }

  // Hero slider
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots span');
  var idx = 0, timer;
  function show(i){
    slides.forEach(function(s,k){ s.style.display = (k===i?'flex':'none'); });
    dots.forEach(function(d,k){ d.classList.toggle('active', k===i); });
    idx = i;
  }
  function next(){ show((idx+1)%slides.length); }
  function prev(){ show((idx-1+slides.length)%slides.length); }
  if(slides.length){
    show(0);
    timer = setInterval(next, 5000);
    document.querySelectorAll('.hero-arrow.next').forEach(function(b){b.addEventListener('click',function(){clearInterval(timer);next();timer=setInterval(next,5000)})});
    document.querySelectorAll('.hero-arrow.prev').forEach(function(b){b.addEventListener('click',function(){clearInterval(timer);prev();timer=setInterval(next,5000)})});
    dots.forEach(function(d,k){ d.addEventListener('click', function(){ clearInterval(timer); show(k); timer=setInterval(next,5000); }); });
  }

  // Hide page-transition overlay if present (instant navigation – no transition videos)
  var overlay = document.getElementById('pageTransition');
  if(overlay){ overlay.style.display = 'none'; }

  // Fade-in observer
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:.12});
  document.querySelectorAll('.fade-in').forEach(function(el){ io.observe(el); });

  // Counter animation
  document.querySelectorAll('.stat .num').forEach(function(el){
    var target = parseInt(el.dataset.count||el.textContent,10) || 0;
    var suffix = el.dataset.suffix || '';
    var n = 0, step = Math.max(1, Math.floor(target/40));
    var iv = setInterval(function(){
      n += step; if(n>=target){ n=target; clearInterval(iv); }
      el.textContent = n + suffix;
    }, 40);
  });
})();
