let lastProgressSave = 0;

async function saveProgress(
    videoId,
    currentSeconds,
    durationSeconds
) {

    const progressPercent =

        durationSeconds > 0

            ? (

                currentSeconds /
                durationSeconds

            ) * 100

            : 0;

    try {

        await fetch(

            '/api/progress/save/',

            {

                method: 'POST',

                credentials: 'same-origin',

                headers: {

                    'Content-Type':
                        'application/json',
                },

                body: JSON.stringify({

                    video_id: videoId,

                    current_seconds:
                        currentSeconds,

                    duration_seconds:
                        durationSeconds,

                    progress_percent:
                        progressPercent,
                })
            }
        );

    } catch (error) {

        console.error(
            'Progress save error:',
            error
        );
    }
}

async function loadProgress(
    videoId
) {

    try {

        const response =
            await fetch(

                `/api/progress/${videoId}/`,

                {

                    credentials: 'same-origin'
                }
            );

        return await response.json();

    } catch (error) {

        console.error(
            'Progress load error:',
            error
        );

        return {

            current_seconds: 0
        };
    }
}

function setupProgressTracking(
    videoElement
) {

    videoElement.addEventListener(
        'seeking',
        () => {

            isSeeking = true;
        }
    );

    videoElement.addEventListener(
        'seeked',
        () => {

            const currentTime =
                videoElement.currentTime;

            currentSubtitleIndex =

                currentSubtitles.findIndex(
                    subtitle =>

                        currentTime >= subtitle.start &&
                        currentTime <= subtitle.end
                );

            if (
                currentSubtitleIndex < 0
            ) {

                currentSubtitleIndex =

                    currentSubtitles.findIndex(
                        subtitle =>

                            subtitle.start >
                            currentTime
                    );

                if (
                    currentSubtitleIndex < 0
                ) {

                    currentSubtitleIndex =
                        currentSubtitles.length - 1;
                }
            }

            lastSubtitle = '';

            setTimeout(() => {

                isSeeking = false;

            }, 300);

        }
    );

    videoElement.addEventListener(
        'timeupdate',
        () => {

            if (

                videoElement.paused ||

                !progressReady ||

                isSeeking

            ) return;

            const currentTime =
                videoElement.currentTime;

            if (

                Math.floor(currentTime) % 10 === 0 &&

                Math.floor(currentTime) !==
                lastProgressSave

            ) {

                lastProgressSave =
                    Math.floor(currentTime);

                saveProgress(

                    currentVideoId,

                    currentTime,

                    videoElement.duration
                );
            }

        }
    );
}