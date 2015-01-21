var Slider = (function ($) {
  var currentIndex, itemsNumber, $container, $wrapper, $items, autoSlide, imageSources;

  var speed = 1000;
  var delay = 2000000;
  var width = 600;

  function init() {
    initDomElements();
    bindEvents();

    imageSources = Array.prototype.slice.call($items.find('img')).map(function(item) {
      return $(item).attr('src');
    });

    currentIndex = 0;
    itemsNumber = $items.length;
  }

  function initDomElements() {
    $container = $('.slider-container');
    $wrapper = $container.find('.slider__items-list');
    $items = $container.find('.slider__slide-item');
  }

  function cycleItems() {
    $wrapper.stop(true, true).animate({'margin-left': -currentIndex * width + 'px'}, speed);
  }

  function autoSlideFn() {
    next();

    cycleItems();
  }

  function setAutoSlide(fn, delay) {
    autoSlide = setInterval(fn, delay);
  }

  setAutoSlide(autoSlideFn, delay);

  function bindEvents() {
    $container.on('click', '[data-action=next]', function () {
      next();

      cycleItems();
    });

    $container.on('click', '[data-action=prev]', function () {
      prev();

      cycleItems();
    });


    $container.on('mouseenter', function () {
      clearInterval(autoSlide);
    });

    $container.on('mouseleave', function () {
      setAutoSlide(autoSlideFn, delay);
    });

    $(document).keydown(function (e) {
      switch (e.which) {
        case 37: // left
          leftActionHandler();
          break;

        case 39: // right
          rightActionHandler();
          break;
      }
      //e.preventDefault(); // prevent the default action (scroll / move caret)
    });
  }

  function next() {
    currentIndex += 1;

    if (currentIndex > itemsNumber - 1) {
      currentIndex = 0;
    }
  }

  function prev() {
    currentIndex -= 1;

    if (currentIndex < 0) {
      currentIndex = itemsNumber - 1;
    }
  }

  function leftActionHandler() {
    clearInterval(autoSlide);

    prev();

    cycleItems();

    setAutoSlide(autoSlideFn, delay);
  }

  function rightActionHandler() {
    clearInterval(autoSlide);

    next();

    cycleItems();

    setAutoSlide(autoSlideFn, delay);
  }

  function getCurrentImgSrc() {
    return imageSources[currentIndex];
  }

  function stopAnimation() {
    $wrapper.stop(true, true);
  }

  return {
    init: init,
    left: leftActionHandler,
    right: rightActionHandler,
    getCurrentImgSrc: getCurrentImgSrc,
    stopAnimation: stopAnimation
  }
})(jQuery);


$(function () {
  Slider.init();

  $('.slider__img').click(function (e) {
    //Get clicked link href
    var image_href = $(this).attr("src"),
      $lightbox = $('.lightbox'),
      $lightboxContent = $lightbox.find('.lightbox-content');

    /*
     If the lightbox window HTML already exists in document,
     change the img src to to match the href of whatever link was clicked

     If the lightbox window HTML doesn't exists, create it and insert it.
     (This will only happen the first time around)
     */

    if ($lightbox.length > 0) { // #lightbox exists

      //place href as img src value
      $lightboxContent.html('<img src="' + image_href + '" />');

      //show lightbox window - you could use .show('fast') for a transition
      $lightbox.show();
    } else { //#lightbox does not exist - create and insert (runs 1st time only)

      //create HTML markup for lightbox window
      var lightbox =
        '<div class="lightbox">' +
        '<div data-action="prev" class="arrow arrow_left arrow_visible"></div>' +
        '<div data-action="next" class="arrow arrow_right arrow_visible"></div>' +
        '<p class="lightbox__close">Click to close</p>' +
        '<div class="lightbox-content">' +
        '<img class="lightbox__img" src="' + image_href + '" />' +
        '</div>' +
        '</div>' +
        '</div>';

      //insert lightbox HTML into page
      $('body').append(lightbox);
    }
  });

  //Click anywhere on the page to get rid of lightbox window
  $(document).on('click', '.lightbox', function (e) { //must use live, as the lightbox element is inserted into the DOM
    var $lightbox = $('.lightbox'),
      $actionButtons = $lightbox.find('[data-action]');

    if (e.target !== $actionButtons[0] && e.target !== $actionButtons[1]) {
      Slider.stopAnimation();
      $lightbox.hide();
    } else {
      if (e.target === $actionButtons[0]) {
        Slider.left();
      } else {
        Slider.right();
      }

      $lightbox.find('.lightbox-content').html('<img src="' + Slider.getCurrentImgSrc() + '" />')
    }
  });
});