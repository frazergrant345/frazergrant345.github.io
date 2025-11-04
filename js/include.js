// includes.js — supports nested includes
function loadIncludes(root = document) {
  const includes = root.querySelectorAll("[data-include]");
  const loadPromises = [];

  includes.forEach(el => {
    const file = el.getAttribute("data-include");
    const p = fetch(file)
      .then(response => {
        if (!response.ok) throw new Error(`Error loading ${file}`);
        return response.text();
      })
      .then(data => {
        el.innerHTML = data;

        // ✅ recursively load any includes nested inside
        return loadIncludes(el);
      })
      .catch(err => {
        el.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
      });
    loadPromises.push(p);
  });

  return Promise.all(loadPromises);
}

document.addEventListener("DOMContentLoaded", () => {
  loadIncludes().then(() => {
    document.dispatchEvent(new Event("includesLoaded"));
  });
});

// Re-scan Font Awesome icons after includes load
document.addEventListener('includesLoaded', () => {
  if (window.FontAwesome && window.FontAwesome.dom) {
    window.FontAwesome.dom.i2svg();
  }
});

// ---------- Development Popup (Once Per Day) ----------
window.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("dev-popup");
  const closeBtn = document.getElementById("dev-popup-close");

  if (!popup) return;

  const lastShown = localStorage.getItem("devPopupLastShown");
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // e.g., "2025-11-04"

  // Only show if it hasn't been shown today
  if (lastShown !== today) {
    setTimeout(() => popup.classList.add("show"), 600);
  }

  // Close button handler
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
    localStorage.setItem("devPopupLastShown", today);
  });
});
