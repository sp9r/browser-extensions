// ページ内の再生中の動画を探す関数
function findPlayingVideo() {
    const videos = Array.from(document.querySelectorAll('video'))
        // 再生可能で、PiPが無効でなく、表示されていて、再生中の動画をフィルタリング
        .filter(video => video.readyState !== 0 && !video.disablePictureInPicture && video.offsetParent !== null && !video.paused);

    if (videos.length === 0) return null;

    // 最も大きい動画を再生中の動画と判断する（経験則）
    videos.sort((a, b) => {
        const aRect = a.getBoundingClientRect();
        const bRect = b.getBoundingClientRect();
        return (bRect.width * bRect.height) - (aRect.width * aRect.height);
    });

    return videos[0];
}

// background.jsからのメッセージを受け取るリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // PiPを開始するリクエスト
    if (request.action === "autoEnterPiP") {
        const videoElement = findPlayingVideo();
        // PiPがまだ開始されていなければ、PiPを開始する
        if (videoElement && document.pictureInPictureElement !== videoElement) {
            videoElement.requestPictureInPicture().catch(error => {
                // PiPの開始に失敗した場合のエラー（ユーザー操作がないと失敗することがある）
                // console.error("Auto PiP Error:", error);
            });
        }
    } 
    // PiPを終了するリクエスト
    else if (request.action === "autoExitPiP") {
        // PiPが実行中であれば終了する
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(error => {
                // console.error("Auto Exit PiP Error:", error);
            });
        }
    }
    // 非同期処理の可能性があることを示すためにtrueを返す
    return true;
});
