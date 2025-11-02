document.addEventListener("DOMContentLoaded", () => {
  const layer = document.createElement("div"); layer.className = "stardust-layer"; document.body.appendChild(layer);
  const toggleBtn = document.createElement("button"); toggleBtn.id = "stardust-toggle"; document.body.appendChild(toggleBtn);
  let enabled = localStorage.getItem("stardust-enabled"); if (enabled === null) enabled = "true";
  function updateToggle(){ if (enabled === "true") { toggleBtn.textContent = "✨ Disable Magic"; toggleBtn.classList.remove("off"); layer.style.display = "block"; } else { toggleBtn.textContent = "Enable Magic ✨"; toggleBtn.classList.add("off"); layer.style.display = "none"; } }
  updateToggle();
  toggleBtn.addEventListener("click", () => { enabled = (enabled === "true") ? "false" : "true"; localStorage.setItem("stardust-enabled", enabled); updateToggle(); });
  let lastX = 0, lastY = 0, lastTime = 0;
  document.addEventListener("mousemove", (e) => {
    if (enabled !== "true") return;
    const now = Date.now(); const dx = e.pageX - lastX; const dy = e.pageY - lastY; const dt = now - lastTime || 1;
    const speed = Math.sqrt(dx*dx + dy*dy) / dt; lastX = e.pageX; lastY = e.pageY; lastTime = now;
    const base = 2; const extra = Math.min(10, Math.floor(speed * 30)); const count = base + extra;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div"); star.className = "stardust"; layer.appendChild(star);
      const tx = (Math.random() - 0.5) * 100; const ty = (Math.random() - 0.5) * 100; star.style.setProperty("--tx", tx); star.style.setProperty("--ty", ty);
      const size = Math.random() * 6 + 4; const colors = ["rgba(255,255,255,0.9)","rgba(0,223,208,0.9)","rgba(0,145,255,0.9)","rgba(255,215,120,0.9)","rgba(255,183,255,0.9)"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      star.style.width = `${size}px`; star.style.height = `${size}px`; star.style.left = `${e.clientX}px`; star.style.top = `${e.clientY}px`;
      star.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`; star.style.boxShadow = `0 0 ${Math.random() * 12 + 4}px ${color}`;
      setTimeout(() => star.remove(), 1300);
    }
  });
});