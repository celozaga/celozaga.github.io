document.addEventListener('DOMContentLoaded', () => {
  const slideshow = document.getElementById('slideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelector('.slides');
  const slideItems = slideshow.querySelectorAll('.slide');
  const prevBtn = slideshow.querySelector('.slideshow-button-prev');
  const nextBtn = slideshow.querySelector('.slideshow-button-next');
  const dotsContainer = slideshow.querySelector('.slideshow-dots');

  if (!slides || !slideItems.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let index = 0;
  let autoplay;
  const delay = 4000;

  /* DOTS */
  slideItems.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'slideshow-dot';
    dot.onclick = () => goTo(i);
    dotsContainer.appendChild(dot);
  });
  const dots = dotsContainer.querySelectorAll('.slideshow-dot');

  function update() {
    slides.style.transition = 'transform 0.4s ease';
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }

  function goTo(i) {
    index = (i + slideItems.length) % slideItems.length;
    update();
    stopAutoplay();
  }

  function next() {
    index = (index + 1) % slideItems.length;
    update();
  }

  function prev() {
    index = (index - 1 + slideItems.length) % slideItems.length;
    update();
  }

  prevBtn.onclick = () => {
    prev();
    stopAutoplay();
  };

  nextBtn.onclick = () => {
    next();
    stopAutoplay();
  };

  function startAutoplay() {
    stopAutoplay(); // Clear any existing interval just in case
    autoplay = setInterval(next, delay);
  }

  function stopAutoplay() {
    clearInterval(autoplay);
  }

  /* DRAG / SWIPE */
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  function dragStart(x) {
    stopAutoplay();
    dragging = true;
    startX = x;
    slides.style.transition = 'none';
  }

  function dragMove(x) {
    if (!dragging) return;
    currentX = x;
    const diff = currentX - startX;
    slides.style.transform = `translateX(calc(-${index * 100}% + ${diff}px))`;
  }

  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    const diff = currentX - startX;
    if (Math.abs(diff) > 60) {
      diff < 0 ? next() : prev();
    } else {
      update();
    }
  }

  /* Mouse Events */
  slideshow.addEventListener('mousedown', e => dragStart(e.clientX));
  window.addEventListener('mousemove', e => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  /* Touch Events */
  slideshow.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), {
    passive: true
  });
  window.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), {
    passive: true
  });
  window.addEventListener('touchend', dragEnd);

  // Initialize
  update();
  startAutoplay();
});