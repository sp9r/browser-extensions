// 現在アクティブなタブIDを保持する変数
let currentActiveTabId = null;

// アクティブなタブが変更されたときの処理
chrome.tabs.onActivated.addListener(activeInfo => {
  const previousTabId = currentActiveTabId;
  const newTabId = activeInfo.tabId;

  // 直前までアクティブだったタブでPiPを開始する
  if (previousTabId && previousTabId !== newTabId) {
    chrome.tabs.sendMessage(previousTabId, { action: "autoEnterPiP" }).catch(err => {
      // コンテンツスクリプトが読み込まれていない場合などのエラーは無視
    });
  }

  // 新しくアクティブになったタブでPiPを終了する
  chrome.tabs.sendMessage(newTabId, { action: "autoExitPiP" }).catch(err => {});

  // 現在のアクティブタブIDを更新
  currentActiveTabId = newTabId;
});

// Chromeウィンドウのフォーカスが変更されたときの処理
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chromeがフォーカスを失った場合（別アプリへ移動）、PiPを開始する
    if (currentActiveTabId) {
      chrome.tabs.sendMessage(currentActiveTabId, { action: "autoEnterPiP" }).catch(err => {});
    }
  } else {
    // Chromeがフォーカスを得た場合、現在アクティブなタブを特定
    chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
      if (tabs.length > 0) {
        const activeTabId = tabs[0].id;
        currentActiveTabId = activeTabId;
        // そのタブで実行中のPiPを終了する
        chrome.tabs.sendMessage(activeTabId, { action: "autoExitPiP" }).catch(err => {});
      }
    });
  }
});

// タブが閉じられたときなどに、アクティブなタブIDを再設定
chrome.tabs.onRemoved.addListener(() => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    if (tabs.length > 0) {
      currentActiveTabId = tabs[0].id;
    }
  });
});
