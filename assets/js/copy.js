document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('pre').forEach(pre => {
    if (pre.querySelector('code')) {
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        <span class="tooltip">Copy</span>
      `;
      
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(pre.querySelector('code').innerText);
          btn.classList.add('copied');
          btn.querySelector('.tooltip').textContent = 'Copied!';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.querySelector('.tooltip').textContent = 'Copy';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      });
      
      pre.appendChild(btn);
    }
  });
});
