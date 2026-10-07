(function () {
  "use strict";

  var STORAGE_KEY = "eduverse:theme";
  var DEFAULT_THEME = "light";
  var THEMES = ["light", "dark"];
  var root = document.documentElement;

  function read() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(stored) === -1 ? DEFAULT_THEME : stored;
    } catch (err) {
      return DEFAULT_THEME;
    }
  }

  function write(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      return;
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var buttons = document.querySelectorAll("[data-theme-set]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].setAttribute(
        "aria-pressed",
        buttons[i].getAttribute("data-theme-set") === theme ? "true" : "false",
      );
    }
  }

  apply(read());

  function onClick(event) {
    var target = event.target.closest("[data-theme-set]");
    if (!target) {
      return;
    }
    var theme = target.getAttribute("data-theme-set");
    if (THEMES.indexOf(theme) === -1) {
      return;
    }
    write(theme);
    apply(theme);
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