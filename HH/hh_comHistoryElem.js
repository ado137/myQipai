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
let hh_const = require('hh_const');
let Thor = require('Thor');
cc.Class({
    extends: Thor,

    editor: {
        executeInEditMode: false,
    },

    properties: {
        panelPl : cc.Node,
        elemPl : cc.Prefab,
        panelPx : cc.Node,
        elemPx : cc.Prefab,
        elemPlNum : 0,
        elemPxNum : 0,

        _elemPlList : [],
        _elemPxList : [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._elemPlList = []
        this._elemPxList = []
        if(this.panelPl){
            for (let index = 0; index < this.elemPlNum; index++) {
                let elemPl = cc.instantiate(this.elemPl);
                elemPl.parent = this.panelPl;
                this._elemPlList.push(elemPl)
            }
        }
        if(this.panelPx){
            for (let index = 0; index < this.elemPxNum; index++) {
                let elemPx = cc.instantiate(this.elemPx);
                elemPx.parent = this.panelPx;
                this._elemPxList.push(elemPx)
            }
        }
    },

    start () {
        hh_data.winHistoryListNotify.addListener(this.refreshUI , this);
        hh_data.cardTypeHistoryListNotify.addListener(this.refreshUI , this);
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        //this.refreshUI()
    },

    refreshUI () {
        if(this.panelPl){
            for (let index = 0; index < this.elemPlNum; index++) {
                let elemPl = this._elemPlList[index];
                elemPl.active = hh_data.winHistoryList[index] != undefined
                elemPl.getComponent("MagicSprite").index = hh_data.winHistoryList[index] === 0 ? 0 : 1;
            }
        }
        if(this.panelPx){
            for (let index = 0; index < this.elemPxNum; index++) {
                let elemPx = this._elemPxList[index];
                elemPx.active = hh_data.cardTypeHistoryList[index] != undefined
                elemPx.getComponent("MagicSprite").index =  hh_data.cardTypeHistoryList[index];
            }
        }
    },

    onDestroy () {
        this._elemPlList = []
        this._elemPxList = []
        hh_data.winHistoryListNotify.removeListener(this.refreshUI , this);
        hh_data.cardTypeHistoryListNotify.removeListener(this.refreshUI , this);
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
    },
    // update (dt) {},
});
