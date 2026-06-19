(function () {
  function setupMoviePlayer(options) {
    var video = document.querySelector(options.video);
    var cover = document.querySelector(options.cover);
    var hlsInstance = null;
    var started = false;

    if (!video || !cover || !options.source) {
      return;
    }

    function attachSource() {
      if (started) {
        return;
      }

      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(options.source);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = options.source;
    }

    function playVideo() {
      attachSource();
      cover.classList.add("is-hidden");

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    cover.addEventListener("click", playVideo);

    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });

    video.addEventListener("ended", function () {
      cover.classList.remove("is-hidden");
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
