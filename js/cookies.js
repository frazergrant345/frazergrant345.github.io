window.addEventListener("load", () => {
  setTimeout(() => {
    const banner = document.getElementById("cookie-popup");
    const accept = document.getElementById("cookie-accept");
    const decline = document.getElementById("cookie-decline");
    const readmore = document.getElementById("cookie-readmore");
    const key = "cookieConsent";

    if (!banner) return;

    if (!localStorage.getItem(key)) {
      banner.classList.add("show");
    }

    const closePopup = () => {
      banner.classList.remove("show");
      banner.classList.add("hide");
      setTimeout(() => banner.remove(), 400);
    };

    accept?.addEventListener("click", () => {
      localStorage.setItem(key, "accepted");
      closePopup();
    });
    decline?.addEventListener("click", () => {
      localStorage.setItem(key, "declined");
      closePopup();
    });
    readmore?.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem(key, "readmore");
      closePopup();
      const btn = document.querySelector("[data-open-modal='cookies']");
      btn?.click();
    });
  }, 1000);
});
