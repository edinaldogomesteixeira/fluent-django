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

    systemDecks.forEach(deck => {

        html += `

            <div
                class="deck-item"
                data-deck-id="${deck.id}">

                ${deck.name}

            </div>

        `;
    });

    html += `

        <div
            class="deck-divider">
        </div>

    `;

    html += `

        <div
            class="deck-item"
            id="newDeckOption">

            + New Deck

        </div>

    `;

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

    const newDeckOption =
        document.getElementById(
            'newDeckOption'
        );

    if (newDeckOption) {

        newDeckOption.onclick =
            function () {

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

    menu.querySelectorAll(
        '.deck-item[data-deck-id]'
    ).forEach(item => {

        item.onclick =
            async function () {

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
            async function (event) {

                if (
                    event.key === 'Enter'
                ) {

                    await createDeck();

                }

            }
        );
}