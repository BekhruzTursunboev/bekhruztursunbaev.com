/**
 * The entire client-side runtime for this site.
 *
 * Loaded with `defer`, and nothing on the page depends on it to be readable:
 * the reveal classes only hide content once this file confirms it can animate
 * it back in. If the script never arrives, the page is simply static.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ------------------------------------------------------------------ theme */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    var themingTimer = 0;
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "light" ? "dark" : "light";
      // Arm the colour cross-fade for the length of this switch only; left on
      // permanently it would smear every hover on the page.
      if (!reduced) {
        root.classList.add("theming");
        clearTimeout(themingTimer);
        themingTimer = setTimeout(function () {
          root.classList.remove("theming");
        }, 380);
      }
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode, or site data blocked: the choice just won't persist */
      }
    });
  }

  /* ----------------------------------------------------------------- reveal */
  var animated = Array.prototype.slice.call(
    document.querySelectorAll(".reveal, .wipe, .line-mask")
  );

  function play(el) {
    el.classList.add("in");
  }

  if (animated.length && !reduced && "IntersectionObserver" in window) {
    // Arming here, rather than in the stylesheet, is what keeps the page
    // readable without JavaScript: the hidden state only ever exists in a
    // browser that has already proven it can undo it.
    root.classList.add("motion-ready");

    var io = new IntersectionObserver(
      function (entries, obs) {
        for (var n = 0; n < entries.length; n++) {
          if (!entries[n].isIntersecting) continue;
          play(entries[n].target);
          obs.unobserve(entries[n].target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
    );
    animated.forEach(function (el) {
      io.observe(el);
    });

    // A tab that was throttled while hidden can miss its callbacks, so catch up
    // on everything already scrolled past when it comes back.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      animated.forEach(function (el) {
        if (!el.classList.contains("in") && el.getBoundingClientRect().top < window.innerHeight) {
          play(el);
        }
      });
    });
  }

  /* ------------------------------------------------------------- menu drawer */
  // The panel starts with the `hidden` attribute in the markup, so without this
  // script it simply does not exist rather than sitting invisibly over the page.
  var menuToggle = document.getElementById("menu-toggle");
  var menuClose = document.getElementById("menu-close");
  var panel = document.querySelector("[data-menu-panel]");
  var backdrop = document.querySelector("[data-menu-backdrop]");

  if (menuToggle && panel && backdrop) {
    var menuOpen = false;

    function setMenu(open) {
      if (open === menuOpen) return;
      menuOpen = open;

      if (open) {
        panel.hidden = false;
        backdrop.hidden = false;
        // Reading the layout forces a frame with the panel still offscreen, so
        // the transform transition actually runs instead of being skipped.
        void panel.offsetWidth;
      }

      root.toggleAttribute("data-menu-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close section menu" : "Open section menu");
      // Lock the page behind the drawer without losing scroll position.
      document.body.style.overflow = open ? "hidden" : "";

      if (open) {
        (menuClose || panel).focus({ preventScroll: true });
      } else {
        menuToggle.focus({ preventScroll: true });
        // Wait out the slide before removing it from the tree.
        window.setTimeout(function () {
          if (!menuOpen) {
            panel.hidden = true;
            backdrop.hidden = true;
          }
        }, reduced ? 0 : 450);
      }
    }

    if (menuClose) menuClose.setAttribute("tabindex", "0");
    menuToggle.addEventListener("click", function () {
      setMenu(!menuOpen);
    });
    if (menuClose) menuClose.addEventListener("click", function () { setMenu(false); });
    backdrop.addEventListener("click", function () { setMenu(false); });

    // Anchor links jump within the same page, so the drawer has to get out of
    // the way itself.
    Array.prototype.forEach.call(panel.querySelectorAll("[data-menu-link]"), function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (event) {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        setMenu(false);
        return;
      }
      if (event.key !== "Tab") return;
      // Keep Tab inside the drawer while it is open.
      var focusable = panel.querySelectorAll("a[href], button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Rotating to a wide viewport reveals the desktop nav; the drawer should go.
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------ media */
  // Fade each image up when it is actually decoded. Images already in cache
  // fire `load` before this script runs, so `complete` has to be checked first
  // or they would stay at zero opacity forever.
  Array.prototype.forEach.call(document.querySelectorAll(".shot img, .portrait-frame img"), function (img) {
    if (img.complete && img.naturalWidth) {
      img.classList.add("loaded");
      return;
    }
    img.addEventListener("load", function () {
      img.classList.add("loaded");
    });
    // A broken image must not leave a permanently invisible hole.
    img.addEventListener("error", function () {
      img.classList.add("loaded");
    });
  });

  /* ---------------------------------------------------- scroll-driven chrome */
  var progress = document.querySelector("[data-progress]");
  var nav = document.querySelector("[data-nav]");
  var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax] img"));
  var spySections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy]"));
  var frame = 0;
  // Elements still waiting to play, used by the scroll backstop below.
  var pending = animated.slice();

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(function () {
      frame = 0;
      var y = window.pageYOffset;

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty("--p", max > 0 ? Math.min(y / max, 1) : 0);
      }

      if (nav) nav.dataset.stuck = y > 24 ? "true" : "false";

      if (!reduced) {
        for (var p = 0; p < parallax.length; p++) {
          var rect = parallax[p].getBoundingClientRect();
          var t = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
          parallax[p].style.setProperty("--shift", (-t * 18).toFixed(2) + "px");
        }
      }

      // Backstop: reveal anything the reader has already scrolled past that the
      // observer somehow missed. Cheap, and it means a single missed callback
      // can never leave a hole in the page.
      if (pending.length) {
        for (var q = pending.length - 1; q >= 0; q--) {
          if (pending[q].classList.contains("in")) {
            pending.splice(q, 1);
          } else if (pending[q].getBoundingClientRect().top < window.innerHeight) {
            play(pending[q]);
            pending.splice(q, 1);
          }
        }
      }

      if (spyLinks.length) {
        // Whichever section top has most recently crossed a third of the way
        // down the viewport is the one being read.
        var line = window.innerHeight * 0.34;
        var active = "";
        for (var s = 0; s < spySections.length; s++) {
          if (spySections[s].getBoundingClientRect().top <= line) active = spySections[s].id;
        }
        for (var l = 0; l < spyLinks.length; l++) {
          spyLinks[l].dataset.active = spyLinks[l].dataset.spy === active ? "true" : "false";
        }
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------- pointer */
  if (finePointer && !reduced) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = parseFloat(el.dataset.magnet || "0.28");
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        var dx = event.clientX - (rect.left + rect.width / 2);
        var dy = event.clientY - (rect.top + rect.height / 2);
        el.style.setProperty("--mx", (dx * strength).toFixed(2) + "px");
        el.style.setProperty("--my", (dy * strength).toFixed(2) + "px");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    });

    document.querySelectorAll(".spotlight").forEach(function (el) {
      el.addEventListener("pointermove", function (event) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty("--sx", (((event.clientX - rect.left) / rect.width) * 100).toFixed(1) + "%");
        el.style.setProperty("--sy", (((event.clientY - rect.top) / rect.height) * 100).toFixed(1) + "%");
      });
    });
  }
})();
