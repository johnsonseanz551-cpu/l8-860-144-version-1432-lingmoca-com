(function() {
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function makeCard(movie) {
    return '<article class="poster-card movie-card">' +
      '<a class="poster-link" href="' + escapeHtml(movie.url) + '">' +
      '<div class="poster-image">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="score-badge">' + escapeHtml(movie.score) + '</span>' +
      '</div>' +
      '<div class="poster-body">' +
      '<div class="card-kicker">' + escapeHtml(movie.category) + ' · ' + escapeHtml(movie.year) + '</div>' +
      '<h3>' + escapeHtml(movie.title) + '</h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="card-meta compact">' +
      '<span>' + escapeHtml(movie.region) + '</span>' +
      '<span>' + escapeHtml(movie.type) + '</span>' +
      '</div>' +
      '<div class="tag-line">' + escapeHtml(movie.tags.join(' ')) + '</div>' +
      '</div>' +
      '</a>' +
      '</article>';
  }

  function normalize(value) {
    return String(value || '').toLowerCase();
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var data = window.movieSearchIndex || [];
    var form = document.querySelector('[data-search-page-form]');
    var input = document.querySelector('[data-search-page-input]');
    var category = document.querySelector('[data-search-page-category]');
    var results = document.querySelector('[data-search-results]');
    var title = document.querySelector('[data-search-title]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (!form || !input || !category || !results) {
      return;
    }

    input.value = initialQuery;

    function render() {
      var keyword = normalize(input.value.trim());
      var categoryValue = category.value;
      var matches = data.filter(function(movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          movie.summary,
          movie.category,
          movie.tags.join(' ')
        ].join(' '));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchCategory = !categoryValue || movie.category === categoryValue;
        return matchKeyword && matchCategory;
      });

      if (!keyword && !categoryValue) {
        matches = matches.slice(0, 60);
        if (title) {
          title.textContent = '热门内容';
        }
      } else if (title) {
        title.textContent = '搜索结果';
      }

      if (!matches.length) {
        results.innerHTML = '<div class="empty-state">没有找到相关内容</div>';
        return;
      }

      results.innerHTML = matches.map(makeCard).join('');
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var query = input.value.trim();
      var nextUrl = query ? './search.html?q=' + encodeURIComponent(query) : './search.html';
      window.history.replaceState({}, '', nextUrl);
      render();
    });

    input.addEventListener('input', render);
    category.addEventListener('change', render);
    render();
  });
}());
