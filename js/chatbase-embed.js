(function () {
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
  function whenIdle(fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 5000 });
    } else {
      setTimeout(fn, 2500);
    }
  }

  const onLoad = function () {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "DtKs1GNJOMerpMgCZfK_6";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  };
  if (document.readyState === "complete") {
    whenIdle(onLoad);
  } else {
    window.addEventListener("load", function () {
      whenIdle(onLoad);
    }, { once: true });
  }
})();
