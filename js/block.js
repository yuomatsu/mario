//
// ブロックオブジェクトのクラス
//

class Block {
  // ブロックの番号と位置を取得
  constructor(bl, x, y) {
    this.bl = bl;

    // 元々の座標
    this.ox = x;
    this.oy = y;

    // ピクセル座標
    this.x = x << 4;
    this.y = y << 4;

    // ブロックの状態
    this.kill = false;
    this.count = 0;

    // ブロックを上下させた際の後ろに残っているブロックを消す
    fieldData[y * FIELD_SIZE_W + x] = 367;
  }
  // 更新処理
  update() {
    if (this.kill) {
      return;
    }
    if (++this.count === 10) {
      this.kill = true;
      // 消えたブロックを再度表示する
      fieldData[this.oy * FIELD_SIZE_W + this.ox] = this.bl;
      return;
    }
  }
  // 描画処理
  draw() {
    if (this.kill) {
      return;
    }

    let sx = (this.bl & 15) << 4;
    let sy = (this.bl >> 4) << 4;

    let px = this.x - (field.scx);
    let py = this.y - (field.scy);

    // ブロックを上下させる
    const upDown = [0, 1, 2, 3, 4, 3, 2, 1, 0, -1];
    py -= upDown[this.count];

    vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
  }
}
