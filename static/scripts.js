// ======================
// Função para alternar seções e tabs
// ======================

/**
 * Mostra a seção correspondente e marca a tab clicada como ativa.
 * @param {Event} event - O evento de clique.
 * @param {string} sectionId - O ID da seção a ser exibida.
 */
function showSection(event, sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove a classe 'active' de todas as tabs
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Exibe a seção desejada
    document.getElementById(sectionId).classList.add('active');

    // Marca a tab clicada como ativa
    event.currentTarget.classList.add('active');
}

// ======================
// Função para buscar e exibir vídeos do YouTube
// ======================

/**
 * Busca os últimos 5 vídeos de um canal do YouTube e os exibe na página.
 */
fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCvOnTTQp_7ZXtWUZYEUZO7Q')
  .then(response => response.json())
  .then(data => {
    const videos = data.items.slice(0, 5); // Limita para os 5 primeiros vídeos
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

// ======================
// Feed de Postagens do Bluesky
// ======================

  document.addEventListener("DOMContentLoaded", function () {
    const feedUrl = "https://granary.io/bluesky/celozaga.bsky.social/@self/@app/?format=jsonfeed&user_id=celozaga.bsky.social&app_password=3jek-joy4-fdi5-dvfn";

    fetch(feedUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            const feedContainer = document.getElementById('feed-bluesky');
            data.items.forEach(item => {
                feedContainer.appendChild(createPostElement(item));
            });
        })
        .catch(error => {
            console.error('Error fetching feed:', error);
            document.getElementById('feed-bluesky').innerHTML = '<p>Failed to load feed. Please try again later.</p>';
        });
});

// Função principal para criar um post
function createPostElement(item) {
    const postElement = document.createElement('li');
    postElement.classList.add('post');

    const postLink = document.createElement('a');
    postLink.href = item.url;
    postLink.target = "_blank";
    postLink.rel = "noopener noreferrer";

    // Adiciona os elementos de conteúdo, imagem e data
    postLink.appendChild(createContentElement(item));
    if (item.image && isValidUrl(item.image)) {
        postLink.appendChild(createImageElement(item.image));
    }
    postLink.appendChild(createDateElement(item.date_published));

    postElement.appendChild(postLink);
    return postElement;
}

// Função para criar o elemento de conteúdo
function createContentElement(item) {
    const contentElement = document.createElement('div');
    contentElement.classList.add('content');

    const paragraphElement = document.createElement('p');
    paragraphElement.innerHTML = item.content_html || item.content_text || "No content available.";

    contentElement.appendChild(paragraphElement);
    return contentElement;
}

// Função para criar o elemento de imagem
function createImageElement(imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    return imageElement;
}

// Função para criar o elemento de data
function createDateElement(dateString) {
    const dateElement = document.createElement('div');
    dateElement.classList.add('date');
    dateElement.innerText = new Date(dateString).toLocaleString();
    return dateElement;
}

// Função para validar URLs de imagem
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
