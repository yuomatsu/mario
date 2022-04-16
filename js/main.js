const GAME_FPS = 1000 / 60;
const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

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
vcon.mozimageSmoothingEnabled = false;
vcon.msimageSmoothingEnabled = false;
vcon.webkitimageSmoothingEnabled = false;
vcon.imageSmoothingEnabled = false;


let frameCount = 0;
let startTime;

let chImg = new Image();
chImg.src = "sprite.png";
console.log(chImg.src)

function update() {

}

function draw() {
    vcon.fillStyle = "#66AAFF";
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);
    vcon.drawImage(chImg, 0, 0, 16, 32, 0, 0, 16, 32);

    vcon.font = "24px 'Impact'";

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
            if (++c >= 4) break;
        }
        // 描画処理
        draw();

    }
    requestAnimationFrame(mainLoop);

}
