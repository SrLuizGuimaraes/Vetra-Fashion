function formatMoney(cents, currency) {
  return (cents / 100).toLocaleString(document.documentElement.lang || 'en', {
    style: 'currency',
    currency,
  });
}

/**
 * <variant-picker> keeps the hidden variant id input, add-to-cart
 * button, and price display in sync with the option swatches/pills
 * the shopper selects on the product page.
 */
class VariantPicker extends HTMLElement {
  connectedCallback() {
    this.variants = JSON.parse(this.dataset.productJson);
    this.currency = document.documentElement.dataset.shopCurrency || 'USD';
    this.addEventListener('change', (event) => {
      if (event.target.matches('input[type="radio"]')) this.sync();
    });
  }

  selectedOptions() {
    return Array.from(this.querySelectorAll('fieldset.product-option')).map((fieldset) => {
      const checked = fieldset.querySelector('input:checked');
      return checked ? checked.value : null;
    });
  }

  matchingVariant() {
    const selected = this.selectedOptions();
    return this.variants.find((variant) =>
      selected.every((value, index) => variant[`option${index + 1}`] === value)
    );
  }

  sync() {
    const variant = this.matchingVariant();
    const idInput = this.querySelector('[data-variant-id-input]');
    const submitButton = this.querySelector('[data-add-to-cart]');
    const priceEl = this.closest('.product-info')?.querySelector('.product-price');

    if (!variant) {
      submitButton.disabled = true;
      submitButton.textContent = window.vetraStrings.unavailable;
      return;
    }

    idInput.value = variant.id;
    submitButton.disabled = !variant.available;
    submitButton.textContent = variant.available
      ? window.vetraStrings.addToCart
      : window.vetraStrings.soldOut;

    if (priceEl) {
      const onSale = variant.compare_at_price > variant.price;
      priceEl.innerHTML = onSale
        ? `<span class="product-price__sale">${formatMoney(variant.price, this.currency)}</span>
           <span class="product-price__compare-at">${formatMoney(variant.compare_at_price, this.currency)}</span>`
        : `<span class="product-price__regular">${formatMoney(variant.price, this.currency)}</span>`;
    }
  }
}

customElements.define('variant-picker', VariantPicker);
