---
layout: default
title: Home
permalink: /
---

<section class="latest-posts">
  <h2 class="section-title">Latest Writeups</h2>
  <div class="posts-list">
    {% for post in site.posts limit:5 %}
      <div class="post-item">
        <div class="post-content">
          <div class="post-meta">
            <span class="date">{{ post.date | date: "%Y-%m-%d" }}</span>
            {% if post.categories %}
              <span class="tag">{{ post.categories | first }}</span>
            {% endif %}
            <span class="reading-time">
              {% assign words = post.content | number_of_words %}
              {% if words < 360 %}1 min read{% else %}{{ words | divided_by: 180 }} min read{% endif %}
            </span>
          </div>
          <h2 class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></h2>
          <p class="post-excerpt">
            {% if post.description %}{{ post.description }}
            {% else %}{{ post.excerpt | strip_html | truncate: 150 }}
            {% endif %}
          </p>
          <a href="{{ post.url }}" class="read-more primary-btn">Read More →</a>
        </div>
      </div>
    {% endfor %}
  </div>
  
  <div class="see-more">
    <a href="/archives" class="btn primary-btn">View All Writeups →</a>
  </div>
</section>