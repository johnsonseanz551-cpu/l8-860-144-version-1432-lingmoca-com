(function () {
    window.setupPlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var trigger = document.getElementById(options.triggerId);
        var source = options.source;
        var hls = null;
        var ready = false;

        if (!video || !trigger || !source) {
            return;
        }

        function hideTrigger() {
            trigger.classList.add("is-hidden");
        }

        function playVideo() {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    trigger.classList.remove("is-hidden");
                });
            }
        }

        function attachNative() {
            if (!ready) {
                video.src = source;
                ready = true;
            }
            playVideo();
        }

        function attachHls() {
            if (ready) {
                playVideo();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    ready = true;
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        ready = false;
                        trigger.classList.remove("is-hidden");
                    }
                });
            } else {
                video.src = source;
                ready = true;
                playVideo();
            }
        }

        function start() {
            hideTrigger();
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                attachNative();
            } else {
                attachHls();
            }
        }

        trigger.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", hideTrigger);
        video.addEventListener("ended", function () {
            trigger.classList.remove("is-hidden");
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
}());
