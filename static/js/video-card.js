function createVideoCard(video) {

    return `

        <div
            class="video-card"
            data-video-id="${video.id}"
        >

            <div class="thumbnail">

                <img
                    src="${video.image || '/static/images/default-thumb2.jpg'}"
                    alt="${video.title}"
                    class="thumbnail-image"
                >

                <img
                    src="${video.preview || '/static/images/default-thumb3.jpg'}"
                    alt="${video.title}"
                    class="preview-image"
                >

            </div>

            <div class="video-card-body">

                <h3 class="video-title">

                    ${video.title}

                </h3>

                <div class="video-meta">

                    <span class="video-level">

                        ${video.level}

                    </span>

                    <span class="video-words">

                        ${video.words} Words

                    </span>

                </div>

            </div>

        </div>

    `;
}