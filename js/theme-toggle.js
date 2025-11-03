// --- Dark Mode Toggle with Local Storage ---
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle';
  toggleBtn.className = 'theme-toggle';
  toggleBtn.innerHTML = '🌙';
  document.body.appendChild(toggleBtn);

  // Load preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.innerHTML = '☀️';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
