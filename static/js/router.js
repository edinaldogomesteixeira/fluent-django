
let currentVideoId = null;






let progressReady = false;
let isSeeking = false;





async function loadExplorePage() {

    const response =
        await fetch(

            '/explore-content/',

            {

                credentials: 'same-origin'
            }
        );

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;

    setActiveBottomNav(
        'explore'
    );

    setupMobileMenu();

    setActiveSidebar(
        'explore'
    );

    loadVideos();
   
}

async function loadTopicPage() {

    const response =
        await fetch(

            '/topic/',

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


document.addEventListener(
    'click',
    async (event) => {

        const link =
            event.target.closest('a');

        if (!link) return;

        const href =
            link.getAttribute('href');

        if (!href) return;

        /* TOPIC */

        if (
            !href.includes('/topic/')
        ) {

            return;
        }

        event.preventDefault();

        const url =
            new URL(
                href,
                window.location.origin
            );

        const section =
            url.searchParams.get(
                'section'
            );

        await openTopic(section);

    }
);


function initializeTabs() {

    const buttons =

        document.querySelectorAll(
            '.tab-button'
        );

    buttons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                document
                    .querySelectorAll(
                        '.tab-button'
                    )
                    .forEach(btn =>

                        btn.classList.remove(
                            'active'
                        )

                    );

                document
                    .querySelectorAll(
                        '.tab-content'
                    )
                    .forEach(tab =>

                        tab.classList.remove(
                            'active'
                        )

                    );

                button.classList.add(
                    'active'
                );

                const tabName =

                    button.dataset.tab;

                document
                    .getElementById(
                        tabName + 'Tab'
                    )
                    .classList.add(
                        'active'
                    );

            }
        );

    });

}

async function openVideoPage(
    videoId
) {

    currentVideoId = videoId;

    await loadVideoPage();

    initializeTabs();

    initializeVocabularyToolbar();

    initializeDeckModal();

    initializeDialogueOptions();

    const video =
        videoMap.get(
            Number(videoId)
        );

    if (!video) return;

    document.getElementById(
        'videoTitle'
    ).innerText =
        video.title;

    document.getElementById(
        'videoImage'
    ).src =
        video.image;

    document.getElementById(
        'videoMeta'
    ).innerText =

        `${video.level} • ${video.words} Words`;

    document.getElementById(
        'videoDescription'
    ).innerText =

        video.description ||
        'Learn English with real videos.';

    document.getElementById(
        'backButton'
    ).onclick = () => {

        loadExplorePage();

    };

    await loadVideoVocabulary(
        video.id
    );

    await renderDialogue(
        video
    );

    renderVocabulary();


    document.getElementById(
        'playButton'
    ).onclick = () => {

        openPlayPage(video);

    };

    document.querySelector(
        '.video-cover'
    ).onclick = () => {

        openPlayPage(video);

    };

}

async function loadVideoVocabulary(
    videoId
) {

    const response =
        await fetch(

            `/api/videos/${videoId}/vocabulary/`

        );

    vocabularyData =
        await response.json();

    console.log(
        "VOCAB LOADED",
        Object.keys(vocabularyData).length
    );

}



function renderVocabulary() {

    const container =
        document.getElementById(
            'videoVocabulary'
        );

    let html = '';

    Object.values(
        vocabularyData
    ).forEach(vocab => {

        const highlightedExample =
            highlightWord(
                vocab.example || '',
                vocab.word || ''
            );

        html += `

            <div class="vocab-row">

                <div class="vocab-select">

                    <input
                        type="checkbox"
                        class="vocab-checkbox"
                        data-word-id="${vocab.id}"
                    >

                </div>

                <div class="vocab-word-column">

                    <div class="vocab-word">
                        ${vocab.word}
                    </div>

                    <div class="vocab-ipa">
                        ${vocab.ipa || ''}
                    </div>

                </div>

                <div class="vocab-translation">

                    ${vocab.translation || ''}

                </div>

                <div class="vocab-example">

                    ${highlightWord(
            vocab.example || '',
            vocab.word
        )}

                </div>

            </div>

            `;

    });

    container.innerHTML = html;

}


