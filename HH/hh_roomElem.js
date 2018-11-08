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
let hh_const = require('hh_const');
let Thor = require('Thor');
cc.Class({
    extends: Thor,
    editor: {
        executeInEditMode: false,
    },
    properties: {
        roomId : '',
        panelPx : cc.Node,
        elemPx : cc.Prefab,
        elemPxNum : 0,
        _elemPxList : [],
        _elemPlList : [],

        _roomData : null,

        _refreshTime: 1,
        _tick : 0,

        tempElem: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._elemPxList = []
        if(this.panelPx){
            for (let index = 0; index < this.elemPxNum; index++) {
                let elemPx = cc.instantiate(this.elemPx);
                elemPx.parent = this.panelPx;
                this._elemPxList.push(elemPx)
            }
        }

        this._elemPlList = [];
        for (let index = 0; index < 110; index++) {
            let elem = cc.instantiate(this.tempElem);
            elem.parent = this._panel_gezi;
            this._elemPlList.push(elem);
        }
        this.tempElem.active = false

    },

    start () {
        if(!CC_EDITOR){
            hh_data.updateRoomRewardLIstDataNotify.addListener(this.onRoomRewardDataRefresh , this);
            hh_data.updateRoomListStatusNotify.addListener(this.onRoomStatusRefresh ,this);
        }
        //this.refreshUI()
    },
    onDestroy () {
        if(!CC_EDITOR){
            hh_data.updateRoomRewardLIstDataNotify.removeListener(this.onRoomRewardDataRefresh , this);
            hh_data.updateRoomListStatusNotify.removeListener(this.onRoomStatusRefresh ,this);
        }
    },

    update (dt){
        if(this._roomData){
            this._roomData.status.timeLeft -= dt*1000
            if(this._roomData.status.timeLeft < 0) this._roomData.status.timeLeft = 0
        }

        this._tick += dt
        if(this._tick > this._refreshTime){
            this._tick = 0
            if(this._roomData){
                this.refreshBaseInfoUI(this._roomData)
            }
        }
    },

    delayRefreshAllData(data){
        if(data.roomId == this.roomId){
            var self = this
            this.scheduleOnce(function(){
                self._roomData = data 
                self.refreshBaseInfoUI(self._roomData)
                self.refreshHistoryUI(self._roomData)
            }, 0.1)
        }
    },

    onRoomRewardDataRefresh(data){
        if(data.roomId == this.roomId){
            if(this._roomData){
                this._roomData.history.push({winner: data.winner , cardType : data.cardType})
                this.refreshHistoryUI(this._roomData)
            }
        }
    },

    onRoomStatusRefresh(data){
        if(data.roomId == this.roomId){
            if(this._roomData){
                this._roomData.persons = data.persons
                this._roomData.status = data.status
                this.refreshBaseInfoUI(this._roomData)
            }
        }
    },

    refreshPxUI(cardTypeHistoryList){
        if(this.panelPx){
            for (let index = 0; index < this.elemPxNum; index++) {
                let elemPx = this._elemPxList[index];
                elemPx.active = cardTypeHistoryList[index] != undefined
                elemPx.getComponent("MagicSprite").index =  cardTypeHistoryList[index];
            }
        }
    },

    refreshContinueWinUI (contiueWinList) {
        let winList = contiueWinList
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

        this._elemPlList.forEach(element => {
            element.opacity = 0;
        });
        showGridList.forEach(element => {
            let indexX = element[0];
            let indexY = element[1];
            let team = element[2];
            let elem = this._elemPlList[indexY*20+indexX];
            elem.opacity = 255;
            elem.getComponent("MagicSprite").index = (team == hh_const.TEAM.HEI)? 0 : 1;
        }); 
    },

    _onBtnEnterGameTouchEnd(){
        hh_net.requestEnterGame(this.roomId)
    },

    refreshBaseInfoUI(data){
        this.node.getChildByName('_roomName').getComponent(cc.Label).string = data.name
        this.node.getChildByName('_szzt').getComponent(cc.Label).string = '可上庄'
        this.node.getChildByName('_zdzm').getComponent(cc.Label).string = '最低注码    ' + data.minbet
        this.node.getChildByName('_renshu').getComponent(cc.Label).string = data.persons + '人'
        this.node.getChildByName('_yxzt').getComponent(cc.Label).string = (data.status.status == 0?  '开奖中： ' : '下注中： ') + Math.floor(data.status.timeLeft/1000) + '秒'
    },

    refreshHistoryUI(data){
        let cardTypeHistoryList = []
        let winHistoryList = []
        data.history.forEach(element=>{
            cardTypeHistoryList.push(parseInt(element.cardType < 2? 0 : element.cardType -1))
            winHistoryList.push(parseInt(element.winner)) 
        })

        let contiueWinList = hh_data.getContiueWinList(winHistoryList)
        this.refreshPxUI(cardTypeHistoryList)
        this.refreshContinueWinUI(contiueWinList)
    },

    // update (dt) {},
});
