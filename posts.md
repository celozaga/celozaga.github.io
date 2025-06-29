---
layout: default
title: Latest Posts
permalink: /posts/
---
<div class="post-list>
<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <small>— {{ post.date | date: "%d %b %Y" }}</small>
  </li>
{% endfor %}
</ul>
</div>
