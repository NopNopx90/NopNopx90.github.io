// theme-switcher.js
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.className = savedTheme;
  updateToggleIcon(savedTheme);

  // System preference listener
  const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      body.className = e.matches ? 'dark' : 'light';
      updateToggleIcon(body.className);
    }
  });

  // Click handler
  themeToggle.addEventListener('click', function() {
    const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
    body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
  });

  // Update icon function
  function updateToggleIcon(theme) {
    const sunIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>`;
    
    const moonIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>`;
    
    themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
});
