// 宣告動態 GIF 圖片變數。
let animatedGif; // 儲存動態角色.gif。

// 宣告 GIF 是否載入成功。
let gifLoaded = false; // 記錄 GIF 載入狀態。

// 宣告瀏覽器音效環境。
let audioContext = null; // 儲存 Web Audio API 音效環境。

// 設定棋盤欄數。
const COLS = 6; // 棋盤共有 6 欄。

// 設定棋盤列數。
const ROWS = 4; // 棋盤共有 4 列。

// 設定牌面總數。
const TOTAL_CARDS = COLS * ROWS; // 棋盤共有 24 張牌。

// 設定配對總數。
const TOTAL_PAIRS = TOTAL_CARDS / 2; // 棋盤共有 12 對配對。

// 設定最多轉彎次數。
const MAX_TURNS = 2; // 連線最多允許 2 個轉彎。

// 宣告球類運動圖案。
const sports = [
  "⚽", // 足球圖案。
  "🏀", // 籃球圖案。
  "🏈", // 美式足球圖案。
  "⚾", // 棒球圖案。
  "🎾", // 網球圖案。
  "🏐", // 排球圖案。
  "🏉", // 橄欖球圖案。
  "🥎", // 壘球圖案。
  "🏓", // 桌球圖案。
  "🏸", // 羽毛球圖案。
  "⛳", // 高爾夫球圖案。
  "🥍" // 長曲棍球圖案。
];

// 宣告球類運動文字。
const sportNames = [
  "足球", // 足球文字。
  "籃球", // 籃球文字。
  "美式足球", // 美式足球文字。
  "棒球", // 棒球文字。
  "網球", // 網球文字。
  "排球", // 排球文字。
  "橄欖球", // 橄欖球文字。
  "壘球", // 壘球文字。
  "桌球", // 桌球文字。
  "羽毛球", // 羽毛球文字。
  "高爾夫球", // 高爾夫球文字。
  "長曲棍球" // 長曲棍球文字。
];

// 宣告棋盤資料。
let board = []; // 儲存每一張牌的資料。

// 宣告牌面消除狀態。
let removed = []; // true 代表牌面已消除。

// 宣告第一張選取牌。
let firstCard = null; // 儲存第一次點擊的牌。

// 宣告第二張選取牌。
let secondCard = null; // 儲存第二次點擊的牌。

// 宣告是否正在檢查配對。
let isChecking = false; // true 時暫停新的點擊。

// 宣告剩餘配對數。
let remainingPairs = TOTAL_CARDS / 2; // 遊戲開始時共有 12 對。

// 宣告目前分數。
let score = 0; // 初始分數為 0。

// 宣告遊戲開始時間。
let gameStartTime = 0; // 儲存計時開始時間。

// 宣告經過秒數。
let elapsedSeconds = 0; // 儲存遊戲經過秒數。

// 宣告遊戲是否已開始。
let gameStarted = false; // 第一次點擊後開始計時。

// 宣告遊戲是否完成。
let gameFinished = false; // 全部配對完成後設為 true。

// 宣告遊戲提示文字。
let gameMessage = "請找出圖案與文字的正確配對"; // 顯示遊戲狀態。

// 宣告棋盤 X 座標。
let boardX = 0; // 儲存棋盤左上角 X 座標。

// 宣告棋盤 Y 座標。
let boardY = 0; // 儲存棋盤左上角 Y 座標。

// 宣告牌面寬度。
let cardWidth = 0; // 儲存每張牌的寬度。

// 宣告牌面高度。
let cardHeight = 0; // 儲存每張牌的高度。

// 宣告牌面間距。
let cardGap = 8; // 設定牌面之間的間距。

// 宣告重新開始按鈕。
let restartButton = {
  x: 0, // 按鈕 X 座標。
  y: 0, // 按鈕 Y 座標。
  width: 150, // 按鈕寬度。
  height: 44 // 按鈕高度。
};

// 宣告成功連線路徑。
let connectionPath = null; // 儲存配對成功的連線。

// 宣告連線動畫開始時間。
let connectionStartTime = 0; // 儲存連線開始時間。

