/*
 *  player.js
 *  2014/07/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
(function() {

tm.define("tds.Player", {
    superClass: "tm.app.Object2D",
    layer: LAYER_OBJECT,

    control: true,  //操作可能フラグ
    shotON: true,   //ショットフラグ
    mouseON: false, //マウス操作中フラグ

    speed: 7,       //移動速度
    type: 0,        //自機タイプ

    power: 0,       //パワーチャージ
    powerMax: 180,  //パワーチャージ最大
    level: 0,       //ショットレベル
    levelMax: 10,   //ショットレベル
    limit: 0,       //ショットレベル上限
    shotInterval: 5,

    parentScene: null,

    init: function() {
        this.superInit();

        this.setupBody();

        //当り判定設定
        this.boundingType = "circle";
        this.radius = 2;
        
        this.time = 0;
        return this;
    },
    setupBody: function() {
        //コア
        var core = tm.display.Shape().addChildTo(this);
        core.x = 2;
        core.y = 3;
        core.width = core.height = 16;
        core.canvas.setFillStyle(
            tm.graphics.RadialGradient(25, 25, 0, 25, 25, 25)
                .addColorStopList([
                    {offset:0.0, color: "hsla({0}, 60%, 50%, 1.0)".format(200)},
                    {offset:0.5, color: "hsla({0}, 60%, 50%, 1.0)".format(240)},
                    {offset:1.0, color: "hsla({0}, 60%, 50%, 0.0)".format(240)},
                ]).toStyle()
            ).fillRect(0, 0, 50, 50);
        core.tweener.clear();
        core.tweener.scale(1.5, 100, "easeInOutQuad").scale(1.0, 200, "easeInOutQuad").setLoop(true);

        //機体
        var body = tm.display.Shape().addChildTo(this);
        body.y = 10;
        var c = body.canvas;
        c.setColorStyle("hsla(200, 50%, 50%, 1.0)", "hsla(200, 50%, 50%, 0.5)");
        c.setLineStyle(1);
        var path = [
            [28,0], [28,40], [25,30],
        ];
        c.beginPath();
        c.moveTo(path[0][0], path[0][1]);
        for (var i = 1; i < path.length; i++) {
            c.lineTo(path[i][0], path[i][1]);
        }
        c.lineTo(path[0][0], path[0][1]);

        c.moveTo(64-path[0][0], path[0][1]);
        for (var i = 1; i < path.length; i++) {
            c.lineTo(64-path[i][0], path[i][1]);
        }
        c.lineTo(64-path[0][0], path[0][1]);
        c.stroke().fill().closePath();
    },
    update: function() {
        //操作系
        if (this.control) {
            var p = app.pointing;
            var dx = p.position.x - p.prevPosition.x;
            var dy = p.position.y - p.prevPosition.y;
            if (p.getPointing()) {
                this.x += dx;
                this.y += dy;
                this.mouseON = true;
            }else{
                this.mouseON = false;
            }

            if (this.mouseON) {
                //ショット
                if (this.shotON && this.time % this.shotInterval == 0) {
                    var s = tds.ShotBullet(0).addChildTo(this.parentScene);
                    s.setPosition(this.x, this.y-16);
                }
            }
        }

        //移動範囲の制限
        this.x = Math.clamp(this.x, 16, SC_W-16);
        this.y = Math.clamp(this.y, 16, SC_H-16);

        //オーラ処理
        if (this.mouseON && this.time % 3 == 0) {
            this.tweener.clear().to({alpha:1},200);
            for (var i = 0; i < this.level+1; i++) {
                var rad = rand(0, 628) / 100;
                var dis = rand(10, 150);
                var x = Math.cos(rad)*dis;
                var y = Math.sin(rad)*dis;
                var s = rand(50, 150);
                var p = tds.Effect.Aura(this, s, 0.99).addChildTo(this.parent);
                p.setPosition(x+this.x, y+this.y);
                p.vx = -x / 50;
                p.vy = -y / 50;
                this.power++;
                if (this.power > this.powerMax) {
                    this.level++;
                    this.power = 0;
                    if (this.level > this.levelMax) {
                        this.level = this.levelMax;
                        this.power = this.powerMax;
                    }
                }
            }
        }
        if (!this.mouseON) {
            this.power = 0;
            this.level = 0;
            this.tweener.clear().to({alpha:0.3},200);
        }

        this.bx = this.x;
        this.by = this.y;
        this.time++;
    },

    //プレイヤー投入時演出
    startup: function() {
        var that = this;
        this.x = SC_W/2;
        this.y = SC_H+32;
        this.tweener.
        to({x:SC_W/2,y:SC_H-64}, 1000, "easeOutQuint").
        call(function(){
            that.shotON = true;
            that.control = true;
        });
        this.shotON = false;
        this.control = false;
    },

    //ステージ開始時演出
    stageStartup: function() {
        var that = this;
        this.x = SC_W/2;
        this.y = SC_H+32;
        this.tweener.
        to({x:SC_W/2,y:SC_H/2+32}, 1000, "easeOutQuint").
        to({x:SC_W/2,y:SC_H-64},1000).
        call(function(){
            that.shotON = true;
            that.control = true;
        });
        this.shotON = false;
        this.control = false;
    },
});

})();