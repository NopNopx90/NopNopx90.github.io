---
layout: default
title: Home
permalink: /
---

<section class="hero">
  <h1>Welcome to NopNopx90's CTF Blog</h1>
  <p>Dive into binary exploitation, reverse engineering, and security research. Explore detailed writeups, tools, and insights from CTFs and real-world challenges.</p>
</section>

<section class="latest-posts">
  <h2>Latest Writeups</h2>
  <div class="posts-grid">
    {% for post in site.posts %}
      <div class="post-card">
        <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
        <p class="post-date">{{ post.date | date: "%B %d, %Y" }}</p>
        <p>{{ post.excerpt | strip_html | truncate: 150 }}</p>
        <a href="{{ post.url }}" class="read-more">Read More →</a>
      </div>
    {% endfor %}
  </div>
</section>

