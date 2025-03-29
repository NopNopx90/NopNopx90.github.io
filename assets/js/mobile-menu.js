document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navList = document.querySelector('nav ul');
  
  menuBtn.addEventListener('click', () => {
    navList.classList.toggle('active');
    menuBtn.innerHTML = navList.classList.contains('active') ? '✕' : '☰';
    
    if(navList.classList.contains('active')) {
      document.addEventListener('click', closeMenuOnClickOutside);
    } else {
      document.removeEventListener('click', closeMenuOnClickOutside);
    }
  });

  function closeMenuOnClickOutside(e) {
    if(!navList.contains(e.target) && !menuBtn.contains(e.target)) {
      navList.classList.remove('active');
      menuBtn.innerHTML = '☰';
      document.removeEventListener('click', closeMenuOnClickOutside);
    }
  }
});
