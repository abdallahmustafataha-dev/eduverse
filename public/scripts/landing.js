(function () {
  "use strict";

  var STATIONS = 12;

  var hero = document.querySelector(".hero--c");
  var stage = document.querySelector("[data-road]");
  var sticky = document.querySelector("[data-sticky]");
  var header = document.querySelector(".site");
  var finalSection = document.getElementById("start");
  var finalState = { visible: false };
  var navState = { scrolled: false };

  /* ---------------------------------------------------------------- navbar */

  /* Past 50px the bar insets itself and hands its surface to .site__inner so it
     can round into a pill. Toggling a class is cheap, but the guard keeps it to
     one write per crossing instead of one per scroll event. */
  function paintHeader() {
    if (!header) {
      return;
    }

    var next = window.pageYOffset > 50;

    if (next === navState.scrolled) {
      return;
    }

    navState.scrolled = next;
    header.classList.toggle("is-scrolled", next);
  }

  /* ------------------------------------------------------------- the road */

  var GEOMETRY = {
    horizontal: { w: 1200, h: 440, pad: 78, mid: 208, amp: 104, bias: 34 },
    vertical: { w: 420, h: 1520, pad: 80, mid: 210, amp: 92, bias: 0 },
  };

  function isStacked() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function isRtl() {
    return document.documentElement.getAttribute("dir") === "rtl";
  }

  // Sine wave along the travel axis, so the road genuinely winds.
  function pointsFor(mode, rtl) {
    var g = GEOMETRY[mode];
    var pts = [];

    for (var i = 0; i < STATIONS; i += 1) {
      var t = i / (STATIONS - 1);
      var across = g.mid + g.amp * Math.sin(2 * Math.PI * t) + g.bias * t;

      if (mode === "horizontal") {
        var x = g.pad + (g.w - g.pad * 2) * t;
        var y = across;
      } else {
        var x2 = across;
        var y2 = g.pad + (g.h - g.pad * 2) * t;
        x = x2;
        y = y2;
      }

      // RTL: mirror horizontally so the journey starts from the right.
      if (rtl) {
        x = g.w - x;
      }

      pts.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
    }

    return pts;
  }

  // Catmull-Rom through every station, converted to cubic beziers, so the
  // curve passes exactly through each milestone instead of near it.
  function curve(pts) {
    var d = "M" + pts[0][0] + " " + pts[0][1];

    for (var i = 0; i < pts.length - 1; i += 1) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;

      var c1x = p1[0] + (p2[0] - p0[0]) / 6;
      var c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6;
      var c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d +=
        "C" +
        Math.round(c1x * 100) / 100 +
        " " +
        Math.round(c1y * 100) / 100 +
        "," +
        Math.round(c2x * 100) / 100 +
        " " +
        Math.round(c2y * 100) / 100 +
        "," +
        p2[0] +
        " " +
        p2[1];
    }

    return d;
  }

  function buildRoad() {
    if (!stage) {
      return;
    }

    var svg = stage.querySelector("[data-road-svg]");
    var bed = stage.querySelector("[data-road-bed]");
    var ink = stage.querySelector("[data-road-ink]");
    var list = stage.querySelector("[data-road-nodes]");

    if (!svg || !bed || !ink || !list) {
      return;
    }

    var mode = isStacked() ? "vertical" : "horizontal";
    var g = GEOMETRY[mode];
    var pts = pointsFor(mode, isRtl());

    svg.setAttribute("viewBox", "0 0 " + g.w + " " + g.h);

    var d = curve(pts);
    bed.setAttribute("d", d);
    ink.setAttribute("d", d);

    var html = "";
    var api = window.EduVerseI18n;

    for (var i = 0; i < STATIONS; i += 1) {
      var x = ((pts[i][0] / g.w) * 100).toFixed(3);
      var y = ((pts[i][1] / g.h) * 100).toFixed(3);
      var key = "road.g" + (i + 1);

      /* The label text is written here rather than left to a later i18n pass:
         i18n.js runs its DOMContentLoaded translate before this builds the nodes,
         so a data-i18n attribute alone would stay empty. */
      html +=
        '<li class="road__node" style="--x:' +
        x +
        "%;--y:" +
        y +
        "%;--i:" +
        (i + 1) +
        '">' +
        '<span class="road__dot"></span>' +
        '<span class="road__label" data-i18n="' +
        key +
        '">' +
        (api ? api.t(key) : "") +
        "</span></li>";
    }

    list.innerHTML = html;
  }

  function paintRoad() {
    if (!stage) {
      return;
    }

    var rect = stage.getBoundingClientRect();
    var travel = Math.max(rect.height * 0.55, 1);
    var t = -rect.top / travel;

    /* Clamp first, then apply the fold floor, so the hero never opens on an
       empty road and the counter starts at station 1.
       0.08 matches the --p default in landing.css. */
    t = t < 0 ? 0 : t > 1 ? 1 : t;

    var p = 0.08 + 0.92 * t;

    stage.style.setProperty("--p", p.toFixed(4));

    var counter = stage.querySelector("[data-road-counter]");

    if (!counter) {
      return;
    }

    var n = Math.ceil(p * STATIONS);
    n = n < 1 ? 1 : n > STATIONS ? STATIONS : n;

    var vars = { n: n, t: STATIONS };
    counter.setAttribute("data-i18n-var", JSON.stringify(vars));

    var api = window.EduVerseI18n;
    counter.textContent = api ? api.t("road.station", vars) : "Station " + n + " of 12";
  }

  /* --------------------------------------------------------- other reveals */

  function revealHero() {
    if (!hero) {
      return;
    }

    hero.classList.remove("is-in");

    window.requestAnimationFrame(function () {
      hero.classList.add("is-in");
    });
  }

  function revealAll() {
    var sections = document.querySelectorAll("[data-section]");

    for (var i = 0; i < sections.length; i += 1) {
      sections[i].classList.add("is-in");
    }
  }

  function watchSections() {
    var sections = document.querySelectorAll("[data-section]");

    if (typeof IntersectionObserver !== "function") {
      revealAll();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i += 1) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add("is-in");
            observer.unobserve(entries[i].target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    for (var i = 0; i < sections.length; i += 1) {
      observer.observe(sections[i]);
    }
  }

  function watchFinal() {
    if (typeof IntersectionObserver !== "function" || !finalSection) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        finalState.visible = entries[0].isIntersecting;
        paintSticky();
      },
      { threshold: 0.35 },
    );

    observer.observe(finalSection);
  }

  function paintSticky() {
    if (!sticky) {
      return;
    }

    var past = window.pageYOffset > (hero ? hero.offsetHeight * 0.7 : 400);
    var up = past && !finalState.visible;

    if (up) {
      sticky.classList.add("is-up");
    } else {
      sticky.classList.remove("is-up");
    }
  }

  /* ------------------------------------------------------------------ boot */

  var lastMode = null;

  function onScroll() {
    paintRoad();
    paintHeader();
    paintSticky();
  }

  function onResize() {
    var mode = isStacked() ? "vertical" : "horizontal";

    if (mode !== lastMode) {
      lastMode = mode;
      buildRoad();
    }

    paintRoad();
  }

  function onLocale() {
    buildRoad();
    paintRoad();
  }

  function onReady() {
    lastMode = isStacked() ? "vertical" : "horizontal";
    buildRoad();

    document.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("resize", onResize);
    document.addEventListener("eduverse:locale", onLocale);

    revealHero();
    watchSections();
    watchFinal();
    paintRoad();
    paintHeader();
    paintSticky();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();