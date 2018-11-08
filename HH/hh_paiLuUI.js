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

let FLY_TYPE = {
    IN : 1,
    OUT: 2
}

cc.Class({
    extends: Thor,

    editor: {
        executeInEditMode: false,
        _autoShowFlag: false,
        _isShowed : false
    },


    properties: {
        _elemList : [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._elemList = [];
        for (let index = 0; index < 110; index++) {
            let elem = cc.instantiate(this._tempElem);
            elem.parent = this._panel_gezi;
            this._elemList.push(elem);
        }
        this._tempElem.active = false

        this._autoShowFlag = true
        this._isShowed = false
        this.refreshGou()
    },

    start () {
        this.node.opacity =  0;
    },

    onEnable () {
        hh_data.winHistoryListNotify.addListener(this.refreshUI , this);
        hh_data.cardTypeHistoryListNotify.addListener(this.refreshUI , this);
        hh_data.animStageNotify.addListener(this.onAnimStageChange , this);
        hh_data.gameStateNotify.addListener(this.onGameStateChange , this);
        this.refreshUI()
    },

    onDisable () {
        hh_data.winHistoryListNotify.removeListener(this.refreshUI , this);
        hh_data.cardTypeHistoryListNotify.removeListener(this.refreshUI , this);
        hh_data.animStageNotify.removeListener(this.onAnimStageChange , this);
        hh_data.gameStateNotify.removeListener(this.onGameStateChange , this);
    },

    onAnimStageChange(newAnimStage , oldAnimStage){
        if(oldAnimStage === hh_const.ANIM_STAGE.SHOW_SCORE
        && newAnimStage === hh_const.ANIM_STAGE.WAIT){
            if(this._autoShowFlag){
                this.playFly(FLY_TYPE.IN)
            }
        }
    },

    onGameStateChange(){
        this.playFly(FLY_TYPE.OUT)
    },

    refreshUI () {
        this.refreshContinueWinUI()
        this._hong_total.$Label.string ='红-'  + hh_data.getHistoryWinTimes(0)
        this._hei_total.$Label.string ='黑-'  + hh_data.getHistoryWinTimes(1)
        this._lk_total.$Label.string ='幸运一击-'  + hh_data.getHistoryWinTimes(2)
        this._junshu_total.$Label.string ='局数-'  + hh_data.winHistoryList.length
    },

    refreshContinueWinUI () {
        let winList = hh_data.getContiueWinList(hh_data.winHistoryList)
        let countGridX = 0;
        let countGridY = 0;
        let showGridList = []

        for (let i = 0; i < winList.length; i++) {
            const elem = winList[i];
            for (let index = 0; index < elem.count; index++) {
                if (countGridX >= 20) {
                    break
                }
                showGridList.push([countGridX , countGridY , elem.team])
                countGridY++;
                if (countGridY >= 5){
                    countGridX++;
                    countGridY = 0;
                }
            }
            if (countGridX >= 20) {
                break
            } 
            if(countGridY !== 0)
            {
                countGridX++;
                countGridY = 0;    
            }
        }

        this._elemList.forEach(element => {
            element.opacity = 0;
        });
        showGridList.forEach(element => {
            let indexX = element[0];
            let indexY = element[1];
            let team = element[2];
            let elem = this._elemList[indexY*20+indexX];
            elem.opacity = 255;
            elem.getComponent("MagicSprite").index = (team == hh_const.TEAM.HEI)? 0 : 1;
        }); 
    },


    _onButtonCloseTouchEnd () {
        this.playFly(FLY_TYPE.OUT)
    },

    _onAutoShowTouchEnd () {
        this._autoShowFlag = !this._autoShowFlag
        this.refreshGou()
    },

    refreshGou(){
        this._gougou.active = this._autoShowFlag 
    },


    playFly(flyType){
        if(flyType === FLY_TYPE.IN){
            if(!this._isShowed){
                this.getComponent(cc.Animation).play('pailu_fly_in')
                this._isShowed = true
            }
        }else{
            if(this._isShowed){
                this.getComponent(cc.Animation).play('pailu_fly_out')
                this._isShowed = false
            }
        }
    }

    // update (dt) {},
});
