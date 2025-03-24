// theme-switcher.js
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  body.classList.add(initialTheme);
  updateToggleIcon(initialTheme);

  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const isDark = body.classList.contains('dark');
    body.classList.remove(isDark ? 'dark' : 'light');
    body.classList.add(isDark ? 'light' : 'dark');
    
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateToggleIcon(isDark ? 'light' : 'dark');
  });

  // Update icon based on current theme
  function updateToggleIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? 
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' :
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }
});
