﻿/*
 * main.js
 *
 * Copyright (c) 2021 tora-japan (s.noda)
 *
 * Released under the MIT license.
 * see https://opensource.org/licenses/MIT
 *
 * https://github.com/tora-japan/
 */

isDebugNextRandom = 0;      // デバッグ用：テトリミノの順番をランダムにする/順番にする

gameSwitch = "gameStart";   // ゲームスイッチ
tetriminoSize = 25;         // テトリミノのサイズ
// ステージの幅と高さ
stageWidth  = tetriminoSize * 12;
stageHeight = tetriminoSize * 20;

// テトリミノ
class Tetrimino{
  constructor(){
    this.x=3;               // 座標
    this.y=4;               // 座標
    this.rotation=0;        // 回転の番号
    this.number=0;          // 現在の番号
    this.next=0;            // 次の番号
    this.dropSpeed=0.02;    // 落下速度
    this.dropCounter=0;     // 落下カウンター
  }
  setNext(){
    this.x=3;
    this.y=4;
    this.number = this.next;
    this.rotation = 0;
    if(isDebugNextRandom){
      this.next = getRandom(6);
    }else{
      if(++this.next >= 7 )  this.next = 0;
    }
  }
}
tetrimino = new Tetrimino();
// テトリミノの座標配列 : テトリミノ番号[7],回転番号[4],ブロック数[4],xy座標[2]
//                        I S Z T L J O     0 90 180 270
tetriminoXY = [
    [ // I
        [ [ 2,1 ],[ 2,2 ],[ 2,3 ],[ 2,4 ] ],
        [ [ 0,2 ],[ 1,2 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,0 ],[ 2,1 ],[ 2,2 ],[ 2,3 ] ],
        [ [ 1,2 ],[ 2,2 ],[ 3,2 ],[ 4,2 ] ]
    ],
    [ // s
        [ [ 3,1 ],[ 2,2 ],[ 3,2 ],[ 2,3 ] ],
        [ [ 1,2 ],[ 2,2 ],[ 2,3 ],[ 3,3 ] ],
        [ [ 2,1 ],[ 1,2 ],[ 2,2 ],[ 1,3 ] ],
        [ [ 1,1 ],[ 2,1 ],[ 2,2 ],[ 3,2 ] ]
    ],
    [ // z
        [ [ 2,1 ],[ 2,2 ],[ 3,2 ],[ 3,3 ] ],
        [ [ 2,2 ],[ 3,2 ],[ 1,3 ],[ 2,3 ] ],
        [ [ 1,1 ],[ 1,2 ],[ 2,2 ],[ 2,3 ] ],
        [ [ 2,1 ],[ 3,1 ],[ 1,2 ],[ 2,2 ] ]
    ],
    [ // t
        [ [ 2,1 ],[ 1,2 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,1 ],[ 1,2 ],[ 2,2 ],[ 2,3 ] ],
        [ [ 1,2 ],[ 2,2 ],[ 3,2 ],[ 2,3 ] ],
        [ [ 2,1 ],[ 2,2 ],[ 3,2 ],[ 2,3 ] ]
    ],
    [ // l
        [ [ 1,1 ],[ 2,1 ],[ 2,2 ],[ 2,3 ] ],
        [ [ 3,1 ],[ 1,2 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,1 ],[ 2,2 ],[ 2,3 ],[ 3,3 ] ],
        [ [ 1,2 ],[ 2,2 ],[ 3,2 ],[ 1,3 ] ]
    ],
    [ // j
        [ [ 2,1 ],[ 3,1 ],[ 2,2 ],[ 2,3 ] ],
        [ [ 1,2 ],[ 2,2 ],[ 3,2 ],[ 3,3 ] ],
        [ [ 2,1 ],[ 2,2 ],[ 1,3 ],[ 2,3 ] ],
        [ [ 1,1 ],[ 1,2 ],[ 2,2 ],[ 3,2 ] ]
    ],
    [ // O
        [ [ 2,1 ],[ 3,1 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,1 ],[ 3,1 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,1 ],[ 3,1 ],[ 2,2 ],[ 3,2 ] ],
        [ [ 2,1 ],[ 3,1 ],[ 2,2 ],[ 3,2 ] ]
    ]
];

