// ========== HIGHLIGHTS SECTION SCRIPT ==========
function displayHighlights(posts) {
  const container = document.querySelector('.announcements-posts-container');
  if (!container) return;

  posts.feed.entry.forEach(post => {
    const li = document.createElement('li');
    li.classList.add('highlight-post');

    const link = document.createElement('a');
    link.href = post.link[post.link.length - 1].href;
    link.classList.add('highlight-post-link');

    const img = document.createElement('img');
    img.src = post.media$thumbnail.url.replace('s72-c', 'w800-h600-p-k-no-nu');

    const title = document.createElement('h3');
    title.classList.add('post-title');
    title.innerHTML = post.title.$t;

    link.appendChild(img);
    link.appendChild(title);
    li.appendChild(link);
    container.appendChild(li);
  });
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
