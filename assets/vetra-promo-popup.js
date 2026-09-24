/**
 * Opens sections/vetra-promo-popup.liquid after a delay, then
 * suppresses it for N days once dismissed (localStorage cooldown).
 */
const STORAGE_KEY = 'vetra:promo-popup:dismissed-at';

document.querySelectorAll('[data-promo-popup]').forEach((popup) => {
  const delaySeconds = Number(popup.dataset.delay || 0);
  const frequencyDays = Number(popup.dataset.frequencyDays || 0);
  const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
  const cooldownMs = frequencyDays * 24 * 60 * 60 * 1000;

  if (dismissedAt && Date.now() - dismissedAt < cooldownMs) return;

  const timer = setTimeout(() => popup.open?.(), delaySeconds * 1000);

  popup.addEventListener('vetra-dialog:close', () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    clearTimeout(timer);
  });
});
