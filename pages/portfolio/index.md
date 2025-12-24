---
layout: default
title: Portfolio
description: ArtStation portfolio and latest works by Celo Zaga.
permalink: /portfolio/
---
    <section class="section">
        <h1 style="display:none;">Portfolio</h1>
        <div id="loading-portfolio" class="loading-spinner">
            <div class="spinner"></div>
        </div>

        <div id="portfolio-grid" class="portfolio-grid">
            <!-- Items loaded via JS -->
        </div>

        <div id="portfolio-error" class="hidden" style="text-align: center; color: var(--text-muted); margin-top: 2rem;">
            <p>Failed to load portfolio. <a href="https://www.artstation.com/celozaga" target="_blank">Visit ArtStation</a></p>
        </div>

        <div class="portfolio-actions" style="text-align: center; margin-top: var(--spacing-lg);">
            <a href="https://www.artstation.com/celozaga" target="_blank" rel="noopener noreferrer" class="btn">
                Ver mais no ArtStation
            </a>
        </div>
    </section>

<script src="{{ '/static/portfolio.js' | absolute_url }}"></script>
