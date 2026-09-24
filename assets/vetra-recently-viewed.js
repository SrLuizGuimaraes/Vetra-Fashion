/**
 * Tracks viewed products in localStorage (called from product.liquid
 * via [data-record-view]) and renders sections/vetra-recently-viewed.liquid
 * by fetching each stored handle's JSON.
 */
const STORAGE_KEY = 'vetra:recently-viewed';
const MAX_ITEMS = 12;

function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function recordView(handle) {
  const history = readHistory().filter((item) => item !== handle);
  history.unshift(handle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ITEMS)));
}

const recorder = document.querySelector('[data-record-view]');
if (recorder) recordView(recorder.dataset.recordView);

const container = document.querySelector('[data-recently-viewed]');
if (container) {
  const grid = container.querySelector('[data-recently-viewed-grid]');
  const exclude = container.dataset.exclude;
  const handles = readHistory()
    .filter((handle) => handle !== exclude)
    .slice(0, 4);

  if (handles.length > 0) {
    Promise.all(
      handles.map((handle) =>
        fetch(`/products/${handle}.js`)
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null)
      )
    ).then((products) => {
      const cardsHtml = products
        .filter(Boolean)
        .map(
          (product) => `
            <a class="recently-viewed-card" href="${product.url}">
              <img src="${product.featured_image}" alt="${product.title}" width="300" height="375" loading="lazy">
              <p class="recently-viewed-card__title">${product.title}</p>
              <p class="recently-viewed-card__price">${window.vetraFormatMoney(product.price)}</p>
            </a>
          `
        )
        .join('');

      if (cardsHtml) {
        grid.innerHTML = cardsHtml;
        container.hidden = false;
      }
    });
  }
}
