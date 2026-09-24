/**
 * Shared cart helpers: talks to Shopify's Ajax Cart API, refreshes the
 * cart drawer via the Section Rendering API, and keeps the header's
 * cart count badge in sync. Used by product.liquid, quick-view.js,
 * and the cart drawer itself.
 */
const CART_DRAWER_SECTION = 'cart-drawer';

function updateCartBadge(itemCount) {
  const cartIcon = document.querySelector('[data-dialog-open="cart-drawer"]');
  if (!cartIcon) return;

  let badge = cartIcon.querySelector('sup');
  if (itemCount > 0) {
    if (!badge) {
      badge = document.createElement('sup');
      cartIcon.prepend(badge);
    }
    badge.textContent = itemCount;
  } else if (badge) {
    badge.remove();
  }
}

function swapCartDrawerContent(sectionsHtml) {
  const html = sectionsHtml[CART_DRAWER_SECTION];
  if (!html) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const newDialog = doc.querySelector('#cart-drawer dialog');
  const currentDialog = document.querySelector('#cart-drawer dialog');

  if (newDialog && currentDialog) {
    currentDialog.innerHTML = newDialog.innerHTML;
    document.dispatchEvent(new CustomEvent('vetra:cart-drawer:rendered'));
  }
}

async function refreshCartDrawer() {
  const response = await fetch(`/?sections=${CART_DRAWER_SECTION}`, {
    headers: { Accept: 'application/json' },
  });
  const sections = await response.json();
  swapCartDrawerContent(sections);
}

async function addToCart(formData) {
  formData.append('sections', CART_DRAWER_SECTION);

  const response = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) throw result;

  if (result.sections) swapCartDrawerContent(result.sections);
  const cart = await (await fetch('/cart.js')).json();
  updateCartBadge(cart.item_count);
  document.dispatchEvent(new CustomEvent('vetra:cart:updated', { detail: cart }));

  return result;
}

async function changeLine(line, quantity) {
  const response = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ line, quantity, sections: CART_DRAWER_SECTION }),
  });

  const cart = await response.json();
  if (cart.sections) swapCartDrawerContent(cart.sections);
  updateCartBadge(cart.item_count);
  document.dispatchEvent(new CustomEvent('vetra:cart:updated', { detail: cart }));

  return cart;
}

async function updateNote(note) {
  await fetch('/cart/update.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ note }),
  });
}

window.vetraCart = { addToCart, changeLine, updateNote, refreshCartDrawer, updateCartBadge };
