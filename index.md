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

<section class="section bluesky" id="bluesky">
<h2>Bluesky</h2>
<ul>
</ul>
</section>

<section class="section apps" id="apps">
<h2>Apps</h2>
<ul>
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
    // ArtStation Feed: https://www.artstation.com/celozaga.rss
    new CarouselManager('portfolio-carousel', 'https://www.artstation.com/celozaga.rss', 'portfolio').init();
  });
</script>
