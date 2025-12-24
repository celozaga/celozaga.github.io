---
layout: default
title: Videos
description: Latest videos from Celo Zaga on YouTube.
permalink: /videos/
---
<section class="section">
    <h1 style="display:none;">Videos</h1>
    <div id="loading-videos" class="loading-spinner">
        <div class="spinner"></div>
    </div>
    <div id="video-grid" class="portfolio-grid">
        <!-- Items loaded via JS -->
    </div>
    <div id="video-error" class="hidden" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">
        <p>Failed to load videos. <a href="https://www.youtube.com/@celozaga" target="_blank">Visit YouTube</a></p>
    </div>
    <div class="portfolio-actions" style="text-align: center; margin-top: var(--spacing-lg);">
        <a href="https://www.youtube.com/@celozaga" target="_blank" rel="noopener noreferrer" class="btn">See more on YouTube</a>
    </div>
</section>
<script src="{{ '/static/videos.js' | absolute_url }}"></script>
