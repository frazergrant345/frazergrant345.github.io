// === Smooth Scroll Settings ===
const SCROLL_DURATION = 600; // ms
const SHOW_BACKTOP_AFTER = 600; // px

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function smoothScrollTo(targetY, duration=SCROLL_DURATION){
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  const start = performance.now();
  function step(now){
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    window.scrollTo(0, startY + diff * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener('load', () => {
  // Hero CTA and footer "Get a Quote" smooth scroll
  document.body.addEventListener('click', (e) => {
    const el = e.target;
    if (!(el instanceof Element)) return;
    if (el.matches('.btn-cta, .link-quote, a[href="#quote"]')) {
      const hash = el.getAttribute('href');
      if (hash === '#quote') {
        e.preventDefault();
        const section = document.querySelector('#quote');
        if (section){
          const rect = section.getBoundingClientRect();
          const y = rect.top + window.scrollY - 10;
          smoothScrollTo(y);
        }
      }
    }
  });

  // Back to top logic
  const btt = document.getElementById('back-to-top');
  if (btt){
    const toggleBtt = () => {
      const overlayOpen = document.getElementById('overlay-root')?.classList.contains('open');
      const cookieOpen = document.getElementById('cookie-popup')?.classList.contains('show');
      if (window.scrollY > SHOW_BACKTOP_AFTER && !overlayOpen && !cookieOpen){
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleBtt, { passive: true });
    window.addEventListener('resize', toggleBtt);
    setTimeout(toggleBtt, 1200);

    btt.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(0);
    });
  }
});
