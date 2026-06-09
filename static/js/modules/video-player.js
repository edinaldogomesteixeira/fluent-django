async function loadVideoPage() {

    const response =
        await fetch(

            '/video/',

            {

                credentials: 'same-origin'
            }
        );

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;
}

async function loadPlayPage() {

    const response =
        await fetch(

            '/play/',

            {

                credentials: 'same-origin'
            }
        );

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;
}

function setupPlayVideo(video) {

    const videoElement =
        document.getElementById(
            'playVideo'
        );

    const youtubeContainer =
        document.getElementById(
            'youtubePlayer'
        );

    videoElement.pause();

    videoElement.removeAttribute(
        'src'
    );

    videoElement.style.display =
        'none';

    youtubeContainer.style.display =
        'none';

    if (
        video.provider === 'youtube'
    ) {

        youtubeContainer.style.display =
            'block';

        MediaController.load(video);

        return null;
    }

    let videoUrl = null;

    if (

        video.video &&

        video.video !== 'null' &&

        video.video !== 'undefined'

    ) {

        videoUrl = video.video;
    }

    else if (

        video.hls &&

        video.hls !== 'null' &&

        video.hls !== 'undefined'

    ) {

        videoUrl = video.hls;
    }

    if (!videoUrl) {

        console.error(
            'No valid video source'
        );

        return null;
    }

    videoElement.style.display =
        'block';

    if (
        video.provider === 'local'
    ) {

        videoElement.src =
            `/stream/${video.id}/`;
    }

    else {

        videoElement.src =
            videoUrl;
    }

    videoElement.load();

    return videoElement;
}