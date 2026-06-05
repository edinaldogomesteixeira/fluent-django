let activeSubtitle = null;
let vocabularyData = {};
let vocabularyLevels = {};

function initModalController() {

    MediaController.init(
        document.getElementById(
            'modalVideo'
        )
    );

    document
        .getElementById('closeModal')
        .addEventListener(
            'click',
            closeModal
        );

    document
        .getElementById('videoModal')
        .addEventListener(
            'click',
            (event) => {

                if (
                    event.target.id ===
                    'videoModal'
                ) {

                    closeModal();

                }

            }
        );

}

function openModal(video) {

    const modal =
        document.getElementById('videoModal');
    
    if (video.provider === 'youtube') {

        const waitApi = setInterval(() => {

            if (window.youtubeAPIReady) {

                clearInterval(waitApi);

                MediaController.load(video);

            }

        }, 200);

    } else {

        MediaController.load(video);

    }

    document.getElementById('modalTitle')
        .innerText = video.title;

    document.getElementById('modalDetails')
        .innerText =
            `${video.level} • ${video.words} Words`;

    modal.classList.add('active');

    const modalContent =
        document.querySelector(
            '.modal-content'
        );

    modalContent.addEventListener(
        'click',
        (event) => {

            /* IGNORE WORD */

            if (
                event.target.closest(
                    '.word'
                )
            ) {

                return;
            }

            closeVocabularyPopup();

        }
    );

    setupSubtitleSync();
    loadSubtitles(video);
}

function closeModal() {

    activeSubtitle = null;

    const modal =
        document.getElementById('videoModal');

    modal.classList.remove('active');

    MediaController.destroy();

    document.getElementById(
        'transcript'
    ).innerHTML = '';

    closeVocabularyPopup();
}


async function loadSubtitles(video) {
    
    await loadVocabularyLevels();

    if (!video.subtitles) {

        document.getElementById(
            'videoDialogue'
        ).innerHTML = `

            <div class="empty-message">

                No subtitles available.

            </div>

        `;

        return;
    }

    const response =
        await fetch(`/api/videos/${video.id}/subtitles/`)

    const subtitles =
        await response.json();

    const transcript =
        document.getElementById('transcript');

    transcript.innerHTML = '';

    subtitles.forEach(subtitle => {

        const words =
            subtitle.text.split(' ');

        const wordsHTML =

            words.map(word => {

                const normalized =

                    word

                        .toLowerCase()
                        .trim()
                        .replace(/[^\w]/g, '');

                const level =

                    vocabularyLevels[
                        normalized
                    ];

                let levelClass = 'new-word';


                if (

                    level !== undefined

                ) {

                    levelClass =

                        `level-${level}`;
                }


                return `
                
                    <span

                        class="subtitle-word ${levelClass}"

                        data-word="${word}"

                    >

                        ${word}

                    </span>
                
                `;

            }).join('');

        transcript.innerHTML += `
                
            <div 
                class="subtitle-line"
                data-start="${subtitle.start}"
                data-end="${subtitle.end}"
            >
                ${wordsHTML}
            </div>

        `;

    });

    const subtitleLines =
        document.querySelectorAll('.subtitle-line');

    subtitleLines.forEach(line => {

        line.addEventListener('click', () => {

            const videoElement =
                document.getElementById('modalVideo');

            const start =
                Number(line.dataset.start);

            MediaController.seek(start);
            MediaController.play();

        });

    });

    /* WORD CLICKS */
    const words =
        document.querySelectorAll(
            '.subtitle-word'
        );

    words.forEach(wordElement => {

        wordElement.addEventListener('click', (event) => {

            event.stopPropagation();

            const word =
                wordElement.innerText;

            const rect =
                wordElement.getBoundingClientRect();

            openVocabularyPopup(
                word,
                rect
            );

        });

    });
}

function setupSubtitleSync() {

    const video =
        document.getElementById('modalVideo');
    
    video.ontimeupdate = null;
    video.addEventListener('timeupdate', () => {

        const currentTime =
             MediaController.getCurrentTime();
        

        const subtitleLines =
            document.querySelectorAll('.subtitle-line');

        subtitleLines.forEach(line => {

            const start =
                parseFloat(
                    line.dataset.start
                );

            const end =
                parseFloat(
                    line.dataset.end
                );

            const isActive =

                currentTime >= start &&
                currentTime <= end;

            if (isActive) {

                if (activeSubtitle !== line) {

                    if (activeSubtitle) {

                        activeSubtitle.classList.remove(
                            'active'
                        );

                    }

                    activeSubtitle = line;

                    line.classList.add(
                        'active'
                    );

                    line.scrollIntoView({

                        behavior: 'smooth',

                        block: 'center'

                    });

                }

            } else {

                line.classList.remove(
                    'active'
                );

            }

        });

    });

}

async function loadVocabulary() {



}

async function saveKnowledgeLevel(
    word,
    level
) {

    await fetch(

        '/api/save-vocabulary-level/',

        {

            method: 'POST',

            credentials: 'same-origin',

            headers: {

                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                word,

                knowledge_level: level
            })
        }
    );
}

