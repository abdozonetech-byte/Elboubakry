(function () {
  "use strict";

  var rail = document.querySelector("#homeportfolio .elb-carousel-rail");
  var track = document.querySelector("#homeportfolio .elb-mockup-track");

  if (!rail || !track) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var resetPoint = 0;
  var speed = window.innerWidth < 768 ? 18 : 29;
  var dragging = false;
  var lightboxOpen = false;
  var switching = false;
  var currentIndex = 0;
  var items = Array.prototype.slice.call(track.querySelectorAll(".elb-mockup-slide:not([aria-hidden]) img")).map(function (image) {
    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || "Service mockup"
    };
  });
  var lightbox = null;
  var lightboxImage = null;
  var closeButton = null;
  var resumeTimer = null;
  var switchTimer = null;
  var touchStartX = 0;
  var touchStartY = 0;

  function measure() {
    var duplicate = track.querySelector('[aria-hidden="true"]');
    resetPoint = duplicate && window.getComputedStyle(duplicate).display !== "none" ? track.scrollWidth / 2 : 0;
    speed = window.innerWidth < 768 ? 18 : 29;
  }

  function tick() {
    var interactionPaused = lightboxOpen || dragging || rail.contains(document.activeElement);

    if (!interactionPaused && !reduceMotion.matches && resetPoint > 0) {
      rail.scrollLeft += speed / 20;

      if (rail.scrollLeft >= resetPoint) {
        rail.scrollLeft -= resetPoint;
      }
    }
  }

  function pauseDrag() {
    window.clearTimeout(resumeTimer);
    dragging = true;
  }

  function resumeDrag() {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function () {
      dragging = false;
    }, 700);
  }

  function buildLightbox() {
    lightbox = document.createElement("div");
    lightbox.className = "elb-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Aperçu agrandi du mockup");
    lightbox.innerHTML = [
      '<div class="elb-lightbox-panel">',
      '<button class="elb-lightbox-close" type="button" aria-label="Fermer l’aperçu">&times;</button>',
      '<button class="elb-lightbox-nav elb-lightbox-prev" type="button" aria-label="Image précédente">‹</button>',
      '<img class="elb-lightbox-image" alt="" />',
      '<button class="elb-lightbox-nav elb-lightbox-next" type="button" aria-label="Image suivante">›</button>',
      "</div>"
    ].join("");

    document.body.appendChild(lightbox);

    lightboxImage = lightbox.querySelector(".elb-lightbox-image");
    closeButton = lightbox.querySelector(".elb-lightbox-close");

    closeButton.addEventListener("click", closeLightbox);
    lightbox.querySelector(".elb-lightbox-prev").addEventListener("click", function () {
      showLightboxItem(currentIndex - 1, "prev");
    });
    lightbox.querySelector(".elb-lightbox-next").addEventListener("click", function () {
      showLightboxItem(currentIndex + 1, "next");
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    lightbox.addEventListener("touchstart", function (event) {
      if (!event.touches || !event.touches.length) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (!event.changedTouches || !event.changedTouches.length) {
        return;
      }

      var deltaX = event.changedTouches[0].clientX - touchStartX;
      var deltaY = event.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        showLightboxItem(currentIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? "next" : "prev");
      }
    }, { passive: true });
  }

  function setLightboxImage(index) {
    if (!items.length) {
      return;
    }

    currentIndex = (index + items.length) % items.length;
    lightboxImage.src = items[currentIndex].src;
    lightboxImage.alt = items[currentIndex].alt;
  }

  function showLightboxItem(index, direction) {
    if (!items.length || switching) {
      return;
    }

    if (!lightbox || !lightboxOpen || !lightboxImage.src) {
      setLightboxImage(index);
      return;
    }

    switching = true;
    window.clearTimeout(switchTimer);
    lightbox.classList.remove("is-switching-prev", "is-switching-next");
    lightbox.classList.add(direction === "prev" ? "is-switching-prev" : "is-switching-next");

    switchTimer = window.setTimeout(function () {
      setLightboxImage(index);
      lightbox.classList.remove("is-switching-prev", "is-switching-next");
      lightbox.classList.add("is-switching-in");

      switchTimer = window.setTimeout(function () {
        lightbox.classList.remove("is-switching-in");
        switching = false;
      }, 180);
    }, 150);
  }

  function openLightbox(index) {
    if (!lightbox) {
      buildLightbox();
    }

    setLightboxImage(index);
    lightboxOpen = true;
    document.body.classList.add("elb-lightbox-open");
    window.requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
    });
    closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightboxOpen = false;
    switching = false;
    window.clearTimeout(switchTimer);
    lightbox.classList.remove("is-switching-prev", "is-switching-next", "is-switching-in");
    lightbox.classList.remove("is-open");
    window.setTimeout(function () {
      document.body.classList.remove("elb-lightbox-open");
    }, 260);
  }

  function handleKeydown(event) {
    if (!lightboxOpen) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showLightboxItem(currentIndex - 1, "prev");
    } else if (event.key === "ArrowRight") {
      showLightboxItem(currentIndex + 1, "next");
    }
  }

  measure();
  window.addEventListener("resize", measure, { passive: true });
  document.addEventListener("keydown", handleKeydown);
  rail.addEventListener("touchstart", pauseDrag, { passive: true });
  rail.addEventListener("touchend", resumeDrag, { passive: true });
  rail.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      pauseDrag();
    }
  }, { passive: true });
  rail.addEventListener("pointerup", function (event) {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      resumeDrag();
    }
  }, { passive: true });
  rail.addEventListener("pointercancel", resumeDrag, { passive: true });
  track.addEventListener("click", function (event) {
    var trigger = event.target.closest(".elb-mockup-open");

    if (!trigger) {
      return;
    }

    openLightbox(Number(trigger.getAttribute("data-mockup-index")) || 0);
  });

  window.setInterval(tick, 50);
})();
