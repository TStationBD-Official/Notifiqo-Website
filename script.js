// Notifiqo marketing/legal page - vanilla JS, no external dependencies.

document.addEventListener('DOMContentLoaded', () => {
  // Scroll-reveal for feature cards and legal sections.
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support, just show everything.
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // Light/dark theme toggle, persisted per-visit via localStorage.
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('notifiqo-theme');

  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
    updateToggleIcon(storedTheme);
  }

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;
    toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDarkNow = current ? current === 'dark' : prefersDark;
      const next = isDarkNow ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('notifiqo-theme', next);
      updateToggleIcon(next);
    });
    updateToggleIcon(storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }
});