// 設定連線動畫時間。
const CONNECTION_DURATION = 700; // 連線動畫持續 700 毫秒。

// 載入動態 GIF。
function preload() {
  // 載入與 sketch.js 同一層的 GIF。
  animatedGif = loadImage(
    "動態角色.gif",

    // GIF 載入成功時執行。
    function () {
      // 設定 GIF 載入狀態為成功。
      gifLoaded = true;
    },

    // GIF 載入失敗時執行。
    function () {
      // 設定 GIF 載入狀態為失敗。
      gifLoaded = false;
    }
  );
}

// 初始化遊戲。
function setup() {
  // 建立全螢幕畫布。
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中。
  textAlign(CENTER, CENTER);

  // 設定文字垂直置中。
  textStyle(NORMAL);

  // 建立遊戲棋盤。
  createBoard();

  // 計算遊戲版面。
  calculateLayout();
}

// 建立圖案與文字配對棋盤。
function createBoard() {
  // 建立暫存牌面陣列。
  let cards = [];

  // 逐一建立 12 組圖案與文字牌。
  for (let i = 0; i < sports.length; i++) {
    // 建立圖案牌。
    cards.push({
      type: "image", // 設定牌面類型為圖案。
      sportIndex: i // 儲存球類運動編號。
    });

    // 建立文字牌。
    cards.push({
      type: "text", // 設定牌面類型為文字。
      sportIndex: i // 儲存球類運動編號。
    });
  }

  // 將所有牌面隨機排列。
  shuffle(cards, true);

  // 清空棋盤。
  board = [];

  // 清空消除狀態。
  removed = [];

  // 建立棋盤每一列。
  for (let row = 0; row < ROWS; row++) {
    // 建立目前列的牌面陣列。
    board[row] = [];

    // 建立目前列的消除狀態陣列。
    removed[row] = [];

    // 建立目前列的每一欄。
    for (let col = 0; col < COLS; col++) {
      // 計算牌面在一維陣列的位置。
      let index = row * COLS + col;

      // 儲存牌面資料。
      board[row][col] = cards[index];

      // 設定牌面尚未消除。
      removed[row][col] = false;
    }
  }

  // 清除第一張牌。
  firstCard = null;

  // 清除第二張牌。
  secondCard = null;

  // 解除點擊鎖定。
  isChecking = false;

  // 重設剩餘配對數。
  remainingPairs = TOTAL_CARDS / 2;

  // 重設分數。
  score = 0;

  // 重設計時。
  elapsedSeconds = 0;

  // 重設遊戲開始狀態。
  gameStarted = false;

  // 重設遊戲完成狀態。
  gameFinished = false;

  // 重設提示文字。
  gameMessage = "請找出圖案與文字的正確配對";

  // 清除連線動畫。
  connectionPath = null;
}

// 計算版面配置。
function calculateLayout() {
  // 計算可用寬度。
  let availableWidth = width * 0.92;

  // 計算可用高度。
  let availableHeight = height * 0.5;

  // 根據欄數計算牌寬度。
  let widthByColumns =
    (availableWidth - cardGap * (COLS - 1)) / COLS;

  // 根據列數計算牌高度。
  let heightByRows =
    (availableHeight - cardGap * (ROWS - 1)) / ROWS;

  // 設定牌面寬度。
  cardWidth = min(widthByColumns, 150);

  // 設定牌面高度。
  cardHeight = min(heightByRows, 100);

  // 計算棋盤總寬度。
  let boardWidth =
    cardWidth * COLS + cardGap * (COLS - 1);

  // 計算棋盤總高度。
  let boardHeight =
    cardHeight * ROWS + cardGap * (ROWS - 1);

  // 讓棋盤水平置中。
  boardX = (width - boardWidth) / 2;

  // 讓棋盤垂直置中。
  boardY = max(155, (height - boardHeight) / 2 - 20);

  // 計算重新開始按鈕 X 座標。
  restartButton.x = width / 2 - restartButton.width / 2;

  // 計算重新開始按鈕 Y 座標。
  restartButton.y = min(
    height - restartButton.height - 20,
    boardY + boardHeight + 25
  );
}

