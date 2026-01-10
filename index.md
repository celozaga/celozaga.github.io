---
layout: default
title: Celo Zaga
description: Connect with Celo Zaga on Discord, YouTube, Bluesky, and other platforms. Explore gaming content and more.
permalink: /
---

<section class="section featured" id="featured">
<h2 style="display:none;">Featured</h2>

<div class="slideshow" id="slideshow">
  <div class="slides">
    {% assign sorted_slides = site.slides | sort: "order" %}
    {% for slide in sorted_slides %}
    <div class="slide" style="background-image: url('{{ slide.image }}');">
      <span class="slide-content">
        <p>{{ slide.description }}</p>
        <a href="{{ slide.link }}" class="btn">{{ slide.button_text }}</a>
      </span>
    </div>
    {% endfor %}
  </div>

  <button class="slideshow-button slideshow-button-prev">
    <svg viewBox="0 0 24 24">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>
  </button>

  <button class="slideshow-button slideshow-button-next">
    <svg viewBox="0 0 24 24">
      <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
    </svg>
  </button>

  <div class="slideshow-dots"></div>
</div>
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
<div id="video-grid" class="portfolio-grid"></div>
<div id="loading-videos" class="loading-spinner">
  <div class="spinner"></div>
</div>
<div id="video-error" class="hidden" style="text-align:center; padding:20px; color:var(--text-muted);">
  <p>Failed to load videos.</p>
</div>
</section>

<section class="section store" id="store">
<a href="/shop"><h2><span>Shop</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg></h2></a>

<div class="carousel"> 
<ul>
  {% assign sorted_store = site.store | sort: "order" %}
  {% for item in sorted_store %}
  <li>
  <a title="{{ item.title }}" href="{{ item.url }}" target="_blank">
  <img src="{{ item.image }}" alt="{{ item.title }}">
  <p>{{ item.title }}</p>
  {% if item.price %}
  <p class="price">{{ item.price }}</p>
  {% endif %}
  </a>
  </li>
  {% endfor %}
</ul>
</div>

</section>

{% include carousel.html id="portfolio-carousel" title="Portfolio" %}
<script src="{{ '/static/carousel.js' | relative_url }}"></script>
<script src="{{ '/static/slideshow.js' | relative_url }}"></script>
<script src="{{ '/static/videos.js' | relative_url }}"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize Portfolio Carousel
    new CarouselManager('portfolio-carousel', 'https://www.artstation.com/celozaga.rss', 'portfolio').init();
  });
</script>
