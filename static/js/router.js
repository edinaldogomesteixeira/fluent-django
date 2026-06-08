
let currentVideoId = null;

let dialogueMode = 'bilingual';

let lastProgressSave = 0;

let currentSubtitles = [];

let currentSubtitleIndex = 0;

let progressReady = false;
let isSeeking = false;
let userProfile = null;

async function loadUserProfile() {

    if (userProfile) {

        return userProfile;
    }

    const response =
        await fetch(
            '/api/languages/user_profile/'
        );

    userProfile =
        await response.json();

    return userProfile;
}


function getCookie(name) {

    let cookieValue = null;

    if (
        document.cookie &&
        document.cookie !== ''
    ) {

        const cookies =
            document.cookie.split(';');

        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {

            const cookie =
                cookies[i].trim();

            if (

                cookie.substring(
                    0,
                    name.length + 1
                ) === (name + '=')

            ) {

                cookieValue =
                    decodeURIComponent(

                        cookie.substring(
                            name.length + 1
                        )

                    );

                break;
            }
        }
    }

    return cookieValue;
}

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

function setupPlayVideo(video) {

    const videoElement =
        document.getElementById(
            'playVideo'
        );

    const youtubeContainer =
        document.getElementById(
            'youtubePlayer'
        );

    /* RESET */

    videoElement.pause();

    videoElement.removeAttribute(
        'src'
    );

    //videoElement.load();

    videoElement.style.display =
        'none';

    youtubeContainer.style.display =
        'none';

    /* YOUTUBE */

    if (
        video.provider === 'youtube'
    ) {

        youtubeContainer.style.display =
            'block';

        createYouTubePlayer(
            video.youtubeId
        );

        return null;
    }

    /* GET VIDEO URL */

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

    /* INVALID */

    if (!videoUrl) {

        console.error(
            'No valid video source'
        );

        return null;
    }


    /* SHOW PLAYER */

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

async function setupLanguageSelector() {

    const selector =

        document.getElementById(
            'languageSelector'
        );

    const dropdown =

        document.getElementById(
            'languageDropdown'
        );

    if (

        !selector ||

        !dropdown

    ) return;

    const response =

        await fetch(
            '/api/languages/list/'
        );

    const languages =

        await response.json();

    dropdown.innerHTML =

        languages.map(language => {

            return `

                <div
                    class="language-option"
                    data-language="${language.code}"
                >

                    <img
                        src="/static/images/flags/${language.flag}.png"
                        class="language-option-flag"
                    >

                    <span>
                        ${language.name}
                    </span>

                </div>

            `;
        })

            .join('');

    console.log(
        'Language selector initialized'
    );

    selector.onclick = function (event) {

        event.stopPropagation();

        dropdown.classList.toggle(
            'show'
        );

        console.log(
            'language click'
        );
    };

    dropdown.onclick = function (event) {

        event.stopPropagation();
    };

    document.onclick = function () {

        dropdown.classList.remove(
            'show'
        );
    };

    dropdown.querySelectorAll(
        '.language-option'
    )
        .forEach(option => {

            option.addEventListener(
                'click',
                async (event) => {

                    event.stopPropagation();

                    const language =
                        option.dataset.language;

                    console.log(
                        'selected language:',
                        language
                    );

                    const response =
                        await fetch(
                            '/api/languages/change-language/',
                            {
                                method: 'POST',

                                credentials: 'same-origin',

                                headers: {
                                    'Content-Type':
                                        'application/json',

                                    'X-CSRFToken':
                                        getCookie('csrftoken')
                                },

                                body: JSON.stringify({
                                    language
                                })
                            }
                        );

                    console.log(
                        await response.text()
                    );

                    /* UPDATE FLAG */

                    const flagImage =
                        document.getElementById(
                            'currentLanguageFlag'
                        );

                    if (flagImage) {

                        const selectedLanguage =

                            languages.find(
                                l => l.code === language
                            );

                        if (selectedLanguage) {

                            flagImage.src =
                                `/static/images/flags/${selectedLanguage.flag}.png`;
                        }
                    }

                    /* RELOAD ONLY CONTENT */

                    await loadExplorePage();

                    dropdown.classList.remove(
                        'show'
                    );
                }
            );
        });

}

window.addEventListener(
    'DOMContentLoaded',
    async () => {

        initModalController();

        setupSearch();

        await loadVocabulary();

        await loadExplorePage();

        await setupLanguageSelector();

        setupUserSelector();
    }
);

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

async function renderDialogue(video) {

    const container =
        document.getElementById(
            'videoDialogue'
        );

    const response =
        await fetch(

            `/api/videos/${video.id}/subtitles/`,

            {
                credentials: 'same-origin'
            }
        );

    const subtitles =
        await response.json();

    if (!subtitles.length) {

        container.innerHTML = `

            <div class="empty-message">
                No subtitles available.
            </div>

        `;

        return;
    }

    renderVocabulary(
        subtitles
    );

    container.innerHTML = '';

    subtitles.forEach(subtitle => {

        container.innerHTML += `

            <div class="dialogue-item">

                <div class="dialogue-left">

                    <button class="play-line-btn">
                        ▶
                    </button>

                </div>

                <div class="dialogue-center">

                    <div class="dialogue-text">
                        ${subtitle.text}
                    </div>

                    <div class="dialogue-translation">
                        ${subtitle.translated_text || ''}
                    </div>

                </div>

                <div class="dialogue-right">

                    ${formatTime(subtitle.start)}

                </div>

            </div>

            `;

    });
    renderDialogueMode();

}

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

            console.log(
                'WORD CLICK:',
                word
            );

            openVocabularyPopup(
                word,
                rect
            );

        };

    if (!video) {

        console.error(
            'playVideo não encontrado'
        );

        return;
    }

    if (!subtitleElement) {

        console.error(
            'activeSubtitle não encontrado'
        );

        return;
    }

    if (!Array.isArray(currentSubtitles)) {

        console.error(
            'currentSubtitles inválido'
        );

        return;
    }

    // evita múltiplos listeners

    if (subtitleSyncHandler) {

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
            // NÃO ENCONTROU LEGENDA

            if (!activeSubtitle) {

                subtitleElement.innerHTML = '';

                lastSubtitle = '';

                return;

            }

            // TEXTO INVÁLIDO

            if (
                !activeSubtitle.text
            ) {

                console.warn(
                    'Legenda sem texto',
                    activeSubtitle
                );

                return;

            }

            // EVITA RE-RENDER

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

                                vocabularyLevels?.[
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

            console.error(
                'Erro na legenda:',
                error
            );

        }

    };

    video.addEventListener(
        'timeupdate',
        subtitleSyncHandler
    );

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

