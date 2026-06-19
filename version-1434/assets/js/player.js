(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));

    shells.forEach(function (shell) {
        var video = shell.querySelector('video');
        var source = video ? video.querySelector('source') : null;
        var button = shell.querySelector('.play-toggle');
        var sourceUrl = source ? source.getAttribute('src') : '';
        var ready = false;
        var hls = null;

        function prepare() {
            if (ready || !video || !sourceUrl) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(sourceUrl);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = sourceUrl;
            } else {
                video.src = sourceUrl;
            }

            ready = true;
        }

        function play() {
            prepare();
            shell.classList.add('is-playing');
            var playResult = video.play();

            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    shell.classList.remove('is-playing');
                });
            }
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                play();
            });
        }

        shell.addEventListener('click', function (event) {
            if (event.target === video) {
                return;
            }

            if (!shell.classList.contains('is-playing')) {
                play();
            }
        });

        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });

        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                shell.classList.remove('is-playing');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
}());
