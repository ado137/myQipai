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
        templateItem : cc.Node,
        itemContent : cc.Node,

        _itemList : []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for (let index = 0; index < 20; index++) {
            let elem =  cc.instantiate(this.templateItem);
            elem.parent = this.itemContent
            this._itemList.push(elem)
        }

        this.templateItem.active = false
    },

    start () {
        this.node.active =  false;
    },

    onEnable () {
        hh_data.betHistoryListNotify.addListener(this.refreshUI , this);
        this.refreshUI()
    },

    onDisable () {
        hh_data.betHistoryListNotify.removeListener(this.refreshUI , this);
    },

    refreshUI () {
        this._itemList.forEach(element => {
            element.active = false;
        });

        for (let index = 0; index < 20; index++) {
            let data = hh_data.betHistoryList[index]
            if(!data) {
                break
            }
            let elem =  this._itemList[index]
            elem.active = true
            let date = new Date(data.time); 
            let timeStr = `${date.getFullYear()}/${date.getMonth()-1}/${date.getDate()}\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            let cardTypeStr = hh_const.CARD_TYPE_STR[data.cardType]

            let resultScore = 0
            let betScore = 0
            resultScore = data.result.reduce((x , elem)=> x+ elem.result, resultScore)
            betScore = data.result.reduce((x , elem)=> x+ elem.bet, betScore)
            let resultStr = (resultScore > 0 ? "胜" : '负') + '/' + cardTypeStr
            elem.active = true
            let pankouStr = "";
            for (let i = 0; i < hh_const.BET_SLOT; i++) {
                pankouStr +=  data.result[i].bet > 0? hh_const.PAN_KOU_STR[i] +'/': ""
            }
            pankouStr = pankouStr.substring(0,pankouStr.length-1)
            elem.getChildByName("labelTime").getComponent(cc.Label).string = timeStr
            elem.getChildByName("labelPankou").getComponent(cc.Label).string = pankouStr
            elem.getChildByName("labelBetScore").getComponent(cc.Label).string = betScore
            elem.getChildByName("labelResult").getComponent(cc.Label).string = resultStr
            elem.getChildByName("labelResultScore").getComponent(cc.Label).string = (resultScore > 0 ? "+" : "") +  resultScore
        }
    },

    _onButtonCloseTouchEnd () {
        this.getComponent('DialogBox').Hide()
    },
    // update (dt) {},
});
