(function () {
  const video = document.getElementById('movie-player');
  const overlay = document.querySelector('[data-play-overlay]');
  const source = typeof movieVideoSource === 'string' ? movieVideoSource : '';

  if (!video || !source) {
    return;
  }

  let ready = false;
  let hls = null;

  function hideOverlay() {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  function prepareVideo() {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source);
      hls.attachMedia(video);
      ready = true;
    }
  }

  function startVideo() {
    prepareVideo();
    hideOverlay();
    const playRequest = video.play();
    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startVideo();
    }
  });

  video.addEventListener('play', hideOverlay);
  video.addEventListener('loadedmetadata', hideOverlay);
  video.addEventListener('error', function () {
    if (hls) {
      hls.destroy();
      hls = null;
      ready = false;
    }
  });
})();
