// Script exclusivo para a seção de Announcements (antigo highlights)
function loadAnnouncements(containerSelector) {
  const highlightContainer = document.querySelector(containerSelector);
  if (!highlightContainer) return;

  window.displayHighlights = function(posts) {
    if (!posts.feed || !posts.feed.entry) return;

    posts.feed.entry.forEach(post => {
      const postEl = document.createElement('div');
      postEl.classList.add('highlight-post');

      const img = document.createElement('img');
      img.src = post.media$thumbnail.url.replace('s72-c', 'w800-h600-p-k-no-nu');
      postEl.appendChild(img);

      const title = document.createElement('h3');
      title.innerHTML = post.title.$t;
      postEl.appendChild(title);

      const summary = document.createElement('p');
      summary.innerHTML = post.summary.$t;
      postEl.appendChild(summary);

      const link = document.createElement('a');
      link.href = post.link[post.link.length - 1].href;
      link.textContent = 'Leia mais';
      postEl.appendChild(link);

      highlightContainer.appendChild(postEl);
    });
  };

  const script = document.createElement('script');
  script.src = `/feeds/posts/summary/-/Announcements?max-results=3&alt=json-in-script&callback=displayHighlights`;
  document.body.appendChild(script);
}


// ========== LABEL POSTS SECTION SCRIPT ==========
function displayLabelPosts(posts) {
  const containers = document.querySelectorAll('[data-label]');
  if (!containers.length) return;

  containers.forEach(container => {
    const label = container.getAttribute('data-label');
    const containerList = container.querySelector('.label-posts-container');
    if (!containerList) return;

    const script = document.createElement('script');
    script.src = `/feeds/posts/summary/-/${encodeURIComponent(label)}?max-results=5&alt=json-in-script&callback=populateLabelPosts_${label.replace(/\W/g, '')}`;
    document.body.appendChild(script);

    window[`populateLabelPosts_${label.replace(/\W/g, '')}`] = function(data) {
      data.feed.entry.forEach(post => {
        const li = document.createElement('li');
        li.classList.add('label-post');

        const link = document.createElement('a');
        link.href = post.link[post.link.length - 1].href;
        link.classList.add('label-post-link');

        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('thumb-container');

        const img = document.createElement('img');
        img.src = post.media$thumbnail.url.replace('s72-c', 'w400-h200-p-k-no-nu');
        imgWrapper.appendChild(img);

        const text = document.createElement('div');
        text.classList.add('text-content');

        const title = document.createElement('h3');
        title.classList.add('post-title');
        title.innerHTML = post.title.$t;
        text.appendChild(title);

        const summary = document.createElement('p');
        summary.innerHTML = post.summary.$t;
        text.appendChild(summary);

        link.appendChild(imgWrapper);
        link.appendChild(text);
        li.appendChild(link);
        containerList.appendChild(li);
      });
    };
  });
}
