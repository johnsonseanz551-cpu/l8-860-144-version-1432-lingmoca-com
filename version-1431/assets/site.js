(function () {
    function setupMobileMenu() {
        var button = document.querySelector('.mobile-menu-button');
        var menu = document.querySelector('.mobile-menu');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            var open = menu.classList.toggle('hidden') === false;
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            button.textContent = open ? '×' : '☰';
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        if (slides.length === 0) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
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
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
        if (scopes.length === 0) {
            return;
        }
        var queryInput = document.querySelector('[data-filter-input]');
        var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-field]'));
        var autofill = document.querySelector('[data-autofill-query]');
        if (autofill) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                autofill.value = q;
            }
        }
        function normalized(value) {
            return String(value || '').toLowerCase().trim();
        }
        function matches(card, query, filters) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
            if (query && haystack.indexOf(query) === -1) {
                return false;
            }
            return filters.every(function (filter) {
                if (!filter.value) {
                    return true;
                }
                return normalized(card.getAttribute('data-' + filter.field)) === filter.value;
            });
        }
        function apply() {
            var query = normalized(queryInput ? queryInput.value : '');
            var filters = selects.map(function (select) {
                return {
                    field: select.getAttribute('data-filter-field'),
                    value: normalized(select.value)
                };
            });
            scopes.forEach(function (scope) {
                var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
                cards.forEach(function (card) {
                    card.setAttribute('data-hidden', matches(card, query, filters) ? 'false' : 'true');
                });
            });
        }
        if (queryInput) {
            queryInput.addEventListener('input', apply);
        }
        selects.forEach(function (select) {
            select.addEventListener('change', apply);
        });
        apply();
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('video[data-src]'));
        players.forEach(function (video) {
            var wrap = video.closest('.player-wrap');
            var button = wrap ? wrap.querySelector('[data-play-button]') : null;
            var source = video.getAttribute('data-src');
            function loadSource() {
                if (video.getAttribute('data-loaded') === 'true') {
                    return;
                }
                video.setAttribute('data-loaded', 'true');
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    video._hls = hls;
                } else {
                    video.src = source;
                }
            }
            function playVideo() {
                loadSource();
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {});
                }
            }
            if (button) {
                button.addEventListener('click', playVideo);
            }
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
            video.addEventListener('pause', function () {
                if (button && video.currentTime === 0) {
                    button.classList.remove('is-hidden');
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
        setupPlayers();
    });
})();
