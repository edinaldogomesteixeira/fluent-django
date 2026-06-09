window.addEventListener(
    'DOMContentLoaded',
    async () => {

        console.log(
            'APP START'
        );

        initModalController();

        setupSearch();

        await loadVocabulary();

        await loadExplorePage();

        await setupLanguageSelector();

        setupUserSelector();

        if (
            typeof initializeBottomNav ===
            'function'
        ) {

            initializeBottomNav();
        }

        if (
            typeof initializeMoreMenu ===
            'function'
        ) {

            initializeMoreMenu();
        }

        console.log(
            'APP READY'
        );
    }
);