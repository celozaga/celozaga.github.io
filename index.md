---
layout: default
title: Celo Zaga - Official Website
description: Connect with Celo Zaga on Discord, YouTube, Bluesky, and other platforms. Explore gaming content and more.
permalink: /
---

<section class="section social-media-tab button-links" id="links">
    <h2>Links</h2>
    <ul>
        <li><a title="Discord" href="https://discord.com/invite/{{ site.social.discord }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/discord.svg" alt="Discord"><p>Discord</p></a></li>
        <li><a title="YouTube" href="https://www.youtube.com/@{{ site.social.youtube }}?sub_confirmation=1" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/youtube.svg" alt="YouTube"><p>YouTube</p></a></li>
        <li><a title="TikTok" href="https://www.tiktok.com/@{{ site.social.tiktok }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/tiktok.svg" alt="TikTok"><p>TikTok</p></a></li>
        <li><a title="Bluesky" href="https://bsky.app/profile/{{ site.social.bluesky }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/bluesky.svg" alt="Bluesky"><p>Bluesky</p></a></li>
        <li><a title="X/.githubTwitter" href="https://x.com/{{ site.social.x }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/x.svg" alt="X"><p>X</p></a></li>
        <li><a title="Threads" href="https://threads.com/@{{ site.social.tiktok }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/threads.svg" alt="Threads"><p>Threads</p></a></li>
        <li><a title="Facebook" href="https://www.facebook.com/{{ site.social.facebook }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/facebook.svg" alt="Facebook"><p>Facebook</p></a></li>
        <li><a title="Reddit" href="https://reddit.com/r/{{ site.social.reddit }}" target="_blank" rel="noopener noreferrer"><img src="static/media/icons/reddit.svg" alt="Reddit"><p>Reddit</p></a></li>  
    </ul>
</section>

<section class="section videos" id="videos">
<ul class="feed-youtube"></ul>
<script>
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCvOnTTQp_7ZXtWUZYEUZO7Q')
  .then(response => response.json())
  .then(data => {
    const videos = data.items.slice(0, 5);
    const videoList = document.querySelector('.feed-youtube');

    videos.forEach(video => {
      const { link, thumbnail, title } = video;

      // Obtém o ID do vídeo
      const videoId = link.split('=')[1];

      // Substitui 'hqdefault' por 'maxresdefault' na URL da thumbnail
      const updatedThumbnail = thumbnail.replace('hqdefault', 'maxresdefault');

      // Cria o item da lista
      const li = `
        <li>
          <a href="${link}" title="${title}" target="_blank">
            <div class="image-container">
              <img src="${updatedThumbnail}" alt="${title}">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
                <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
              </svg>
            </div>
            <h3>${title}</h3>
          </a>
        </li>
      `;

      // Adiciona o item da lista à página
      videoList.innerHTML += li;
    });
  });
    
</script>
</section>

<section class="section posts blog-posts-homepage" id="posts">
    <h2>Latest Posts</h2>
    <div id="posts-container-home" class="post-list"></div>
    <div class="pagination-controls" id="pagination-controls-home" style="display: none;">
      <button id="prev-page-home" disabled>&laquo; Prev</button>
      <span id="page-info-home">Page 1 de 1</span>
      <button id="next-page-home" disabled>Next &raquo;</button>
    </div>
</section>