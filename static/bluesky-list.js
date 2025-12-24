/**
 * Bluesky List Fetcher
 * Fetches latest 5 posts from Bluesky and renders them as a text list.
 */

async function loadBlueskyList(containerId, handle) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const proxyUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=5`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.feed && Array.isArray(data.feed)) {
            container.innerHTML = '';
            const items = data.feed.slice(0, 5); // Ensure max 5

            items.forEach(item => {
                const post = item.post;
                if (!post) return;

                const text = post.record.text;
                if (!text) return; // Skip posts without text? Or show generic?

                const rkey = post.uri.split('/').pop();

                // Construct Internal Link
                // Format: /YYYY/MM/DD/slug-rkey.html
                const createdDate = new Date(post.record.createdAt);
                const year = createdDate.getFullYear();
                const month = String(createdDate.getMonth() + 1).padStart(2, '0');
                const day = String(createdDate.getDate()).padStart(2, '0');

                const slug = slugify(text);
                const link = `https://celozaga.github.io/${year}/${month}/${day}/${slug}-${rkey}.html`;

                const li = document.createElement('li');
                li.className = 'post-list-item';

                li.innerHTML = `
          <a href="${link}" target="_blank" rel="noopener noreferrer">
            <span class="post-title">${text}</span>
            <span class="icon-external">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </span>
          </a>
        `;
                container.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Bluesky List Error:', error);
        container.innerHTML = '<li style="color:var(--text-muted)">Failed to load posts.</li>';
    }
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/-+/g, '-');         // Replace multiple - with single -
}

// Auto-run if configured
// document.addEventListener('DOMContentLoaded', () => loadBlueskyList('bluesky-list', 'celozaga.bsky.social'));
