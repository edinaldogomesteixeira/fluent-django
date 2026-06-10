function renderVideos(videos, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = '';

    videos.forEach(video => {

        container.innerHTML +=
            createVideoCard(video);

    });
}

function renderDynamicCategories() {

    const container =

        document.getElementById(
            'dynamicCategories'
        );

    if (!container) {

        console.error(
            '#dynamicCategories not found'
        );

        return;
    }

    container.innerHTML = '';

    Object.entries(

        allData.categories

    ).forEach(([slug, categoryData]) => {

        const videos = categoryData.videos;
        const categoryName = categoryData.name;

        container.innerHTML += `

            <div class="category">

                <div class="category-header">

                    <h2 class="category-title">

                        ${categoryName}

                    </h2>

                    <a
                        class="see-all"
                        href="/topic/?section=${slug}"
                    >
                        See All
                    </a>

                </div>

                <div
                    class="video-row"
                    id="${slug}"
                ></div>

            </div>

        `;

        renderVideos(
            videos,
            slug
        );

    });

}

function renderVideoGrid() {

    const container =
        document.getElementById(
            'videoGrid'
        );

    if (!container) return;

    container.innerHTML =

        allData.videos

            .map(video => {

                return createVideoCard(
                    video
                );

            })

            .join('');

}

function renderSearchResults(
    videos
) {

    const container =

        document.getElementById(
            'dynamicCategories'
        );

    if (!container) return;

    container.innerHTML = `

        <div class="category">

            <div class="category-header">

                <h2 class="category-title">

                    Search Results

                </h2>

            </div>

            <div
                class="video-row"
                id="searchResults"
            ></div>

        </div>

    `;

    renderVideos(
        videos,
        'searchResults'
    );
}

function setupSearch() {

    const searchInput =

        document.getElementById(
            'searchInput'
        );

    if (!searchInput) return;

    searchInput.oninput = () => {

        const value =

            searchInput.value
                .toLowerCase()
                .trim();

        if (!value) {

            renderDynamicCategories();

            return;
        }

        const filteredVideos =

            [...videoMap.values()]

                .filter(video => {

                    return (

                        video.title
                            .toLowerCase()
                            .includes(value)

                    );

                });

        renderSearchResults(
            filteredVideos
        );

    };

}

function setupVideoClicks() {

    document.addEventListener(
        'click',
        (event) => {

            const card =

                event.target.closest(
                    '.video-card'
                );

            if (!card) return;

            const videoId =

                card.dataset.videoId;

            if (!videoId) return;

            openVideoPage(videoId);

        }
    );
}

async function openTopic(section) {

    await loadTopicPage();

    const topicTitle =
        document.getElementById(
            'topicTitle'
        );

    const topicGrid =
        document.getElementById(
            'topicGrid'
        );

    const categoryData =

        allData.categories[
            section
        ];

    if (!categoryData) {

        topicTitle.innerText =
            'Category Not Found';

        topicGrid.innerHTML =
            'No videos found';

        return;
    }

    topicTitle.innerText =
        categoryData.name;

    topicGrid.innerHTML =

        categoryData.videos

            .map(video => {

                return createVideoCard(video);

            })

            .join('');

    document.getElementById(
        'backButton'
    ).onclick = () => {

        loadExplorePage();

    };

}