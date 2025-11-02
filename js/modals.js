window.addEventListener("load", () => {
  setTimeout(() => {
    const overlay = document.getElementById("overlay-root");
    const privacy = document.getElementById("privacy-modal");
    const cookies = document.getElementById("cookies-modal");
    const quote = document.getElementById("quote-modal");

    if (!overlay) return;

    function openModal(which) {
      // Hide all first
      privacy?.classList.remove("open");
      cookies?.classList.remove("open");
      quote?.classList.remove("open");

      // Show overlay
      overlay.setAttribute("aria-hidden", "false");
      overlay.classList.add("open");

      // Open the requested one
      if (which === "privacy") privacy?.classList.add("open");
      if (which === "cookies") cookies?.classList.add("open");
      if (which === "quote") quote?.classList.add("open");

      // Disable page scroll
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.classList.remove("open");
      privacy?.classList.remove("open");
      cookies?.classList.remove("open");
      quote?.classList.remove("open");
      document.body.style.overflow = "";
    }

    // Event delegation for buttons/links
    document.body.addEventListener("click", (e) => {
      const tr = e.target;
      if (!(tr instanceof Element)) return;

      const which = tr.getAttribute("data-open-modal");

      // Only open one modal at a time
      if (which) {
        e.preventDefault();
        openModal(which);
      }

      // Close modal on background or X button click
      if (tr.classList.contains("modal-close") || tr.id === "overlay-root") {
        closeModal();
      }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }, 300);
});
