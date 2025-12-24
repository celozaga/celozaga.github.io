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
<ul id="bluesky-list" class="posts-list">
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
<script src="{{ '/static/bluesky-list.js' | relative_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize Portfolio Carousel
    new CarouselManager('portfolio-carousel', 'https://www.artstation.com/celozaga.rss', 'portfolio').init();
    
    // Initialize Bluesky List (Last 5 posts)
    loadBlueskyList('bluesky-list', 'celozaga.bsky.social');
  });
</script>
