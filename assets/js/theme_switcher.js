document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Initialize theme from localStorage or prefer-color-scheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let savedTheme = localStorage.getItem('theme');
  
  if (!savedTheme) {
    savedTheme = prefersDark ? 'dark' : 'light';
  }
  
  body.className = savedTheme;
  updateToggleIcon(savedTheme);

  // System theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      body.className = e.matches ? 'dark' : 'light';
      updateToggleIcon(body.className);
    }
  });

  themeToggle.addEventListener('click', function() {
    const isDark = body.classList.contains('dark');
    body.className = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', body.className);
    updateToggleIcon(body.className);
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: body.className }
    }));
  });

  function updateToggleIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ?
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>' :
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    themeToggle.setAttribute('aria-label', `${theme === 'dark' ? 'Switch to light' : 'Switch to dark'} mode`);
  }
});
