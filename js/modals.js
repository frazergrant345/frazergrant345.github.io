// modals.js — waits for all includes to load first
document.addEventListener("includesLoaded", () => {
  const overlay = document.getElementById("overlay-root");
  if (!overlay) return;

  // Find all modal elements
  const modals = {
    privacy: document.getElementById("privacy-modal"),
    cookies: document.getElementById("cookies-modal"),
    quote: document.getElementById("quote-modal"),
    flights: document.getElementById("flights-modal"),
    cruises: document.getElementById("cruises-modal"),
    adventures: document.getElementById("adventures-modal"),
  };

  // Open modal
  function openModal(which) {
    Object.values(modals).forEach(m => m?.classList.remove("open"));
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    modals[which]?.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // Close modal
  function closeModal() {
    overlay.classList.remove("open");
    Object.values(modals).forEach(m => m?.classList.remove("open"));
    document.body.style.overflow = "";
  }

  // Global click handling
  document.body.addEventListener("click", e => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const which = t.getAttribute("data-open-modal");
    if (which) {
      e.preventDefault();
      openModal(which);
    }

    if (t.classList.contains("modal-close") || t.id === "overlay-root") {
      closeModal();
    }
  });

  // ESC key closes
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});
