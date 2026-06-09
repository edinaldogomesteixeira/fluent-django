function initializeMoreMenu() {

    const moreButton =
        document.getElementById(
            'bottomMore'
        );

    const menu =
        document.getElementById(
            'moreMenu'
        );

    if (
        !moreButton ||
        !menu
    ) {
        return;
    }

    moreButton.onclick = function () {

        menu.classList.toggle(
            'show'
        );
    };

    document.onclick = function (
        event
    ) {

        if (
            !event.target.closest(
                '#bottomMore'
            ) &&
            !event.target.closest(
                '#moreMenu'
            )
        ) {

            menu.classList.remove(
                'show'
            );
        }
    };

    document.getElementById(
        'menuProfile'
    )?.addEventListener(
        'click',
        () => navigate('profile')
    );

    document.getElementById(
        'menuSettings'
    )?.addEventListener(
        'click',
        () => navigate('settings')
    );

    document.getElementById(
        'menuFlashcards'
    )?.addEventListener(
        'click',
        () => navigate('flashcards')
    );

    document.getElementById(
        'menuAchievements'
    )?.addEventListener(
        'click',
        () => navigate('achievements')
    );
}

document.addEventListener(
    'DOMContentLoaded',
    initializeMoreMenu
);