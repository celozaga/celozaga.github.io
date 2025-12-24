/**
 * Carousel Manager
 * Handles fetching RSS data and rendering card carousels.
 */

class CarouselManager {
    /**
     * @param {string} containerId - DOM ID of the carousel track container
     * @param {string} feedUrl - RSS Feed URL
     * @param {string} type - 'portfolio' (ArtStation) or 'youtube'
     */
    constructor(containerId, feedUrl, type = 'portfolio') {
        this.container = document.getElementById(containerId);
        this.feedUrl = feedUrl;
        this.type = type;
        this.proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);
    }

    async init() {
        if (!this.container) return;

        this.renderLoading();

        try {
            const response = await fetch(this.proxyUrl);
            const data = await response.json();

            if (data.status === 'ok') {
                this.clearContainer();
                this.renderItems(data.items);
            } else {
                throw new Error('RSS status not ok');
            }
        } catch (error) {
            console.error(`Carousel Error (${this.type}):`, error);
            this.renderError();
        }
    }

    renderLoading() {
        this.container.innerHTML = `
      <div class="carousel-loading">
        <div class="spinner" style="width:30px;height:30px;border:3px solid rgba(255,255,255,0.1);border-top-color:var(--primary-color);border-radius:50%;animation:spin 1s linear infinite;"></div>
      </div>`;
    }

    renderError() {
        this.container.innerHTML = `
      <div class="carousel-error">
        <p>Failed to load content.</p>
      </div>`;
    }

    clearContainer() {
        this.container.innerHTML = '';
    }

    renderItems(items) {
        items.forEach(item => {
            const card = this.createCard(item);
            if (card) {
                this.container.appendChild(card);
            }
        });
    }

    createCard(item) {
        let imgSrc = '';
        let link = item.link;
        let title = item.title;

        if (this.type === 'portfolio') {
            // ArtStation RSS logic
            imgSrc = item.thumbnail || item.enclosure?.link;
            if (!imgSrc && item.content) {
                const match = item.content.match(/src="([^"]+)"/);
                if (match) imgSrc = match[1];
            }
        } else if (this.type === 'youtube') {
            // YouTube RSS logic
            let videoId = '';
            const linkMatch = item.link.match(/v=([^&]+)/);
            if (linkMatch) videoId = linkMatch[1];

            imgSrc = videoId
                ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
                : (item.thumbnail || item.enclosure?.link);
        }

        if (!imgSrc) return null;

        const card = document.createElement('a');
        card.href = link;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'carousel-item';

        card.innerHTML = `
      <div class="image-wrapper">
        <img src="${imgSrc}" alt="${title}" loading="lazy">
        ${this.type === 'youtube' ? this.playIcon() : ''}
      </div>
      <div class="item-info">
        <h3>${title}</h3>
      </div>
    `;

        return card;
    }

    playIcon() {
        return `
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:40px; height:40px; background:rgba(0,0,0,0.7); border-radius:50%; display:flex; align-items:center; justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M8 5v14l11-7z"/></svg>
      </div>`;
    }
}

// Auto-initialize carousels defined in global config if needed, 
// OR just expose the class globally.
window.CarouselManager = CarouselManager;
