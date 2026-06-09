let currentSubtitles = [];
let currentSubtitleIndex = 0;


function highlightWord(
    text,
    word
) {

    if (!text || !word) {

        return text || '';
    }

    const escapedWord =
        word.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

    return text.replace(
        new RegExp(
            `\\b${escapedWord}\\b`,
            'gi'
        ),
        '<span class="keyword">$&</span>'
    );
}

async function renderPlaySubtitles(
    video
) {

    const container =
        document.getElementById(
            'playSubtitles'
        );

    try {

        const response =
            await fetch(

                `/api/videos/${video.id}/subtitles/`,

                {
                    credentials: 'same-origin'
                }
            );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }

        currentSubtitles =
            await response.json();

        currentSubtitleIndex = 0;

        lastSubtitle = '';

    }
    catch (error) {

        console.error(error);

        currentSubtitles = [];

    }

    if (!currentSubtitles.length) {

        container.innerHTML = '';

        return;
    }

    container.innerHTML = `

        <div
            id="activeSubtitle"
            class="active-subtitle"
        >
        </div>

    `;
}

let lastSubtitle = '';

let subtitleSyncHandler = null;

function startSubtitleSync() {

    const video =
        document.getElementById(
            'playVideo'
        );

    const subtitleElement =
        document.getElementById(
            'activeSubtitle'
        );

    subtitleElement.onclick =
        (event) => {

            const wordElement =

                event.target.closest(
                    '.subtitle-word'
                );

            if (!wordElement) {

                return;
            }

            const word =

                wordElement.dataset.word ||

                wordElement.innerText
                    .toLowerCase()
                    .replace(/[.,!?]/g, '');

            const rect =

                wordElement.getBoundingClientRect();

            openVocabularyPopup(
                word,
                rect
            );
        };

    if (!video) {

        return;
    }

    if (!subtitleElement) {

        return;
    }

    if (!Array.isArray(
        currentSubtitles
    )) {

        return;
    }

    if (
        subtitleSyncHandler
    ) {

        video.removeEventListener(
            'timeupdate',
            subtitleSyncHandler
        );
    }

    subtitleSyncHandler = () => {

        try {

            if (
                video.paused ||
                isSeeking
            ) {

                return;
            }

            const currentTime =
                video.currentTime;

            let activeSubtitle =

                currentSubtitles[
                currentSubtitleIndex
                ];

            while (

                activeSubtitle &&

                currentTime >
                activeSubtitle.end &&

                currentSubtitleIndex <
                currentSubtitles.length - 1

            ) {

                currentSubtitleIndex++;

                activeSubtitle =

                    currentSubtitles[
                    currentSubtitleIndex
                    ];
            }

            if (

                activeSubtitle &&

                currentTime <
                activeSubtitle.start

            ) {

                subtitleElement.innerHTML = '';

                lastSubtitle = '';

                return;
            }

            if (!activeSubtitle) {

                subtitleElement.innerHTML = '';

                lastSubtitle = '';

                return;
            }

            if (
                !activeSubtitle.text
            ) {

                return;
            }

            if (
                lastSubtitle ===
                activeSubtitle.text
            ) {

                return;
            }

            lastSubtitle =
                activeSubtitle.text;

            const html =

                activeSubtitle.text

                    .split(/\s+/)

                    .map(word => {

                        const normalized =

                            word
                                .toLowerCase()
                                .replace(/[.,!?]/g, '')
                                .trim();

                        let levelClass =
                            'new-word';

                        if (

                            typeof vocabularyLevels !==
                            'undefined' &&

                            vocabularyLevels

                        ) {

                            const level =

                                vocabularyLevels[
                                normalized
                                ];

                            if (
                                level !== undefined
                            ) {

                                levelClass =
                                    `level-${level}`;
                            }
                        }

                        return `

                            <span
                                class="subtitle-word ${levelClass}"
                                data-word="${normalized}"
                            >
                                ${word}
                            </span>

                        `;
                    })

                    .join(' ');

            subtitleElement.innerHTML =
                html;

        }

        catch (error) {

            console.error(error);
        }

    };

    video.addEventListener(
        'timeupdate',
        subtitleSyncHandler
    );
}