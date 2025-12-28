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
<a href="/posts"><h2><span>Posts</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></h2></a> 
<ul class="posts-list">
  {% for post in site.posts limit:5 %}
  <li class="post-list-item">
    <a href="{{ post.url | absolute_url }}" target="_blank">
      <span class="post-title">{{ post.title }}</span>
      <span class="icon-external">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>
      </span>
    </a>
  </li>
  {% endfor %}
</ul>
</section>

<section class="section videos" id="videos">
<a href="/videos"><h2><span>Videos</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></h2></a> 
<ul>
</ul>
</section>

<section class="section store" id="store">
<a href="/store"><h2><span>Store</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></h2></a>

<div class="carousel"> 
<ul>
<li>
<a title="Sample" href="https://aliexpress.com/item/1005009651257943.html" target="_blank">
<img src="https://i.imgur.com/wj8tIdw.png">
<p>Eggy Party Unisex Cotton T-Shirt</p>
</a>
</li>
<li>
<a title="Eggy Party Stainless Steel Thermal Mug" href="https://aliexpress.com/item/1005010381425933.html" target="_blank">
<img src="https://i.imgur.com/wj8tIdw.png">
<p>Eggy Party Stainless Steel Thermal Mug</p>
</a>
</li>
<li>
<a title="Sample" href="" target="_blank">
<img src="https://i.imgur.com/wj8tIdw.png">
<p>Sample</p>
</a>
</li>
<li>
<a title="Sample" href="" target="_blank">
<img src="https://i.imgur.com/wj8tIdw.png">
<p>Sample</p>
</a>
</li>
<li>
<a title="Sample" href="" target="_blank">
<img src="https://i.imgur.com/wj8tIdw.png">
<p>Sample</p>
</a>
</li>
</ul>
</div>

</section>

{% include carousel.html id="portfolio-carousel" title="Portfolio" %}
<script src="{{ '/static/carousel.js' | relative_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize Portfolio Carousel
    new CarouselManager('portfolio-carousel', 'https://www.artstation.com/celozaga.rss', 'portfolio').init();
  });
</script>
