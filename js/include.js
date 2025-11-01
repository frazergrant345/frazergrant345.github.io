document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(el => {
        const file = el.getAttribute("data-include");
        fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Error loading ${file}`);
            return response.text();
        })
        .then(data => (el.innerHTML = data))
        .catch(err => (el.innerHTML = `<p style="color:red;">${err}</p>`));
    });
});
