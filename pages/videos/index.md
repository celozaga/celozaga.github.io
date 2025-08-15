---
layout: default
title: Videos
permalink: /videos/
---

<section class="section videos" id="videos">
    <ul class="feed-youtube"></ul>
</section>

<script>
// ======================
// Função para buscar e exibir vídeos do YouTube
// ======================

/**
 * Busca os últimos 5 vídeos de um canal do YouTube e os exibe na página.
 */
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCvOnTTQp_7ZXtWUZYEUZO7Q')
  .then(response => response.json())
  .then(data => {
    const videos = data.items.slice(0, 9); // Limita para os 5 primeiros vídeos
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