/**
 * Switches the active tab/panel pair in sections/vetra-tabs.liquid.
 */
document.querySelectorAll('[data-tabs]').forEach((root) => {
  root.querySelectorAll('[data-tabs-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const index = trigger.dataset.tabsTrigger;

      root.querySelectorAll('[data-tabs-trigger]').forEach((el) => el.classList.remove('is-active'));
      root.querySelectorAll('[data-tabs-panel]').forEach((el) => el.classList.remove('is-active'));

      trigger.classList.add('is-active');
      root.querySelector(`[data-tabs-panel="${index}"]`)?.classList.add('is-active');
    });
  });
});
