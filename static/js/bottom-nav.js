function setActiveBottomNav(active) {

    document
        .querySelectorAll(
            '.bottom-nav button'
        )
        .forEach(button => {

            button.classList.remove(
                'active'
            );

        });

    const map = {

        explore: 'bottomExplore',

        courses: 'bottomCourses',

        library: 'bottomLibrary',

        dashboard: 'bottomDashboard',

        more: 'bottomMore'
    };

    const buttonId =
        map[active];

    document
        .getElementById(
            buttonId
        )
        ?.classList.add(
            'active'
        );
}

function initializeBottomNav() {

    document
        .getElementById(
            'bottomExplore'
        )
        ?.addEventListener(
            'click',
            () => navigate('explore')
        );

    document
        .getElementById(
            'bottomCourses'
        )
        ?.addEventListener(
            'click',
            () => navigate('courses')
        );

    document
        .getElementById(
            'bottomLibrary'
        )
        ?.addEventListener(
            'click',
            () => navigate('library')
        );

    document
        .getElementById(
            'bottomDashboard'
        )
        ?.addEventListener(
            'click',
            () => navigate('dashboard')
        );
}

document.addEventListener(
    'DOMContentLoaded',
    initializeBottomNav
);