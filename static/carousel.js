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
  /**
   * @param {string} containerId - DOM ID of the carousel track container
   * @param {string} feedUrl - RSS Feed URL or Bluesky Handle
   * @param {string} type - 'portfolio', 'youtube', or 'bluesky'
   */
  constructor(containerId, feedUrl, type = 'portfolio') {
    this.container = document.getElementById(containerId);
    this.feedUrl = feedUrl;
    this.type = type;

    if (this.type === 'bluesky') {
      // feedUrl is the handle (e.g. celozaga.bsky.social)
      this.proxyUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${feedUrl}`;
    } else {
      this.proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feedUrl);
    }
  }

  async init() {
    if (!this.container) return;

    this.renderLoading();

    try {
      const response = await fetch(this.proxyUrl);
      const data = await response.json();

      if (this.type === 'bluesky') {
        if (data.feed) {
          this.clearContainer();
          this.renderItems(data.feed); // Bluesky items are in data.feed
        } else {
          throw new Error('Bluesky feed not found');
        }
      } else {
        // RSS to JSON
        if (data.status === 'ok') {
          this.clearContainer();
          this.renderItems(data.items);
        } else {
          throw new Error('RSS status not ok');
        }
      }
    } catch (error) {
      console.error(`Carousel Error (${this.type}):`, error);
      this.renderError();
    }
  }

  // ... renderLoading, renderError, clearContainer ...

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
    let link = '';
    let title = '';

    if (this.type === 'bluesky') {
      // Bluesky Logic
      const post = item.post;
      if (!post) return null;

      // Extract Image (Embed images or video thumbnail)
      if (post.embed && post.embed.images && post.embed.images.length > 0) {
        imgSrc = post.embed.images[0].thumb;
      } else if (post.embed && post.embed.thumbnail) {
        imgSrc = post.embed.thumbnail; // External link thumbnail
      }

      // Extract Title (Text)
      title = post.record.text || 'Bluesky Post';

      // Construct Link
      const handle = post.author.handle;
      const rkey = post.uri.split('/').pop();
      link = `https://bsky.app/profile/${handle}/post/${rkey}`;

    } else if (this.type === 'portfolio') {
      // ArtStation RSS logic
      link = item.link;
      title = item.title;
      imgSrc = item.thumbnail || item.enclosure?.link;
      if (!imgSrc && item.content) {
        const match = item.content.match(/src="([^"]+)"/);
        if (match) imgSrc = match[1];
      }
    } else if (this.type === 'youtube') {
      // YouTube RSS logic
      link = item.link;
      title = item.title;
      let videoId = '';
      const linkMatch = item.link.match(/v=([^&]+)/);
      if (linkMatch) videoId = linkMatch[1];

      imgSrc = videoId
        ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
        : (item.thumbnail || item.enclosure?.link);
    }

    if (!imgSrc) return null; // We only show items with images in this carousel

    const card = document.createElement('a');
    card.href = link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'carousel-item';

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${imgSrc}" alt="${title}" loading="lazy">
        ${this.type === 'youtube' ? this.playIcon() : ''}
        ${this.type === 'bluesky' ? this.blueskyIcon() : ''}
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

  blueskyIcon() {
    return `
      <div style="position:absolute; top:10px; right:10px; width:24px; height:24px; background:rgba(0,0,0,0.5); border-radius:50%; display:flex; align-items:center; justify-content:center;">
        <svg fill="white" viewBox="0 0 24 24" width="16" height="16"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.553 1.724 0 2.36 0 2.96c0 6.535 3.731 15.549 11.234 19.34.466-2.433.466-8.9.766-11.5zM12 10.8c1.087-2.114 4.046-6.053 6.798-7.995 2.636-1.861 3.642-1.539 4.301-1.24.349.159.902.795.902 1.395 0 6.535-3.731 15.549-11.234 19.34-.466-2.433-.466-8.9-.766-11.5z"></path></svg>
      </div>
      `;
  }

}

// Auto-initialize carousels defined in global config if needed, 
// OR just expose the class globally.
window.CarouselManager = CarouselManager;
