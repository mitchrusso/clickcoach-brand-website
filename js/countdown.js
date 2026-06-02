(function () {
  function pad(n) { return String(n).padStart(2, '0'); }

  function init() {
    var el = document.querySelector('[data-countdown]');
    if (!el) return;
    var cells = el.querySelectorAll('strong');
    if (cells.length < 4) return;

    function tick() {
      var now = new Date();
      // The COMING midnight in the visitor's local time zone — i.e. the
      // very start of tomorrow (24:00:00 today / 00:00:00 tomorrow), the
      // instant right after 11:59:59 PM. getDate()+1 rolls month/year over.
      var target = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
      );

      var diff = target.getTime() - now.getTime(); // ms until midnight
      if (diff < 0) diff = 0;

      var totalSeconds = Math.floor(diff / 1000);
      var days = Math.floor(totalSeconds / 86400);
      var hours = Math.floor((totalSeconds % 86400) / 3600);
      var minutes = Math.floor((totalSeconds % 3600) / 60);
      var seconds = totalSeconds % 60;

      cells[0].textContent = pad(days);
      cells[1].textContent = pad(hours);
      cells[2].textContent = pad(minutes);
      cells[3].textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