// p5.js 每一幀執行的函式。
function draw() {
  // 使用指定顏色清除背景。
  background("#caf0f8");

  // 更新遊戲計時。
  updateTimer();

  // 繪製標題。
  drawTitle();

  // 繪製動態 GIF。
  drawAnimatedGif();

  // 繪製棋盤。
  drawBoard();

  // 繪製成功連線。
  drawConnectionAnimation();

  // 繪製重新開始按鈕。
  drawRestartButton();
}

// 更新遊戲計時。
function updateTimer() {
  // 判斷遊戲是否開始且尚未結束。
  if (gameStarted === true && gameFinished === false) {
    // 計算遊戲經過秒數。
    elapsedSeconds = floor((millis() - gameStartTime) / 1000);
  }
}

// 繪製遊戲標題。
function drawTitle() {
  // 設定標題文字大小。
  textSize(min(30, width * 0.065));

  // 設定標題文字顏色。
  fill("#023047");

  // 繪製遊戲標題。
  text("球類運動圖文連連看", width / 2, 34);

  // 設定資訊文字大小。
  textSize(16);

  // 設定資訊文字顏色。
  fill("#0077b6");

  // 顯示目前分數。
  text("分數：" + score, width / 2 - 150, 72);

  // 顯示遊戲時間。
  text("時間：" + elapsedSeconds + " 秒", width / 2, 72);

  // 顯示剩餘配對數。
  text(
    "剩餘：" + remainingPairs + " 對",
    width / 2 + 150,
    72
  );

  // 設定提示文字顏色。
  fill("#03045e");

  // 顯示遊戲提示。
  text(gameMessage, width / 2, 104);
}

// 繪製動態 GIF。
function drawAnimatedGif() {
  // 判斷 GIF 是否載入成功。
  if (gifLoaded === true && animatedGif) {
    // 設定 GIF 寬度。
    let gifWidth = 70;

    // 設定 GIF 高度。
    let gifHeight = 70;

    // 顯示動態 GIF。
    image(
      animatedGif,
      width - gifWidth - 18,
      18,
      gifWidth,
      gifHeight
    );
  } else {
    // 設定替代文字大小。
    textSize(13);

    // 設定替代文字顏色。
    fill("#0077b6");

    // 顯示 GIF 載入提示。
    text("GIF", width - 42, 50);
  }
}

// 繪製棋盤。
function drawBoard() {
  // 設定牌面外框粗細。
  strokeWeight(2);

  // 逐列繪製棋盤。
  for (let row = 0; row < ROWS; row++) {
    // 逐欄繪製棋盤。
    for (let col = 0; col < COLS; col++) {
      // 計算牌面 X 座標。
      let x = boardX + col * (cardWidth + cardGap);

      // 計算牌面 Y 座標。
      let y = boardY + row * (cardHeight + cardGap);

      // 判斷牌面是否已消除。
      if (removed[row][col] === true) {
        // 設定空白牌面填色。
        fill(255, 255, 255, 45);

        // 設定空白牌面外框。
        stroke("#90e0ef");

        // 繪製空白牌面。
        rect(x, y, cardWidth, cardHeight, 10);
      } else {
        // 判斷牌面是否被選取。
        let selected = isSelected(row, col);

        // 判斷是否被選取。
        if (selected === true) {
          // 設定選取牌面顏色。
          fill("#ffd166");

          // 設定選取牌面外框顏色。
          stroke("#f77f00");
        } else {
          // 設定一般牌面顏色。
          fill("#ffffff");

          // 設定一般牌面外框顏色。
          stroke("#48cae4");
        }

        // 繪製牌面背景。
        rect(x, y, cardWidth, cardHeight, 10);

        // 取得目前牌面資料。
        let card = board[row][col];

        // 判斷目前是否為圖案牌。
        if (card.type === "image") {
          // 設定圖案文字大小。
          textSize(min(cardWidth, cardHeight) * 0.42);

          // 設定圖案顏色。
          fill("#023047");

          // 顯示球類運動圖案。
          text(
            sports[card.sportIndex],
            x + cardWidth / 2,
            y + cardHeight / 2
          );
        } else {
          // 設定文字牌面大小。
          textSize(min(18, cardWidth * 0.17));

          // 設定文字牌面顏色。
          fill("#023047");

          // 顯示球類運動文字。
          text(
            sportNames[card.sportIndex],
            x + cardWidth / 2,
            y + cardHeight / 2
          );
        }
      }
    }
  }

  // 還原外框粗細。
  strokeWeight(1);
}

