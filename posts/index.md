---
layout: default
title: Latest Posts
permalink: /posts/
---

<h1>{{ page.title }}</h1>

<div class="post-list">
  <ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}
      <small>— {{ post.date | date: "%d %b %Y" }}</small>
      </a>
    </li>
  {% endfor %}
  </ul>
</div>
