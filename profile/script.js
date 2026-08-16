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

    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
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
})();
