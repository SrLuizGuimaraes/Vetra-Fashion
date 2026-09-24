/**
 * Powers the quick view dialog rendered by snippets/quick-view.liquid.
 * Fetches a product's JSON representation and renders a minimal
 * variant picker + add-to-cart form on the fly.
 */
function formatMoney(cents, currency) {
  return (cents / 100).toLocaleString(document.documentElement.lang || 'en', {
    style: 'currency',
    currency,
  });
}

function renderQuickView(product, currency) {
  const image = product.images[0] || product.featured_image;
  const optionsMarkup = product.options.length
    ? product.options
        .map((option, index) => {
          const values = product.variants
            .map((variant) => variant[`option${index + 1}`])
            .filter((value, i, all) => all.indexOf(value) === i);

          return `
            <label>
              <span class="quick-view-option-label">${option}</span>
              <select name="option${index + 1}" data-option-index="${index}">
                ${values.map((value) => `<option value="${value}">${value}</option>`).join('')}
              </select>
            </label>
          `;
        })
        .join('')
    : '';

  return `
    <div class="quick-view-grid">
      <div class="quick-view-media">
        <img src="${image}" alt="${product.title}" width="800" height="800" loading="eager">
      </div>
      <div class="quick-view-info">
        <h2>${product.title}</h2>
        <p class="quick-view-price" data-quick-view-price>${formatMoney(product.price, currency)}</p>
        <form data-quick-view-form>
          <input type="hidden" name="id" value="${product.variants[0].id}" data-quick-view-variant-id>
          <div class="quick-view-options">${optionsMarkup}</div>
          <button type="submit">${window.vetraStrings.addToCart}</button>
        </form>
      </div>
    </div>
  `;
}

function bindQuickViewForm(container, product, currency) {
  const form = container.querySelector('[data-quick-view-form]');
  const variantIdInput = container.querySelector('[data-quick-view-variant-id]');
  const priceEl = container.querySelector('[data-quick-view-price]');
  const selects = Array.from(container.querySelectorAll('select[data-option-index]'));
  const submitButton = form.querySelector('button[type="submit"]');

  function selectedVariant() {
    const selectedValues = selects.map((select) => select.value);
    return (
      product.variants.find((variant) =>
        selectedValues.every((value, index) => variant[`option${index + 1}`] === value)
      ) || null
    );
  }

  function syncVariant() {
    const variant = selectedVariant();
    if (!variant) {
      submitButton.disabled = true;
      submitButton.textContent = window.vetraStrings.unavailable;
      return;
    }
    variantIdInput.value = variant.id;
    priceEl.textContent = formatMoney(variant.price, currency);
    submitButton.disabled = !variant.available;
    submitButton.textContent = variant.available
      ? window.vetraStrings.addToCart
      : window.vetraStrings.soldOut;
  }

  selects.forEach((select) => select.addEventListener('change', syncVariant));
  syncVariant();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;

    try {
      await window.vetraCart.addToCart(new FormData(form));
      document.getElementById('quick-view')?.close();
      document.getElementById('cart-drawer')?.open();
    } catch (error) {
      submitButton.textContent = window.vetraStrings.unavailable;
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener('click', async (event) => {
  const trigger = event.target.closest('[data-quick-view]');
  if (!trigger) return;

  const content = document.querySelector('[data-quick-view-content]');
  if (!content) return;

  content.innerHTML = '<p class="quick-view__loading">…</p>';

  try {
    const response = await fetch(`${trigger.dataset.quickView}.js`);
    if (!response.ok) throw new Error('Product fetch failed');

    const product = await response.json();
    const currency = document.documentElement.dataset.shopCurrency || 'USD';

    content.innerHTML = renderQuickView(product, currency);
    bindQuickViewForm(content, product, currency);
  } catch (error) {
    content.innerHTML = '<p class="quick-view__error">…</p>';
  }
});
