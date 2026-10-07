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

  function loadMarketingScripts() {
    if (loaded) return;
    if (!/^(www\.)?clickcoach\.io$/.test(location.hostname)) return;
    if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;
    try {
      if (localStorage.getItem("clickcoach-marketing-consent-v1") !== "accepted") return;
    } catch (_) { return; }
    loaded = true;
    appendScript("https://cdn.convertbox.com/convertbox/js/embed.js", {
      id: "app-convertbox-script",
      "data-uuid": "cc64bc00-c22e-425f-8f6d-b9a01a50e5f6",
    });

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

  window.addEventListener("clickcoach:consent", loadMarketingScripts);
  loadMarketingScripts();
})();
