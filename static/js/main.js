// ====== Mobile menu ======
(function() {
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (!burger || !mobileNav) return;

  burger.addEventListener('click', function() {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    var isOpen = mobileNav.classList.contains('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

// ====== Stars canvas (landing only) ======
(function() {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var stars = [];
  var count = 120;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.6 + 0.1,
        s: Math.random() * 0.3 + 0.05
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(function(s) {
      s.a += Math.sin(Date.now() * 0.001 * s.s) * 0.005;
      var alpha = Math.max(0.05, Math.min(0.7, s.a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(192, 132, 252, ' + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', resize);
})();

// ====== Scroll-triggered animations (continuous) ======
(function() {
  var services = document.getElementById('services');
  if (!services) return;

  var cards = services.querySelectorAll('.service-card');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(function(card) { observer.observe(card); });
  observer.observe(services);
})();

// ====== Interview carousel ======
function scrollCarousel(dir) {
  var track = document.getElementById('interview-track');
  if (!track) return;
  var card = track.querySelector('.interview-card');
  if (!card) return;
  var w = card.offsetWidth + 16;
  track.scrollBy({ left: dir * w, behavior: 'smooth' });
}

// ====== TOC active link highlighting ======
(function() {
  var toc = document.querySelector('.sidebar-toc');
  if (!toc) return;

  var links = toc.querySelectorAll('a');
  if (!links.length) return;

  var headings = [];
  links.forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var el = document.getElementById(href.slice(1));
      if (el) headings.push({ el: el, link: link });
    }
  });

  if (!headings.length) return;

  function update() {
    var scrollY = window.scrollY + 120;
    var current = null;

    for (var i = headings.length - 1; i >= 0; i--) {
      if (headings[i].el.offsetTop <= scrollY) {
        current = headings[i];
        break;
      }
    }

    links.forEach(function(l) { l.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ====== TOC toggle (tablet) ======
(function() {
  var toc = document.querySelector('.sidebar-toc');
  if (!toc) return;

  var title = toc.querySelector('.sidebar-toc-title');
  if (!title) return;

  title.addEventListener('click', function() {
    toc.classList.toggle('toc-open');
  });
})();

// ====== Code copy (for gnts-code shortcode) ======
function gntsCodeCopy(btn) {
  var code = btn.closest('.gnts-code').querySelector('code');
  var text = code.textContent || code.innerText;
  navigator.clipboard.writeText(text).then(function() {
    btn.textContent = 'Скопировано';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = 'Копировать';
      btn.classList.remove('copied');
    }, 2000);
  });
}