async function loadCoursesPage() {

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

function setActiveSidebar(
    active
) {

    document
        .querySelectorAll(
            '.menu-item'
        )
        .forEach(item => {

            item.classList.remove(
                'active'
            );
        });

    if (
        active === 'courses'
    ) {

        document
            .getElementById(
                'coursesButton'
            )
            ?.classList.add(
                'active'
            );
    }

    if (
        active === 'explore'
    ) {

        document
            .getElementById(
                'exploreButton'
            )
            ?.classList.add(
                'active'
            );
    }

    if (
        active === 'youtube'
    ) {

        document
            .getElementById(
                'youtubeButton'
            )
            ?.classList.add(
                'active'
            );
    }

    if (
        active === 'netflix'
    ) {

        document
            .getElementById(
                'netflixButton'
            )
            ?.classList.add(
                'active'
            );
    }

    if (
        active === 'library'
    ) {

        document
            .getElementById(
                'libraryButton'
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
        'dashboardButton'
    );

    loadDashboard();
}

document.getElementById(
    'dashboardButton'
).onclick = () => {

    loadDashboardPage();
};

async function initializeDialogueOptions() {

    const button =
        document.getElementById(
            'dialogueOptionsButton'
        );

    const menu =
        document.getElementById(
            'dialogueOptionsMenu'
        );

    if (!button || !menu) {

        return;
    }

    const profile =
        await loadUserProfile();

    const video =
        videoMap.get(
            Number(currentVideoId)
        );

    const learningLanguage =
        video?.language_name || 'Original';

    const nativeLanguage =
        profile.native_language || 'Native';

    menu.innerHTML = `

        <div
            class="dialogue-option"
            data-mode="original">
            ${learningLanguage} Only
        </div>

        <div
            class="dialogue-option"
            data-mode="native">
            ${nativeLanguage} Only
        </div>

        <div
            class="dialogue-option"
            data-mode="bilingual">
            ${learningLanguage} + ${nativeLanguage}
        </div>

    `;

    button.onclick = function (event) {

        event.stopPropagation();

        menu.classList.toggle(
            'show'
        );
    };

    document.onclick = () => {

        menu.classList.remove(
            'show'
        );
    };

    menu.querySelectorAll(
        '.dialogue-option'
    ).forEach(option => {

        option.onclick = function () {

            dialogueMode =
                this.dataset.mode;

            renderDialogueMode();

            menu.classList.remove(
                'show'
            );
        };
    });
}

function renderDialogueMode() {

    document
        .querySelectorAll(
            '.dialogue-item'
        )
        .forEach(item => {

            const original =

                item.querySelector(
                    '.dialogue-text'
                );

            const translation =

                item.querySelector(
                    '.dialogue-translation'
                );

            if (

                !original ||

                !translation

            ) return;

            if (
                dialogueMode ===
                'original'
            ) {

                original.style.display =
                    'block';

                translation.style.display =
                    'none';
            }

            else if (
                dialogueMode ===
                'native'
            ) {

                original.style.display =
                    'none';

                translation.style.display =
                    'block';
            }

            else {

                original.style.display =
                    'block';

                translation.style.display =
                    'block';
            }
        });
}

function initializeVocabularyToolbar() {

    const selectAll =
        document.getElementById(
            'selectAllVocabulary'
        );

    if (!selectAll) {

        return;
    }

    selectAll.addEventListener(
        'change',
        function () {

            document
                .querySelectorAll(
                    '.vocab-checkbox'
                )
                .forEach(checkbox => {

                    checkbox.checked =
                        this.checked;

                });

        }
    );

    const addButton =
        document.getElementById(
            'addToDeckButton'
        );

    if (addButton) {

        addButton.onclick =
            openDeckMenu;
    }
}

async function openDeckMenu() {

    const response =
        await fetch(
            '/api/flashcards/decks/'
        );

    const decks =
        await response.json();

    const menu =
        document.getElementById(
            'deckMenu'
        );

    const systemDecks =
        decks.filter(
            deck => deck.is_system
        );

    const userDecks =
        decks.filter(
            deck => !deck.is_system
        );

    let html = '';

    // Decks do sistema

    systemDecks.forEach(deck => {

        html += `

            <div
                class="deck-item"
                data-deck-id="${deck.id}">

                ${deck.name}

            </div>

        `;

    });

    // Linha separadora

    html += `

        <div
            class="deck-divider">

        </div>

    `;

    // Novo Deck

    html += `

        <div
            class="deck-item"
            id="newDeckOption">

            + New Deck

        </div>

    `;

    // Decks do usuário

    userDecks.forEach(deck => {

        html += `

            <div
                class="deck-item"
                data-deck-id="${deck.id}">

                ${deck.name}

            </div>

        `;

    });

    menu.innerHTML = html;

    menu.classList.toggle(
        'show'
    );

    // Abrir modal de criação

    const newDeckOption =
        document.getElementById(
            'newDeckOption'
        );

    if (newDeckOption) {

        newDeckOption.onclick =
            function() {

                document
                    .getElementById(
                        'newDeckModal'
                    )
                    .classList.add(
                        'show'
                    );

                document
                    .getElementById(
                        'newDeckName'
                    )
                    .focus();

                menu.classList.remove(
                    'show'
                );

            };
    }

    // Adicionar palavras ao deck

    menu.querySelectorAll(
        '.deck-item[data-deck-id]'
    ).forEach(item => {

        item.onclick =
            async function() {

                const deckId =
                    Number(
                        this.dataset.deckId
                    );

                const wordIds =
                    getSelectedWordIds();

                if (!wordIds.length) {

                    alert(
                        'Select at least one word'
                    );

                    return;
                }

                const result =
                    await addWordsToDeck(
                        deckId,
                        wordIds
                    );

                alert(
                    `${result.created} words added`
                );

                menu.classList.remove(
                    'show'
                );

            };

    });

}

function getSelectedWords() {

    return Array.from(

        document.querySelectorAll(
            '.vocab-checkbox:checked'
        )

    ).map(

        checkbox =>

            Number(
                checkbox.dataset.wordId
            )

    );
}

async function addWordsToDeck(
    deckId,
    wordIds
) {

    const response =
        await fetch(

            '/api/flashcards/add-words/',

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    deck_id: deckId,

                    word_ids: wordIds

                })

            }

        );

    return await response.json();

}

