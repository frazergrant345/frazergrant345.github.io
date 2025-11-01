document.addEventListener("DOMContentLoaded", () => {
    const includes = document.querySelectorAll("[data-include]");

    includes.forEach(el => {
        // Automatically prepend the includes folder
        const file = `includes/${el.getAttribute("data-include")}`;

        fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Error loading ${file} (${response.status})`);
            return response.text();
        })
        .then(data => (el.innerHTML = data))
        .catch(err => {
            console.error(err);
            el.innerHTML = `<p style="color:red; font-size:0.9em;">⚠️ Failed to load ${file}</p>`;
        });
    });
});

