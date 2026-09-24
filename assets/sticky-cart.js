/**
 * Shows a floating "add to cart" bar once the product page's main
 * submit button has scrolled out of view.
 */
const mainSubmitButton = document.querySelector('[data-add-to-cart]');
const stickyBar = document.querySelector('[data-sticky-cart]');

if (mainSubmitButton && stickyBar) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      stickyBar.hidden = entry.isIntersecting;
    },
    { threshold: 0 }
  );

  observer.observe(mainSubmitButton);

  stickyBar.querySelector('[data-sticky-cart-submit]').addEventListener('click', () => {
    document.getElementById('product-form')?.requestSubmit();
  });
}
