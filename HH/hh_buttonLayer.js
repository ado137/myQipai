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
var common = require("Common");
let hh_const = require('hh_const');
let Thor = require('Thor');
let playerHead = 8 
var Constants = require('Constants');
cc.Class({
    extends: Thor,
    editor: {
        executeInEditMode: false,
    },
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var i = 0
        this.node.ChipController.ChipsArea.children.forEach(element => {
            element.getComponent('hh_chip').score = hh_const.CHIP_CONFIG[i++]
        });
    },

    start () {
        if(!CC_EDITOR){
            hh_data.gameStateNotify.addListener(this.onGameStateChange , this);
            hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
            hh_data.myGoldNotify.addListener(this.refreshUI ,this);
            hh_data.currentBankerInfoNotify.addListener(this.refreshUI ,this);
            hh_data.upBankerListNotify.addListener(this.onUpBankerListRefresh ,this);
            hh_data.playerInfoListNotify.addListener(this.onPlayerInfoListRefresh ,this);
            hh_data.lastTurnBetRecordNotify.addListener(this.refreshButtonXt , this);
        }
        //this.refreshUI()
    },
    onDestroy () {
        if(!CC_EDITOR){
            hh_data.gameStateNotify.removeListener(this.onGameStateChange ,this);
            hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
            hh_data.myGoldNotify.removeListener(this.refreshUI ,this);
            hh_data.currentBankerInfoNotify.removeListener(this.refreshUI ,this);
            hh_data.playerInfoListNotify.removeListener(this.onUpBankerListRefresh ,this);
            hh_data.upBankerListNotify.removeListener(this.onPlayerInfoListRefresh ,this);
            hh_data.lastTurnBetRecordNotify.removeListener(this.refreshButtonXt , this);
        }
    },

    
    onGameStateChange (state) {
        this.refreshUI();
    },

    onPlayerInfoListRefresh () {
        let playerMgr = this.node.$GBInterface.getPlayerMgr();
        let otherPlayerInfoList = hh_data.getOtherPlayerList();
        otherPlayerInfoList.forEach(element => {
            if(!playerMgr.alreadyHaveThisId(element.playerName, element.playerCoins)){
                this.node.$GBInterface.addOtherPlayer(element.playerName , element.playerCoins , element.portrait % playerHead || 0 , element.playerName)
            }
            else{
                playerMgr.setCoin(element.playerName , element.playerCoins)
            }
        });
        let removeList = []
        playerMgr.m_list.content.children.forEach(element => {
            let data = otherPlayerInfoList.find(elem => {
                return elem.playerName == element.name;
            });
            if(!data){
                removeList.push(element.name)
            }
        });
        removeList.forEach(element => {
            this.node.$GBInterface.removeOtherPlayer(element)
        });
        this.refreshPlayerNum()
    },

    onUpBankerListRefresh () {
        let dealerMgr = this.node.$GBInterface.getDealerMgr()
        hh_data.upBankerList.forEach(element => {
            if(!dealerMgr.alreadyHaveThisId(element.playerName, element.playerCoins)){
                this.node.$GBInterface.addDealer(element.playerName , element.playerCoins , element.portrait % playerHead || 0, element.playerName)
            }else{
                dealerMgr.setCoin(element.playerName , element.playerCoins)
            }
        });
        let removeList = []
        dealerMgr.m_list.content.children.forEach(element => {
            let data = hh_data.upBankerList.find(elem => {
                return elem.playerName == element.name;
            });
            if(!data){
                removeList.push(element.name)
            }
        });
        removeList.forEach(element => {
            this.node.$GBInterface.removeDealer(element)
        });
        this.refreshZhuangButton()
    },

    refreshChipButton () {
        let enable = hh_data.gameState === hh_const.GAME_STATE.BET && !hh_data.isMeBanker()
        this.node.ChipController.ChipsArea.children.forEach(element => {
            element.getComponent('hh_chip').setTouchEnable(enable);
            element.getComponent('hh_chip').isGray = !enable;
        });

        if (enable) {
            this.node.ChipController.ChipsArea.children.forEach(element => {
                if(element.getComponent('hh_chip').score > hh_data.myGold){
                    element.getComponent('hh_chip').setTouchEnable(false);
                    element.getComponent('hh_chip').isGray = true;
                }
            });
        }
    },

    refreshUI () {
        this.refreshChipButton();
        this.refreshButtonXt();
        this.refreshZhuangButton();
        this.refreshPlayerNum()
        this.onUpBankerListRefresh()
        this.onPlayerInfoListRefresh()
    },

    refreshZhuangButton () {
        let flag = hh_data.isMeBanker() || hh_data.checkMeInUpBankerList();
        this._buttonXz.active = hh_data.isMeBanker();
        this._buttonSz.active = (!hh_data.isMeBanker() && !hh_data.checkMeInUpBankerList());
        this._buttonLKDL.active = (!hh_data.isMeBanker() && hh_data.checkMeInUpBankerList());
    },

    refreshPlayerNum () {
        let otherPlayerInfoList = hh_data.getOtherPlayerList()
        this.node.$GBInterface.setOtherPlayersNum(otherPlayerInfoList.length)
    },

    refreshButtonXt () {
        let enable = false;
        let state = hh_data.gameState;
        do {
            if (state !== hh_const.GAME_STATE.BET){
                break;
            }
            if (!hh_data.checkHasBetLastTurn()){
                break;
            }
            if(!hh_data.checkXutouGold()){
                break;
            }
            if(hh_data.isMeBanker()){
                break;
            }
            enable = true;
        } while (false);
        this.node.ChipController.ReBetBtn.getComponent(cc.Button).interactable = enable;
    },

    _onButtonXzTouchEnd () {
        cc.log('_onButtonXzTouchEnd')
        hh_net.requestLeaveBanker()
    },

    _onButtonSzTouchEnd () {
        if (!hh_data.checkUpBankerGold()) {
            common.ShowTips(`您的金币不足${hh_data.getUpBankerGold()},上庄失败`)
            return
        }
        hh_net.requestUpBanker()
    },

    _onButtonLKDLTouchEnd () {
        cc.log('_onButtonLKDLTouchEnd')
        hh_net.requestLeaveBanker()
    },

    _onButtonHistoryTouchEnd () {
        this.node.parent.parent.getComponent('hh_mainLayer').openHistoryUI()
    },

    _onButtonPTouchEnd (sender) {
        cc.log( `你点击了${sender.$}，他的节点名字为"${sender.name}"`)
        /*if(hh_data.gameState !== hh_const.GAME_STATE.BET){
            common.ShowTips('未到下注时间,不能投注!')
            return
        }*/

        if(hh_data.isMeBanker()){
            common.ShowTips('庄家不能下注!')
            return
        }

        if(!hh_data.checkGoldEnough(hh_data.currentChooseChipScore)){
            common.ShowTips('金币不足,投注失败!')
            return
        }
        if(!hh_data.checkHasChooseChipScore()){
            common.ShowTips('请选择筹码!')
            return
        }
        let area =  parseInt(sender.$)
        hh_net.requestAddBet(area , hh_data.currentChooseChipScore)
    },

    onOutDoorTouchEnd () {
        hh_net.requestExitGame()
    },

    onRecordTouchEnd () {
        this.node.parent.parent.getComponent('hh_mainLayer').openMyRecordUI()
    },

    onChipClick (chipValue, chipNode) {
        if(hh_data.currentChooseChipScore === chipValue){
            hh_data.currentChooseChipScore === -1
        }
        else{
            hh_data.currentChooseChipScore = chipValue
        }
    },

    onXuTouClick () {
        hh_net.requestXt()
        hh_data.lastTurnBetRecord = []
        cc.log('onXuTouClick')
    },

    onSafeBoxClick () {
        cc.log('onSafeBoxClick')
    },

    /**
     * @description 停止/恢复播放背景音乐
     */
    ToggleMusic(toggle){
        if(toggle.isChecked){
            cc.audioEngine.resumeMusic();           
        }else{
            cc.audioEngine.pauseMusic();
        }
        Constants.AudioConfig.MusicToggle = toggle.isChecked;
    },

    /**
     * @description 停止/恢复播放音效
     */
    ToggleEffects(toggle){
        Constants.AudioConfig.EffectToggle = toggle.isChecked;
    }

    // update (dt) {},
});
