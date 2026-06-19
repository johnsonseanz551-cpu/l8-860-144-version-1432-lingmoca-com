(function () {
  const video = document.querySelector('[data-player]');
  const cover = document.querySelector('[data-start]');

  if (!video || !cover) {
    return;
  }

  const stream = video.getAttribute('data-stream');
  let ready = false;

  function bindStream() {
    if (ready || !stream) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function playVideo() {
    bindStream();
    cover.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  cover.addEventListener('click', playVideo);

  video.addEventListener('click', function () {
    if (!ready) {
      playVideo();
    }
  });
})();
