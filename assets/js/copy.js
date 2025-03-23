document.addEventListener('DOMContentLoaded', function() {
  // Copy button for code blocks
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.innerText = 'Copy';
    btn.className = 'copy-btn';
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText);
      btn.innerText = 'Copied!';
      setTimeout(() => btn.innerText = 'Copy', 2000);
    };
    pre.appendChild(btn);
  });
});