// 判斷牌面是否被選取。
function isSelected(row, col) {
  // 判斷是否為第一張牌。
  let firstSelected =
    firstCard !== null &&
    firstCard.row === row &&
    firstCard.col === col;

  // 判斷是否為第二張牌。
  let secondSelected =
    secondCard !== null &&
    secondCard.row === row &&
    secondCard.col === col;

  // 回傳牌面是否被選取。
  return firstSelected || secondSelected;
}

// 繪製重新開始按鈕。
function drawRestartButton() {
  // 判斷滑鼠是否在按鈕上。
  let hovering = isMouseOverRestartButton();

  // 設定按鈕顏色。
  if (hovering === true) {
    // 設定滑鼠移入顏色。
    fill("#0096c7");
  } else {
    // 設定一般按鈕顏色。
    fill("#0077b6");
  }

  // 設定按鈕外框。
  stroke("#023e8a");

  // 繪製重新開始按鈕。
  rect(
    restartButton.x,
    restartButton.y,
    restartButton.width,
    restartButton.height,
    10
  );

  // 設定按鈕文字顏色。
  fill("#ffffff");

  // 設定按鈕文字大小。
  textSize(16);

  // 顯示按鈕文字。
  text(
    "重新開始",
    restartButton.x + restartButton.width / 2,
    restartButton.y + restartButton.height / 2
  );
}

// 判斷滑鼠是否在重新開始按鈕內。
function isMouseOverRestartButton() {
  // 回傳滑鼠是否在按鈕範圍內。
  return (
    mouseX >= restartButton.x &&
    mouseX <= restartButton.x + restartButton.width &&
    mouseY >= restartButton.y &&
    mouseY <= restartButton.y + restartButton.height
  );
}

// 啟動瀏覽器音效。
function startAudio() {
  // 判斷瀏覽器是否支援 AudioContext。
  if (!window.AudioContext && !window.webkitAudioContext) {
    // 不支援時結束函式。
    return;
  }

  // 判斷音效環境是否尚未建立。
  if (audioContext === null) {
    // 取得瀏覽器支援的 AudioContext 類別。
    let AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    // 建立音效環境。
    audioContext = new AudioContextClass();
  }

  // 判斷音效環境是否暫停。
  if (audioContext.state === "suspended") {
    // 恢復音效環境。
    audioContext.resume();
  }
}

// 播放答對音效。
function playCorrectSound() {
  // 啟動音效環境。
  startAudio();

  // 判斷音效環境是否存在。
  if (audioContext === null) {
    // 音效環境不存在時結束函式。
    return;
  }

  // 建立振盪器。
  let oscillator = audioContext.createOscillator();

  // 建立音量控制器。
  let gain = audioContext.createGain();

  // 設定答對音效頻率。
  oscillator.frequency.value = 720;

  // 設定音效類型。
  oscillator.type = "sine";

  // 連接振盪器與音量控制器。
  oscillator.connect(gain);

  // 連接音量控制器與喇叭。
  gain.connect(audioContext.destination);

  // 設定音量。
  gain.gain.setValueAtTime(0.25, audioContext.currentTime);

  // 設定音量淡出。
  gain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3
  );

  // 開始播放音效。
  oscillator.start();

  // 停止播放音效。
  oscillator.stop(audioContext.currentTime + 0.3);
}

// 播放答錯音效。
function playWrongSound() {
  // 啟動音效環境。
  startAudio();

  // 判斷音效環境是否存在。
  if (audioContext === null) {
    // 音效環境不存在時結束函式。
    return;
  }

  // 建立振盪器。
  let oscillator = audioContext.createOscillator();

  // 建立音量控制器。
  let gain = audioContext.createGain();

  // 設定答錯音效頻率。
  oscillator.frequency.value = 180;

  // 設定答錯音效類型。
  oscillator.type = "sawtooth";

  // 連接振盪器與音量控制器。
  oscillator.connect(gain);

  // 連接音量控制器與喇叭。
  gain.connect(audioContext.destination);

  // 設定音量。
  gain.gain.setValueAtTime(0.18, audioContext.currentTime);

  // 設定音量淡出。
  gain.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.35
  );

  // 開始播放音效。
  oscillator.start();

  // 停止播放音效。
  oscillator.stop(audioContext.currentTime + 0.35);
}

