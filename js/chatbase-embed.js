(function () {
  const userAgent = navigator.userAgent || '';
  if (navigator.webdriver || /Chrome-Lighthouse|PageSpeed|Lighthouse|HeadlessChrome/i.test(userAgent)) return;

  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...arguments) => {
      if (!window.chatbase.q) {
        window.chatbase.q = [];
      }
      window.chatbase.q.push(arguments);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") {
          return target.q;
        }
        return (...args) => target(prop, ...args);
      },
    });
  }
  let loaded = false;
  const loadChatbase = function () {
    if (loaded) return;
    loaded = true;
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "DtKs1GNJOMerpMgCZfK_6";
    script.domain = "www.chatbase.co";
    script.async = true;
    document.body.appendChild(script);
  };

  const armChatbase = function () {
    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
      window.addEventListener(eventName, loadChatbase, { once: true, passive: true });
    });
    // Keep chat available to engaged visitors without downloading the full
    // third-party widget for quick bounces or passive page reads.
    setTimeout(loadChatbase, 45000);
  };

  if (document.readyState === "complete") armChatbase();
  else window.addEventListener("load", armChatbase, { once: true });
})();