async function openPlayPage(
    video
) {


    await loadPlayPage();

    if (!video) return;

    currentVideoId = video.id;

    currentSubtitleIndex = 0;

    lastSubtitle = '';

    progressReady = false;

    lastProgressSave = -1;


    document.getElementById(
        'playTitle'
    ).innerText =
        video.title;


    /* LOAD SAVED PROGRESS */

    const progress =
        await loadProgress(
            video.id
        );

    /* SETUP PLAYER */
    const videoElement =
        setupPlayVideo(video);

    await renderPlaySubtitles(
        video
    );

    startSubtitleSync();

    if (
        !videoElement &&
        video.provider !== 'youtube'
    ) {

        return;
    }

    setupProgressTracking(
        videoElement
    );

    /* RESUME PLAYBACK */

    if (
        progress.current_seconds > 0
    ) {

        const applyProgress = () => {

            if (

                !videoElement.duration ||

                isNaN(videoElement.duration)

            ) {

                setTimeout(
                    applyProgress,
                    300
                );

                return;
            }

            const safeTime = Math.min(

                progress.current_seconds,

                videoElement.duration - 1
            );

            videoElement.currentTime =
                safeTime;

            setTimeout(() => {

                progressReady = true;

            }, 1500);
        };

        applyProgress();

    }

    else {

        setTimeout(() => {

            progressReady = true;

        }, 2000);
    }

    /* SUBTITLES */

    await loadVocabularyLevels();


    /* BACK BUTTON */

    document.getElementById(
        'backToVideo'
    ).addEventListener(
        'click',
        () => {

            openVideoPage(video.id);

        }
    );
}




async function loadCoursesPage() {

    setActiveBottomNav(
        'courses'
    );

    const response =
        await fetch(

            '/courses/',

            {

                credentials:
                    'same-origin'
            }
        );

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;

    setActiveSidebar(
        'courses'
    );
}

function setActiveSidebar(active) {

    document
        .querySelectorAll(
            '.menu-item'
        )
        .forEach(item => {

            item.classList.remove(
                'active'
            );

        });

    const map = {

        courses: 'coursesButton',

        explore: 'exploreButton',

        youtube: 'youtubeButton',

        netflix: 'netflixButton',

        library: 'libraryButton',

        dashboard: 'dashboardButton',

        profile: 'profileButton',

        settings: 'settingsButton',

        flashcards: 'flashcardsButton',

        achievements: 'achievementsButton'
    };

    const buttonId =
        map[active];

    if (buttonId) {

        document
            .getElementById(
                buttonId
            )
            ?.classList.add(
                'active'
            );
    }
}

document
    .getElementById(
        'coursesButton'
    )
    ?.addEventListener(

        'click',

        () => {

            loadCoursesPage();
        }
    );

document
    .getElementById(
        'exploreButton'
    )
    ?.addEventListener(

        'click',

        (event) => {

            event.preventDefault();

            loadExplorePage();
        }
    );

async function loadDashboardPage() {

    setActiveBottomNav(
        'dashboard'
    );

    const response =

        await fetch(
            '/dashboard/'
        );

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;

    setActiveSidebar(
        'dashboard'
    );

    loadDashboard();
}

document.getElementById(
    'dashboardButton'
).onclick = () => {

    loadDashboardPage();
};



/* LIBRARY */

document
    .getElementById(
        'libraryButton'
    )
    ?.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            navigate('library');

        }
    );

/* PROFILE */

document
    .getElementById(
        'profileButton'
    )
    ?.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            navigate('profile');

        }
    );

/* SETTINGS */

document
    .getElementById(
        'settingsButton'
    )
    ?.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            navigate('settings');

        }
    );

/* FLASHCARDS */

document
    .getElementById(
        'flashcardsButton'
    )
    ?.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            navigate('flashcards');

        }
    );

/* ACHIEVEMENTS */

document
    .getElementById(
        'achievementsButton'
    )
    ?.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            navigate('achievements');

        }
    );