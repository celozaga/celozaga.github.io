---
layout: default
title: Todos os Posts do Blog
permalink: /posts/
---

<h1>{{ page.title }}</h1>

<div class="post-list">
  <ul>
  {% for post in site.posts %} {# Iterar sobre TODOS os posts sem paginação #}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}
      <small>— {{ post.date | date: "%d %b %Y" }}</small>
      </a>
    </li>
  {% endfor %}
  </ul>
</div>
