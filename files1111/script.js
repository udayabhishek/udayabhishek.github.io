(function () {
  "use strict";

  /* -------- Mobile nav toggle -------- */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* -------- Active nav link on scroll -------- */
  var navAnchors = document.querySelectorAll("[data-nav]");
  var sections = Array.prototype.map.call(navAnchors, function (a) {
    var id = a.getAttribute("href").slice(1);
    return document.getElementById(id);
  }).filter(Boolean);

  function setActive() {
    var scrollPos = window.scrollY + 120;
    var current = null;
    var currentTop = -Infinity;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop > currentTop) {
        current = sec;
        currentTop = sec.offsetTop;
      }
    });

    navAnchors.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      a.classList.toggle("active", current && current.id === id);
    });
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        setActive();
        ticking = false;
      });
      ticking = true;
    }
  });
  setActive();

  /* -------- Scroll reveal -------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* -------- Count-up numbers -------- */
  var countEls = document.querySelectorAll(".count-up");
  var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;

    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    var duration = 1100;
    var start = null;

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = easeOutCubic(progress);
      var current = target * eased;
      el.textContent = current.toFixed(decimals);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }

    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && countEls.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    countEls.forEach(function (el) { countObserver.observe(el); });
  } else {
    countEls.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }
})();
