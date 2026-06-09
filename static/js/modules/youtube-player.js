let youtubePlayer = null;

/* YOUTUBE PLAYER */

function createYouTubePlayer(
    youtubeId
) {

    const youtubeContainer =
        document.getElementById(
            'youtubePlayer'
        );

    if (
        !youtubeContainer
    ) {

        console.error(
            'youtubePlayer container not found'
        );

        return;
    }

    /* DESTROY PREVIOUS */

    if (
        youtubePlayer
    ) {

        youtubePlayer.destroy();
    }

    youtubePlayer = new YT.Player(
        'youtubePlayer',
        {

            height: '500',

            width: '100%',

            videoId: youtubeId,

            playerVars: {

                autoplay: 1,

                controls: 1,

                rel: 0
            }
        }
    );
}