// 處理滑鼠點擊。
function mousePressed() {
  // 啟動音效環境。
  startAudio();

  // 判斷是否點擊重新開始按鈕。
  if (isMouseOverRestartButton() === true) {
    // 重新建立棋盤。
    createBoard();

    // 結束滑鼠事件。
    return false;
  }

  // 判斷目前是否正在檢查配對。
  if (isChecking === true) {
    // 暫停新的點擊。
    return false;
  }

  // 判斷遊戲是否已完成。
  if (gameFinished === true) {
    // 遊戲完成後停止點擊。
    return false;
  }

  // 取得滑鼠點擊的牌面。
  let clickedCard = getCardAtPosition(mouseX, mouseY);

  // 判斷是否點擊棋盤外。
  if (clickedCard === null) {
    // 結束滑鼠事件。
    return false;
  }

  // 判斷牌面是否已消除。
  if (removed[clickedCard.row][clickedCard.col] === true) {
    // 不處理已消除牌面。
    return false;
  }

  // 第一次點擊時開始計時。
  if (gameStarted === false) {
    // 設定遊戲已開始。
    gameStarted = true;

    // 記錄計時起始時間。
    gameStartTime = millis();
  }

  // 判斷是否尚未選取第一張牌。
  if (firstCard === null) {
    // 儲存第一張牌。
    firstCard = clickedCard;

    // 顯示第二張牌提示。
    gameMessage = "請選擇與它相符的文字或圖案";
  } else {
    // 判斷是否點擊同一張牌。
    if (
      firstCard.row === clickedCard.row &&
      firstCard.col === clickedCard.col
    ) {
      // 取消第一張牌。
      firstCard = null;

      // 恢復提示文字。
      gameMessage = "請找出圖案與文字的正確配對";
    } else {
      // 儲存第二張牌。
      secondCard = clickedCard;

      // 鎖定點擊。
      isChecking = true;

      // 檢查配對結果。
      checkPair();
    }
  }

  // 阻止瀏覽器預設行為。
  return false;
}

// 取得滑鼠所在牌面。
function getCardAtPosition(x, y) {
  // 逐列檢查。
  for (let row = 0; row < ROWS; row++) {
    // 逐欄檢查。
    for (let col = 0; col < COLS; col++) {
      // 計算牌面 X 座標。
      let cardX = boardX + col * (cardWidth + cardGap);

      // 計算牌面 Y 座標。
      let cardY = boardY + row * (cardHeight + cardGap);

      // 判斷滑鼠是否位於牌面內。
      if (
        x >= cardX &&
        x <= cardX + cardWidth &&
        y >= cardY &&
        y <= cardY + cardHeight
      ) {
        // 回傳牌面位置。
        return {
          row: row,
          col: col
        };
      }
    }
  }

  // 找不到牌面時回傳 null。
  return null;
}

