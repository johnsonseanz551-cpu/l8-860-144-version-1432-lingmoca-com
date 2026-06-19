(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function siteRoot() {
        return document.body.getAttribute('data-root') || './';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"']/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char];
        });
    }

    function setupMobileMenu() {
        var button = qs('.mobile-menu-button');
        var panel = qs('.mobile-panel');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            var open = panel.classList.toggle('open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function setupSearchForms() {
        qsa('form.site-search').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = qs('input[name="q"]', form);
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    if (input) {
                        input.focus();
                    }
                    return;
                }
                if (!form.getAttribute('action')) {
                    event.preventDefault();
                    window.location.href = siteRoot() + 'search.html?q=' + encodeURIComponent(input.value.trim());
                }
            });
        });
    }

    function setupHero() {
        var root = qs('.hero-carousel');
        if (!root) {
            return;
        }
        var slides = qsa('.hero-slide', root);
        var dots = qsa('.hero-dot', root);
        var prev = qs('.hero-prev', root);
        var next = qs('.hero-next', root);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        start();
    }

    function textMatches(card, query) {
        if (!query) {
            return true;
        }
        var haystack = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        return haystack.indexOf(query.toLowerCase()) !== -1;
    }

    function setupCatalogFilters() {
        qsa('.catalog-filter').forEach(function (box) {
            var input = qs('input', box);
            var select = qs('select', box);
            var container = box.nextElementSibling;
            if (!container) {
                return;
            }
            var cards = qsa('[data-title]', container);
            function apply() {
                var query = input ? input.value.trim() : '';
                var year = select ? select.value : '';
                cards.forEach(function (card) {
                    var okText = textMatches(card, query);
                    var okYear = !year || card.getAttribute('data-year') === year;
                    card.classList.toggle('is-filtered-out', !(okText && okYear));
                });
            }
            if (input) {
                input.addEventListener('input', apply);
            }
            if (select) {
                select.addEventListener('change', apply);
            }
        });
    }

    window.initMoviePlayer = function (videoId, overlayId, sourceUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        if (!video || !overlay || !sourceUrl) {
            return;
        }
        var attached = false;
        var hls = null;
        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }
        }
        function play() {
            attach();
            overlay.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }
        overlay.addEventListener('click', play);
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            overlay.classList.add('is-hidden');
        });
        video.addEventListener('ended', function () {
            overlay.classList.remove('is-hidden');
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    };

    function setupSearchPage() {
        var results = document.getElementById('search-results');
        if (!results || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = (params.get('q') || '').trim();
        var input = qs('.search-page-form input[name="q"]');
        if (input) {
            input.value = query;
        }
        function render(items) {
            if (!items.length) {
                results.innerHTML = '<div class="empty-state">没有找到匹配的影片，请尝试更换关键词。</div>';
                return;
            }
            results.innerHTML = items.slice(0, 120).map(function (item) {
                var title = escapeHtml(item.title);
                var cover = escapeHtml(item.cover);
                var url = escapeHtml(item.url);
                var category = escapeHtml(item.category);
                var duration = escapeHtml(item.duration);
                var description = escapeHtml(item.description);
                var year = escapeHtml(item.year);
                var region = escapeHtml(item.region);
                var type = escapeHtml(item.type);
                return '<a class="movie-card" href="' + url + '" data-title="' + title + '">' +
                    '<figure><img src="' + cover + '" alt="' + title + '"><span class="card-badge">' + category + '</span><span class="card-duration">' + duration + '</span><span class="card-play">▶</span></figure>' +
                    '<div class="card-copy"><h3>' + title + '</h3><p>' + description + '</p><div class="card-meta"><span>' + year + '</span><span>' + region + '</span><span>' + type + '</span></div></div>' +
                    '</a>';
            }).join('');
        }
        if (!query) {
            render(window.SEARCH_MOVIES.slice(0, 60));
            return;
        }
        var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        var matches = window.SEARCH_MOVIES.filter(function (item) {
            var text = [item.title, item.description, item.category, item.year, item.region, item.type, item.genre, item.tags].join(' ').toLowerCase();
            return terms.every(function (term) {
                return text.indexOf(term) !== -1;
            });
        });
        render(matches);
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupSearchForms();
        setupHero();
        setupCatalogFilters();
        setupSearchPage();
    });
})();
