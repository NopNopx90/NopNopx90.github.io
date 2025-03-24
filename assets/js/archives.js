document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const tags = document.querySelectorAll('.tag');
  const posts = document.querySelectorAll('.post-item');
  const noResults = document.getElementById('noResults');
  
  let activeTag = 'all';
  let searchQuery = '';
  
  // Filter function - handles both tag and search filtering
  function filterPosts() {
    let visibleCount = 0;
    
    posts.forEach(post => {
      const categories = post.getAttribute('data-categories');
      const title = post.getAttribute('data-title');
      
      // Check if post matches current tag filter
      const matchesTag = activeTag === 'all' || 
                          (categories && categories.includes(activeTag));
      
      // Check if post matches search query
      const matchesSearch = searchQuery === '' || 
                            title.includes(searchQuery.toLowerCase());
      
      if (matchesTag && matchesSearch) {
        post.style.display = 'block';
        visibleCount++;
      } else {
        post.style.display = 'none';
      }
    });
    
    // Show "no results" message if needed
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }
  
  // Sort function
  function sortPosts() {
    const postsList = document.getElementById('archivesList');
    const postsArray = Array.from(posts);
    
    postsArray.sort((a, b) => {
      const sortType = sortSelect.value;
      
      if (sortType === 'newest') {
        return b.getAttribute('data-date') - a.getAttribute('data-date');
      } else if (sortType === 'oldest') {
        return a.getAttribute('data-date') - b.getAttribute('data-date');
      } else if (sortType === 'title') {
        return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
      }
    });
    
    // Remove all posts and re-append in sorted order
    postsArray.forEach(post => postsList.appendChild(post));
    
    // Re-apply filters after sorting
    filterPosts();
  }
  
  // Search input handler
  searchInput.addEventListener('input', function() {
    searchQuery = this.value.trim();
    filterPosts();
  });
  
  // Tag click handler
  tags.forEach(tag => {
    tag.addEventListener('click', function() {
      activeTag = this.getAttribute('data-tag');
      
      // Update active tag styling
      tags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      filterPosts();
    });
  });
  
  // Sort selection handler
  sortSelect.addEventListener('change', sortPosts);
  
  // Initial sort
  sortPosts();
  
  // Add animation effects
  posts.forEach(post => {
    post.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    
    post.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
  });
});
