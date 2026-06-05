console.log('IMPORT VIDEO LOADED');

function initImportVideo() {

    const button =
        document.querySelector(
            '.import-video-button'
        );

    const modal =
        document.getElementById(
            'importVideoModal'
        );

    const closeButton =
        document.getElementById(
            'closeImportModal'
        );

    const form =
        document.getElementById(
            'importVideoForm'
        );

    if (
        !button ||
        !modal ||
        !form
    ) {

        console.log(
            'Import modal not initialized'
        );

        return;
    }

    // =====================
    // OPEN MODAL
    // =====================

    button.addEventListener(
        'click',
        () => {

            modal.classList.add(
                'active'
            );
            loadCategories();

        }
    );

    // =====================
    // CLOSE BUTTON
    // =====================

    if (closeButton) {

        closeButton.addEventListener(
            'click',
            () => {

                modal.classList.remove(
                    'active'
                );

            }
        );
    }

    // =====================
    // CLICK OUTSIDE
    // =====================

    modal.addEventListener(
        'click',
        (event) => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    'active'
                );

            }

        }
    );

    // =====================
    // SUBMIT
    // =====================

    form.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();

            const submitButton =

                form.querySelector(
                    'button[type="submit"]'
                );

            const formData =
                new FormData(form);
            
            formData.append(

                'category_id',

                document.getElementById(
                    'video-category'
                ).value

            );

            const csrfToken =
                document.querySelector(
                    '[name=csrfmiddlewaretoken]'
                ).value;

            const youtubeUrl =

                document.getElementById(
                    'youtubeUrl'
                )?.value || '';
            console.log(
                'YOUTUBE URL:',
                youtubeUrl
            );
            let endpoint =
                '/api/videos/upload/';

            if (
                youtubeUrl.trim() !== ''
            ) {

                endpoint =
                    '/api/videos/import-youtube/';

            }
            console.log(
                'ENDPOINT:',
                endpoint
            );

            submitButton.disabled = true;

            submitButton.textContent =
                'Processing...';

            try {

                const response =
                    await fetch(

                        endpoint,

                        {

                            method: 'POST',

                            body: formData,

                            headers: {

                                'X-CSRFToken':
                                    csrfToken

                            }

                        }

                    );

                const data =
                    await response.json();

                console.log(data);

                if (
                    !response.ok
                ) {

                    throw new Error(

                        data.message ||

                        'Import failed'

                    );

                }

                if (
                    data.success
                ) {

                    form.reset();

                    modal.classList.remove(
                        'active'
                    );

                    if (

                        typeof loadVideos ===
                        'function'

                    ) {

                        await loadVideos();

                    }

                    alert(
                        'Video imported successfully!'
                    );

                }

            } catch(error) {

                console.error(
                    error
                );

                alert(

                    error.message ||

                    'Import failed'

                );

            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    'Import';

            }

        }
    );
}

document.addEventListener(
    'DOMContentLoaded',
    initImportVideo
);

async function loadCategories() {

    const response = await fetch(
        '/api/videos/categories/'
    );

    const categories =
        await response.json();

    const select =
        document.getElementById(
            'video-category'
        );

    select.innerHTML = '';

    categories.forEach(category => {

        const option =
            document.createElement(
                'option'
            );

        option.value =
            category.id;

        option.textContent =
            category.name;

        select.appendChild(
            option
        );

    });

}