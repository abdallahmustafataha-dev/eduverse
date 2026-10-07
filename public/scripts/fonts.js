(function () {
  "use strict";

  var STORAGE_KEY = "eduverse:fonts";
  var MODES = ["web", "fallback"];
  var DEFAULT_MODE = "web";
  var root = document.documentElement;

  function read() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return MODES.indexOf(stored) === -1 ? DEFAULT_MODE : stored;
    } catch (err) {
      return DEFAULT_MODE;
    }
  }

  function write(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (err) {
      return;
    }
  }

  function apply(mode) {
    root.setAttribute("data-fonts", mode);

    var buttons = document.querySelectorAll("[data-fonts-set]");

    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute(
        "aria-pressed",
        buttons[i].getAttribute("data-fonts-set") === mode ? "true" : "false",
      );
    }
  }

  apply(read());

  function onClick(event) {
    var target = event.target.closest("[data-fonts-set]");

    if (!target) {
      return;
    }

    var mode = target.getAttribute("data-fonts-set");

    if (MODES.indexOf(mode) === -1) {
      return;
    }

    write(mode);
    apply(mode);
  }

  function onReady() {
    document.addEventListener("click", onClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();