/*
 *  BulletPattern.js
 *  2014/08/02
 *  @auther minimo  
 *  This Program is MIT license.
 */
(function() {

tds.bulletPattern = [];
var $ = bulletml.dsl;

$rank = 1;

//弾種
var RS = function(action) { return $.bullet(action, {type: "normal", color:320}); };
var BS = function(action) { return $.bullet(action, {type: "normal", color:240}); };
var RL = function(action) { return $.bullet(action, {type: "large", color:320}); };
var BL = function(action) { return $.bullet(action, {type: "large", color:240}); };

var $interval = function(v) { return $.wait(v) };

//速度
var $spd = function(v) {
    v = v===undefined?1:v;
    return $.speed($rank*0.1*v+v); };

var $fireBS = function(spd) { return $.fire($.direction(0), $.speed(spd) || $spd, BS) };
var $fireRS = function(spd) { return $.fire($.direction(0), $.speed(spd) || $spd, RS) };

//no operation
tds.bulletPattern["nop"] = new bulletml.Root({top: $.action([$.wait(10000)])});

//Basic aim bullet
tds.bulletPattern["basic-aim1"] = new bulletml.Root({
    top: $.action([
        $.wait(60),
        $.repeat(999, [
            $fireRS(6),
            $.wait("$rand * 60"),
        ]),
    ]),
});

tds.bulletPattern["basic-aim2"] = new bulletml.Root({
    top: $.action([
        $.wait(60),
        $.repeat(999, [
            $fireRS(6),
            $.wait("$rand * 60"),
        ]),
    ]),
});

/** 自機狙いn-way弾 */
var $nway = function(way, rangeFrom, rangeTo, speed, bullet, offsetX, offsetY, autonomy) {
    return $.action([
        $.fire($.direction(rangeFrom), speed, bullet || RS, offsetX, offsetY, autonomy),
        $.bindVar("way", "Math.max(2, " + way + ")"),
        $.repeat("$way-1", [
            $.fire($.direction("((" + rangeTo + ")-(" + rangeFrom + "))/($way-1)", "sequence"), speed, bullet || RS, offsetX, offsetY, autonomy),
        ]),
    ]);
};
var $nwayVs = function(way, rangeFrom, rangeTo, bullet, offsetX, offsetY, autonomy) {
    return function(spd) {
        return $nway(way, rangeFrom, rangeTo, spd, bullet, offsetX, offsetY, autonomy);
    };
};

/** 絶対n-way弾 */
var $absoluteNway = function(way, rangeFrom, rangeTo, speed, bullet, offsetX, offsetY) {
    return $.action([
        $.fire($.direction(rangeFrom, "absolute"), speed, bullet || RS, offsetX, offsetY),
        $.bindVar("way", "Math.max(2, " + way + ")"),
        $.repeat("$way-1", [
            $.fire($.direction("((" + rangeTo + ")-(" + rangeFrom + "))/($way-1)", "sequence"), speed, bullet || RNS, offsetX, offsetY),
        ]),
    ]);
};
var $absoluteNwayVs = function(way, rangeFrom, rangeTo, bullet, offsetX, offsetY) {
    return function(spd) {
        return $absoluteNway(way, rangeFrom, rangeTo, spd, bullet, offsetX, offsetY);
    };
};

/**
 * ウィップ
 * @param {bulletml.Speed} baseSpeed 初回のスピード
 * @param {number} delta 2回目以降のスピード増分
 * @param {number} count 回数
 * @param {function(bulletml.Speed):bulletml.Action} スピードを受け取りActionを返す関数
 */
var $whip = function(baseSpeed, delta, count, actionFunc) {
    return $.action([
        actionFunc(baseSpeed),
        $.repeat(count + "-1", [
            actionFunc($.speed(delta, "sequence")),
        ]),
    ]);
};

//cube1
tds.bulletPattern["cube1"] = new bulletml.Root({
    top: $.action([
        $.wait(60),
        $.repeat(999, [
            $fireRS(6),
            $.wait("$rand * 60"),
        ]),
    ]),
});

//cube2
tds.bulletPattern["cube2"] = new bulletml.Root({
    top: $.action([
        $.wait(60),
        $.repeat(3, [
            $fireRS(6),
            $.wait("$rand * 60"),
        ]),
    ]),
});

//square
tds.bulletPattern["square1"] = new bulletml.Root({
    top: $.action([
        $.wait(240),
        $.repeat(3, [
            $absoluteNway(10, 90, 270, $spd(3), RL, 0, 0),
            $.wait("$rand * 60"),
        ]),
    ]),
});

//square1-child
tds.bulletPattern["square1-child"] = new bulletml.Root({
    top: $.action([
        $.wait(300),
        $.repeat(3, [
            $fireRS(6),
            $.wait("$rand * 60"),
        ]),
    ]),
});

})();