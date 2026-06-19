(function () {
    var input = document.getElementById('global-search-input');
    var results = document.getElementById('search-results');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function render(value) {
        var keyword = normalize(value);
        var items = window.SearchMovies || [];
        var matched = items.filter(function (item) {
            var haystack = normalize([
                item.title,
                item.category,
                item.year,
                item.region,
                item.type,
                (item.tags || []).join(' '),
                item.line
            ].join(' '));
            return !keyword || haystack.indexOf(keyword) !== -1;
        }).slice(0, 80);

        if (!results) {
            return;
        }

        if (!matched.length) {
            results.innerHTML = '<p class="empty-state">未找到相关影片</p>';
            return;
        }

        results.innerHTML = matched.map(function (item) {
            return '<a class="search-result-item" href="' + escapeHtml(item.url) + '">' +
                '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
                '<span><h2>' + escapeHtml(item.title) + '</h2>' +
                '<p>' + escapeHtml(item.category + ' · ' + item.region + ' · ' + (item.year || '热播')) + '</p>' +
                '<p>' + escapeHtml(item.line) + '</p></span></a>';
        }).join('');
    }

    if (input) {
        input.value = query;
        input.addEventListener('input', function () {
            render(input.value);
        });
    }

    render(query);
}());
