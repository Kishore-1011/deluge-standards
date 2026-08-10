/**
 * Zoho Deluge Documentation - Theme Controller
 * Handles Light / Dark theme switching with zero FOUC (Flash of Unstyled Content)
 */
(() => {
  const STORAGE_KEY = 'deluge-docs-theme';

  // Apply theme immediately to root html tag to eliminate flash of unstyled content
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Update theme toggle icon if present in DOM
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.innerHTML = `<i data-lucide="${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
      if (window.lucide) {
        lucide.createIcons();
      }
    }
  }

  // Initial immediate application
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind listener once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());

    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, newTheme);
        applyTheme(newTheme);
      }
    });

    // Listen for OS system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  window.DocTheme = { getPreferredTheme, applyTheme };
})();
