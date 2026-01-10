---
layout: default
title: Shop
description: Recommended products and apps.
permalink: /shop
---

<div class="container">
    <section class="section shop apps carousel-list" id="shop">
        <h2>Apps</h2>
        <ul>
        <li><a title="Sample" href="/store/apps/totopia"><img src="https://i.imgur.com/D5fNE8Y.png"/><p>Totopia</p></a></li>
        <li><a title="Sample" href="/store/apps/eggy-party"><img src="https://i.imgur.com/x5gglbX.png"/><p>Eggy Party</p></a></li>
        <li><a title="Sample" href="/store/apps/spirit-crossing"><img src="https://i.imgur.com/jogDRHu.png"/><p>Spirit Crossing</p></a></li>
        <li><a title="Sample" href="/store/apps/supernatural-squad"><img src="https://i.imgur.com/QCtDyPR.png"/><p>Supernatural Squad</p></a></li>
        <li><a title="Sample" href="/store/apps/ldplayer"><img src="https://i.imgur.com/pHAVUFK.png"/><p>LDPlayer</p></a></li>
        <li><a title="Sample" href="/store/apps/gearup-booster"><img src="https://i.imgur.com/2Ur3sgr.jpeg"/><p>GearUP Booster</p></a></li>
        </ul>
        <h2>Shop</h2>
        <ul>
        {% assign sorted_store = site.store | sort: "order" %}
        {% for item in sorted_store %}
        <li>
          <a title="{{ item.title }}" href="{{ item.url }}" target="_blank">
            <img src="{{ item.image }}" alt="{{ item.title }}"/>
            <p>{{ item.title }}</p>
            {% if item.price %}
            <p class="price">{{ item.price }}</p>
            {% endif %}
          </a>
        </li>
        {% endfor %}
        </ul>
    </section>
</div>
