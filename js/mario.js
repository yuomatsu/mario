//
// マリオクラス
//

// 状態を定義
const ANIME_STAND = 1;
const ANIME_WALK = 2;
const ANIME_BRAKE = 4;
const ANIME_JUMP = 8;
const GRAVITY = 4;
const MAX_SPEED = 32;

class Mario {

  constructor(x, y) {
    // ビット演算を用いる
    this.x = x << 4;
    this.y = y << 4;
    // マリオの移動速度
    this.vx = 0;
    // マリオの上下移動速度
    this.vy = 0;
    // マリオの状態（立っている時が0、歩いている時が1）
    this.anime = 0;
    // マリオのスプライト番号
    this.snum = 0;
    // フレームのカウント数
    this.acount = 0;
    this.dir = 0;
    // ジャンプステータス（0が着地している、1以上で空中）
    this.jump = 0;
  }

  // 床の判定
  checkFloor() {
    if (this.vy <= 0) {
      return;
    }

    let lx = (this.x + this.vx) >> 4;
    let ly = (this.y + this.vy) >> 4;

    if (
      // マリオの足の両端より1px内側で判定
      field.isBlock(lx + 1, ly + 31)
      || field.isBlock(lx + 14, ly + 31
      )
    ) {
      if (this.anime === ANIME_JUMP) {
        this.anime = ANIME_WALK;
      }
      this.jump = 0;
      this.vy = 0;
      this.y = ((((ly + 31) >> 4) << 4) - 32) << 4;

    }
  }

  // 壁の判定（）
  checkWall() {
    let lx = (this.x + this.vx) >> 4;
    let ly = (this.y + this.vy) >> 4;

    if (
      // 右側（大きいマリオは頭、胴、つま先の3点チェック）
      field.isBlock(lx + 15, ly + 9)
      || field.isBlock(lx + 15, ly + 15)
      || field.isBlock(lx + 15, ly + 24)
    ) {
      this.vx = 0;
      this.x -= 8; // 0.5px分左に寄せる
    }
    if (
      // 左側（大きいマリオは頭、胴、つま先の3点チェック）
      field.isBlock(lx, ly + 9)
      || field.isBlock(lx, ly + 15)
      || field.isBlock(lx, ly + 24)
    ) {
      this.vx = 0;
      this.x += 8;
    }
  }

  // 天井の判定
  checkCeiling() {
    if (this.vy >= 0) {
      return;
    }

    let lx = (this.x + this.vx) >> 4;
    let ly = (this.y + this.vy) >> 4;

    // +6はジャンプ中の手を考慮するため
    let bl = field.isBlock(lx + 8, ly + 6);
    if (bl) {
      // ジャンプを終わらせるためjumpを15に指定
      this.jump = 15;
      this.vy = 0;

      if (bl != 371) {
        block.push(new Block(bl, (lx + 8) >> 4, (ly + 5) >> 4));
      } else {
        // ブロックが壊れたら4方向に散らばる
        block.push(new Block(bl, (lx + 8) >> 4, (ly + 5) >> 4, 1, 20, -60));
        block.push(new Block(bl, (lx + 8) >> 4, (ly + 5) >> 4, 1, -20, -60));
        block.push(new Block(bl, (lx + 8) >> 4, (ly + 5) >> 4, 1, 20, -20));
        block.push(new Block(bl, (lx + 8) >> 4, (ly + 5) >> 4, 1, -20, -20));
      }
    }
  }

  // ジャンプ
  updateJump() {
    if (keyb.aButton) {
      if (this.jump === 0) {
        this.anime = ANIME_JUMP;
        this.jump = 1;
      }
      // ジャンプ中の速度を小さくしていく
      if (this.jump < 14) {
        this.vy = -(64 - this.jump);
      }
    }
    if (this.jump) {
      this.jump++;
    }
  }

  updateWalkSub(dir) {
    // 最高速まで加速
    if (dir === 0 && this.vx < MAX_SPEED) {
      this.vx++;
    }
    if (dir === 1 && this.vx > -MAX_SPEED) {
      this.vx--; // 16倍したいが0.1*16=1.6で小数になってしまうので1
    }

    // ジャンプしていないとき
    if (!this.jump) {
      // 立ちポーズのときはカウンタをリセット
      if (this.anime == 0) this.acount = 0;

      this.anime = ANIME_WALK;
      // 方向を決定
      if (!this.jump) {
        this.dir = dir;
      }
      if (dir === 0 && this.vx < 0) {
        this.vx++;
      }
      if (dir === 1 && this.vx > 0) {
        this.vx--;
      }
      // 逆方向の加速値が大きい場合はブレーキをかける
      if (dir === 1 && this.vx > 8
        || dir === 0 && this.vx < -8) {
        this.anime = ANIME_BRAKE;
      }
    }
  }

  // 水平移動
  updateWalk() {
    if (keyb.Left) {
      this.updateWalkSub(1);
    } else if (keyb.Right) {
      this.updateWalkSub(0);
    } else {
      // ジャンプしていないときは速度を帰る
      if (!this.jump) {
        // console.log(this.jump);
        if (this.vx > 0) this.vx -= 1;
        if (this.vx < 0) this.vx += 1;
        // this.vxが0ならばマリオは停止
        if (!this.vx) this.anime = ANIME_STAND;
        // if (this.jump === 0 && !this.vx) this.anime = 0;
      }
    }
  }

  updateAnime() {
    // スプライトの決定
    switch (this.anime) {
      case ANIME_STAND:
        this.snum = 0;
        break;
      case ANIME_WALK:
        this.snum = 2 + ((this.acount / 6) % 3);
        break;
      case ANIME_BRAKE:
        this.snum = 5;
        break;
      case ANIME_JUMP:
        this.snum = 6;
        break;
    }
    // マリオの向きを判定
    if (this.dir) this.snum += 48;
  }

  // 毎フレームごとの更新処理
  update() {
    // アニメ用のカウンタ
    this.acount++;
    if (Math.abs(this.vx) === MAX_SPEED) this.acount++;

    this.updateJump();
    this.updateWalk();
    this.updateAnime();

    // 重力
    if (this.vy < 64) this.vy += GRAVITY;

    // 座標を返す
    this.x += this.vx;
    this.y += this.vy;

    // 壁の判定
    this.checkWall();

    // 床の判定
    this.checkFloor();

    // 天井の判定
    this.checkCeiling();

    // if (this.y > 160 << 4) {
    //   if (this.anime === ANIME_JUMP) {
    //     this.anime = ANIME_WALK;
    //   }
    //   this.jump = 0;
    //   this.vy = 0;
    //   this.y = 160 << 4;
    // }
  }

  // 毎フレームごとの描画処理
  draw() {
    // 背景の移動に合わせてマリオの位置を調整
    let px = (this.x >> 4) - field.scx;
    let py = (this.y >> 4) - field.scy;
    drawSprite(this.snum, px, py);
  }


}