window.addEventListener("load", () => {
  setTimeout(() => {
    const overlay = document.getElementById("overlay-root");
    if (!overlay) return;
    const privacy = document.getElementById("privacy-modal");
    const cookies = document.getElementById("cookies-modal");
    const quote = document.getElementById("quote-modal");
    function openModal(which){
      overlay.setAttribute("aria-hidden","false");
      overlay.classList.add("open");
      privacy?.classList.remove("open");
      cookies?.classList.remove("open");
      quote?.classList.remove("open");
      if (which === "privacy") privacy?.classList.add("open");
      if (which === "cookies") cookies?.classList.add("open");
      if (which === "quote") quote?.classList.add("open");
      document.body.style.overflow = "hidden";
      const btt = document.getElementById("back-to-top");
      if (btt) btt.classList.remove("show");
    }
    function closeModal(){
      overlay.classList.remove("open");
      privacy?.classList.remove("open");
      cookies?.classList.remove("open");
      quote?.classList.remove("open");
      document.body.style.overflow = "";
    }
    document.body.addEventListener("click", (e) => {
      const tr = e.target;
      if (!(tr instanceof Element)) return;
      const which = tr.getAttribute("data-open-modal");
      if (which){ e.preventDefault(); openModal(which); }
      if (tr.classList.contains("modal-close") || tr.id === "overlay-root"){ closeModal(); }
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }, 300);
});