stageClearPattern = [
  //          1  1  1  1  1   テトリミノを横5つ分並べた場合（範囲）
  //          |  (x = 3)      テトリミノの初期座標にする場所
  // 0  1  2  3  4  5  6  7  8  9  0  1
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  0
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  1
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  2
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  3
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  4
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  5<--- 0
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  6     1
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  7     2
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  8     3
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], //  9     4
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 10     5
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 11     6
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 12     7
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 13     8
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 14     9
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 15    10
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 16    11
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 17    12
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 18    13
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 19    14
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 20    15
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 21    16
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 22    17
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 23    18
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 24    19
];
stage = [];                               // ステージ
spriteTColor = [1, 6, 7, 3, 5, 4, 2];     // スプライトIDに紐づけされたテトリミノの色番号

image_cacheCounter = 0;     // イメージキャッシュ登録のカウンター
image_cacheList = [];       // イメージキャッシュリスト

// キーの登録
input = new JsInput();
input.add( input.vk_left  );  // 用途：移動　左
input.add( input.vk_right );  // 用途：移動　右
input.add( input.vk_down);    // 用途：移動　下
input.add( input.vk_up  );    // 用途：回転
input.add( input.vk_space);   // 用途：回転・ゲーム開始

// 乱数
function getRandom(max) { return Math.floor(Math.random() * Math.floor(max)); }
// キャッシュに登録する：通常
function cacheAdd(fileName,x,y,w,h){
  let spriteFrame = new cc.SpriteFrame(fileName, cc.rect(x,y, w, h));
  cc.spriteFrameCache.addSpriteFrame(spriteFrame, image_cacheCounter);
  image_cacheCounter++;
}
// rtに対してキャッシュから描画する
function rtDrawSprite(number,x,y){
    let sprite = cc.Sprite.create( cc.spriteFrameCache.getSpriteFrame(number) );
    sprite.retain();
    sprite.setAnchorPoint(0, 0);
    sprite.setPosition(x,y);
    sprite.visit();
    sprite.release();
}

// テトリミノ用
TetriminoLayer = cc.Sprite.extend({
  rt:null,                            // レンダリングテクスチャー
  number:0,
  rot:0,
  ctor:function(){
    this._super();
    this.rt=cc.RenderTexture.create(tetriminoSize*5,tetriminoSize*5);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL) this.setFlippedY(true);
  },
  update(){
    this.rt.clear(0,0,0,255);
    this.rt.begin();
    var x,y,i,number;
    number = spriteTColor[this.number];
    for(let i=0;i<4;i++){
      x = tetriminoXY[this.number][this.rot][i][0];
      y = tetriminoXY[this.number][this.rot][i][1];
      rtDrawSprite( number,x*tetriminoSize, (4 - y)*tetriminoSize );
    }
    this.rt.end();
    this.setSpriteFrame( this.rt.sprite.getSpriteFrame() );
  }
});
// ステージ用
StageLayer = cc.Sprite.extend({
  rt:null,                            // レンダリングテクスチャー
  ctor:function(){
    this._super();
    this.rt=cc.RenderTexture.create(stageWidth,stageHeight);
    if (cc._renderType === cc._RENDER_TYPE_WEBGL) this.setFlippedY(true);
  },
  update(){
    this.rt.clear(0,0,0,255);
    this.rt.begin();
    var x,y,i,number;
    var offsetY = stageHeight - tetriminoSize;
    for(y=0;y<20;y++){
      for(x=0;x<12;x++){
        number =stage[y+5][x]-1;
        if(number==-1) continue;
        rtDrawSprite(number,x*tetriminoSize,offsetY - y*tetriminoSize );
      }
    }
    number = spriteTColor[tetrimino.number];

    for(i=0;i<4;i++){
      x = tetrimino.x + tetriminoXY[tetrimino.number][tetrimino.rotation][i][0];
      y = tetrimino.y + tetriminoXY[tetrimino.number][tetrimino.rotation][i][1]-5;
      rtDrawSprite( number,x*tetriminoSize,offsetY - y*tetriminoSize );
    }
    this.rt.end();
    this.setSpriteFrame( this.rt.sprite.getSpriteFrame() );
  }
});

