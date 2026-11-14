# Browser Extensions Collection

日常のブラウジングや情報収集の小さなストレスを解消するために制作した、Chromium 系ブラウザ（Chrome / Edge / Vivaldi 等）向け **Manifest V3** 拡張機能コレクションです。外部ビルドツールに頼らず軽量な Vanilla JavaScript / CSS で実装しています。

## 収録拡張機能一覧

| フォルダ | 拡張機能名 | 主な機能と技術ポイント |
|---|---|---|
| `auto-pip/` | **Auto Picture-in-Picture** | `background.js` と `content.js` のメッセージングでタブ切り替えを検知し、再生中の `<video>` を自動でピクチャーインピクチャー（PiP）へ移行 |
| `x-metrics-hider/` | **X Metrics Hider** | CSS セレクタ（`styles.css`）のみで X（旧 Twitter）タイムラインのいいね数・リポスト数・返信数・インプレッション数を軽量に非表示化 |
| `youtube-detail-time/` | **YouTube 投稿時間表示** | `content.js` と YouTube Data API v3 により、相対時刻（「2日前」等）の横に正確な投稿日時（時・分）をインライン表示 |
| `amazon-valuebooks-checker/` | **Amazon × バリューブックス連携** | Amazon 書籍ページから ISBN-13 を抽出し、`background.js`（Service Worker）経由でバリューブックス側の在庫・買取／販売価格をクロスオリジン照会 |

## インストール方法（開発者モード）

1. 本リポジトリをクローンまたはダウンロードします。
2. Chrome で `chrome://extensions/` を開きます。
3. 右上の **「デベロッパーモード」** をオンにします。
4. **「パッケージ化されていない拡張機能を読み込む」** から、導入したい各サブフォルダ（例: `auto-pip/`）を選択します。

※ `youtube-detail-time` を利用する場合は、`youtube-detail-time/content.js` 内に各自の YouTube Data API v3 キーを設定してください。

## ライセンス

MIT License（[LICENSE](./LICENSE)）
