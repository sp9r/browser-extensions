// ページ内からISBNを取得
function getISBN() {
    const isbnElement = document.querySelector("#productDetailsTable .content ul li:contains('ISBN-13')") ||
                        document.querySelector("span.a-size-small:contains('ISBN-13')");
    if (isbnElement) {
      const isbn = isbnElement.textContent.match(/\d{13}/); // ISBN-13形式を抽出
      return isbn ? isbn[0] : null;
    }
    return null;
  }
  
  // Valuebooksで検索
  async function checkValueBooks(isbn) {
    const searchUrl = `https://www.valuebooks.jp/search?q=${isbn}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    return html.includes("商品が見つかりました");
  }
  
  // 結果をAmazonページに表示
  function displayResult(isAvailable) {
    const titleElement = document.querySelector("#productTitle");
    if (titleElement) {
      const message = document.createElement("div");
      message.style.marginTop = "10px";
      message.style.padding = "10px";
      message.style.backgroundColor = isAvailable ? "#DFF2BF" : "#FFBABA";
      message.style.color = "#555";
      message.style.fontSize = "14px";
      message.style.border = "1px solid #ccc";
      message.textContent = isAvailable
        ? "この本はValuebooksで取り扱われています。"
        : "この本はValuebooksで取り扱われていません。";
      titleElement.parentNode.insertBefore(message, titleElement.nextSibling);
    }
  }
  
  // メイン処理
  (async function () {
    const isbn = getISBN();
    if (isbn) {
      const isAvailable = await checkValueBooks(isbn);
      displayResult(isAvailable);
    }
  })();
  