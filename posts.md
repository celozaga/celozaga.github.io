---
layout: default
title: Blog
permalink: /posts/
---

<h1>Blog</h1>

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <small>— {{ post.date | date: "%d %b %Y" }}</small>
  </li>
{% endfor %}
</ul>
