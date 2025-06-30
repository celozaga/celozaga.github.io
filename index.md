---
layout: default
title: Celo Zaga
description: Connect with Celo Zaga on Discord, YouTube, Bluesky, and other platforms. Explore gaming content and more.
---

<h1>{{ page.title }}</h1>

<div class="post-list">
  <ul>
  {% for post in paginator.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}
      <small>— {{ post.date | date: "%d %b %Y" }}</small>
      </a>
    </li>
  {% endfor %}
  </ul>
</div>

<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">&laquo; Anterior</a>
  {% else %}
    <span class="previous-page disabled">&laquo; Anterior</span>
  {% endif %}

  <span class="page_number ">Página {{ paginator.page }} de {{ paginator.total_pages }}</span>

  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}" class="next-page">Próxima &raquo;</a>
  {% else %}
    <span class="next-page disabled">Próxima &raquo;</span>
  {% endif %}
</div>
