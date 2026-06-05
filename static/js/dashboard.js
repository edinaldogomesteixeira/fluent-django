async function loadDashboard() {

    const response =

        await fetch(

            '/api/learning-analytics/',

            {

                credentials: 'same-origin'
            }
        );

    const data =
        await response.json();

    renderAnalytics(data);
}

function formatTime(seconds) {

    const hours =

        Math.floor(
            seconds / 3600
        );

    const minutes =

        Math.floor(
            (seconds % 3600) / 60
        );

    const secs =

        Math.floor(
            seconds % 60
        );

    return `

        ${String(hours).padStart(2, '0')}:
        ${String(minutes).padStart(2, '0')}:
        ${String(secs).padStart(2, '0')}

    `.replace(/\s/g, '');
}

function renderAnalytics(data) {

    const grid =

        document.getElementById(
            'analyticsGrid'
        );

    grid.innerHTML = `

        <div class="analytics-card">

            <h3>
                Watch Hours
            </h3>

            <p>
                ${formatTime(
                    data.total_watch_seconds
                )}
            </p>

        </div>

        <div class="analytics-card">

            <h3>
                Videos Completed
            </h3>

            <p>
                ${data.completed_videos}
            </p>

        </div>

        <div class="analytics-card">

            <h3>
                Words Learned
            </h3>

            <p>
                ${data.total_words}
            </p>

        </div>

    `;


    const categoriesContainer =

        document.getElementById(
            'favoriteCategories'
        );

    categoriesContainer.innerHTML = `

        <h2 class="section-title">

            Favorite Categories

        </h2>

        <div class="category-tags">

            ${data.favorite_categories.map(category => `

                <div class="category-tag">

                    ${category[0]}

                </div>

            `).join('')}

        </div>

    `;
}