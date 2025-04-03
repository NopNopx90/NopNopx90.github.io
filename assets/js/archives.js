document.addEventListener('DOMContentLoaded', function() {
  const tagButtons = document.querySelectorAll('.tag-list .tag');
  const posts = document.querySelectorAll('.post-item');
  const yearSections = document.querySelectorAll('.year-section');
  const searchInput = document.getElementById('searchInput');

  // Filter by category
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      tagButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      filterPosts(this.dataset.category);
    });
  });

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const activeTag = document.querySelector('.tag-list .tag.active');
      const category = activeTag ? activeTag.dataset.category : 'all';
      filterPosts(category, searchInput.value.toLowerCase());
    }, 300));
  }

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  posts.forEach(post => observer.observe(post));

  function filterPosts(category, searchTerm = '') {
    posts.forEach(post => {
      const matchesCategory = category === 'all' || post.dataset.category === category;
      const matchesSearch = searchTerm === '' || 
        post.querySelector('.post-title')?.textContent.toLowerCase().includes(searchTerm) ||
        post.querySelector('.post-meta .tag')?.textContent.toLowerCase().includes(searchTerm);
      
      post.style.display = matchesCategory && matchesSearch ? 'flex' : 'none';
    });

    // Handle year sections visibility
    yearSections.forEach(section => {
      const hasVisiblePosts = [...section.querySelectorAll('.post-item')]
        .some(post => post.style.display !== 'none');
      section.style.display = hasVisiblePosts ? 'block' : 'none';
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
});

