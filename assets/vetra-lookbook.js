/**
 * Toggles lookbook hotspot cards on tap (hover already handles this
 * on pointer devices via CSS :hover/:focus-within).
 */
document.querySelectorAll('[data-hotspot]').forEach((hotspot) => {
  hotspot.addEventListener('click', (event) => {
    if (window.matchMedia('(hover: hover)').matches) return;
    event.preventDefault();

    const wasOpen = hotspot.classList.contains('is-open');
    document.querySelectorAll('[data-hotspot].is-open').forEach((el) => el.classList.remove('is-open'));
    if (!wasOpen) hotspot.classList.add('is-open');
  });
});

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-hotspot]')) return;
  document.querySelectorAll('[data-hotspot].is-open').forEach((el) => el.classList.remove('is-open'));
});
