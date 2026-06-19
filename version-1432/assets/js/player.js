(function() {
  var shell = document.querySelector('.player-shell');
  if (!shell) {
    return;
  }

  var video = shell.querySelector('video');
  var button = shell.querySelector('.player-overlay');
  var source = shell.getAttribute('data-source');
  var hlsInstance = null;
  var started = false;

  function hideButton() {
    if (button) {
      button.classList.add('is-hidden');
    }
  }

  function startPlayback() {
    if (!video || !source) {
      return;
    }

    hideButton();

    if (!started) {
      started = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', function() {
          video.play().catch(function() {});
        }, { once: true });
      } else {
        video.src = source;
      }
    }

    video.play().catch(function() {});
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', startPlayback);
    video.addEventListener('play', hideButton);
  }

  window.addEventListener('beforeunload', function() {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
