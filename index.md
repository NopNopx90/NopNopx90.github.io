---
layout: default
title: Home
permalink: /
---

<section class="latest-posts">
  <h2>Latest Writeups</h2>
  <div class="posts-list">
    {% for post in site.posts limit:5 %}
      <div class="post-item">
        <div class="post-content">
          <div class="post-meta">
            <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
            {% if post.categories %}
              <span class="tag">{{ post.categories | first }}</span>
            {% endif %}
            <span class="reading-time">{{ post.content | number_of_words | divided_by: 250 | plus: 1 }} min read</span>
          </div>
          <h2 class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
          <p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 150 }}</p>
          <a href="{{ post.url }}" class="read-more">Read More →</a>
        </div>
      </div>
    {% endfor %}
  </div>
  
  <div class="see-more">
    <a href="/archives" class="btn">View All Writeups →</a>
  </div>
</section>
