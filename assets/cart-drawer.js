/**
 * Wires up quantity steppers, line removal, and the order note inside
 * the cart drawer (sections/cart-drawer.liquid). Delegates on
 * document so it keeps working after assets/cart.js swaps the
 * drawer's inner HTML for a fresh render.
 */
let noteDebounce;

document.addEventListener('click', (event) => {
  const stepper = event.target.closest('[data-cart-qty-change]');
  const removeButton = event.target.closest('[data-cart-qty-set]');

  if (stepper) {
    const line = Number(stepper.dataset.line);
    const valueEl = stepper.closest('.cart-drawer__item').querySelector('[data-cart-qty-value]');
    const newQuantity = Number(valueEl.textContent) + Number(stepper.dataset.cartQtyChange);
    window.vetraCart.changeLine(line, Math.max(newQuantity, 0));
    return;
  }

  if (removeButton) {
    const line = Number(removeButton.dataset.line);
    window.vetraCart.changeLine(line, Number(removeButton.dataset.cartQtySet));
  }
});

document.addEventListener('input', (event) => {
  if (!event.target.matches('[data-cart-note]')) return;

  clearTimeout(noteDebounce);
  noteDebounce = setTimeout(() => {
    window.vetraCart.updateNote(event.target.value);
  }, 500);
});
