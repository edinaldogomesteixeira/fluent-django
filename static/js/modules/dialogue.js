let dialogueMode = 'bilingual';

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