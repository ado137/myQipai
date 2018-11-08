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
let Thor = require('Thor');
let hh_const = require('hh_const');
cc.Class({
    extends: Thor,

    properties: {
        playerName:{
            default:"",
            notify: function(oldValue){
                this._labelName.$Label.string = this.playerName
            }
        },

        playerMoney:{
            default:0,
            notify: function(oldValue){
                this._labelGold.$Label.string = this.playerMoney
            }
        },

        bankerName:{
            default:"",
            notify: function(oldValue){
                this._labelBankerName.$Label.string = this.bankerName
            }
        },

        bankerMoney:{
            default:0,
            notify: function(oldValue){
                this._labelBankerGold.$Label.string = this.bankerMoney
            }
        },

        UpBankerNumber:{
            default:0,
            notify: function(oldValue){
                this._labelUpNumber.$Label.string = '(' + this.UpBankerNumber + '人)'
            }
        }
        ,

        isSystemBanker:{
            default:false,
            notify: function(oldValue){
                if(this.isSystemBanker){
                    this.bankerMoney = ''
                    this.bankerName = '系统上庄中'
                }
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {


    },

    start () {
        hh_data.myGoldNotify.addListener(this.refreshUI ,this);
        hh_data.currentBankerInfoNotify.addListener(this.refreshUI ,this);
        hh_data.upBankerListNotify.addListener(this.refreshUI ,this);
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        hh_data.animStageNotify.addListener(this.onAnimStageChange , this);
        hh_data.gameStateNotify.addListener(this.onGameState , this);
        //this.refreshUI()
    },

    refreshUI () {
        this.unscheduleAllCallbacks()
        this.playerMoney =  hh_data.formatGold(hh_data.myGold.toFixed(2))
        let name = hh_data.currentBankerInfo.playerName
        let bankerMoney = hh_data.formatGold(Number(hh_data.currentBankerInfo.playerCoins))
        if(hh_data.isSystemBanker()){
            name = '系统坐庄'
            bankerMoney = ''
        }

        this.isSystemBanker = hh_data.isSystemBanker()
        this.bankerName = name
        this.bankerMoney = bankerMoney
        this.UpBankerNumber = hh_data.upBankerList.length
        this.playerName = hh_data.getMyName()

        this._labelMyWin.opacity = 0
        this._labelMyLose.opacity = 0
        this._labelBankerWin.opacity = 0
        this._labelBankerLose.opacity = 0
        this._labelOtherWin.opacity = 0
        this._labelOtherLose.opacity = 0
    },

    onDestroy () {
        hh_data.myGoldNotify.removeListener(this.refreshUI ,this);
        hh_data.currentBankerInfoNotify.removeListener(this.refreshUI ,this);
        hh_data.upBankerListNotify.removeListener(this.refreshUI ,this);
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
        hh_data.animStageNotify.removeListener(this.onAnimStageChange , this);
        hh_data.gameStateNotify.removeListener(this.onGameState , this);
    },

    onAnimStageChange (stage) {
        if (stage === hh_const.ANIM_STAGE.SHOW_SCORE) {
            hh_data.refreshGoldInfo()
            this.getPlayResultUIList().forEach(element => {
                element.$Animation.play('goldDrop')
            });
            this.scheduleOnce(() =>{
                hh_data.animStage = hh_const.ANIM_STAGE.WAIT
            } , 2);
        }
    },

    onGameState (){
        this.refreshUI () 
    },

    getPlayResultUIList () {
        let myResultGold = hh_data.formatGold(hh_data.getMyResultGold());
        let otherResultGold = hh_data.formatGold(hh_data.getOtherResultGold());
        let bankerResultGold = hh_data.formatGold(hh_data.getBankerResultGold());
        let resultList = []
        let myGoldLable = myResultGold >= 0? this._labelMyWin : this._labelMyLose
        let otherGoldLable = otherResultGold >= 0? this._labelOtherWin : this._labelOtherLose
        let bankerGoldLabel = bankerResultGold >= 0? this._labelBankerWin : this._labelBankerLose
        myGoldLable.$Label.string = myResultGold > 0 ? "+" + myResultGold : myResultGold
        otherGoldLable.$Label.string = otherResultGold > 0 ? "+" + otherResultGold : otherResultGold
        bankerGoldLabel.$Label.string = bankerResultGold > 0 ? "+" + bankerResultGold : bankerResultGold

        if(myResultGold != 0){
            resultList.push(myGoldLable)
        }
        if(otherResultGold != 0){
            resultList.push(otherGoldLable)
        }
        if(bankerResultGold != 0){
            resultList.push(bankerGoldLabel)
        }
        return resultList
    },
    // update (dt) {},
});
