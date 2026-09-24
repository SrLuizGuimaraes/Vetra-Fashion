/**
 * <vetra-dialog> wraps a native <dialog> and wires it up to any
 * [data-dialog-open="<id>"] trigger on the page plus any
 * [data-dialog-close] button inside itself. Reused for the mobile
 * menu, quick view, cart drawer, image zoom, and promo popup.
 */
class VetraDialog extends HTMLElement {
  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    if (!this.dialog) return;

    this.querySelectorAll('[data-dialog-close]').forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.close();
    });

    this.dialog.addEventListener('close', () => {
      this.dialog.removeAttribute('scroll-lock');
      this.dispatchEvent(new CustomEvent('vetra-dialog:close', { bubbles: true }));
    });

    if (this.id) {
      document.querySelectorAll(`[data-dialog-open="${this.id}"]`).forEach((button) => {
        button.addEventListener('click', () => this.open());
      });
    }
  }

  open() {
    if (this.dialog.open) return;
    this.dialog.showModal();
    this.dialog.setAttribute('scroll-lock', '');
    this.dispatchEvent(new CustomEvent('vetra-dialog:open', { bubbles: true }));
  }

  close() {
    if (!this.dialog.open) return;
    this.dialog.close();
  }
}

customElements.define('vetra-dialog', VetraDialog);
