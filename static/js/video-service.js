let allData = {};

let videoMap = new Map();

async function loadVideos() {

    const response =

        await fetch(

            '/api/videos/',

            {

                credentials: 'same-origin'
            }
        );

    const videos =
        await response.json();

    const categories = {};

    const continueResponse =

        await fetch(

            '/api/continue-watching/',

            {

                credentials: 'same-origin'
            }
        );

    const continueWatching =

        await continueResponse.json();

    if (

        continueWatching.length > 0

    ) {

        categories[
            'continue-watching'
        ] = {

            name:
                'Continue Watching',

            videos:
                continueWatching
        };
    }

    videos.forEach(video => {

        videoMap.set(
            video.id,
            video
        );

        if (

            !video.categories ||

            video.categories.length === 0

        ) {

            return;
        }

        video.categories.forEach(category => {

            if (

                !categories[
                    category.slug
                ]

            ) {

                categories[
                    category.slug
                ] = {

                    name: category.name,

                    videos: []
                };
            }

            categories[
                category.slug
            ].videos.push(video);

        });

    });

    allData = {

        categories
    };

    /*
    =========================================
    SOMENTE EXPLORE POSSUI dynamicCategories
    =========================================
    */

    if (

        document.getElementById(
            'dynamicCategories'
        )

    ) {

        renderDynamicCategories();
    }

    setupVideoClicks();

    loadVocabulary();
}