(function () {
    function qs(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function qsa(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = qs("[data-menu-button]");
        var nav = qs("[data-main-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = qs("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = qsa("[data-hero-slide]", hero);
        var dots = qsa("[data-hero-dot]", hero);
        if (slides.length < 2) {
            return;
        }
        var active = 0;
        var timer;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }
        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(active + 1);
            }, 5200);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                play();
            });
        });
        hero.addEventListener("mouseenter", function () {
            clearInterval(timer);
        });
        hero.addEventListener("mouseleave", play);
        show(0);
        play();
    }

    function initCardFilters() {
        var panels = qsa("[data-filter-panel]");
        panels.forEach(function (panel) {
            var list = qs("[data-card-list]");
            var input = qs("[data-card-filter]", panel);
            var select = qs("[data-card-sort]", panel);
            if (!list) {
                return;
            }
            var cards = qsa("[data-movie-card]", list);
            function update() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-genre") || ""
                    ].join(" ").toLowerCase();
                    card.style.display = !keyword || text.indexOf(keyword) !== -1 ? "" : "none";
                });
                if (select) {
                    var mode = select.value;
                    cards.sort(function (a, b) {
                        var av = Number(a.getAttribute("data-" + mode) || 0);
                        var bv = Number(b.getAttribute("data-" + mode) || 0);
                        return bv - av;
                    });
                    cards.forEach(function (card) {
                        list.appendChild(card);
                    });
                }
            }
            if (input) {
                input.addEventListener("input", update);
            }
            if (select) {
                select.addEventListener("change", update);
            }
            update();
        });
    }

    function cardHtml(movie) {
        return [
            '<article class="movie-card">',
            '<a class="poster-link" href="' + movie.detailUrl + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '<span class="poster-frame">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
            '<span class="poster-gradient"></span>',
            '<span class="play-chip">播放</span>',
            '</span>',
            '</a>',
            '<div class="card-body">',
            '<div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span><a href="' + movie.categoryUrl + '">' + escapeHtml(movie.categoryName) + '</a></div>',
            '<h3><a href="' + movie.detailUrl + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="card-tags">' + movie.tags.slice(0, 3).map(function (tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function initSearchPage() {
        var container = qs("#search-results");
        if (!container || !window.SEARCH_MOVIES) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var q = (params.get("q") || "").trim();
        var input = qs("[data-search-input]");
        if (input) {
            input.value = q;
        }
        if (!q) {
            container.innerHTML = '<div class="search-empty"><h2>输入关键词开始搜索</h2><p>可按片名、年份、地区、题材或标签查找影视内容。</p></div>';
            return;
        }
        var keyword = q.toLowerCase();
        var results = window.SEARCH_MOVIES.filter(function (movie) {
            return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags.join(" "), movie.oneLine, movie.categoryName]
                .join(" ")
                .toLowerCase()
                .indexOf(keyword) !== -1;
        }).slice(0, 96);
        if (!results.length) {
            container.innerHTML = '<div class="search-empty"><h2>没有找到相关内容</h2><p>可以尝试更换片名、题材或年份继续检索。</p></div>';
            return;
        }
        container.innerHTML = '<div class="section-heading"><div><span class="eyebrow">搜索结果</span><h2>' + escapeHtml(q) + '</h2><p>以下内容与关键词匹配，可直接进入详情页观看。</p></div></div><div class="movie-grid">' + results.map(cardHtml).join('') + '</div>';
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initHero();
        initCardFilters();
        initSearchPage();
    });
}());
