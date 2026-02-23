---
layout: default
title: Store
permalink: /store/
---

<div class="container section">
    <h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" /></svg>
        Apps & Games
    </h1>
    <div class="portfolio-grid">
        {% for item in site.store %}
        {% if item.category == 'App' %}
        <a href="{{ item.url | relative_url }}" class="portfolio-item">
            <div class="image-wrapper">
                <img src="{{ item.image }}" alt="{{ item.title }}" loading="lazy">
            </div>
            <div class="item-info">
                <h3>{{ item.title }}</h3>
                <p style="margin: 5px 0 0; color: #2ecc71; font-weight: bold;">{{ item.price }}</p>
            </div>
        </a>
        {% endif %}
        {% endfor %}
    </div>

    <h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M12 13H11V11H12C12.55 11 13 10.55 13 10V9C13 8.45 12.55 8 12 8H9V6H12C13.66 6 15 7.34 15 9V10C15 11.1 14.1 12 13 12H12M11 16H13V14H11V16Z" /></svg>
        Products
    </h1>
    <div class="portfolio-grid">
        {% for item in site.store %}
        {% if item.category != 'App' %}
        <a href="{{ item.url | relative_url }}" class="portfolio-item">
            <div class="image-wrapper">
                <img src="{{ item.image }}" alt="{{ item.title }}" loading="lazy">
            </div>
            <div class="item-info">
                <h3>{{ item.title }}</h3>
                <p style="margin: 5px 0 0; color: #2ecc71; font-weight: bold;">{{ item.price }}</p>
            </div>
        </a>
        {% endif %}
        {% endfor %}
    </div>
</div>
