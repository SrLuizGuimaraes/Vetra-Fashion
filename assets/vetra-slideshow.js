/**
 * Syncs the dots with the scroll-snap slideshow track and, if
 * autoplay is set, advances slides automatically (pausing on hover
 * and honoring prefers-reduced-motion).
 */
document.querySelectorAll('[data-slideshow]').forEach((root) => {
  const track = root.querySelector('[data-slideshow-track]');
  const slides = Array.from(root.querySelectorAll('[data-slideshow-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-slideshow-dot]'));
  if (!track || slides.length < 2) return;

  function goTo(index) {
    slides[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.slideshowDot)));
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = slides.indexOf(entry.target);
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      });
    },
    { root: track, threshold: 0.6 }
  );

  slides.forEach((slide) => observer.observe(slide));

  const autoplaySeconds = Number(root.dataset.autoplay || 0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (autoplaySeconds > 0 && !reducedMotion) {
    let paused = false;
    root.addEventListener('mouseenter', () => (paused = true));
    root.addEventListener('mouseleave', () => (paused = false));

    setInterval(() => {
      if (paused) return;
      const current = dots.findIndex((dot) => dot.classList.contains('is-active'));
      goTo((current + 1) % slides.length);
    }, autoplaySeconds * 1000);
  }
});