var MainLayer = cc.Layer.extend({
  ctor:function () {
    this._super();
    var size = cc.director.getWinSize();          // ウィンドウサイズを取得

    aRect = cc.DrawNode.create();
    aRect.drawRect(cc.p(0,0),cc.p(450,800),cc.color( 64,128, 64,255), 0, cc.color(0,0,0,255));
    this.addChild(aRect, 3);
    image_cacheCounter=0;
    cc.spriteFrameCache.removeSpriteFrames();

    let w,h;
    w=h=tetriminoSize;
    cacheAdd('img/1_block.png',0,0,w,h);
    cacheAdd('img/2_lightblue.png',0,0,w,h);
    cacheAdd('img/3_yellow.png',0,0,w,h);
    cacheAdd('img/4_purple.png',0,0,w,h);
    cacheAdd('img/5_blue.png',0,0,w,h);
    cacheAdd('img/6_orange.png',0,0,w,h);
    cacheAdd('img/7_green.png',0,0,w,h);
    cacheAdd('img/8_red.png',0,0,w,h);

    stageLayer = new StageLayer();
    stageLayer.setAnchorPoint(0, 0);
    stageLayer.setPosition(0,800 - stageHeight -200);
    stageLayer.setScale(1);
    this.addChild(stageLayer, 4);

    nextLayer = new TetriminoLayer();
    nextLayer.setAnchorPoint(0, 0);
    nextLayer.setPosition(    25*3 , 800 -200 +25);
    nextLayer.setScale(1);
    this.addChild(nextLayer, 5);

    // メッセージ用の背景
    msgBg = cc.DrawNode.create();
    msgBg.drawRect(
      cc.p(             12,stageLayer.getPositionY() +stageHeight/2 + 24 * 2+12),
      cc.p(stageWidth - 12,stageLayer.getPositionY() +stageHeight/2 - 24 * 2-12),
      cc.color( 32,  128,  96, 255), 0, cc.color(0, 0, 0, 255));
    this.addChild(msgBg, 10);
    
    lblText_TGame = new cc.LabelTTF("T-Game", null, 24);
    lblText_TGame.attr({ x: stageWidth / 2, y: stageLayer.getPositionY() +stageHeight/2 + 24 });
    this.addChild(lblText_TGame, 11);

    lblText_GameOver = new cc.LabelTTF("ゲームオーバー", null, 24);
    lblText_GameOver.attr({ x: stageWidth / 2, y: stageLayer.getPositionY() +stageHeight/2 + 24 });
    this.addChild(lblText_GameOver, 11);

    lblText_SpaceStart = new cc.LabelTTF("スペースキーでゲーム開始", null, 16);
    lblText_SpaceStart.attr({ x: stageWidth / 2, y: stageLayer.getPositionY() +stageHeight/2 - 24 });
    this.addChild(lblText_SpaceStart, 11);
    
    this.hideMessage();
    return true;
  },
  showGameStart: function () {
    msgBg.visible = true;
    lblText_TGame.visible = true;
    lblText_GameOver.visible = false;
    lblText_SpaceStart.visible = true;
  },
  showGameOver: function () {
    msgBg.visible = true;
    lblText_TGame.visible = false;
    lblText_GameOver.visible = true;
    lblText_SpaceStart.visible = true;
  },
  hideMessage: function () {
    msgBg.visible = false;
    lblText_TGame.visible = false;
    lblText_GameOver.visible = false;
    lblText_SpaceStart.visible = false;
  },
});