function getSelectedWordIds() {

    return Array.from(

        document.querySelectorAll(
            '.vocab-checkbox:checked'
        )

    ).map(

        checkbox =>

            Number(
                checkbox.dataset.wordId
            )

    );

}

async function createDeck() {

    const input =
        document.getElementById(
            'newDeckName'
        );

    const name =
        input.value.trim();

    if (!name) {

        return;
    }

    const response =
        await fetch(

            '/api/flashcards/decks/create/',

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify({

                    name

                })
            }

        );

    const deck =
        await response.json();

    const wordIds =
        getSelectedWordIds();
    
    let result = {
        created: 0
    };

    if (wordIds.length) {

        result =
            await addWordsToDeck(
                deck.id,
                wordIds
            );
    }

    alert(
        `${result.created} words added to ${deck.name}`
    );

    document
        .getElementById(
            'newDeckModal'
        )
        .classList.remove(
            'show'
        );

    input.value = '';

}

function initializeDeckModal() {

    document
        .getElementById(
            'createDeckButton'
        )
        ?.addEventListener(

            'click',

            createDeck

        );

    document
        .getElementById(
            'cancelDeckButton'
        )
        ?.addEventListener(

            'click',

            () => {

                document
                    .getElementById(
                        'newDeckModal'
                    )
                    .classList.remove(
                        'show'
                    );
            }
        );
    
    document
        .getElementById(
            'newDeckName'
        )
        ?.addEventListener(
            'keydown',
            async function(event) {

                if (
                    event.key === 'Enter'
                ) {

                    await createDeck();

                }

            }
        );

}