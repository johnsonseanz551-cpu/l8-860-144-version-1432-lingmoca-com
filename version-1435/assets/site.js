(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let heroIndex = 0;

  function setHero(index) {
    if (!heroSlides.length) {
      return;
    }

    heroIndex = (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    heroDots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const index = Number(dot.getAttribute('data-hero-dot')) || 0;
      setHero(index);
    });
  });

  if (heroSlides.length > 1) {
    setInterval(function () {
      setHero(heroIndex + 1);
    }, 5200);
  }

  const filterPanel = document.querySelector('[data-filter-panel]');

  if (filterPanel) {
    const input = filterPanel.querySelector('[data-filter-input]');
    const region = filterPanel.querySelector('[data-filter-region]');
    const type = filterPanel.querySelector('[data-filter-type]');
    const genre = filterPanel.querySelector('[data-filter-genre]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));
    const emptyState = document.querySelector('[data-empty-state]');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function includesText(value, queryText) {
      return String(value || '').toLowerCase().includes(String(queryText || '').toLowerCase());
    }

    function applyFilters() {
      const textValue = input ? input.value.trim().toLowerCase() : '';
      const regionValue = region ? region.value : '';
      const typeValue = type ? type.value : '';
      const genreValue = genre ? genre.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const searchText = card.getAttribute('data-search') || '';
        const cardRegion = card.getAttribute('data-region') || '';
        const cardType = card.getAttribute('data-type') || '';
        const cardGenre = card.getAttribute('data-genre') || '';
        const matched = includesText(searchText, textValue)
          && (!regionValue || cardRegion === regionValue)
          && (!typeValue || cardType === typeValue)
          && (!genreValue || includesText(cardGenre, genreValue));

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, region, type, genre].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
