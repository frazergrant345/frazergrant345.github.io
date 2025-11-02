// Smooth scroll + back-to-top logic
const SCROLL_DURATION = 600;
const SHOW_BACKTOP_AFTER = 600;

// Ease-out cubic timing
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Smooth scroll animation
function smoothScrollTo(targetY, duration = SCROLL_DURATION) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  const start = performance.now();

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    window.scrollTo(0, startY + diff * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

window.addEventListener("load", () => {
  // Smooth scroll for "quote" links
  document.body.addEventListener("click", (e) => {
    const el = e.target;
    if (!(el instanceof Element)) return;

    if (el.matches('.btn-cta, .link-quote, a[href="#quote"]')) {
      const hash = el.getAttribute("href");
      if (hash === "#quote") {
        e.preventDefault();
        const section = document.querySelector("#quote");
        if (section) {
          const rect = section.getBoundingClientRect();
          const y = rect.top + window.scrollY - 10;
          smoothScrollTo(y);
        }
      }
    }
  });

  // Back-to-top button logic
  const btt = document.getElementById("back-to-top");
  if (btt) {
    const toggleBtt = () => {
      const overlayOpen = document.getElementById("overlay-root")?.classList.contains("open");
      const cookieVisible = document.getElementById("cookie-popup")?.classList.contains("show");

      if (window.scrollY > SHOW_BACKTOP_AFTER && !overlayOpen && !cookieVisible) {
        btt.classList.add("show");
      } else {
        btt.classList.remove("show");
      }
    };

    window.addEventListener("scroll", toggleBtt, { passive: true });
    window.addEventListener("resize", toggleBtt);
    setTimeout(toggleBtt, 1000);

    btt.addEventListener("click", (e) => {
      e.preventDefault();
      smoothScrollTo(0);
    });
  }
});

// Fade cards into view smoothly as you scroll (matches stardust timing)
window.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".feature-card");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  cards.forEach(card => observer.observe(card));
});
