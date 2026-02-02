document.addEventListener('DOMContentLoaded', loadPortfolio);

async function loadPortfolio() {
    const rssUrl = 'https://www.artstation.com/celozaga.rss';
    const proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);
    const grid = document.getElementById('portfolio-grid');
    const spinner = document.getElementById('loading-portfolio');
    const errorMsg = document.getElementById('portfolio-error');

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            spinner.style.display = 'none';

            data.items.forEach(item => {
                // Determine image source - usually in description or enclosure
                // rss2json extracts enclosure as 'enclosure' or thumbnail as 'thumbnail'
                // ArtStation RSS puts the main image in 'enclosure'
                let imgSrc = item.thumbnail || item.enclosure?.link;

                // Fallback: try to regex text within content if no enclosure
                if (!imgSrc && item.content) {
                    const match = item.content.match(/src="([^"]+)"/);
                    if (match) imgSrc = match[1];
                }

                if (imgSrc) {
                    const card = document.createElement('a');
                    card.href = item.link;
                    card.target = '_blank';
                    card.rel = 'noopener noreferrer';
                    card.className = 'portfolio-item';

                    card.innerHTML = `
                        <div class="image-wrapper">
                            <img src="${imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="item-info">
                            <h3>${item.title}</h3>
                        </div>
                    `;

                    grid.appendChild(card);
                }
            });
        } else {
            throw new Error('RSS fetch failed');
        }
    } catch (e) {
        console.error('Portfolio Error:', e);
        spinner.style.display = 'none';
        errorMsg.classList.remove('hidden');
    }
}
