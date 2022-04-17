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

// ビット演算を用いる
let mario_x = 100 << 4;
let mario_y = 100 << 4;
// マリオの移動速度
let mario_vx = 0;
// マリオのスプライト番号
let mario_sprite = 1;
// マリオの状態（立っている時が0、歩いている時が1）
let mario_anime = 0;
// カウント
let mario_acount = 0;
let mario_dir = 0;



function update() {
    if (keyb.Left) {
        if(mario_anime == 0) mario_acount = 0;
        mario_anime = 1;
        mario_sprite = 48;
        mario_dir = 1;
        if (mario_vx > -2 * 16) mario_vx -= 1; // 16倍したいが0.1*16=1.6で小数になってしまうので1
        if (mario_vx > 0) mario_vx -= 1;
        if (mario_vx > 8) mario_anime = 2;
    } else if (keyb.Right) {
        if(mario_anime == 0) mario_acount = 0;
        mario_anime = 1;
        mario_sprite = 0;
        mario_dir = 0;
        if (mario_vx < 2 * 16) mario_vx += 1;
        if (mario_vx < 0) mario_vx += 1;
        if (mario_vx < -8) mario_anime = 2;
    } else {
        if (mario_vx > 0) mario_vx -= 1;
        if (mario_vx < 0) mario_vx += 1;
        // mario_vxが0ならばマリオは停止
        if (!mario_vx) mario_anime = 0;
    }
    mario_acount++;
    if(Math.abs(mario_vx) == 32) mario_acount++;

    if (mario_anime === 0) mario_sprite = 0;
    // ここが分かりにくい
    else if (mario_anime === 1) mario_sprite = 2 + ((mario_acount / 6) % 3);
    else if (mario_anime === 2) mario_sprite = 5;

    // マリオの向きを判定
    if(mario_dir) mario_sprite += 48;

    mario_x += mario_vx;
}

function drawSprite(snum, x, y) {

    let sx = (snum & 15) * 16;
    let sy = (snum >> 4) * 16;
    // マリオ表示
    vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32);
}

function draw() {
    vcon.fillStyle = "#66AAFF";
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);
    drawSprite(mario_sprite, mario_x >> 4, mario_y >> 4);

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
            console.log(keyb);
            console.log(mario_x);
            if (++c >= 4) break;
        }
        // 描画処理
        draw();

    }
    requestAnimationFrame(mainLoop);

}


// キーボードが押された時に呼ばれる
document.onkeydown = function (e) {
    // console.log(e.key);
    if (e.key == "ArrowLeft") keyb.Left = true;
    if (e.key == "ArrowRight") keyb.Right = true;
    // console.log(keyb);
};
// キーボードが話された時に呼ばれる
document.onkeyup = function (e) {
    if (e.key == "ArrowLeft") keyb.Left = false;
    if (e.key == "ArrowRight") keyb.Right = false;
};
// console.log(keyb)


