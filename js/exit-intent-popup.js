(function(){
  const storageKey = 'clickcoachExitIntentSeenDate';
  const minTimeOnPage = 9000;
  const muxPlaybackId = 'J4MjhbBkhPISfKV32vATXDqKXqhpNBUT367E5eojii4';
  const tinyEmailAccountId = 'e4ea2f69-5822-4136-a02b-d0045cabb18f';
  const tinyEmailFormId = '0044c477-093f-4d8b-8041-69c2d7c5d1e3';
  let shown = false;
  let ready = false;
  let memorySeen = false;
  let muxPlayerReady = null;

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function hasSeen() {
    try {
      return memorySeen || localStorage.getItem(storageKey) === todayKey();
    } catch (error) {
      return memorySeen;
    }
  }

  function markSeen() {
    memorySeen = true;
    try {
      localStorage.setItem(storageKey, todayKey());
    } catch (error) {}
  }

  function canShow() {
    return ready && !shown && !hasSeen() && !document.querySelector('.cc-exit-popup');
  }

  function loadMuxPlayer() {
    if (window.customElements && customElements.get('mux-player')) {
      return Promise.resolve();
    }
    if (muxPlayerReady) return muxPlayerReady;
    muxPlayerReady = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mux/mux-player';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return muxPlayerReady;
  }

  function closePopup(dialog) {
    markSeen();
    const player = dialog.querySelector('mux-player');
    if (player && typeof player.pause === 'function') player.pause();
    dialog.close();
    dialog.remove();
  }

  function showVideo(dialog) {
    const body = dialog.querySelector('.cc-exit-popup__body');
    body.innerHTML = `
      <div class="cc-exit-popup__video" aria-label="ClickCoach demo video">
        <mux-player
          playback-id="${muxPlaybackId}"
          metadata-video-title="ClickCoach Demo"
          default-hidden-captions
          prefer-playback="mse"
          stream-type="on-demand"
          class="u-video-frame"
        ></mux-player>
      </div>
    `;
    loadMuxPlayer().then(() => {
      const player = dialog.querySelector('mux-player');
      if (player && typeof player.play === 'function') player.play().catch(() => {});
    }).catch(() => {});
  }

  function normalizeTinyEmailDemoForm(container) {
    const placeholderMap = new Map([
      ['First name placeholder', 'First Name'],
      ['Last name placeholder', 'Last Name'],
      ['Email address placeholder', 'Email Address'],
    ]);

    container.querySelectorAll('input[placeholder]').forEach((input) => {
      const replacement = placeholderMap.get(input.getAttribute('placeholder'));
      if (replacement) input.setAttribute('placeholder', replacement);
    });

    container.querySelectorAll('button, input[type="submit"], [role="button"]').forEach((control) => {
      const controlText = (control.textContent || control.value || '').trim().toLowerCase();
      if (controlText === 'submit' || controlText === 'download slipmeter') {
        if ('value' in control) control.value = 'Send me the video';
        control.textContent = 'Send me the video';
        control.setAttribute('aria-label', 'Send me the video');
      }
    });

    container.querySelectorAll('*').forEach((element) => {
      const message = element.textContent.trim();
      if (
        element.childNodes.length === 1 &&
        (message === 'Form successfully submitted!' || message === 'Thanks! Please check your email for the SlipMeter download link.')
      ) {
        element.textContent = 'Done - check your email for the demo video and the pricing report.';
      }
    });
  }

  function loadTinyEmailDemoForm(target) {
    const embed = target.querySelector('[data-demo-email-form]');
    if (!embed || embed.dataset.loaded === 'true') return;
    embed.dataset.loaded = 'true';
    const observer = new MutationObserver(() => normalizeTinyEmailDemoForm(embed));
    observer.observe(embed, { childList: true, subtree: true });

    const script = document.createElement('script');
    script.src = 'https://app.tinyemail.com/static/js/TinyFormRenderer.js';
    script.dataset.ia1 = tinyEmailAccountId;
    script.dataset.if2 = tinyEmailFormId;
    script.defer = true;
    script.onload = () => normalizeTinyEmailDemoForm(embed);
    embed.appendChild(script);
  }

  function showEmailForm(dialog) {
    const body = dialog.querySelector('.cc-exit-popup__body');
    body.innerHTML = `
      <span class="chip">Send the demo</span>
      <h2>Sure. Where should we send it?</h2>
      <p>You're going to love it. Just drop in your email and we will send you the 3-minute study, plus a study we concluded on how to raise your rates and get higher-end clients.</p>
      <div class="cc-exit-popup__form" data-demo-email-form aria-label="Request the ClickCoach demo video by email"></div>
    `;
    loadTinyEmailDemoForm(body);
  }

  function buildPopup() {
    const dialog = document.createElement('dialog');
    dialog.className = 'cc-exit-popup';
    dialog.setAttribute('aria-label', 'Watch the ClickCoach demo');
    dialog.innerHTML = `
      <div class="cc-exit-popup__shell">
        <button class="cc-exit-popup__close" type="button" aria-label="Close">&times;</button>
        <div class="cc-exit-popup__body">
          <span class="chip">Quick demo</span>
          <h2>Hey! Want to see a 3 min video about how to use it?</h2>
          <p>See how ClickCoach brings sessions, homework, progress, billing, courses, and AI into one clean coaching workspace.</p>
          <div class="cc-exit-popup__actions">
            <button class="btn btn-primary btn-lg" type="button" data-exit-watch>Watch the video</button>
            <button class="btn btn-secondary btn-lg" type="button" data-exit-send>We can send it instead</button>
          </div>
        </div>
      </div>
    `;

    dialog.querySelector('.cc-exit-popup__close').addEventListener('click', () => closePopup(dialog));
    dialog.querySelector('[data-exit-watch]').addEventListener('click', () => showVideo(dialog));
    dialog.querySelector('[data-exit-send]').addEventListener('click', () => showEmailForm(dialog));
    dialog.addEventListener('cancel', markSeen);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closePopup(dialog);
    });
    return dialog;
  }

  function showPopup() {
    if (!canShow()) return;
    shown = true;
    const dialog = buildPopup();
    document.body.appendChild(dialog);
    try {
      dialog.showModal();
    } catch (error) {
      dialog.remove();
      shown = false;
    }
  }

  function onMouseOut(event) {
    if (event.clientY <= 0 && !event.relatedTarget) showPopup();
  }

  function onMouseLeave(event) {
    if (event.clientY <= 0) showPopup();
  }

  window.setTimeout(() => { ready = true; }, minTimeOnPage);
  if (new URLSearchParams(window.location.search).has('exit-popup-preview')) {
    window.setTimeout(() => {
      ready = true;
      shown = false;
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        memorySeen = false;
      }
      showPopup();
    }, 500);
  }
  document.addEventListener('mouseout', onMouseOut, { passive: true });
  document.documentElement.addEventListener('mouseleave', onMouseLeave, { passive: true });
})();
