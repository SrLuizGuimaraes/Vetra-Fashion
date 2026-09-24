/**
 * Toggles the overlay header (transparent on top of a home page hero)
 * into its solid state once the shopper scrolls past it.
 */
const header = document.querySelector('[data-site-header].site-header--overlay');

if (header) {
  const threshold = header.offsetHeight;

  function sync() {
    header.classList.toggle('is-scrolled', window.scrollY > threshold);
  }

  sync();
  window.addEventListener('scroll', sync, { passive: true });
}
