window.addEventListener("load", () => {
  setTimeout(() => {
    const overlay = document.getElementById("overlay-root");
    if (!overlay) return;
    const privacy = document.getElementById("privacy-modal");
    const cookies = document.getElementById("cookies-modal");

    function openModal(which){
      overlay.setAttribute("aria-hidden","false");
      overlay.classList.add("open");
      privacy?.classList.toggle("open", which === "privacy");
      cookies?.classList.toggle("open", which === "cookies");
      const quote = document.getElementById("quote-modal");
      quote?.classList.toggle("open", which === "quote");
      document.body.style.overflow = "hidden";
      // hide back-to-top while modal open
      const btt = document.getElementById("back-to-top");
      if (btt) btt.classList.remove("show");
    }
    function closeModal(){
      overlay.classList.remove("open");
      privacy?.classList.remove("open");
      cookies?.classList.remove("open");
      document.body.style.overflow = "";
    }

    document.body.addEventListener("click", (e) => {
      const tr = e.target;
      if (!(tr instanceof Element)) return;
      const which = tr.getAttribute("data-open-modal");
      if (which){
        e.preventDefault();
        openModal(which);
      }
      if (tr.classList.contains("modal-close") || tr.id === "overlay-root"){
        closeModal();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }, 300);
});
