let hls = null;
let youtubePlayer = null;
window.youtubeAPIReady = false;

function onYouTubeIframeAPIReady() {

    window.youtubeAPIReady = true;


}

const MediaController = {

    videoElement: null,

    currentProvider: null,

    init(videoElement) {

        this.videoElement = videoElement;

    },

    load(video) {

        this.destroy();

        switch (video.provider) {

            case 'bunny':

                this.loadBunny(video);

                break;

            case 'local':

                this.loadLocal(video);

                break;

            case 'youtube':

                this.loadYoutube(video);

                break;
        }

    },

    loadBunny(video) {

        this.currentProvider = 'bunny';

        document.getElementById(
            'youtubePlayer'
        ).style.display = 'none';

        this.videoElement.style.display =
            'block';

        if (Hls.isSupported()) {

            hls = new Hls();

            hls.loadSource(video.hls);

            hls.attachMedia(this.videoElement);

            hls.on(
                Hls.Events.MANIFEST_PARSED,
                () => {

                    this.videoElement.play();

                }
            );

        } else {

            this.videoElement.src =
                video.hls;

        }

    },

    loadLocal(video) {

        this.currentProvider = 'local';

        document.getElementById(
            'youtubePlayer'
        ).style.display = 'none';

        this.videoElement.style.display =
            'block';

        this.videoElement.src =
            video.video;

        this.videoElement.play();

    },

    loadYoutube(video) {

        this.currentProvider = 'youtube';

        const videoElement =
            this.videoElement;

        const youtubeContainer =
            document.getElementById(
                'youtubePlayer'
            );

        videoElement.style.display =
            'none';

        youtubeContainer.style.display =
            'block';

        youtubeContainer.innerHTML =
            '<div id="youtubeIframe"></div>';
        
        if (!window.youtubeAPIReady) {

            return;
        }

        new YT.Player(
            'youtubeIframe',
            {

                width: '100%',

                height: '420',

                videoId: video.youtubeId,

                playerVars: {

                    autoplay: 1,

                    controls: 1,

                    rel: 0,
                    
                    enablejsapi: 1,

                    origin: window.location.origin

                },

                events: {

                    onReady: (event) => {

                        youtubePlayer =
                            event.target;

                        window.youtubeReady =
                            true;

                        youtubePlayer.playVideo();

                    }

                }

            }
        );

    },

    play() {

        if (
            this.currentProvider === 'youtube'
        ) {

            youtubePlayer.playVideo();

            return;
        }

        this.videoElement.play();

    },

    pause() {

        if (
            this.currentProvider === 'youtube'
        ) {
            youtubePlayer.pauseVideo();
            return;
        }

        this.videoElement.pause();

    },

    seek(time) {

        if (
            this.currentProvider === 'youtube'
        ) {

            youtubePlayer.seekTo(
                time,
                true
            );

            return;
        }

        this.videoElement.currentTime =
            time;

    },

    getCurrentTime() {

        if (
            this.currentProvider === 'youtube'
        ) {


            if (!youtubePlayer) {

                return 0;
            }


            try {

                return youtubePlayer.getCurrentTime();

            } catch (error) {

                return 0;
            }

        }

        return this.videoElement.currentTime;

    },

    destroy() {
 
        if (youtubePlayer) {
            youtubePlayer.destroy();
            youtubePlayer = null;
        }

        if (hls) {

            hls.destroy();

            hls = null;
        }

        if (!this.videoElement) {

            return;
        }

        this.videoElement.pause();

        this.videoElement.removeAttribute(
            'src'
        );

        this.videoElement.load();

    }


};