(function () {
  const mobileButton = document.querySelector('[data-mobile-menu]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
      mobileButton.setAttribute('aria-expanded', mobilePanel.classList.contains('open') ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let current = 0;
    let timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  const filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    const cards = Array.from(filterRoot.querySelectorAll('[data-card]'));
    const filterButtons = Array.from(document.querySelectorAll('[data-filter-value]'));
    const quickSearch = document.querySelector('[data-inline-filter]');
    let activeValue = 'all';
    let searchValue = '';

    function matchCard(card) {
      const filterText = [card.dataset.type, card.dataset.region, card.dataset.year, card.dataset.genre, card.dataset.category].join(' ');
      const targetText = (card.dataset.search || '').toLowerCase();
      const okFilter = activeValue === 'all' || filterText.indexOf(activeValue) !== -1;
      const okSearch = !searchValue || targetText.indexOf(searchValue) !== -1;
      return okFilter && okSearch;
    }

    function applyFilters() {
      cards.forEach(function (card) {
        card.classList.toggle('hidden-card', !matchCard(card));
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeValue = button.dataset.filterValue || 'all';
        filterButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters();
      });
    });

    if (quickSearch) {
      quickSearch.addEventListener('input', function () {
        searchValue = quickSearch.value.trim().toLowerCase();
        applyFilters();
      });
    }
  }

  const searchMount = document.querySelector('[data-search-results]');
  if (searchMount && Array.isArray(window.SEARCH_MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim().toLowerCase();
    const title = document.querySelector('[data-search-title]');
    if (title) {
      title.textContent = query ? '搜索结果：' + params.get('q') : '搜索影片';
    }

    if (!query) {
      searchMount.innerHTML = '<div class="empty-state">输入影片名称、地区、类型或标签，快速找到想看的内容。</div>';
      return;
    }

    const results = window.SEARCH_MOVIES.filter(function (movie) {
      return movie.search.indexOf(query) !== -1;
    }).slice(0, 160);

    if (!results.length) {
      searchMount.innerHTML = '<div class="empty-state">没有找到相关内容。</div>';
      return;
    }

    searchMount.innerHTML = results.map(function (movie) {
      return '<a class="movie-card" href="' + movie.url + '">' +
        '<div class="card-poster"><img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '" loading="lazy"><span class="badge-year">' + movie.year + '</span></div>' +
        '<div class="card-body"><h2 class="card-title">' + movie.title + '</h2><p class="card-summary">' + movie.oneLine + '</p><div class="card-meta"><span>' + movie.region + '</span><span class="card-chip">' + movie.type + '</span></div></div>' +
        '</a>';
    }).join('');
  }
})();
