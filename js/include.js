document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  const loadPromises = [];

  includes.forEach(el => {
    const file = el.getAttribute("data-include");
    const p = fetch(file)
      .then(response => {
        if (!response.ok) throw new Error(`Error loading ${file}`);
        return response.text();
      })
      .then(data => (el.innerHTML = data))
      .catch(err => (el.innerHTML = `<p style="color:red;">${err}</p>`));
    loadPromises.push(p);
  });

  Promise.all(loadPromises).then(() => {
    document.dispatchEvent(new Event("includesLoaded"));
  });
});