// 檢查圖案與文字是否配對。
function checkPair() {
  // 取得第一張牌。
  let first = board[firstCard.row][firstCard.col];

  // 取得第二張牌。
  let second = board[secondCard.row][secondCard.col];

  // 判斷第一張是否為圖案、第二張是否為文字。
  let firstImageSecondText =
    first.type === "image" &&
    second.type === "text";

  // 判斷第一張是否為文字、第二張是否為圖案。
  let firstTextSecondImage =
    first.type === "text" &&
    second.type === "image";

  // 判斷兩張牌是否為一圖案一文字。
  let correctType =
    firstImageSecondText || firstTextSecondImage;

  // 判斷兩張牌是否屬於同一種球類運動。
  let correctSport =
    first.sportIndex === second.sportIndex;

  // 判斷兩張牌是否通過連線規則。
  let path = null;

  // 只有牌型正確且運動相同才找連線。
  if (correctType === true && correctSport === true) {
    // 尋找最多 2 個轉彎的連線。
    path = findConnection(firstCard, secondCard);
  }

  // 判斷是否配對成功。
  if (path !== null) {
    // 消除第一張牌。
    removed[firstCard.row][firstCard.col] = true;

    // 消除第二張牌。
    removed[secondCard.row][secondCard.col] = true;

    // 減少剩餘配對數。
    remainingPairs--;

    // 計算速度獎勵。
    let speedBonus = max(0, 100 - elapsedSeconds * 2);

    // 增加答對分數。
    score += 100 + speedBonus;

    // 播放答對音效。
    playCorrectSound();

    // 儲存成功連線。
    connectionPath = path;

    // 記錄連線時間。
    connectionStartTime = millis();

    // 判斷是否完成遊戲。
    if (remainingPairs === 0) {
      // 設定遊戲已完成。
      gameFinished = true;

      // 顯示完成訊息。
      gameMessage = "全部完成！最終分數：" + score;
    } else {
      // 顯示配對成功訊息。
      gameMessage = "答對了！";
    }

    // 延遲清除選取狀態。
    setTimeout(clearSelection, 450);
  } else {
    // 扣除錯誤分數。
    score = max(0, score - 20);

    // 播放答錯音效。
    playWrongSound();

    // 顯示答錯訊息。
    gameMessage = "答錯了！請配對正確的圖案與文字";

    // 延遲清除選取狀態。
    setTimeout(clearSelection, 800);
  }
}

// 清除選取狀態。
function clearSelection() {
  // 清除第一張牌。
  firstCard = null;

  // 清除第二張牌。
  secondCard = null;

  // 解除點擊鎖定。
  isChecking = false;

  // 判斷遊戲是否尚未完成。
  if (gameFinished === false) {
    // 恢復一般提示。
    gameMessage = "請找出圖案與文字的正確配對";
  }
}

// 尋找合法連線。
function findConnection(start, end) {
  // 建立搜尋佇列。
  let queue = [];

  // 建立四個移動方向。
  let directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
  ];

  // 將起點四個方向加入佇列。
  for (let i = 0; i < directions.length; i++) {
    // 取得目前方向。
    let direction = directions[i];

    // 計算下一列位置。
    let nextRow = start.row + direction.row;

    // 計算下一欄位置。
    let nextCol = start.col + direction.col;

    // 判斷下一格是否可通行。
    if (isWalkable(nextRow, nextCol, end) === true) {
      // 加入初始搜尋狀態。
      queue.push({
        row: nextRow,
        col: nextCol,
        directionRow: direction.row,
        directionCol: direction.col,
        turns: 0,
        path: [
          { row: start.row, col: start.col },
          { row: nextRow, col: nextCol }
        ]
      });
    }
  }

  // 建立已拜訪紀錄。
  let visited = {};

  // 持續搜尋連線。
  while (queue.length > 0) {
    // 取出佇列第一個節點。
    let current = queue.shift();

    // 判斷是否抵達終點。
    if (
      current.row === end.row &&
      current.col === end.col
    ) {
      // 回傳連線路徑。
      return current.path;
    }

    // 建立目前狀態的識別名稱。
    let key =
      current.row +
      "," +
      current.col +
      "," +
      current.directionRow +
      "," +
      current.directionCol;

    // 取得之前的轉彎數。
    let previousTurns = visited[key];

    // 判斷目前狀態是否值得繼續搜尋。
    if (
      previousTurns === undefined ||
      current.turns < previousTurns
    ) {
      // 記錄目前轉彎數。
      visited[key] = current.turns;

      // 嘗試四個移動方向。
      for (let i = 0; i < directions.length; i++) {
        // 取得目前方向。
        let direction = directions[i];

        // 計算下一列。
        let nextRow = current.row + direction.row;

        // 計算下一欄。
        let nextCol = current.col + direction.col;

        // 判斷下一格是否可以通行。
        if (isWalkable(nextRow, nextCol, end) === true) {
          // 判斷是否轉彎。
          let changedDirection =
            direction.row !== current.directionRow ||
            direction.col !== current.directionCol;

          // 計算新的轉彎數。
          let newTurns =
            current.turns + (changedDirection ? 1 : 0);

          // 判斷是否沒有超過轉彎限制。
          if (newTurns <= MAX_TURNS) {
            // 複製目前路徑。
            let newPath = current.path.slice();

            // 加入新的節點。
            newPath.push({
              row: nextRow,
              col: nextCol
            });

            // 將新狀態加入佇列。
            queue.push({
              row: nextRow,
              col: nextCol,
              directionRow: direction.row,
              directionCol: direction.col,
              turns: newTurns,
              path: newPath
            });
          }
        }
      }
    }
  }

  // 找不到合法路徑時回傳 null。
  return null;
}

