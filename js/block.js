//
// ブロックオブジェクトのクラス
//

class Block {
  // ブロックの番号と位置を取得
  constructor(bl, x, y, type, vx, vy) {
    if (type === undefined) {
      type = 0;
    }
    this.type = type;
    if (vx === undefined) {
      vx = 0;
    }
    this.vx = vx;
    if (vy === undefined) {
      vy = 0;
    }
    this.vy = vy;


    this.bl = bl;

    // 元々の座標
    this.ox = x;
    this.oy = y;

    // ピクセル座標
    this.x = x << 8;
    this.y = y << 8;

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
    if (++this.count === 10 && this.type === 0) {
      this.kill = true;
      // 消えたブロックを再度表示する
      fieldData[this.oy * FIELD_SIZE_W + this.ox] = this.bl;
      return;
    }
    if (this.type === 0) {
      return;
    }

    if (this.vy < 64) {
      this.vy += GRAVITY;
    }
    this.x += this.vx;
    this.y += this.vy;

    // フィールドの縦サイズを超えたらkillしないと永遠に落ち続ける
    if ((this.y >> 4) > FIELD_SIZE_H * 16) {
      this.kill = true;
    }
  }

  // 描画処理
  draw() {
    if (this.kill) {
      return;
    }

    let anime;
    // typeが1の場合は壊れたブロックを描画する
    if (this.type === 0) {
      anime = this.bl;
    } else {
      anime = 388 + ((frameCount >> 4) & 1);
    }

    let sx = (anime & 15) << 4;
    let sy = (anime >> 4) << 4;

    let px = (this.x >> 4) - (field.scx);
    let py = (this.y >> 4) - (field.scy);

    // ブロックを上下させる
    if (this.type === 0) {
      const upDown = [0, 1, 2, 3, 4, 3, 2, 1, 0, -1];
      py -= upDown[this.count];
    }
    vcon.drawImage(chImg, sx, sy, 16, 16, px, py, 16, 16);
  }
}
