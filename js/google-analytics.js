(function () {
  "use strict";
  if (window.clickCoachAnalyticsLoaded) return;
  window.clickCoachAnalyticsLoaded = true;
  var id = "G-Z5M6NT3QFL";
  var key = "clickcoach-analytics-consent-v1";
  var marketingKey = "clickcoach-marketing-consent-v1";
  var started = false;
  var choice;
  try { choice = localStorage.getItem(key); } catch (_) {}
  // Never collect from previews, local development, or the private application.
  var production = /^(www\.)?clickcoach\.io$/.test(location.hostname);
  var blocked = navigator.globalPrivacyControl === true || navigator.doNotTrack === "1";

  function start() {
    if (started || !production || blocked) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", id, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: location.hostname,
      // Exclude query strings, fragments, and referring page paths.
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : ""
    });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(script);
  }

  function save(value, marketing) {
    var previousMarketing;
    try {
      previousMarketing = localStorage.getItem(marketingKey);
      localStorage.setItem(marketingKey, marketing || "declined");
    } catch (_) {}
    try { localStorage.setItem(key, value); } catch (_) {}
    if (value === "accepted") start();
    else {
      window["ga-disable-" + id] = true;
      document.cookie.split(";").forEach(function (cookie) {
        var name = cookie.split("=")[0].trim();
        if (!/^(_ga(?:_|$)|_fbp$|_fbc$)/.test(name)) return;
        ["", ";domain=" + location.hostname, ";domain=.clickcoach.io"].forEach(function (domain) {
          document.cookie = name + "=;max-age=0;path=/" + domain;
        });
      });
    }
    dialog.close();
    window.dispatchEvent(new Event("clickcoach:consent"));
    // Reload when changing a prior choice so the loaded tag is fully removed.
    if ((choice && choice !== value) || (previousMarketing === "accepted" && marketing !== "accepted")) location.reload();
    choice = value;
  }

  if (choice === "accepted") start();
  var style = document.createElement("style");
  style.textContent = ".cc-analytics-dialog{box-sizing:border-box;position:fixed;inset:auto 16px 16px;margin:0 auto;width:560px;max-width:calc(100% - 32px);max-height:80vh;overflow:auto;padding:24px;border:1px solid #d4dbe6;border-radius:8px;background:#fff;color:#182338;box-shadow:0 4px 24px #0002;z-index:2147483647;font:16px/1.5 system-ui,sans-serif}.cc-analytics-dialog h2{font:600 20px/1.3 system-ui;margin:0 0 12px}.cc-analytics-dialog p{margin:0 0 16px}.cc-analytics-actions{display:flex;gap:12px;flex-wrap:wrap}.cc-analytics-actions button{font:600 16px system-ui;padding:12px 18px;border:1px solid #2355df;border-radius:6px;background:#fff;color:#2355df;cursor:pointer;min-height:44px}.cc-analytics-actions button:last-child{background:#2355df;color:#fff}.cc-analytics-dialog a,.cc-analytics-settings{color:#2355df}.cc-analytics-settings{font:inherit;background:none;border:0;text-decoration:underline;cursor:pointer;padding:8px}";
  document.head.appendChild(style);
  var dialog = document.createElement("dialog");
  dialog.className = "cc-analytics-dialog";
  dialog.setAttribute("aria-labelledby", "cc-analytics-title");
  dialog.innerHTML = '<h2 id="cc-analytics-title">Your Privacy Choices</h2><p>Optional analytics uses Google Analytics. Optional marketing uses Meta Pixel for advertising, Rybbit for visit measurement, and ConvertBox for offers. Nothing in these categories loads before consent. Declining does not prevent use of the website. <a href="/privacy/#cookies">Privacy policy</a></p><div class="cc-analytics-actions"><button type="button">Decline all</button><button type="button">Analytics only</button><button type="button">Accept analytics and marketing</button></div>';
  document.body.appendChild(dialog);
  var buttons = dialog.querySelectorAll("button");
  if (blocked) {
    dialog.querySelector("p").textContent = "Optional analytics and marketing are off because your browser sends a Do Not Track or Global Privacy Control preference. We respect that preference, even if you previously accepted tracking.";
    buttons[0].textContent = "Close";
    buttons[1].hidden = true;
    buttons[2].hidden = true;
    buttons[0].addEventListener("click", function () { dialog.close(); });
  } else {
    buttons[0].addEventListener("click", function () { save("declined"); });
    buttons[1].addEventListener("click", function () { save("accepted"); });
    buttons[2].addEventListener("click", function () { save("accepted", "accepted"); });
  }
  var settings = document.createElement("button");
  settings.type = "button";
  settings.className = "cc-analytics-settings";
  settings.textContent = "Your Privacy Choices";
  settings.style.cssText = "color:#182338;background:#fff;border:1px solid #64748b;border-radius:4px;min-height:44px";
  settings.addEventListener("click", function () { dialog.show(); });
  (document.querySelector(".footer__bottom") || document.body).appendChild(settings);
  if (location.hash === "#privacy-choices") dialog.show();
  window.addEventListener("hashchange", function () {
    if (location.hash === "#privacy-choices") dialog.show();
  });
  window.addEventListener("storage", function (event) {
    if (event.key === key || event.key === marketingKey || event.key === null) location.reload();
  });
  if (!choice && !blocked) dialog.show();
})();