// 判斷位置是否可以通行。
function isWalkable(row, col, end) {
  // 判斷是否為目標牌面。
  if (row === end.row && col === end.col) {
    // 目標牌面可以通行。
    return true;
  }

  // 判斷是否超出棋盤外圍。
  if (
    row < -1 ||
    row > ROWS ||
    col < -1 ||
    col > COLS
  ) {
    // 超出範圍時不可通行。
    return false;
  }

  // 判斷是否位於棋盤外圍。
  if (
    row === -1 ||
    row === ROWS ||
    col === -1 ||
    col === COLS
  ) {
    // 棋盤外圍可以通行。
    return true;
  }

  // 只有消除後的空格可以通行。
  return removed[row][col] === true;
}

// 繪製配對成功的連線動畫。
function drawConnectionAnimation() {
  // 判斷是否有連線。
  if (connectionPath === null) {
    // 沒有連線時結束。
    return;
  }

  // 計算動畫經過時間。
  let elapsed = millis() - connectionStartTime;

  // 判斷動畫是否完成。
  if (elapsed > CONNECTION_DURATION) {
    // 清除連線。
    connectionPath = null;

    // 結束函式。
    return;
  }

  // 計算連線透明度。
  let alphaValue = map(
    elapsed,
    0,
    CONNECTION_DURATION,
    255,
    0
  );

  // 設定連線顏色。
  stroke(255, 145, 0, alphaValue);

  // 設定連線粗細。
  strokeWeight(8);

  // 設定線條端點。
  strokeCap(ROUND);

  // 關閉填色。
  noFill();

  // 開始繪製連線。
  beginShape();

  // 逐點繪製路徑。
  for (let i = 0; i < connectionPath.length; i++) {
    // 取得目前路徑節點。
    let point = connectionPath[i];

    // 計算節點 X 座標。
    let pointX = getPointX(point);

    // 計算節點 Y 座標。
    let pointY = getPointY(point);

    // 加入路徑節點。
    vertex(pointX, pointY);
  }

  // 結束繪製連線。
  endShape();

  // 還原線條端點樣式。
  strokeCap(SQUARE);

  // 還原線條粗細。
  strokeWeight(1);
}

// 取得連線 X 座標。
function getPointX(point) {
  // 判斷節點是否在左側外圍。
  if (point.col === -1) {
    // 回傳左側外圍 X 座標。
    return boardX - cardGap / 2;
  }

  // 判斷節點是否在右側外圍。
  if (point.col === COLS) {
    // 回傳右側外圍 X 座標。
    return boardX +
      COLS * (cardWidth + cardGap) -
      cardGap / 2;
  }

  // 回傳棋盤內部 X 座標。
  return boardX +
    point.col * (cardWidth + cardGap) +
    cardWidth / 2;
}

// 取得連線 Y 座標。
function getPointY(point) {
  // 判斷節點是否在上方外圍。
  if (point.row === -1) {
    // 回傳上方外圍 Y 座標。
    return boardY - cardGap / 2;
  }

  // 判斷節點是否在下方外圍。
  if (point.row === ROWS) {
    // 回傳下方外圍 Y 座標。
    return boardY +
      ROWS * (cardHeight + cardGap) -
      cardGap / 2;
  }

  // 回傳棋盤內部 Y 座標。
  return boardY +
    point.row * (cardHeight + cardGap) +
    cardHeight / 2;
}

// 視窗大小改變時執行。
function windowResized() {
  // 重新調整畫布大小。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算遊戲版面。
  calculateLayout();
}