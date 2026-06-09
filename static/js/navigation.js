const ROUTES = {

    explore: {
        url: '/explore-content/',
        sidebar: 'explore',
        bottom: 'explore',
        callback: () => loadVideos()
    },

    courses: {
        url: '/courses/',
        sidebar: 'courses',
        bottom: 'courses',
        callback: null
    },

    dashboard: {
        url: '/dashboard/',
        sidebar: 'dashboard',
        bottom: 'dashboard',
        callback: () => loadDashboard()
    },

    library: {
        url: '/library/',
        sidebar: 'library',
        bottom: 'library',
        callback: null
    },

    profile: {
        url: '/profile/',
        sidebar: 'profile',
        bottom: 'more',
        callback: null
    },

    settings: {
        url: '/settings/',
        sidebar: 'settings',
        bottom: 'more',
        callback: null
    },

    flashcards: {
        url: '/flashcards/',
        sidebar: 'flashcards',
        bottom: 'more',
        callback: null
    },

    achievements: {
        url: '/achievements/',
        sidebar: 'achievements',
        bottom: 'more',
        callback: null
    }
};

async function navigate(route) {

    const config = ROUTES[route];

    if (!config) {
        console.error(
            'Route not found:',
            route
        );
        return;
    }

    const response =
        await fetch(config.url);

    const html =
        await response.text();

    document.getElementById(
        'mainContent'
    ).innerHTML = html;

    setActiveSidebar(
        config.sidebar
    );

    setActiveBottomNav(
        config.bottom
    );

    if (config.callback) {

        config.callback();
    }
}