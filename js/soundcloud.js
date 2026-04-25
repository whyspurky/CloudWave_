// js/soundcloud.js

let widget = null;
let currentTrack = null;

const CLIENT_ID = "ceeWbO4nf8MvuTeipNw0E3Lkh3NNxzMy";   // ← Замени на свой Client ID!

// Инициализация виджета
function initWidget() {
    const iframe = document.getElementById('soundcloud-widget');
    widget = SC.Widget(iframe);

    widget.bind(SC.Widget.Events.READY, () => {
        console.log('✅ SoundCloud Widget готов');
    });

    widget.bind(SC.Widget.Events.PLAY, () => {
        document.getElementById('play-pause-btn').textContent = '⏸️';
    });

    widget.bind(SC.Widget.Events.PAUSE, () => {
        document.getElementById('play-pause-btn').textContent = '▶️';
    });
}

// Поиск треков через SoundCloud API (v2)
async function searchTracks(query) {
    if (!query) return [];

    const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=20`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.collection || [];
    } catch (err) {
        console.error("Ошибка поиска:", err);
        return [];
    }
}

// Воспроизведение трека
function playTrack(track) {
    if (!track || !track.permalink_url) return;

    currentTrack = track;

    const widgetUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(track.permalink_url)}&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false&color=ff5500`;

    const iframe = document.getElementById('soundcloud-widget');
    iframe.src = widgetUrl;
    iframe.style.display = "block";

    // Обновляем нижний плеер
    document.getElementById('player-cover').src = track.artwork_url || track.user.avatar_url || 'https://via.placeholder.com/50';
    document.getElementById('player-title').textContent = track.title;
    document.getElementById('player-artist').textContent = track.user.username;

    console.log(`▶️ Играет: ${track.title} — ${track.user.username}`);
}

// Переключение Play/Pause
function togglePlay() {
    if (!widget) return;
    widget.isPaused(isPaused => {
        if (isPaused) widget.play();
        else widget.pause();
    });
}

// Экспорт
window.SoundCloud = {
    init: initWidget,
    search: searchTracks,
    play: playTrack,
    toggle: togglePlay
};
