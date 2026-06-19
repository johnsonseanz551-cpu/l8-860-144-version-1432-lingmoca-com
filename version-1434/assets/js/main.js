(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    var prev = document.querySelector('.hero-control.prev');
    var next = document.querySelector('.hero-control.next');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === current);
        });
    }

    function startHero() {
        if (timer || slides.length < 2) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5600);
    }

    function stopHero() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    if (prev) {
        prev.addEventListener('click', function () {
            stopHero();
            showSlide(current - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            stopHero();
            showSlide(current + 1);
            startHero();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            stopHero();
            showSlide(index);
            startHero();
        });
    });

    startHero();

    var filterInput = document.querySelector('.page-filter');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.filter-chips button'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.catalog-grid .movie-card'));
    var activeFilter = '';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
        var keyword = normalize(filterInput ? filterInput.value : '');
        var filter = normalize(activeFilter);

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-category'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-year')
            ].join(' '));
            var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchFilter = !filter || haystack.indexOf(filter) !== -1;
            card.classList.toggle('is-hidden', !(matchKeyword && matchFilter));
        });
    }

    if (filterInput) {
        filterInput.addEventListener('input', applyFilter);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            filterButtons.forEach(function (item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
            activeFilter = button.getAttribute('data-filter') || '';
            applyFilter();
        });
    });
}());
