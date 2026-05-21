(function () {
  const screenshotDialog = document.getElementById('screenshot-lightbox');
  if (!screenshotDialog) return;

  const lightboxImg = screenshotDialog.querySelector('.screenshot-lightbox__img');
  let lightboxScrollY = 0;
  let lightboxOpener = null;

  function lockPageScroll() {
    lightboxScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lightboxScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockPageScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, lightboxScrollY);
  }

  document.querySelectorAll('[data-screenshot-expand]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!lightboxImg) return;
      const sourceImg = trigger.querySelector('img');
      if (sourceImg) {
        lightboxImg.src = sourceImg.currentSrc || sourceImg.src;
        lightboxImg.alt = sourceImg.alt;
        const label = trigger.getAttribute('aria-label');
        if (label) screenshotDialog.setAttribute('aria-label', label);
      }
      lightboxOpener = trigger;
      lockPageScroll();
      screenshotDialog.showModal();
    });
  });

  screenshotDialog.addEventListener('click', (e) => {
    if (e.target === screenshotDialog) screenshotDialog.close();
  });

  screenshotDialog.addEventListener('close', () => {
    unlockPageScroll();
    if (lightboxOpener) {
      lightboxOpener.focus({ preventScroll: true });
      lightboxOpener = null;
    }
  });
})();
