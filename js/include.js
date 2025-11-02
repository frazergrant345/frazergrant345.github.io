document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  includes.forEach(el => {
    const file = `includes/${el.getAttribute("data-include")}`;
    fetch(file).then(r => {
      if (!r.ok) throw new Error(`Error loading ${file} (${r.status})`);
      return r.text();
    }).then(html => el.innerHTML = html)
      .catch(err => {
        console.error(err);
        el.innerHTML = `<div style='color:#b00020'>Failed to load ${file}</div>`;
      });
  });
});