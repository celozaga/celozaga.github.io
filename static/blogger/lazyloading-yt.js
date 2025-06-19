
document.addEventListener("DOMContentLoaded", function () {
  const originalIframes = document.querySelectorAll("iframe.BLOG_video_class");

  originalIframes.forEach(original => {
    const videoId = original.getAttribute("youtube-src-id");
    if (!videoId) return;

    // Cria container
    const wrapper = document.createElement("div");
    wrapper.className = "youtube-lazy";
    wrapper.setAttribute("data-id", videoId);

    // Cria thumbnail
    const thumb = document.createElement("div");
    thumb.className = "youtube-thumb";
    thumb.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;

    // Botão
    const button = document.createElement("button");
    button.className = "play-btn";
    button.setAttribute("aria-label", "Assistir vídeo");

    thumb.appendChild(button);
    wrapper.appendChild(thumb);

    // Fallback SEO (Googlebot)
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${videoId}" 
        loading="lazy"
        allowfullscreen 
        width="560" height="315"
        frameborder="0">
      </iframe>
    `;
    wrapper.appendChild(noscript);

    // Substitui o iframe original
    original.parentNode.replaceChild(wrapper, original);

    // Clique → carrega player real
    wrapper.addEventListener("click", function () {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", `https://www.youtube.com/embed/${videoId}?autoplay=1`);
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("loading", "lazy");
      wrapper.innerHTML = ""; // limpa o conteúdo
      wrapper.appendChild(iframe);
    });
  });
});
