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
let hh_net = require('hh_net');

cc.Class({
    extends: cc.Component,
    onLoad: function () {
        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown: function (event) {
        cc.log(event.keyCode);
        let area =  Math.floor(Math.random() * 3);
        let score = hh_const.CHIP_CONFIG[Math.floor(Math.random() * hh_const.CHIP_CONFIG.length)];
        switch(event.keyCode) {
            case cc.KEY.a:
                //hh_net.onME_KICK_OUT()
                //require("Common").ShowTips('testtesttesttesttesttesttesttesttest')
                //cc.director.loadScene("LoginScene");
                hh_data.countDown3Second = true
                break;
            case cc.KEY.s:
                hh_data.currentTurnBetRecord = []
                break;
            case cc.KEY.d:
                hh_data.addBetChip(area , score , false)
                break;
            case cc.KEY.f:
                break;
        }
    },

    start () {
        /*hh_data.countDown = hh_const.BET_TIME;
        hh_data.gameState = hh_const.GAME_STATE.BET;
        this.schedule(function(){
            if (hh_data.gameState === hh_const.GAME_STATE.BET) {
                let area =  Math.floor(Math.random() * 3);
                let score = hh_const.CHIP_CONFIG[Math.floor(Math.random() * hh_const.CHIP_CONFIG.length)];
                hh_data.addBetChip(area , score , false);
            }
        } , 0.5);
        
        hh_data.winHistoryList = [1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1]
        let l = []
        for (let index = 0; index < 20; index++) {
            l[index] = Math.floor(Math.random()*6);
        }
        hh_data.cardTypeHistoryList = l;

        hh_data.betHistoryList = [
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
            {time: Math.floor(Math.random()*10000000) , cardType: Math.floor(Math.random()*6) , betScore: Math.floor(Math.random()*100000) - 50000 , resultScore:Math.floor(Math.random()*100000) - 50000 , panKouList : [0,2] },
        ]*/
    },

    update (dt) {
        /*if (hh_data.countDown === 0){
            let state = (hh_data.gameState === hh_const.GAME_STATE.BET)? hh_const.GAME_STATE.REWARD : hh_const.GAME_STATE.BET;
            hh_data.changeGameState(state);
            hh_data.countDown = (hh_data.gameState === hh_const.GAME_STATE.BET)? hh_const.BET_TIME : hh_const.REWARD_TIME;
        }
        */
       
    },
});