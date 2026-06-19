function createMoviePlayer(videoId, overlayId, sourceUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var requestedPlay = false;
  var hlsInstance = null;

  if (!video || !sourceUrl) {
    return;
  }

  function setOverlay(hidden) {
    if (overlay) {
      overlay.classList.toggle('is-hidden', hidden);
    }
  }

  function playVideo() {
    requestedPlay = true;
    setOverlay(true);
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function() {
        setOverlay(false);
      });
    }
  }

  function bindSource() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
        if (requestedPlay) {
          playVideo();
        }
      });
      hlsInstance.on(Hls.Events.ERROR, function(event, data) {
        if (data && data.fatal && hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
          video.src = sourceUrl;
        }
      });
      return;
    }

    video.src = sourceUrl;
  }

  bindSource();

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function() {
    if (video.paused) {
      playVideo();
    }
  });

  video.addEventListener('play', function() {
    setOverlay(true);
  });

  video.addEventListener('pause', function() {
    if (!video.ended) {
      setOverlay(false);
    }
  });
}
