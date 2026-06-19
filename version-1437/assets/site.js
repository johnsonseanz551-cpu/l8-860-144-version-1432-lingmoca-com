(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    showSlide(0);
    startTimer();
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));

  forms.forEach(function (form) {
    var scope = form.parentElement || document;
    var input = form.querySelector("[data-search-input]");
    var year = form.querySelector("[data-year-filter]");
    var genre = form.querySelector("[data-genre-filter]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var keyword = normalize(input && input.value);
      var yearValue = normalize(year && year.value);
      var genreValue = normalize(genre && genre.value);

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year")
        ].join(" "));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardGenre = normalize(card.getAttribute("data-genre"));
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedYear = !yearValue || cardYear === yearValue;
        var matchedGenre = !genreValue || cardGenre.indexOf(genreValue) !== -1;

        card.classList.toggle("is-hidden", !(matchedKeyword && matchedYear && matchedGenre));
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      applyFilters();
    });

    if (input) {
      input.addEventListener("input", applyFilters);
    }

    if (year) {
      year.addEventListener("change", applyFilters);
    }

    if (genre) {
      genre.addEventListener("change", applyFilters);
    }
  });
})();
