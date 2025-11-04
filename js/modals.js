// js/modals.js — resilient version for include-loaded modals
(function () {
  console.log("[modals] script loaded");

  function initModals() {
    const overlay = document.getElementById("overlay-root");
    if (!overlay) {
      console.warn("[modals] #overlay-root not yet in DOM — retrying...");
      // Retry every 500ms until overlay appears
      setTimeout(initModals, 500);
      return;
    }

    console.log("[modals] overlay-root found — attaching listeners");

    function showOverlay() {
      overlay.classList.add("open");
      requestAnimationFrame(() => overlay.classList.add("visible"));
      document.body.style.overflow = "hidden";
    }

    function hideOverlay() {
      overlay.classList.remove("visible");
      overlay.querySelectorAll(".modal-panel.open").forEach(p => p.classList.remove("open"));
      setTimeout(() => {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }, 250);
    }

    // Handle clicks on any [data-open-modal]
    document.body.addEventListener("click", e => {
      const trigger = e.target.closest("[data-open-modal]");
      if (!trigger) return;
      e.preventDefault();

      const modalName = trigger.getAttribute("data-open-modal");
      const panel = overlay.querySelector(`#${modalName}-modal`);

      if (!panel) {
        console.warn(`[modals] Could not find modal: #${modalName}-modal`);
        return;
      }

      // close others, then open this
      overlay.querySelectorAll(".modal-panel.open").forEach(p => p.classList.remove("open"));
      panel.classList.add("open");
      showOverlay();
    });

    // Close buttons
    overlay.addEventListener("click", e => {
      if (e.target.closest(".modal-close")) {
        e.preventDefault();
        hideOverlay();
      }
    });

    // Backdrop click
    overlay.addEventListener("click", e => {
      if (e.target === overlay) hideOverlay();
    });

    // Escape key
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && overlay.classList.contains("visible")) hideOverlay();
    });

    // Hook cookie readmore → open cookies modal
    document.body.addEventListener("click", e => {
      const readMore = e.target.closest("#cookie-readmore");
      if (!readMore) return;
      e.preventDefault();
      const popup = document.getElementById("cookie-popup");
      if (popup) popup.classList.remove("show");
      const cookieModal = overlay.querySelector("#cookies-modal");
      if (cookieModal) {
        cookieModal.classList.add("open");
        showOverlay();
      }
    });

    console.log("[modals] ✅ All modal handlers attached");
  }

  // Run once DOM ready
  if (document.readyState !== "loading") initModals();
  else document.addEventListener("DOMContentLoaded", initModals);

  // Run again when includes are reloaded
  document.addEventListener("includesLoaded", initModals);
})();
