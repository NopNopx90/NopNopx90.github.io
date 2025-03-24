document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuBtn.innerHTML = nav.classList.contains('active') ? '✕' : '☰';
  });
});
