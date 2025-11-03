document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".theme-toggle");
  const body = document.body;

  // Check user preference in localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && systemDark)) {
    body.classList.add("dark-mode");
  }

  // Update icon state
  updateThemeIcon();

  // Toggle theme when clicked
  toggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");

    // Save user choice
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeIcon();
  });

  // React to system changes live (optional but nice)
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) { // only if user hasn’t overridden manually
      if (e.matches) {
        body.classList.add("dark-mode");
      } else {
        body.classList.remove("dark-mode");
      }
      updateThemeIcon();
    }
  });

  function updateThemeIcon() {
    if (!toggle) return;
    const isDark = body.classList.contains("dark-mode");
    toggle.innerHTML = isDark ? "☀️" : "🌙";
    toggle.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
  }
});
