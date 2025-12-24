document.addEventListener('DOMContentLoaded', loadVideos);

async function loadVideos() {
    const rssUrl = 'https://www.youtube.com/feeds/videos.xml?user=celozaga';
    const proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);
    const grid = document.getElementById('video-grid');
    const spinner = document.getElementById('loading-videos');
    const errorMsg = document.getElementById('video-error');

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            spinner.style.display = 'none';

            data.items.forEach(item => {
                // Determine image source - rss2json usually returns 'thumbnail' for YouTube
                // YouTube max res thumbnail: https://i.ytimg.com/vi/[VIDEO_ID]/maxresdefault.jpg
                // We can extract ID from link or guid

                let videoId = '';
                const linkMatch = item.link.match(/v=([^&]+)/);
                if (linkMatch) videoId = linkMatch[1];

                const imgSrc = videoId
                    ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` // mqdefault is 320x180 (16:9), safe for grid
                    : (item.thumbnail || item.enclosure?.link);

                const card = document.createElement('a');
                card.href = item.link;
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                card.className = 'portfolio-item';

                card.innerHTML = `
                    <div class="image-wrapper">
                        <img src="${imgSrc}" alt="${item.title}" loading="lazy">
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:40px; height:40px; background:rgba(0,0,0,0.7); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                    <div class="item-info">
                        <h3>${item.title}</h3>
                    </div>
                `;

                grid.appendChild(card);
            });
        } else {
            throw new Error('RSS fetch failed');
        }
    } catch (e) {
        console.error('Videos Error:', e);
        spinner.style.display = 'none';
        errorMsg.classList.remove('hidden');
    }
}
