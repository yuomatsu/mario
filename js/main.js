const SCREEN_SIZE_W = 256;
const SCREEN_SIZE_H = 224;

let can = document.getElementById("can");
let con = can.getContext("2d");
// console.log(con)
// ファミコンの画面サイズ
can.width  = SCREEN_SIZE_W;
can.height = SCREEN_SIZE_H;

con.fillStyle = "#66AAFF";
con.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H);

let chImg = new Image();
chImg.src = "sprite.png";
console.log(chImg.src)
chImg.onload = () => {
    // 読み込み完了後に実行
    con.drawImage(chImg, 0, 0, 16, 32, 0, 0, 16, 32);
}

