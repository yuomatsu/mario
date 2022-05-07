// 仮想キャンバスを作成
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d")

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

// ファミコンの画面サイズ
can.width = SCREEN_SIZE_W * 2;
can.height = SCREEN_SIZE_H * 2;

// ぼやけを修正
con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;


let frameCount = 0;
let startTime;

let chImg = new Image();
chImg.src = "sprite.png";

// マリオの位置
// キーボード
let keyb = {};

// マリオを定義する
let mario = new Mario(100, 100)

// フィールドを作る
let field = new Field();

// ブロックのオブジェクト
let block = [];

function update() {
  // フィールドを更新
  field.update();
  // スプライトのブロックを更新
  for (let i = block.length - 1; i >= 0; i--) {
    block[i].update();
    if (block[i].kill) {
      block.splice(i, 1)
    }
  }
  // マリオを更新
  mario.update();
}

function drawSprite(snum, x, y) {

  let sx = (snum & 15) << 4;
  let sy = (snum >> 4) << 4;
  // マリオ表示
  vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32);
}

function draw() {
  vcon.fillStyle = "#66AAFF";
  vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);

  // 描画処理
  field.draw();
  // スプライトのブロックを表示
  for (let i = 0; i < block.length; i++) {
    block[i].draw();
  }
  mario.draw();

  // デバッグ
  vcon.font = "24px 'Impact'";

  // 仮想画面から実画面に拡大表示
  con.drawImage(vcan, 0, 0, vcan.width, vcan.height, 0, 0, can.width, can.height);
}

// 1秒間に60回mainLoopを実行
setInterval(mainLoop, 1000 / 60);

window.onload = function () {
  startTime = performance.now();
  mainLoop();
}

function mainLoop() {
  let nowTime = performance.now();

  // 何回目の描画なのか算出
  let nowFrame = (nowTime - startTime) / GAME_FPS;
  if (nowFrame > frameCount) {

    // 処理落ちした時の制御（もっといいやり方あるかも）
    let c = 0;
    while (nowFrame > frameCount) {
      frameCount++;
      // 更新処理
      update();
      // console.log(keyb);
      // console.log(mario_x);
      if (++c >= 4) break;
    }
    // 描画処理
    draw();

  }
  requestAnimationFrame(mainLoop);

}


// キーボードが押された時に呼ばれる
document.onkeydown = function (e) {
  // console.log(e);
  if (e.key === "ArrowLeft") keyb.Left = true;
  if (e.key === "ArrowRight") keyb.Right = true;
  if (e.key === "z") keyb.aButton = true;
  if (e.key === "x") keyb.bButton = true;
  // console.log(keyb);
  if (e.key == "a") field.scx--;
  if (e.key == "s") field.scx++;

};
// キーボードが話された時に呼ばれる
document.onkeyup = function (e) {
  if (e.key == "ArrowLeft") keyb.Left = false;
  if (e.key == "ArrowRight") keyb.Right = false;
  if (e.key == "z") keyb.aButton = false;
  if (e.key == "x") keyb.bButton = false;
};

