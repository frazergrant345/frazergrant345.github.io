// ===============================
// Travel with Nat — News Loader v3
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("newsModal");
  const modal = overlay?.querySelector(".news-modal");
  const imgEl = document.getElementById("newsModalImage");
  const titleEl = document.getElementById("newsModalTitle");
  const dateEl = document.getElementById("newsModalDate");
  const contentEl = document.getElementById("newsModalContent");
  const closeBtn = document.getElementById("newsModalClose");

  // --- Load news.json and render cards ---
let allNews = [];

fetch("includes/news.json")
  .then(res => res.json())
  .then(news => {
    allNews = news; // store globally
    window.__allNews = news;
    const container = document.getElementById("news-container");
    const today = new Date();

    container.innerHTML = news.map((item, index) => {
      const date = new Date(item.date);
      const daysOld = (today - date) / (1000 * 60 * 60 * 24);
      const isNew = daysOld <= 30;

      return `
        <div class="news-card"
             data-index="${index}">
          <div class="icon">${item.icon || "📰"}</div>
          ${isNew ? `<span class="new-badge">NEW</span>` : ""}
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="news-thumb">` : ""}
          <div class="date">${date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}</div>
          <h3>${item.title}</h3>
          <p>${item.content.split('\n')[0]}</p>
          <span class="read-more">Read More →</span>
        </div>
      `;
    }).join("");
      window.__renderNewsCards && window.__renderNewsCards();

    // Attach click handlers
    document.querySelectorAll(".news-card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.classList.contains("read-more") || e.currentTarget === e.target) {
          const index = card.dataset.index;
          openNewsModal(allNews[index]); // ✅ use full article with gallery
        }
      });
    });
  })
  .catch(err => console.error("Error loading news:", err));


  // --- Modal Functions ---
  function openNewsModal(article) {
    if (!overlay || !modal) return;

    // Update content
    titleEl.textContent = article.title;
    dateEl.textContent = new Date(article.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    // Show image or hide it gracefully
    if (article.image) {
      imgEl.src = article.image;
      imgEl.style.display = "block";
      modal.classList.remove("no-image");
    } else {
      imgEl.style.display = "none";
      modal.classList.add("no-image");
    }

    // Markdown-like formatting
    let formatted = article.content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
    contentEl.innerHTML = formatted;

  // Add gallery images if available
const galleryContainer = document.createElement("div");
if (article.gallery && article.gallery.length > 0) {
  galleryContainer.classList.add("news-gallery");
  galleryContainer.innerHTML = article.gallery
    .map(img => `<img src="${img}" alt="" class="gallery-thumb">`)
    .join("");
  contentEl.appendChild(galleryContainer);
}


    // Animate open
    overlay.classList.add("visible");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeNewsModal() {
    if (!overlay || !modal) return;
    overlay.classList.remove("visible");
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  // --- Event Listeners ---
  if (closeBtn) closeBtn.addEventListener("click", closeNewsModal);
  overlay?.addEventListener("click", e => {
    if (e.target === overlay) closeNewsModal();
  });

  // Escape key closes modal
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeNewsModal();
  });

  // Expose globally (optional)
  window.openNewsModal = openNewsModal;
  window.closeNewsModal = closeNewsModal;
});

// ---------- Lightbox Viewer ----------
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.innerHTML = `
  <div class="lightbox-backdrop">
    <button id="lightbox-close">×</button>
    <button id="lightbox-prev">‹</button>
    <img id="lightbox-image" alt="">
    <button id="lightbox-next">›</button>
  </div>
`;
document.body.appendChild(lightbox);

let currentGallery = [];
let currentIndex = 0;

document.addEventListener("click", e => {
  if (e.target.classList.contains("gallery-thumb")) {
    const gallery = Array.from(
      e.target.closest(".news-gallery").querySelectorAll(".gallery-thumb")
    );
    currentGallery = gallery.map(img => img.src);
    currentIndex = gallery.indexOf(e.target);
    showLightbox(currentGallery[currentIndex]);
  }
});

// ---------- Banner Image Lightbox Integration ----------
document.addEventListener("click", e => {
  // If user clicks the main banner image inside a news modal
  if (e.target.classList.contains("news-modal-image")) {
    const banner = e.target.src;

    // Try to collect gallery images (if present)
    const gallery = Array.from(
      e.target.closest(".news-modal").querySelectorAll(".gallery-thumb")
    );

    // Build gallery array including banner image first
    currentGallery = [banner, ...gallery.map(img => img.src)];
    currentIndex = 0; // start with the banner

    showLightbox(currentGallery[currentIndex]);
  }
});

function showLightbox(src) {
  const img = document.getElementById("lightbox-image");
  img.src = src;
  document.getElementById("lightbox").classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
  document.body.style.overflow = "auto";
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  showLightbox(currentGallery[currentIndex]);
});
document.getElementById("lightbox-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  showLightbox(currentGallery[currentIndex]);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});
// ---------- Swipe + Arrow Key Support ----------
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});
document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (!document.getElementById("lightbox").classList.contains("show")) return;

  if (endX - startX > 50) {
    // Swipe right → previous
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showLightbox(currentGallery[currentIndex]);
  } else if (startX - endX > 50) {
    // Swipe left → next
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showLightbox(currentGallery[currentIndex]);
  }
});

document.addEventListener("keydown", e => {
  if (!document.getElementById("lightbox").classList.contains("show")) return;

  if (e.key === "ArrowLeft") {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showLightbox(currentGallery[currentIndex]);
  }
  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showLightbox(currentGallery[currentIndex]);
  }
});


/* === Slider Patch v1 === */
(function(){
  function initNewsSlider(){
    const container = document.getElementById('news-container');
    if(!container) return;
    container.classList.add('news-slider-active');

    // Arrows
    const wrapper = container.closest('.news-slider-wrapper');
    const prev = wrapper ? wrapper.querySelector('.news-nav.prev') : null;
    const next = wrapper ? wrapper.querySelector('.news-nav.next') : null;

    // Scroll amount ~= one card width + gap
    const card = container.querySelector('.news-card');
    const gap = 24;
    const cardWidth = card ? card.getBoundingClientRect().width : 340;
    const scrollAmount = Math.round(cardWidth + gap);

    function updateNav(){
      if(!prev || !next) return;
      prev.style.opacity = container.scrollLeft > 0 ? '1' : '0.4';
      const maxScroll = container.scrollWidth - container.clientWidth;
      next.style.opacity = container.scrollLeft >= maxScroll - 5 ? '0.4' : '1';
    }

    if(next) next.addEventListener('click', (e)=>{
      e.stopPropagation();
      container.scrollBy({left: scrollAmount, behavior:'smooth'});
      setTimeout(updateNav, 350);
    });
    if(prev) prev.addEventListener('click', (e)=>{
      e.stopPropagation();
      container.scrollBy({left: -scrollAmount, behavior:'smooth'});
      setTimeout(updateNav, 350);
    });

    container.addEventListener('scroll', updateNav);
    window.addEventListener('resize', updateNav);
    setTimeout(updateNav, 500);

    // Click handling: open modal for any card or its "Read More"
    container.querySelectorAll('.news-card').forEach((cardEl)=>{
      cardEl.addEventListener('click', (e)=>{
        if(e.target.closest('.news-nav')) return; // ignore arrow clicks
        const idx = cardEl.dataset.index || cardEl.getAttribute('data-index');
        if(typeof idx !== 'undefined' && window.__allNews && window.__allNews[+idx]){
          (window.openNewsModal||function(){})(window.__allNews[+idx]);
        }
      });
      const readMore = cardEl.querySelector('.read-more');
      if(readMore){
        readMore.addEventListener('click', (e)=>{
          e.preventDefault();
          e.stopPropagation();
          const idx = cardEl.dataset.index || cardEl.getAttribute('data-index');
          if(typeof idx !== 'undefined' && window.__allNews && window.__allNews[+idx]){
            (window.openNewsModal||function(){})(window.__allNews[+idx]);
          }
        });
      }
    });
  }

  // Hook into existing loader by setting global after render helper
  const _origRender = window.__renderNewsCards;
  window.__renderNewsCards = function(){ try{ if(typeof _origRender==='function') _origRender(); }catch(e){}; initNewsSlider(); };

  // If the page already rendered before this patch loads, try anyway
  document.addEventListener('DOMContentLoaded', initNewsSlider);
  setTimeout(initNewsSlider, 1200);
})();
