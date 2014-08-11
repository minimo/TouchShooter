/*
 *  Effect.js
 *  2014/07/10
 *  @auther minimo  
 *  This Program is MIT license.
 */
tds.Effect = [];

(function() {

//汎用パーティクル
tm.define("tds.Effect.Particle", {
    superClass: "tm.display.Shape",
    layer: LAYER_EFFECT_UPPER,

    alpha: 1.0,
    alphaDecayRate: 0.85,
    size: 0,

    image: null,
    isEffect: true,
    isUpper: true,

    init: function(size, initialAlpha, alphaDecayRate, color) {
        size = size || 32;
        color = color || 0;
        this.superInit(size, size);

        if (initialAlpha === undefined) initialAlpha = 1;
        if (alphaDecayRate === undefined) alphaDecayRate = 0.9;

        this.size = size;
        this.alpha = initialAlpha;
        this.alphaDecayRate = alphaDecayRate;
        this.blendMode = "lighter";

        var c = this.canvas;
        c.setFillStyle(
            tm.graphics.RadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
                .addColorStopList([
                    {offset:0.0, color: "hsla({0}, 60%, 50%, 1.0)".format(color)},
                    {offset:0.5, color: "hsla({0}, 60%, 50%, 0.5)".format(color)},
                    {offset:1.0, color: "hsla({0}, 60%, 50%, 0.0)".format(color)},
                ]).toStyle()
            )
            .fillRect(0, 0, size, size);

        this.on("enterframe", function() {
            this.alpha *= this.alphaDecayRate;
            if (this.alpha < 0.01) {
                this.remove();
                return;
            } else if (1.0 < this.alpha) {
                this.alpha = 1.0;
            }
        }.bind(this));
    },
});

//オーラ用パーティクル
tm.define("tds.Effect.Aura", {
    superClass: "tm.display.Shape",
    layer: LAYER_EFFECT_UPPER,

    init: function(target, size, alphaDecayRate) {
        this.superInit();

        size = size || 100;
        if (alphaDecayRate === undefined) alphaDecayRate = 0.9;

        this.width = this.height = this.size = size;
        this.alpha = 0.02;
        this.alphaDecayRate = alphaDecayRate;
        this.blendMode = "lighter";
        this.tweener.clear().to({alpha:1},200).to({alpha:0},2000);

        this.target = target;
        this.vanish = false;

        this.setScale(size*0.01);

        var c = this.canvas;
        c.setFillStyle(
            tm.graphics.RadialGradient(25, 25, 0, 25, 25, 25)
                .addColorStopList([
                    {offset:0.0, color: "hsla({0}, 60%, 50%, 0.4)".format(200)},
                    {offset:0.5, color: "hsla({0}, 60%, 50%, 0.2)".format(240)},
                    {offset:1.0, color: "hsla({0}, 60%, 50%, 0.0)".format(240)},
                ]).toStyle()
            )
            .fillRect(0, 0, 50, 50);
    },

    update: function() {
        if (this.alpha < 0.01) {
            this.remove();
            return;
        } else if (1.0 < this.alpha) {
            this.alpha = 1.0;
        }
        if (this.target.mouseON && !this.vanish) {
             this.x += this.vx;
             this.y += this.vy;
        } else {
             this.vanish = true;
             this.x -= this.vx*3;
             this.y -= this.vy*3;
        }
        var x = this.target.x;
        var y = this.target.y;
        if (this.x-2 < x && x < this.x+2 && this.y-2 < y && y < this.y+2) {
            this.remove();
            return;
        }
        this.scaleX *= 0.98;
        this.scaleY *= 0.98;
    },
});

//爆発用パーティクル
tm.define("tds.Effect.BurnParticle", {
    superClass: "tm.display.Shape",
    layer: LAYER_EFFECT_UPPER,

    alpha: 1.0,
    alphaDecayRate: 0.85,
    size: 0,

    image: null,
    isEffect: true,
    isUpper: true,

    init: function(size, initialAlpha, alphaDecayRate, color) {
        size = size || 32;
        color = color || 0;
        this.superInit(size, size);

        if (initialAlpha === undefined) initialAlpha = 1;
        if (alphaDecayRate === undefined) alphaDecayRate = 0.9;

        this.size = size;
        this.alpha = initialAlpha;
        this.alphaDecayRate = alphaDecayRate;
        this.blendMode = "lighter";

        var c = this.canvas;
        c.setFillStyle(
            tm.graphics.RadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
                .addColorStopList([
                    {offset:0.0, color: "hsla({0}, 50%, 30%, 1.0)".format(color)},
                    {offset:0.5, color: "hsla({0}, 50%, 30%, 0.5)".format(color)},
                    {offset:1.0, color: "hsla({0}, 60%, 50%, 0.0)".format(color)},
                ]).toStyle()
            )
            .fillRect(0, 0, size, size);

        this.on("enterframe", function() {
            this.alpha *= this.alphaDecayRate;
            if (this.alpha < 0.01) {
                this.remove();
                return;
            } else if (1.0 < this.alpha) {
                this.alpha = 1.0;
            }
        }.bind(this));
    },
});

})();