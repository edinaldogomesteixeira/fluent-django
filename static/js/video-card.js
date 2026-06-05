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

            <h3 class="video-title">
                ${video.title}
            </h3>

            <p class="video-info">
                ${video.level} • ${video.words} Words
            </p>

        </div>

    `;
}