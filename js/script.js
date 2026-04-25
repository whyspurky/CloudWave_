// js/script.js

document.addEventListener('DOMContentLoaded', () => {
    SoundCloud.init();

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results');

    // Функция отображения результатов
    function renderTracks(tracks) {
        resultsContainer.innerHTML = '';

        if (tracks.length === 0) {
            resultsContainer.innerHTML = '<p>Ничего не найдено :(</p>';
            return;
        }

        tracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'track-card';
            card.innerHTML = `
                <img src="${track.artwork_url || track.user.avatar_url || 'https://via.placeholder.com/150'}" alt="cover">
                <div class="info">
                    <h3>${track.title}</h3>
                    <p>${track.user.username}</p>
                </div>
                <button class="play-btn">▶️</button>
            `;

            card.querySelector('.play-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                SoundCloud.play(track);
            });

            resultsContainer.appendChild(card);
        });
    }

    // Поиск по кнопке и Enter
    async function performSearch() {
        const query = searchInput.value.trim();
        if (!query) return;

        resultsContainer.innerHTML = '<p>Ищем...</p>';
        const tracks = await SoundCloud.search(query);
        renderTracks(tracks);
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Управление плеером
    document.getElementById('play-pause-btn').addEventListener('click', SoundCloud.toggle);

    console.log('🎵 CloudWave готов! Введи Client ID в soundcloud.js и начинай поиск.');
});
