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
