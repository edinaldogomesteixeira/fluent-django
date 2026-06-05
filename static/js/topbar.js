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