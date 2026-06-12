(function () {
  "use strict";

  var rail = document.querySelector("#homeportfolio .elb-carousel-rail");
  var track = document.querySelector("#homeportfolio .elb-mockup-track");

  if (!rail || !track) {
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var RAIL_DRAG_THRESHOLD = 8;
  var resetPoint = 0;
  var speed = window.innerWidth < 768 ? 18 : 29;
  var dragging = false;
  var railPointerActive = false;
  var railDragActive = false;
  var railPointerId = null;
  var railPointerCaptured = false;
  var railStartX = 0;
  var railStartY = 0;
  var railStartScrollLeft = 0;
  var railDragDeltaX = 0;
  var railDragMoved = false;
  var railDragFrame = null;
  var railClickSuppressed = false;
  var lightboxOpen = false;
  var currentIndex = 0;
  var positionIndex = 1;
  var items = Array.prototype.slice.call(track.querySelectorAll(".elb-mockup-slide:not([aria-hidden]) img")).map(function (image) {
    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt") || "Service mockup"
    };
  });
  var lightbox = null;
  var lightboxViewport = null;
  var lightboxTrack = null;
  var closeButton = null;
  var resumeTimer = null;
  var dragPointerId = null;
  var dragStartX = 0;
  var dragStartY = 0;
  var dragDeltaX = 0;
  var dragFrame = null;
  var dragActive = false;
  var dragMoved = false;
  var wheelTimer = null;
  var lastFrameTime = 0;
  var railAutoPosition = 0;

  function measure() {
    var duplicate = track.querySelector('[aria-hidden="true"]');
    resetPoint = duplicate && window.getComputedStyle(duplicate).display !== "none" ? track.scrollWidth / 2 : 0;
    speed = window.innerWidth < 768 ? 18 : 29;
    syncRailPosition();
  }

  function tick(timestamp) {
    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    var deltaTime = Math.min(48, timestamp - lastFrameTime);
    var interactionPaused = lightboxOpen || dragging || railDragActive;

    lastFrameTime = timestamp;

    if (!interactionPaused && !reduceMotion.matches && resetPoint > 0) {
      railAutoPosition = normalizeRailValue(railAutoPosition + (speed * (deltaTime / 1000)));
      rail.scrollLeft = railAutoPosition;
    }

    window.requestAnimationFrame(tick);
  }

  function normalizeRailValue(value) {
    if (!resetPoint) {
      return value;
    }

    while (value >= resetPoint) {
      value -= resetPoint;
    }

    while (value < 0) {
      value += resetPoint;
    }

    return value;
  }

  function normalizeRailScroll() {
    if (!resetPoint) {
      return;
    }

    railAutoPosition = normalizeRailValue(rail.scrollLeft);
    rail.scrollLeft = railAutoPosition;
  }

  function syncRailPosition() {
    railAutoPosition = resetPoint ? normalizeRailValue(rail.scrollLeft) : rail.scrollLeft;
  }

  function pauseDrag() {
    window.clearTimeout(resumeTimer);
    dragging = true;
  }

  function resumeDrag(delay) {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(function () {
      dragging = false;
    }, typeof delay === "number" ? delay : 140);
  }

  function captureRailPointer(event) {
    if (railPointerCaptured || !rail.setPointerCapture) {
      return;
    }

    try {
      rail.setPointerCapture(event.pointerId);
      railPointerCaptured = true;
    } catch (error) {
      /* Synthetic QA events may not register an active pointer. */
    }
  }

  function activateRailDrag(event, deltaX) {
    railDragActive = true;
    railDragMoved = true;
    pauseDrag();
    captureRailPointer(event);
    rail.classList.add("is-dragging");

    /* The auto-scroll may have advanced since pointerdown; start from the current visual position. */
    railStartScrollLeft = rail.scrollLeft;
  }

  function startRailDrag(event) {
    if (lightboxOpen || event.button > 0) {
      return;
    }

    railPointerActive = true;
    railDragActive = false;
    syncRailPosition();
    railPointerId = event.pointerId;
    railStartX = event.clientX;
    railStartY = event.clientY;
    railStartScrollLeft = rail.scrollLeft;
    railDragDeltaX = 0;
    railDragMoved = false;
    railClickSuppressed = false;
    railPointerCaptured = false;
  }

  function moveRailDrag(event) {
    if (!railPointerActive || event.pointerId !== railPointerId) {
      return;
    }

    var deltaX = event.clientX - railStartX;
    var deltaY = event.clientY - railStartY;

    railDragDeltaX = deltaX;

    if (Math.abs(deltaX) > RAIL_DRAG_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * .65) {
      event.preventDefault();

      if (!railDragActive) {
        activateRailDrag(event, deltaX);
      }

      railDragMoved = true;
    }

    if (railDragActive) {
      window.cancelAnimationFrame(railDragFrame);
      railDragFrame = window.requestAnimationFrame(function () {
        railAutoPosition = normalizeRailValue(railStartScrollLeft - railDragDeltaX);
        rail.scrollLeft = railAutoPosition;
      });
    }
  }

  function endRailDrag(event) {
    if (!railPointerActive || (event && event.pointerId !== railPointerId)) {
      return;
    }

    var wasDragging = railDragActive;
    railDragActive = false;
    railPointerActive = false;
    railPointerId = null;
    railPointerCaptured = false;
    window.cancelAnimationFrame(railDragFrame);
    syncRailPosition();
    rail.classList.remove("is-dragging");

    if (wasDragging || railDragMoved || Math.abs(railDragDeltaX) > RAIL_DRAG_THRESHOLD) {
      railClickSuppressed = true;
      window.setTimeout(function () {
        railClickSuppressed = false;
      }, 260);
    }

    if (wasDragging) {
      resumeDrag(120);
    }
  }

  function handleRailWheel(event) {
    var horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : 0;

    if (!horizontalDelta && event.shiftKey) {
      horizontalDelta = event.deltaY;
    }

    if (!horizontalDelta) {
      return;
    }

    event.preventDefault();
    pauseDrag();
    railAutoPosition = normalizeRailValue(rail.scrollLeft + horizontalDelta);
    rail.scrollLeft = railAutoPosition;
    resumeDrag(160);
  }

  function suppressClickAfterRailDrag(event) {
    if (!railClickSuppressed) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    railClickSuppressed = false;
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
      '<div class="elb-lightbox-viewport" aria-live="polite">',
      '<div class="elb-lightbox-track"></div>',
      '</div>',
      '<button class="elb-lightbox-nav elb-lightbox-next" type="button" aria-label="Image suivante">›</button>',
      "</div>"
    ].join("");

    document.body.appendChild(lightbox);

    lightboxViewport = lightbox.querySelector(".elb-lightbox-viewport");
    lightboxTrack = lightbox.querySelector(".elb-lightbox-track");
    closeButton = lightbox.querySelector(".elb-lightbox-close");
    renderLightboxSlides();

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
    lightboxTrack.addEventListener("transitionend", normalizeLightboxPosition);
    lightboxViewport.addEventListener("pointerdown", startLightboxDrag);
    lightboxViewport.addEventListener("pointermove", moveLightboxDrag);
    lightboxViewport.addEventListener("pointerup", endLightboxDrag);
    lightboxViewport.addEventListener("pointercancel", endLightboxDrag);
    lightboxViewport.addEventListener("lostpointercapture", endLightboxDrag);
    lightboxViewport.addEventListener("wheel", handleLightboxWheel, { passive: false });
  }

  function getSlides() {
    if (!items.length) {
      return [];
    }

    return [items[items.length - 1]].concat(items, [items[0]]);
  }

  function renderLightboxSlides() {
    if (!lightboxTrack) {
      return;
    }

    lightboxTrack.innerHTML = getSlides().map(function (item) {
      return [
        '<div class="elb-lightbox-slide">',
        '<img class="elb-lightbox-image" src="',
        item.src,
        '" alt="',
        item.alt.replace(/"/g, "&quot;"),
        '" draggable="false" />',
        "</div>"
      ].join("");
    }).join("");
  }

  function getViewportWidth() {
    return lightboxViewport ? lightboxViewport.getBoundingClientRect().width : 0;
  }

  function setTrackTransition(enabled) {
    if (!lightboxTrack) {
      return;
    }

    lightboxTrack.style.transition = enabled ? "" : "none";
  }

  function updateLightboxTransform(deltaX) {
    if (!lightboxTrack) {
      return;
    }

    var viewportWidth = getViewportWidth();
    lightboxTrack.style.transform = "translate3d(" + ((positionIndex * viewportWidth * -1) + (deltaX || 0)) + "px, 0, 0)";
  }

  function setLightboxImage(index, immediate) {
    if (!items.length) {
      return;
    }

    currentIndex = (index + items.length) % items.length;
    positionIndex = currentIndex + 1;
    setTrackTransition(!immediate);
    updateLightboxTransform(0);
    if (immediate) {
      window.requestAnimationFrame(function () {
        setTrackTransition(true);
      });
    }
  }

  function normalizeLightboxPosition() {
    if (!items.length || dragActive) {
      return;
    }

    if (positionIndex === 0) {
      currentIndex = items.length - 1;
      positionIndex = items.length;
    } else if (positionIndex === items.length + 1) {
      currentIndex = 0;
      positionIndex = 1;
    } else {
      currentIndex = positionIndex - 1;
    }

    setTrackTransition(false);
    updateLightboxTransform(0);
    window.requestAnimationFrame(function () {
      setTrackTransition(true);
    });
  }

  function showLightboxItem(index, direction) {
    if (!items.length || !lightboxTrack) {
      return;
    }

    if (!lightbox || !lightboxOpen) {
      setLightboxImage(index, true);
      return;
    }

    lightbox.classList.remove("is-dragging");
    setTrackTransition(true);

    if (index < 0) {
      positionIndex = 0;
    } else if (index >= items.length) {
      positionIndex = items.length + 1;
    } else {
      positionIndex = index + 1;
    }

    currentIndex = (index + items.length) % items.length;
    updateLightboxTransform(0);
  }

  function openLightbox(index) {
    if (!lightbox) {
      buildLightbox();
    }

    setLightboxImage(index, true);
    lightboxOpen = true;
    document.body.classList.add("elb-lightbox-open");
    window.requestAnimationFrame(function () {
      lightbox.classList.add("is-open");
      updateLightboxTransform(0);
    });
    closeButton.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightboxOpen = false;
    dragActive = false;
    dragPointerId = null;
    window.cancelAnimationFrame(dragFrame);
    lightbox.classList.remove("is-dragging");
    lightbox.classList.remove("is-open");
    window.setTimeout(function () {
      document.body.classList.remove("elb-lightbox-open");
    }, 260);
  }

  function startLightboxDrag(event) {
    if (!lightboxOpen || !items.length || event.button > 0) {
      return;
    }

    dragPointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragDeltaX = 0;
    dragMoved = false;
    dragActive = true;
    lightbox.classList.add("is-dragging");
    setTrackTransition(false);
    if (lightboxViewport.setPointerCapture) {
      try {
        lightboxViewport.setPointerCapture(event.pointerId);
      } catch (error) {
        /* Synthetic QA events may not register an active pointer. */
      }
    }
  }

  function moveLightboxDrag(event) {
    if (!dragActive || event.pointerId !== dragPointerId) {
      return;
    }

    var deltaX = event.clientX - dragStartX;
    var deltaY = event.clientY - dragStartY;

    if (Math.abs(deltaX) > 4 && Math.abs(deltaX) > Math.abs(deltaY) * .72) {
      event.preventDefault();
      dragMoved = true;
    }

    dragDeltaX = deltaX;
    window.cancelAnimationFrame(dragFrame);
    dragFrame = window.requestAnimationFrame(function () {
      updateLightboxTransform(dragDeltaX);
    });
  }

  function endLightboxDrag(event) {
    if (!dragActive || (event && event.pointerId !== dragPointerId)) {
      return;
    }

    var threshold = Math.min(90, Math.max(50, getViewportWidth() * .12));
    var deltaX = dragDeltaX;

    dragActive = false;
    dragPointerId = null;
    dragDeltaX = 0;
    lightbox.classList.remove("is-dragging");
    setTrackTransition(true);

    if (deltaX < threshold * -1) {
      showLightboxItem(currentIndex + 1, "next");
    } else if (deltaX > threshold) {
      showLightboxItem(currentIndex - 1, "prev");
    } else {
      updateLightboxTransform(0);
    }
  }

  function handleLightboxWheel(event) {
    if (!lightboxOpen || Math.abs(event.deltaX) < Math.abs(event.deltaY) || Math.abs(event.deltaX) < 24) {
      return;
    }

    event.preventDefault();

    if (wheelTimer) {
      return;
    }

    showLightboxItem(currentIndex + (event.deltaX > 0 ? 1 : -1), event.deltaX > 0 ? "next" : "prev");
    wheelTimer = window.setTimeout(function () {
      wheelTimer = null;
    }, 320);
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
  window.addEventListener("resize", function () {
    if (lightboxOpen) {
      setLightboxImage(currentIndex, true);
    }
  }, { passive: true });
  document.addEventListener("keydown", handleKeydown);
  rail.addEventListener("pointerdown", startRailDrag);
  rail.addEventListener("pointermove", moveRailDrag);
  rail.addEventListener("pointerup", endRailDrag);
  rail.addEventListener("pointercancel", endRailDrag);
  rail.addEventListener("lostpointercapture", endRailDrag);
  rail.addEventListener("wheel", handleRailWheel, { passive: false });
  rail.addEventListener("click", suppressClickAfterRailDrag, true);
  track.addEventListener("click", function (event) {
    var trigger = event.target.closest(".elb-mockup-open");

    if (!trigger) {
      return;
    }

    if (railClickSuppressed) {
      event.preventDefault();
      event.stopPropagation();
      railClickSuppressed = false;
      return;
    }

    openLightbox(Number(trigger.getAttribute("data-mockup-index")) || 0);
  });

  window.requestAnimationFrame(tick);
})();
