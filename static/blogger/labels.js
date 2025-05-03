// ========== ANNOUNCEMENTS SECTION SCRIPT ==========
function populateAnnouncementPosts(data) {
  var container = document.querySelector(".announcement-posts-container");
  if (!data || !data.feed || !data.feed.entry) {
    container.innerHTML = "<p>Sem anúncios por enquanto.</p>";
    return;
  }

  data.feed.entry.forEach(function(post) {
    var link = post.link.find(l => l.rel === "alternate").href;
    var title = post.title.$t;
    var thumb = post.media$thumbnail ? post.media$thumbnail.url.replace("s72-c", "w800-h600-p-k-no-nu") : "";

    var div = document.createElement("li");
    div.className = "announcement-post";
    div.innerHTML = ` 
      <a class="announcement-link" href="${link}">
        <img src="${thumb}" alt="${title}" />
        <h3>${title}</h3>
      </a>
    `;
    container.appendChild(div);
  });
}

function fetchAnnouncementPosts() {
  var callbackName = "displayAnnouncementPosts";
  window[callbackName] = function(data) {
    populateAnnouncementPosts(data);
    delete window[callbackName];
  };

  var script = document.createElement("script");
  script.src = "/feeds/posts/summary/-/Announcements?alt=json-in-script&callback=" + callbackName + "&max-results=5";
  document.body.appendChild(script);
}

document.addEventListener("DOMContentLoaded", fetchAnnouncementPosts);

// ========== LABEL POSTS SECTION SCRIPT ==========
function displayLabelPosts() {
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
      if (!data || !data.feed || !data.feed.entry) {
        containerList.innerHTML = "<li>No posts found.</li>";
        return;
      }

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
        summary.innerHTML = post.summary.$t || "";
        text.appendChild(summary);

        link.appendChild(imgWrapper);
        link.appendChild(text);
        li.appendChild(link);
        containerList.appendChild(li);
      });
    };
  });
}

document.addEventListener("DOMContentLoaded", function() {
  displayLabelPosts(); // Inicia a exibição dos posts para todas as labels
});
