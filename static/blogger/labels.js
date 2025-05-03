
// Script para carregar posts por label
function loadLabelPosts(label, containerSelector) {
  const labelPostsContainer = document.querySelector(containerSelector);
  if (!labelPostsContainer) return;

  window.displayLabelPosts = function(posts) {
    if (!posts.feed || !posts.feed.entry) return;

    posts.feed.entry.forEach(post => {
      const thumbContainer = document.createElement('div');
      thumbContainer.classList.add('thumb-container');

      const thumbnail = document.createElement('img');
      thumbnail.src = post.media$thumbnail.url.replace('s72-c', 'w400-h200-p-k-no-nu');
      thumbContainer.appendChild(thumbnail);

      const textContent = document.createElement('div');
      textContent.classList.add('text-content');

      const title = document.createElement('h3');
      title.classList.add('post-title');
      title.innerHTML = post.title.$t;
      textContent.appendChild(title);

      const summary = document.createElement('p');
      summary.innerHTML = post.summary.$t;
      textContent.appendChild(summary);

      const labelPostLink = document.createElement('a');
      labelPostLink.href = post.link[post.link.length - 1].href;
      labelPostLink.classList.add('label-post-link');

      const labelPost = document.createElement('li');
      labelPost.classList.add('label-post');

      labelPostLink.appendChild(thumbContainer);
      labelPostLink.appendChild(textContent);
      labelPost.appendChild(labelPostLink);
      labelPostsContainer.appendChild(labelPost);
    });
  };

  const script = document.createElement('script');
  script.src = `/feeds/posts/summary/-/${label}?max-results=5&alt=json-in-script&callback=displayLabelPosts`;
  document.body.appendChild(script);
}

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
