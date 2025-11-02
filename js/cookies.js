window.addEventListener("load", () => {
  setTimeout(() => {
    const banner = document.getElementById("cookie-popup");
    const accept = document.getElementById("cookie-accept");
    const decline = document.getElementById("cookie-decline");
    const readmore = document.getElementById("cookie-readmore");
    const key = "cookieConsent";
    if (!banner) return;
    const consent = localStorage.getItem(key);
    if (!consent) banner.classList.add("show");
    const closePopup = () => { banner.classList.remove("show"); banner.classList.add("hide"); setTimeout(() => banner.remove(), 400); };
    function cookiesAllowed(){ return localStorage.getItem(key) === "accepted"; }
    // Initial enforcement on load
    if (!cookiesAllowed()) {
      document.querySelectorAll("iframe").forEach(frame => { if (!frame.dataset.src) frame.dataset.src = frame.src || ""; frame.src = ""; });
    }
    function triggerChange(){ window.dispatchEvent(new Event("cookieConsentChanged")); }
    accept?.addEventListener("click", () => { localStorage.setItem(key, "accepted"); triggerChange(); closePopup(); });
    decline?.addEventListener("click", () => { localStorage.setItem(key, "declined"); triggerChange(); closePopup(); });
    readmore?.addEventListener("click", (e) => { e.preventDefault(); localStorage.setItem(key, "readmore"); triggerChange(); closePopup(); const btn = document.querySelector("[data-open-modal='cookies']"); btn?.click(); });
    window.addEventListener("cookieConsentChanged", () => {
      if (cookiesAllowed()) {
        document.querySelectorAll("iframe[data-src]").forEach(frame => { frame.src = frame.dataset.src; frame.removeAttribute("data-src"); });
      } else {
        document.querySelectorAll("iframe").forEach(frame => { if (!frame.dataset.src) frame.dataset.src = frame.src || ""; frame.src = ""; });
      }
    });
  }, 1000);
});