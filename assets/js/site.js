(function() {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function() {
      var isOpen = mobilePanel.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var topButton = document.querySelector('.back-to-top');
  if (topButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 360) {
        topButton.classList.add('is-visible');
      } else {
        topButton.classList.remove('is-visible');
      }
    }, { passive: true });
    topButton.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(index + 1);
        schedule();
      });
    }

    schedule();
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var searchInput = document.querySelector('.page-search input[name="q"]');
  if (searchInput && query) {
    searchInput.value = query;
  }

  var results = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');
  var searchSummary = document.querySelector('[data-search-summary]');
  if (results && query && Array.isArray(window.MOVIES)) {
    var lowerQuery = query.toLowerCase();
    var matched = window.MOVIES.filter(function(movie) {
      return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase().indexOf(lowerQuery) !== -1;
    }).slice(0, 80);

    if (searchTitle) {
      searchTitle.textContent = '搜索：' + query;
    }
    if (searchSummary) {
      searchSummary.textContent = matched.length ? '以下内容与关键词相关。' : '暂未找到匹配内容，可尝试更换关键词。';
    }
    results.innerHTML = matched.map(function(movie) {
      return '<article class="movie-card">' +
        '<a class="movie-poster" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
        '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '<span class="poster-play">▶</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
        '<div class="movie-badges"><span>' + escapeHtml(movie.year || movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
        '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p>' +
        '<div class="movie-card-foot"><span>' + escapeHtml(movie.genre) + '</span><a href="' + movie.url + '">立即观看</a></div>' +
        '</div>' +
        '</article>';
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function(char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }
})();
