document.addEventListener("includesLoaded", () => {
  const overlay = document.getElementById("overlay-root");
  const privacy = document.getElementById("privacy-modal");
  const cookies = document.getElementById("cookies-modal");
  const quote = document.getElementById("quote-modal");
  const flights = document.getElementById("flights-modal");
  const cruises = document.getElementById("cruises-modal");
  const adventures = document.getElementById("adventures-modal");

  function openModal(which) {
    [privacy, cookies, quote, flights, cruises, adventures].forEach(m => m?.classList.remove("open"));
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    const map = {
      privacy,
      cookies,
      quote,
      flights,
      cruises,
      adventures
    };
    map[which]?.classList.add("open");
  }

  function closeModal() {
    overlay.classList.remove("open");
    [privacy, cookies, quote, flights, cruises, adventures].forEach(m => m?.classList.remove("open"));
    document.body.style.overflow = "";
  }

  document.body.addEventListener("click", e => {
    const t = e.target;
    if (!(t instanceof Element)) return;

    const which = t.getAttribute("data-open-modal");
    if (which) {
      e.preventDefault();
      openModal(which);
    }

    if (t.classList.contains("modal-close") || t.id === "overlay-root") closeModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });
});
