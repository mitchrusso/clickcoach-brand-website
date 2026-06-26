(function () {
  const triggers = document.querySelectorAll('[data-screenshot-expand]');
  if (!triggers.length) return;

  let screenshotDialog = document.getElementById('screenshot-lightbox');

  if (!screenshotDialog) {
    screenshotDialog = document.createElement('dialog');
    screenshotDialog.id = 'screenshot-lightbox';
    screenshotDialog.className = 'screenshot-lightbox';
    screenshotDialog.setAttribute('aria-label', 'Expanded screenshot');
    screenshotDialog.innerHTML = `
      <form method="dialog">
        <button type="submit" class="screenshot-lightbox__close" aria-label="Close expanded screenshot">&times;</button>
      </form>
      <img class="screenshot-lightbox__img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="Expanded ClickCoach screenshot preview" />
    `;
    document.body.appendChild(screenshotDialog);
  }

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

  triggers.forEach((trigger) => {
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
