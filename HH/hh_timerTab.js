// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Thor = require('Thor');
let hh_data = require('hh_data');
let hh_const = require('hh_const');
cc.Class({
    extends: Thor,
    editor: {
        executeInEditMode: false,
    },

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        hh_data.gameStateNotify.addListener(this.refreshStateUI , this);
        hh_data.initDataFlagNotify.addListener(this.refreshStateUI , this);
        this.refreshStateUI()
        this.refreshTimer()
    },

    refreshTimer () {
        let timeStr = '';
        let countDown = Math.ceil(hh_data.countDown);
        timeStr = "" + countDown < 10 ? ('0' + countDown) : countDown;
        this._labelTimer.$Label.string = timeStr;
    },

    refreshStateUI() {
        this._labelState.$Label.string = (hh_data.gameState === hh_const.GAME_STATE.BET)? '下注中：' : '开奖中：';
    },

    onDestroy () {
        hh_data.gameStateNotify.removeListener(this.refreshStateUI , this);
        hh_data.initDataFlagNotify.removeListener(this.refreshStateUI , this);
    },
    update (dt) {
        this.refreshTimer()
    },
});
