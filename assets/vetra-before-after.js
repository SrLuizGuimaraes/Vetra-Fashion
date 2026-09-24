/**
 * Drives the before/after comparison slider: a native range input
 * (for accessibility and touch support) moves the handle and clips
 * the "after" image via clip-path.
 */
document.querySelectorAll('[data-before-after]').forEach((frame) => {
  const range = frame.querySelector('[data-before-after-range]');
  const clip = frame.querySelector('[data-before-after-clip]');
  const handle = frame.querySelector('[data-before-after-handle]');

  function update(value) {
    clip.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    handle.style.left = `${value}%`;
  }

  range.addEventListener('input', () => update(range.value));
  update(range.value);
});
