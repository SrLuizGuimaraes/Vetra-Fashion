/**
 * Queries Shopify's real /cart/shipping_rates.json endpoint for the
 * shopper's current cart, so the estimator reflects the shop's
 * actual configured shipping rates rather than a static guess.
 */
document.querySelectorAll('[data-shipping-estimator-form]').forEach((form) => {
  const results = form.closest('.shipping-estimator').querySelector('[data-shipping-estimator-results]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const country = form.country.value.trim().toUpperCase();
    const zip = form.zip.value.trim();
    results.textContent = window.vetraStrings.shippingEstimating;

    try {
      const params = new URLSearchParams({
        'shipping_address[zip]': zip,
        'shipping_address[country]': country,
      });
      const response = await fetch(`/cart/shipping_rates.json?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await response.json();
      const rates = data.shipping_rates || [];

      if (rates.length === 0) {
        results.textContent = window.vetraStrings.shippingEmpty;
        return;
      }

      results.innerHTML = rates
        .map(
          (rate) => `
            <div class="shipping-estimator__rate">
              <span>${rate.presentment_name || rate.name}</span>
              <span>${window.vetraFormatMoney(Math.round(Number(rate.price) * 100))}</span>
            </div>
          `
        )
        .join('');
    } catch (error) {
      results.textContent = window.vetraStrings.shippingError;
    }
  });
});
