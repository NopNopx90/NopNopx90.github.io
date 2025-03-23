---
layout: default
title: Home
---

# Welcome to NopNop0x90's Blog

## Latest Writeups

<ul>
  {% for post in site.posts %}
    <li><a href="{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: "%b %d, %Y" }}</li>
  {% endfor %}
</ul>
