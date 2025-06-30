---
layout: default
title: Celo Zaga
description: Connect with Celo Zaga on Discord, YouTube, Bluesky, and other platforms. Explore gaming content and more.
---



<section class="section links active" id="links">
    <h2>Links</h2>
    <ul>
        <li><a title="Discord" href="https://discord.com/invite/gHEHaxtwBT" target="_blank"><img src="{{ '/static/media/icons/discord.svg' | relative_url }}" alt="Discord"><p>Discord</p></a></li>
        <li><a title="YouTube" href="https://www.youtube.com/@CeloZaga?sub_confirmation=1" target="_blank"><img src="{{ '/static/media/icons/youtube.svg' | relative_url }}" alt="YouTube"><p>YouTube</p></a></li>
        <li><a title="Bluesky" href="https://bsky.app/profile/celozaga.bsky.social" target="_blank"><img src="{{ '/static/media/icons/bluesky.svg' | relative_url }}" alt="Bluesky"><p>Bluesky</p></a></li>
        <li><a title="Threads" href="https://threads.net/@CeloZaga" target="_blank"><img src="{{ '/static/media/icons/threads.svg' | relative_url }}" alt="Threads"><p>Threads</p></a></li>
        <li><a title="Instagram" href="https://instagram.com/CeloZaga" target="_blank"><img src="{{ '/static/media/icons/instagram.svg' | relative_url }}" alt="Instagram"><p>Instagram</p></a></li>
        <li><a title="Facebook" href="https://www.facebook.com/CeloZaga" target="_blank"><img src="{{ '/static/media/icons/facebook.svg' | relative_url }}" alt="Facebook"><p>Facebook</p></a></li>
        <li><a title="TikTok" href="https://www.tiktok.com/@CeloZaga" target="_blank"><img src="{{ '/static/media/icons/tiktok.svg' | relative_url }}" alt="TikTok"><p>TikTok</p></a></li>
        <li><a title="Reddit" href="https://reddit.com/u/Celo-Zaga" target="_blank"><img src="{{ '/static/media/icons/reddit.svg' | relative_url }}" alt="Reddit"><p>Reddit</p></a></li>
        <li><a title="X" href="https://x.com/CeloZaga" target="_blank"><img src="{{ '/static/media/icons/x.svg' | relative_url }}" alt="X"><p>X</p></a></li>
    </ul>
</section>

<section class="section news" id="news">
    <h2>News</h2>
    <ul id="feed-bluesky"></ul>
    <div class="button button-link"><a href="https://bsky.app/profile/celozaga.bsky.social" target="_blank">Read more on Bluesky</a></div>
</section>

<section class="section videos" id="videos">
    <h2>Videos</h2>
    <ul class="feed-youtube"></ul>
    <div class="button button-link"><a href="https://www.youtube.com/@CeloZaga" target="_blank">Watch more on YouTube</a></div>
</section>

{# NOVA SEÇÃO PARA OS POSTS DO BLOG #}
<section class="section blog-posts" id="blog-posts">
    <h2>Últimos Posts do Blog</h2>
    <div class="post-list">
        <ul>
        {% for post in paginator.posts %}
            <li>
                <a href="{{ post.url | relative_url }}">{{ post.title }}
                <small>— {{ post.date | date: "%d %b %Y" }}</small>
                </a>
            </li>
        {% endfor %}
        </ul>
    </div>

    <div class="pagination">
        {% if paginator.previous_page %}
            <a href="{{ paginator.previous_page_path | relative_url }}" class="previous-page">&laquo; Anterior</a>
        {% else %}
            <span class="previous-page disabled">&laquo; Anterior</span>
        {% endif %}

        <span class="page_number ">Página {{ paginator.page }} de {{ paginator.total_pages }}</span>

        {% if paginator.next_page %}
            <a href="{{ paginator.next_page_path | relative_url }}" class="next-page">Próxima &raquo;</a>
        {% else %}
            <span class="next-page disabled">Próxima &raquo;</span>
        {% endif %}
    </div>
</section>

