(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function() {
      menu.classList.toggle('is-open');
      button.textContent = menu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function initSiteSearch() {
    document.querySelectorAll('[data-site-search]').forEach(function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var target = form.getAttribute('action') || './search.html';
        if (query) {
          window.location.href = target + '?q=' + encodeURIComponent(query);
        } else {
          window.location.href = target;
        }
      });
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer;

    function setSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function move(step) {
      setSlide(current + step);
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        move(1);
      }, 5000);
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        setSlide(index);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        move(-1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        move(1);
        restart();
      });
    }

    restart();
  }

  function initLocalFilter() {
    document.querySelectorAll('[data-local-filter]').forEach(function(panel) {
      var input = panel.querySelector('[data-filter-input]');
      var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-tag]'));
      var cards = Array.prototype.slice.call(panel.querySelectorAll('.movie-card'));
      var activeTag = 'all';

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        cards.forEach(function(card) {
          var text = (card.getAttribute('data-filter') || '').toLowerCase();
          var tags = card.getAttribute('data-tags') || '';
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchTag = activeTag === 'all' || tags.indexOf(activeTag) !== -1;
          card.classList.toggle('is-hidden', !(matchKeyword && matchTag));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          activeTag = button.getAttribute('data-filter-tag') || 'all';
          buttons.forEach(function(item) {
            item.classList.toggle('is-active', item === button);
          });
          apply();
        });
      });
    });
  }

  ready(function() {
    initMenu();
    initSiteSearch();
    initHero();
    initLocalFilter();
  });
}());
