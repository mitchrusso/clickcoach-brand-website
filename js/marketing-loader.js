(function () {
  "use strict";

  var loader = document.currentScript;
  var includeRybbit = loader && loader.dataset.rybbit === "true";
  var loaded = false;

  function appendScript(src, attributes) {
    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    Object.keys(attributes || {}).forEach(function (name) {
      if (name.startsWith("data-")) script.setAttribute(name, attributes[name]);
      else script[name] = attributes[name];
    });
    document.head.appendChild(script);
  }

  // ConvertBox owns its own display delay, so load its runtime immediately.
  // Deferring this script made the configured 8-second trigger start only
  // after the marketing-loader's 12-second fallback delay.
  appendScript("https://cdn.convertbox.com/convertbox/js/embed.js", {
    id: "app-convertbox-script",
    "data-uuid": "cc64bc00-c22e-425f-8f6d-b9a01a50e5f6",
  });

  function loadMarketingScripts() {
    if (loaded) return;
    loaded = true;

    if (includeRybbit) {
      appendScript("https://app.rybbit.io/api/script.js", {
        "data-site-id": "b96de0375325",
      });
    }

    if (!window.fbq) {
      var fbq = (window.fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      });
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      appendScript("https://connect.facebook.net/en_US/fbevents.js");
    }
    window.fbq("init", "27459395117029374");
    window.fbq("track", "PageView");
  }

  function scheduleLoad() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadMarketingScripts, { timeout: 2000 });
    } else {
      window.setTimeout(loadMarketingScripts, 200);
    }
  }

  window.addEventListener(
    "load",
    function () {
      ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (eventName) {
        window.addEventListener(eventName, scheduleLoad, { once: true, passive: true });
      });
      window.setTimeout(scheduleLoad, 12000);
    },
    { once: true }
  );
})();
