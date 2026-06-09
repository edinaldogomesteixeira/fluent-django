let userProfile = null;

async function loadUserProfile() {

    if (userProfile) {

        return userProfile;
    }

    const response =
        await fetch(
            '/api/languages/user_profile/'
        );

    userProfile =
        await response.json();

    return userProfile;
}

function getCookie(name) {

    let cookieValue = null;

    if (
        document.cookie &&
        document.cookie !== ''
    ) {

        const cookies =
            document.cookie.split(';');

        for (
            let i = 0;
            i < cookies.length;
            i++
        ) {

            const cookie =
                cookies[i].trim();

            if (

                cookie.substring(
                    0,
                    name.length + 1
                ) === (name + '=')

            ) {

                cookieValue =
                    decodeURIComponent(

                        cookie.substring(
                            name.length + 1
                        )

                    );

                break;
            }
        }
    }

    return cookieValue;
}

async function setupLanguageSelector() {

    const selector =

        document.getElementById(
            'languageSelector'
        );

    const dropdown =

        document.getElementById(
            'languageDropdown'
        );

    if (

        !selector ||

        !dropdown

    ) return;

    const response =

        await fetch(
            '/api/languages/list/'
        );

    const languages =

        await response.json();

    dropdown.innerHTML =

        languages.map(language => {

            return `

                <div
                    class="language-option"
                    data-language="${language.code}"
                >

                    <img
                        src="/static/images/flags/${language.flag}.png"
                        class="language-option-flag"
                    >

                    <span>
                        ${language.name}
                    </span>

                </div>

            `;
        })

            .join('');

    selector.onclick = function (event) {

        event.stopPropagation();

        dropdown.classList.toggle(
            'show'
        );
    };

    dropdown.onclick = function (event) {

        event.stopPropagation();
    };

    document.onclick = function () {

        dropdown.classList.remove(
            'show'
        );
    };

    dropdown.querySelectorAll(
        '.language-option'
    )
        .forEach(option => {

            option.addEventListener(
                'click',
                async (event) => {

                    event.stopPropagation();

                    const language =
                        option.dataset.language;

                    await fetch(
                        '/api/languages/change-language/',
                        {
                            method: 'POST',

                            credentials: 'same-origin',

                            headers: {
                                'Content-Type':
                                    'application/json',

                                'X-CSRFToken':
                                    getCookie('csrftoken')
                            },

                            body: JSON.stringify({
                                language
                            })
                        }
                    );

                    const flagImage =
                        document.getElementById(
                            'currentLanguageFlag'
                        );

                    if (flagImage) {

                        const selectedLanguage =

                            languages.find(
                                l => l.code === language
                            );

                        if (selectedLanguage) {

                            flagImage.src =
                                `/static/images/flags/${selectedLanguage.flag}.png`;
                        }
                    }

                    await loadExplorePage();

                    dropdown.classList.remove(
                        'show'
                    );
                }
            );
        });
}