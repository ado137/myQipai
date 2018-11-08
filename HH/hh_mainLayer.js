// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let hh_data = require('hh_data');
let hh_net = require('hh_net');
var GamesBaseLayer = require('GamesBaseLayer');
cc.Class({
    extends: GamesBaseLayer,
    editor: {
        executeInEditMode: false,
    },

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    __preload() {
        this._super()
        hh_data.init()
        hh_net.registAll()
    },

    onLoad () {

    },

    start () {
        this._super();
        this.paiLuUI = this.node.getChildByName('paiLuUI').children[0]
        this.recordUI = this.node.getChildByName('recordUI').children[0]
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        hh_data.exitGameStatusNotify.addListener(this.BaseExcutiveExitGame , this);
    },

    update (dt) {

    },

    onDestroy () {
        this._super();
        hh_data.destroy()
        hh_net.unRegAll()
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
        hh_data.exitGameStatusNotify.removeListener(this.BaseExcutiveExitGame , this);
    },

    refreshUI () {
    },

    openHistoryUI () {
        this.paiLuUI.getComponent('hh_paiLuUI').playFly(1)
    },
        
    openMyRecordUI () {
        this.recordUI.getComponent('DialogBox').Show();
    },

    //需要子类覆�正常进入游戏
    InitWithNormalEnter(_Msg)
    {
        hh_net.onENTER_GAME(_Msg)
    },
    //需要子类覆�断线重连进入游戏
    InitWithReconnect(_Msg)
    {
        hh_net.onENTER_GAME(_Msg)
    },

});
