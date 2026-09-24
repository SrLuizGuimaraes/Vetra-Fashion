/**
 * Ticks down to the date set in sections/vetra-countdown.liquid.
 * Supports multiple countdown sections on the same page.
 */
function pad(value) {
  return String(Math.max(value, 0)).padStart(2, '0');
}

function tick(root) {
  const end = new Date(root.dataset.end).getTime();
  const now = Date.now();
  const remaining = end - now;

  const timer = root.querySelector('[data-countdown-timer]');
  const ended = root.querySelector('[data-countdown-ended]');

  if (Number.isNaN(end) || remaining <= 0) {
    timer.hidden = true;
    ended.hidden = false;
    return false;
  }

  const seconds = Math.floor(remaining / 1000) % 60;
  const minutes = Math.floor(remaining / (1000 * 60)) % 60;
  const hours = Math.floor(remaining / (1000 * 60 * 60)) % 24;
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

  root.querySelector('[data-countdown-days]').textContent = pad(days);
  root.querySelector('[data-countdown-hours]').textContent = pad(hours);
  root.querySelector('[data-countdown-minutes]').textContent = pad(minutes);
  root.querySelector('[data-countdown-seconds]').textContent = pad(seconds);

  return true;
}

document.querySelectorAll('[data-countdown]').forEach((root) => {
  if (!tick(root)) return;
  const interval = setInterval(() => {
    if (!tick(root)) clearInterval(interval);
  }, 1000);
});
