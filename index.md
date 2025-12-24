---
layout: default
title: Celo Zaga
description: Connect with Celo Zaga on Discord, YouTube, Bluesky, and other platforms. Explore gaming content and more.
permalink: /
---

<section class="section featured" id="featured">
<h2 style="display:none;">Featured</h2>
<ul>
</ul>
</section>

<section class="section posts" id="posts">
<h2>Posts</h2>
<ul class="posts-list">
  {% for post in site.posts limit:5 %}
  <li class="post-list-item">
    <a href="{{ post.url | absolute_url }}" target="_blank">
      <span class="post-title">{{ post.title }}</span>
      <span class="icon-external">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </span>
    </a>
  </li>
  {% endfor %}
</ul>
</section>

<section class="section videos" id="videos">
<h2>Videos</h2>
<ul>
</ul>
</section>

<section class="section store" id="store">
<h2>Store</h2>
<ul>
</ul>
</section>

{% include carousel.html id="portfolio-carousel" title="Portfolio" %}
<script src="{{ '/static/carousel.js' | relative_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize Portfolio Carousel
    new CarouselManager('portfolio-carousel', 'https://www.artstation.com/celozaga.rss', 'portfolio').init();
  });
</script>
