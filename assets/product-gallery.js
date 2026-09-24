/**
 * Switches the active product image when a thumbnail is clicked, and
 * keeps the zoom dialog (assets/vetra-dialog.js) pointed at whichever
 * image is currently visible.
 */
document.querySelectorAll('[data-gallery-thumbnail]').forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => {
    const target = document.getElementById(thumbnail.dataset.target);
    if (!target) return;

    document
      .querySelectorAll('[data-gallery-image].is-active, [data-gallery-thumbnail].is-active')
      .forEach((el) => el.classList.remove('is-active'));

    target.classList.add('is-active');
    thumbnail.classList.add('is-active');
  });
});

document.querySelectorAll('[data-gallery-image]').forEach((button) => {
  button.addEventListener('click', () => {
    const zoomImage = document.querySelector('[data-zoom-image]');
    if (zoomImage) zoomImage.src = button.dataset.zoomSrc;
  });
});
