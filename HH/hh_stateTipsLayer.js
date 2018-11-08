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
var common = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start () {
        this._isTrigger = false
        hh_data.gameStateNotify.addListener(this.onGameStateChange , this);
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        hh_data.animStageNotify.addListener(this.refreshUI , this)
        hh_data.countDown3SecondNotify.addListener(this.onCountDown3Second , this)
        hh_data.currentBankerInfoNotify.addListener(this.onCurrentBankerInfo ,this);
        hh_data.isObserveNotify.addListener(this.onIsObserve,this)
        this.effectComp = this.node.children[0].getComponent('GameEffectController')
        //this.refreshUI()
    },
    onDestroy () {
        hh_data.gameStateNotify.removeListener(this.onGameStateChange ,this);
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
        hh_data.animStageNotify.removeListener(this.refreshUI , this);
        hh_data.countDown3SecondNotify.removeListener(this.onCountDown3Second , this)
        hh_data.currentBankerInfoNotify.removeListener(this.onCurrentBankerInfo ,this);
        hh_data.isObserveNotify.removeListener(this.onIsObserve,this)
    },

    onIsObserve(_msg){
        this.effectComp.playWatchingGame(_msg.canPlay,_msg.minMoney)
    },

    onGameStateChange (state , oldState) {
        if (state === hh_const.GAME_STATE.REWARD && oldState != hh_const.GAME_STATE.NONE) {
            this.playStopBetAnim();
            if (!hh_data.checkHasBet() && !hh_data.isMeBanker()) {
                common.ShowTips('本局您没有下注!') 
            }
        }
        else if (state === hh_const.GAME_STATE.BET&& oldState != hh_const.GAME_STATE.NONE) {
            this.playStartBetAnim();
            this.scheduleOnce(()=>{
                if(hh_data.getBankerTimes() > 1){
                    this.playContinueDealText(hh_data.getBankerTimes())
                }
            } , 2)
            this._isTrigger = false
        }
    },

    refreshUI () {
        this.playWaitingForNextGameEffect(hh_data.animStage === hh_const.ANIM_STAGE.WAIT)
        this.resetAllTipsUI()
    },

    playCountDonwAnim () {
        this.resetAllTipsUI()
        this.effectComp.playCountDownEffect()
        cc.log('playCountDonwAnim')
    },

    playStopBetAnim () {
        this.resetAllTipsUI()
        this.effectComp.playEndChipInEffect()
        cc.log('playStopBetAnim')
    },

    playStartBetAnim () {
        this.resetAllTipsUI()
        this.effectComp.playStartChipInEffect()
        cc.log('playStartBetAnim')
    },

    playWaitingForNextGameEffect(active) {
        this.effectComp.playWaitingForNextGameEffect(active)
    },

    playContinueDealText (num) {
        this.resetAllTipsUI()
        if(!hh_data.isSystemBanker()){
            this.effectComp.showContinueDealText(true ,num ,1)
        }
    },

    resetAllTipsUI () {
        this.effectComp.showContinueDealText()
    },

    onCurrentBankerInfo (currentInfo , oldInfo) {
        if(currentInfo.playerName !=  oldInfo.playerName && oldInfo.playerName != ''){
            this.effectComp.showChangeDealerText(true , 1)
        }
    },

    onCountDown3Second () {
        this.playCountDonwAnim()
    },
});
