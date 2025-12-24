---
layout: default
title: Portfolio - Celo Zaga
description: ArtStation portfolio and latest works by Celo Zaga.
permalink: /portfolio/
---

<div class="container">
    <section class="section">
        <h1>Portfolio</h1>
        <p>Latest works from my <a href="https://www.artstation.com/celozaga" target="_blank" rel="noopener noreferrer">ArtStation</a>.</p>
        
        <div id="loading-portfolio" class="loading-spinner">
            <div class="spinner"></div>
        </div>

        <div id="portfolio-grid" class="portfolio-grid">
            <!-- Items loaded via JS -->
        </div>

        <div id="portfolio-error" class="hidden" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">
            <p>Failed to load portfolio. <a href="https://www.artstation.com/celozaga" target="_blank">Visit ArtStation</a></p>
        </div>
    </section>
</div>

<script src="{{ '/static/portfolio.js' | absolute_url }}"></script>
