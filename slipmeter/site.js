(function () {
  const menu = document.getElementById('sm-menu');
  const navLinks = document.getElementById('sm-nav-links');
  if (!menu || !navLinks) return;
  menu.addEventListener('click', function () {
    const open = navLinks.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', function (event) {
    if (!event.target.closest('a')) return;
    navLinks.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  });
})();

(function () {
  const coupon = document.getElementById('slipmeter-coupon');
  const status = document.querySelector('.sm-coupon-status');
  const endpoint = 'https://new.clickcoach.io/api/slipmeter/coupons/redeem';

  function fieldValue(form, selectors) {
    const field = form.querySelector(selectors);
    return field ? String(field.value || '').trim() : '';
  }

  window.redeemSlipMeterCoupon = async function (form) {
    const code = coupon ? coupon.value.trim() : '';
    if (!code) return true;
    if (status) {
      status.textContent = 'Checking coupon code...';
      status.className = 'sm-coupon-status';
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          couponCode: code,
          coupon_code: code,
          firstName: fieldValue(form, '[name="first_name"], [name="firstName"], [autocomplete="given-name"]'),
          lastName: fieldValue(form, '[name="last_name"], [name="lastName"], [autocomplete="family-name"]'),
          email: fieldValue(form, '[name="email"], [type="email"]'),
          source: 'clickcoach-slipmeter-web'
        })
      });
      const result = await response.json().catch(function () { return {}; });
      if (!response.ok || !result.applied) throw new Error(result.message || 'That coupon code could not be applied.');
      if (status) {
        status.textContent = result.message || 'Coupon code applied.';
        status.className = 'sm-coupon-status sm-coupon-status--success';
      }
      return true;
    } catch (error) {
      if (status) {
        status.textContent = error.message || 'We could not verify that coupon code. Please check it and try again.';
        status.className = 'sm-coupon-status sm-coupon-status--error';
      }
      return false;
    }
  };
})();

(function () {
  const coupon = document.getElementById('slipmeter-coupon');
  const embed = document.querySelector('.sm-tinyemail-embed');
  const fallback = document.getElementById('slipmeter-download-fallback');
  const ready = document.getElementById('slipmeter-download-ready');
  if (!coupon || !embed) return;

  const tinyEmailSelector = 'form, iframe, [data-reactroot], input, button, textarea, select';
  const approvedSubmissions = new WeakSet();

  function showDownload() {
    if (ready) ready.hidden = false;
  }

  function normalizeTinyEmailUi() {
    embed.querySelectorAll('button, input[type="submit"], [role="button"]').forEach(function (control) {
      const text = (control.textContent || control.value || '').trim().toLowerCase();
      if (text === 'submit') {
        if ('value' in control) control.value = 'Register and download';
        control.textContent = 'Register and download';
        control.setAttribute('aria-label', 'Register and download SlipMeter');
      }
    });
    const placeholders = new Map([
      ['First name placeholder', 'First name'],
      ['Last name placeholder', 'Last name'],
      ['Email address placeholder', 'Email address']
    ]);
    embed.querySelectorAll('input[placeholder]').forEach(function (input) {
      const replacement = placeholders.get(input.getAttribute('placeholder'));
      if (replacement) input.setAttribute('placeholder', replacement);
    });
    embed.querySelectorAll('*').forEach(function (element) {
      const message = element.childNodes.length === 1 ? element.textContent.trim() : '';
      if (message === 'Form successfully submitted!') {
        element.textContent = 'Registration complete. Your SlipMeter download is ready below.';
        showDownload();
      }
    });
  }

  function hasTinyEmailRendered() {
    return Boolean(embed.querySelector(tinyEmailSelector));
  }

  function syncCouponField() {
    const form = embed.querySelector('form') || fallback;
    if (!form) return false;
    let hiddenCoupon = form.querySelector('input[name="coupon_code"]');
    if (!hiddenCoupon) {
      hiddenCoupon = document.createElement('input');
      hiddenCoupon.type = 'hidden';
      hiddenCoupon.name = 'coupon_code';
      form.appendChild(hiddenCoupon);
    }
    hiddenCoupon.value = coupon.value.trim();
    return true;
  }

  function useTinyEmailIfReady() {
    if (!hasTinyEmailRendered()) return false;
    embed.classList.remove('sm-tinyemail-embed--empty');
    if (fallback) fallback.hidden = true;
    normalizeTinyEmailUi();
    syncCouponField();
    return true;
  }

  coupon.addEventListener('input', syncCouponField);
  embed.addEventListener('submit', async function (event) {
    const form = event.target.closest('form');
    if (!form || approvedSubmissions.has(form) || !coupon.value.trim()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const approved = await window.redeemSlipMeterCoupon(form);
    if (!approved) return;
    approvedSubmissions.add(form);
    form.requestSubmit(event.submitter || undefined);
  }, true);

  const observer = new MutationObserver(function () { useTinyEmailIfReady(); });
  observer.observe(embed, { childList: true, subtree: true });
  syncCouponField();
  window.setTimeout(function () {
    if (!useTinyEmailIfReady() && fallback) {
      fallback.hidden = false;
      syncCouponField();
    }
  }, 2500);
})();

(function () {
  const form = document.getElementById('slipmeter-download-fallback');
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = document.getElementById('slipmeter-download-status');
  const coupon = document.getElementById('slipmeter-coupon');
  const ready = document.getElementById('slipmeter-download-ready');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const hiddenCoupon = form.querySelector('input[name="coupon_code"]');
    if (hiddenCoupon && coupon) hiddenCoupon.value = coupon.value.trim();
    if (button) {
      button.disabled = true;
      button.textContent = 'Preparing download...';
    }
    if (status) {
      status.textContent = '';
      status.className = 'sm-download-status';
    }
    try {
      const couponApproved = await window.redeemSlipMeterCoupon(form);
      if (!couponApproved) return;
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');
      if (status) {
        status.textContent = 'Registration complete. Your download is ready.';
        status.className = 'sm-download-status sm-download-status--success';
      }
      if (ready) ready.hidden = false;
      form.reset();
      if (coupon) coupon.value = '';
    } catch (error) {
      if (status) {
        status.textContent = 'Something went wrong. Please check your details and try again.';
        status.className = 'sm-download-status sm-download-status--error';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Register and download';
      }
    }
  });
})();
