document.addEventListener("DOMContentLoaded", () => {
  const layer = document.createElement("div");
  layer.className = "stardust-layer";
  document.body.appendChild(layer);

  const toggleBtn = document.createElement("button");
  toggleBtn.id = "stardust-toggle";
  document.body.appendChild(toggleBtn);

  let enabled = localStorage.getItem("stardust-enabled");
  if (enabled === null) enabled = "true";

  function updateToggle() {
    if (enabled === "true") {
      toggleBtn.textContent = "✨ Disable Magic";
      toggleBtn.classList.remove("off");
      layer.style.display = "block";
    } else {
      toggleBtn.textContent = "Enable Magic ✨";
      toggleBtn.classList.add("off");
      layer.style.display = "none";
    }
  }
  updateToggle();

  toggleBtn.addEventListener("click", () => {
    enabled = (enabled === "true") ? "false" : "true";
    localStorage.setItem("stardust-enabled", enabled);
    updateToggle();
  });

  let lastX = 0, lastY = 0, lastTime = 0;

  function createStardust(x, y, density = 1) {
    if (enabled !== "true") return;

    const now = Date.now();
    const dx = x - lastX;
    const dy = y - lastY;
    const dt = now - lastTime || 1;
    const speed = Math.sqrt(dx * dx + dy * dy) / dt;
    lastX = x; lastY = y; lastTime = now;

    const base = 2;
    const extra = Math.min(10, Math.floor(speed * 30));
    const count = (base + extra) * density;

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "stardust";
      layer.appendChild(star);

      const tx = (Math.random() - 0.5) * 100;
      const ty = (Math.random() - 0.5) * 100;
      star.style.setProperty("--tx", tx);
      star.style.setProperty("--ty", ty);

      const size = Math.random() * 6 + 4;
      const colors = [
        "rgba(255,255,255,0.9)",
        "rgba(0,223,208,0.9)",
        "rgba(0,145,255,0.9)",
        "rgba(255,215,120,0.9)",
        "rgba(255,183,255,0.9)"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
      star.style.boxShadow = `0 0 ${Math.random() * 12 + 4}px ${color}`;
      star.style.opacity = 0.9;

      setTimeout(() => star.remove(), 1300);
    }
  }

  // 🖱️ Desktop mouse trail
  document.addEventListener("mousemove", (e) => createStardust(e.pageX, e.pageY));

  // 📱 Touch trail (smooth interpolation)
  let touchActive = false;
  let lastTouch = null;

  document.addEventListener("touchstart", (e) => {
    touchActive = true;
    const t = e.touches[0];
    lastTouch = { x: t.pageX, y: t.pageY };
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createStardust(t.pageX, t.pageY, 0.6), i * 40);
    }
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (!touchActive || !lastTouch) return;
    const t = e.touches[0];
    const dx = t.pageX - lastTouch.x;
    const dy = t.pageY - lastTouch.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.ceil(dist / 10); // smaller = smoother trail

    for (let i = 0; i < steps; i++) {
      const progress = i / steps;
      const x = lastTouch.x + dx * progress;
      const y = lastTouch.y + dy * progress;
      createStardust(x, y, 0.4);
    }

    lastTouch = { x: t.pageX, y: t.pageY };
  }, { passive: true });

  document.addEventListener("touchend", () => {
    touchActive = false;
    lastTouch = null;
  }, { passive: true });
});