MySceneGame = cc.Scene.extend({
  onEnter: function () {
    this._super();
    var x,y;
    var size = cc.director.getWinSize();
    this.mainLayer = new MainLayer();
    this.addChild(this.mainLayer);
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed: function (keyCode, event) {
        input.onDown(keyCode);
      },
      onKeyReleased: function (keyCode, event) {
        input.onUp(keyCode);
      }
    }, this);
    
    this.gameInit();
    this.scheduleUpdate();
  },
  update: function (dt) {
    input.exec();
    switch (gameSwitch) {
      case "gameStart": this.gameStart(); break;
      case "gameMain":  this.gameMain();  break;
      case "gameOver":  this.gameOver();  break;
    }
    nextLayer.number = tetrimino.next;
    stageLayer.update();
    nextLayer.update();
  },
  gameInit: function () {
    stage = [];
    for (let y = 0; y < stageClearPattern.length; y++) {
      stage.push(stageClearPattern[y].concat());
    }
    this.next();
    this.next();
    this.mainLayer.hideMessage();
  },
  gameStart: function () {
    this.mainLayer.showGameStart();
      if (input.getClick(input.vk_space)) {
        gameSwitch='gameMain';
        this.gameInit();
      }
  },
  gameOver: function () {
    this.mainLayer.showGameOver();
      if (input.getClick(input.vk_space)) {
        gameSwitch='gameMain';
        this.gameInit();
      }
  },
  gameMain: function() {
      if (input.getPress(input.vk_up,   128)) this.rotationLeftRight(1);
      if (input.getPress(input.vk_down, 128)) this.move(0, 1);
      if (input.getPress(input.vk_left,  64)) this.move(-1, 0);
      if (input.getPress(input.vk_right, 64)) this.move(1, 0);
//      if (input.getPress(input.vk_space,128)) this.next();
      if (input.getPress(input.vk_space,128)) this.rotationLeftRight(-1);

      // 落下処理
      tetrimino.dropCounter += tetrimino.dropSpeed;
      if (tetrimino.dropCounter >= 1){
        tetrimino.dropCounter = 0;
        // 1つ落下してみて移動不可である？
        if (this.move(0, 1)==0) {
          this.putTetriminoOnStage();           // テトリミノを置く
          let lines = this.removeLine();        // ラインを消す
          if(lines != 0){
            tetrimino.dropSpeed +=0.005;        // 消したのでちょっと早くする
          }
          this.next();                          // 次にセットする
          if (this.isHit()){                    // セットした位置で動けない場合はゲームオーバー
            gameSwitch = 'gameOver';
          }
        }
      }
  },
  // テトリミノを回転させる
  rotationLeftRight: function(value){
      let tmpRotation = tetrimino.rotation;
      for (let i = 0; i < 4; i++) {
          tetrimino.rotation += value;
          if (tetrimino.rotation < 0) tetrimino.rotation = 3;
          if (tetrimino.rotation >= 4) tetrimino.rotation = 0;
          if (this.isHit() == 0) return 1;
      }
      tetrimino.rotation = tmpRotation;
      return 0;
  },
  // テトリミノを移動する
  move: function(x,y){
    let tmpX = tetrimino.x;
    let tmpY = tetrimino.y;
    tetrimino.x += x;
    tetrimino.y += y;
    if (this.isHit() == 0) return 1;
    tetrimino.x = tmpX;
    tetrimino.y = tmpY;
    return 0;
  },
  // 次のテトリミノをセットする
  next: function(){
    tetrimino.setNext();
  },
  // テトリミノとステージとの当たり判定
  isHit: function(){
      let x, y;
      for (let i = 0; i < 4; i++){
          x = tetriminoXY[tetrimino.number][tetrimino.rotation][i][0] + tetrimino.x;
          y = tetriminoXY[tetrimino.number][tetrimino.rotation][i][1] + tetrimino.y;
          if (x <= 0) return 1;
          if (x >= 11) return 1;
          if (y < 0) return 1;
          if (y >= 24) return 1;
          if (stage[y][x] != 0) return 1;
      }
      return 0;
  },
  // テトリミノを置く
  putTetriminoOnStage:function(){
    let x, y;
    let color = [1, 6, 7, 3, 5, 4, 2];
    for (let i = 0; i < 4; i++){
      x = tetriminoXY[tetrimino.number][tetrimino.rotation][i][0] + tetrimino.x;
      y = tetriminoXY[tetrimino.number][tetrimino.rotation][i][1] + tetrimino.y;
      if (1 <= x && x <= 10 && 0 < y && y < 24) {
        stage[y][x] = spriteTColor[tetrimino.number] + 1;
      }
    }
  },
  // テトリミノのライン（横一列）ができているか？
  isLine:function(y){
    for (let x = 1; x <= 10; x++){
      if (stage[y][x] == 0) return 0;
    }
    return 1;
  },
  // ステージのラインを上書きで移動させる
  moveLine : function(i){
    for (let y = i; y > 1; y--) {
      for (let x = 1; x <= 10; x++) {
        stage[y][x] = stage[y - 1][x];
      }
    }
  },
  // ラインを消す：消したライン数を返す
  removeLine : function(){
    let yy = tetrimino.y + 5;
    if (yy >= 23) yy = 23;
    let  cnt = 0;
    for (let y = yy; y > 0; y--) {
      if (this.isLine(y)) {       // テトリミノのライン（横一列）ができているか？
        this.moveLine(y);         // ステージのラインを上書きで移動させる
        y++;                      // 1ライン移動したのでオフセットを調整
        cnt++;                    // 消したライン数を加算する
      }
    }
    return cnt;
  }
});