async function openVocabularyPopup(
    word,
    rect
) {

    const popup =
        document.getElementById(
            'vocabPopup'
        );

    const lookup =
        word
            .toLowerCase()
            .trim()
            .replace(/[.,!?]/g, '');

    const response =
        await fetch(

            `/api/vocabulary/${lookup}/`
        );

    const vocabulary =
        await response.json();
    
        document.getElementById(
        'popupWord'
    ).innerText = word;

    document.getElementById(
        'popupIPA'
    ).innerText =

        vocabulary.ipa || '';

    document.getElementById(
        'popupTranslation'
    ).innerText =

        vocabulary.translation || '';

    document.getElementById(
        'popupDefinition'
    ).innerText =

        vocabulary.definition || '';

    document.getElementById(
        'closeVocabularyPopup'
    ).onclick = () => {

        closeVocabularyPopup();
    };

    const deleteButton =

        document.querySelector(
            '.knowledge-button.delete'
        );

    deleteButton.onclick = async () => {

        await deleteVocabularyWord(
            lookup
        );


        /* REMOVE LOCAL CACHE */

        delete vocabularyLevels[
            lookup
        ];


        /* UPDATE SUBTITLE COLOR */

        document

            .querySelectorAll(
                '.subtitle-word'
            )

            .forEach(wordElement => {

                const word =

                    wordElement

                        .dataset.word

                        .toLowerCase()

                        .replace(/[^\w]/g, '')
                        .trim();


                if (word !== lookup) return;


                wordElement.classList.remove(

                    'level-1',

                    'level-2',

                    'level-3',

                    'level-4',

                    'level-5'
                );


                wordElement.classList.add(
                    'new-word'
                );

            });


        closeVocabularyPopup();
    };

    const knowledgeButtons =

        document.querySelectorAll(

            '.knowledge-button:not(.delete)'
        );

    knowledgeButtons.forEach(button => {

        button.classList.remove(
            'active'
        );
    });

    const currentLevel =

        vocabulary.knowledge_level;


    const activeButton =

        document.querySelector(

            `.knowledge-button[data-level="${currentLevel}"]`
        );


    if (activeButton) {

        activeButton.classList.add(
            'active'
        );
    }

    knowledgeButtons.forEach(button => {

        button.onclick = async () => {

            const level =

                Number(
                    button.dataset.level
                );


            /* SAVE DATABASE */

            await saveKnowledgeLevel(

                lookup,

                level
            );


            /* UPDATE LOCAL CACHE */

            vocabularyLevels[
                lookup
            ] = level;


            /* UPDATE SUBTITLE COLOR */

            document

                .querySelectorAll(
                    '.subtitle-word'
                )

                .forEach(wordElement => {

                    const word =

                        wordElement

                            .dataset.word

                            .toLowerCase()

                            .replace(/[^\w]/g, '')
                            .trim();


                    if (word !== lookup) return;


                    wordElement.classList.remove(

                        'new-word',

                        'level-1',

                        'level-2',

                        'level-3',

                        'level-4',

                        'level-5'
                    );


                    wordElement.classList.add(
                        `level-${level}`
                    );

                });


            /* CLOSE POPUP */

            closeVocabularyPopup();

        };
    });

        popup.style.position =
        'fixed';

    let leftPosition =
        rect.left +
        rect.width / 2 -
        160;

    if (leftPosition < 16) {

        leftPosition = 16;
    }

    if (leftPosition > window.innerWidth - 336) {

        leftPosition =
            window.innerWidth - 336;
    }

    popup.style.left =
        `${leftPosition}px`;

    requestAnimationFrame(() => {

        const popupHeight =
            popup.offsetHeight;

        let topPosition =

            rect.top -
            popupHeight -
            18;

        if (topPosition < 16) {

            topPosition =
                rect.bottom + 18;
        }

        popup.style.top =
            `${topPosition}px`;

    });

    popup.style.zIndex =
        '999999';

    popup.style.display =
        'block';

    popup.classList.add(
        'active'
    );
}

function closeVocabularyPopup() {

    const popup =
        document.getElementById(
            'vocabPopup'
        );

    popup.classList.remove(
        'active'
    );

    setTimeout(() => {

        popup.style.display =
            'none';

    }, 180);

}

async function deleteVocabularyWord(
    word
) {

    await fetch(

        '/api/delete-user-vocabulary/',

        {

            method: 'POST',

            credentials: 'same-origin',

            headers: {

                'Content-Type':
                    'application/json'
            },

            body: JSON.stringify({

                word
            })
        }
    );
}

document.addEventListener(
    'pointerdown',
    (event) => {

        const popup =
            document.getElementById(
                'vocabPopup'
            );

        const clickedWord =

            event.target.closest(
                '.subtitle-word'
            );

        const clickedPopup =

            event.target.closest(
                '#vocabPopup'
            );

        /* KEEP OPEN */

        if (
            clickedWord ||
            clickedPopup
        ) {

            return;
        }

        closeVocabularyPopup();

    }
);

document
    .getElementById('closeModal')
    .addEventListener('click', closeModal);

document
    .getElementById('videoModal')
    .addEventListener('click', (event) => {

        if (
            event.target.id === 'videoModal'
        ) {
            closeModal();
        }

    });

async function loadVocabularyLevels() {

    const response = await fetch(

        '/api/user-vocabulary-levels/'
    );

    vocabularyLevels =

        await response.json();
}

