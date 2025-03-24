document.addEventListener('DOMContentLoaded', function() {
  const tagButtons = document.querySelectorAll('.tag-list .tag');
  const posts = document.querySelectorAll('.post-item');
  const yearSections = document.querySelectorAll('.year-section');
  
  // Filter posts by category
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      tagButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      
      // Filter posts
      posts.forEach(post => {
        if (category === 'all' || post.getAttribute('data-category') === category) {
          post.style.display = 'flex';
        } else {
          post.style.display = 'none';
        }
      });
      
      // Check if year sections are empty and hide if needed
      yearSections.forEach(section => {
        const visiblePosts = section.querySelectorAll('.post-item[style="display: flex"]').length;
        if (visiblePosts === 0) {
          section.style.display = 'none';
        } else {
          section.style.display = 'block';
        }
      });
    });
  });
  
  // Add animation to posts when they come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  posts.forEach(post => {
    observer.observe(post);
  });
});
