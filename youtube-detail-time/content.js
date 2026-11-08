const API_KEY = 'YOUR_YOUTUBE_DATA_API_KEY';  // ここに取得したAPIキーを入力してください

// 分数をゼロ埋めして返す関数
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0'); // ゼロ埋め
    return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`;
}

// APIリクエストを通して投稿時間を取得する関数
async function fetchUploadTime(videoId) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
        const uploadTime = new Date(data.items[0].snippet.publishedAt);
        return formatTime(uploadTime);
    }
    return null;
}

// 投稿時間を表示する関数
async function addUploadTime(item) {
    const titleElement = item.querySelector('#video-title');
    const thumbnailElement = item.querySelector('a#thumbnail');

    if (!titleElement || !thumbnailElement) return;

    const videoUrl = thumbnailElement.href;
    const videoId = new URLSearchParams(new URL(videoUrl).search).get('v');

    // すでに投稿時間が表示されている場合はスキップ
    if (titleElement.querySelector('.upload-time') || !videoId) return;

    const uploadTime = await fetchUploadTime(videoId);

    if (uploadTime) {
        const uploadTimeSpan = document.createElement('span');
        uploadTimeSpan.classList.add('upload-time');
        uploadTimeSpan.innerText = `【${uploadTime}】 `;
        titleElement.prepend(uploadTimeSpan);
    }
}

function displayUploadTime() {
    const videoItems = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer');

    videoItems.forEach(item => {
        // 各動画ごとに非同期で投稿時間を追加
        addUploadTime(item);
    });
}

// ページの変更を監視し、新たな動画が読み込まれたら投稿時間を追加
let observer = new MutationObserver(displayUploadTime);
observer.observe(document.body, { childList: true, subtree: true });

// 初期ロード時に投稿時間を表示
window.addEventListener('load', displayUploadTime);
