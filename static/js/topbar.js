function setupUserSelector() {

    const selector =
        document.getElementById(
            'userSelector'
        );

    const dropdown =
        document.getElementById(
            'userDropdown'
        );

    if (
        !selector ||
        !dropdown
    ) return;

    selector.addEventListener(
        'click',
        (event) => {

            event.stopPropagation();

            dropdown.classList.toggle(
                'show'
            );
        }
    );

    dropdown.addEventListener(
        'click',
        (event) => {

            event.stopPropagation();
        }
    );

    document.addEventListener(
        'click',
        () => {

            dropdown.classList.remove(
                'show'
            );
        }
    );
}

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            'menuButton'
        );

    const sidebar =
        document.getElementById(
            'sidebar'
        );

    if (
        !menuButton ||
        !sidebar
    ) {
        return;
    }

    menuButton.addEventListener(
        'click',
        () => {

            sidebar.classList.toggle(
                'open'
            );

        }
    );
}

document.addEventListener(
    'DOMContentLoaded',
    setupMobileMenu
);