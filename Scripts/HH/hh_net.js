/**
 * Date: 2018/8/25
 * Author: dylan_xi
 * Desc: 红黑-网络层
 * 
 */

let hh_const = require('hh_const')
let hh_data = require('hh_data')
var common = require("Common");

module.exports = {

    /**
     * @description net handlers
     */
    _handlers: {},

    /**
     * @description 注册消息
     */
    registAll : function(){
        cc.log('注册消息');
        let websocket = common.api.getWebsocket()
        for(var key in hh_const.NET_MSG){
            websocket.reg(hh_const.NET_MSG[key] , this._receiveMsg , this);
        }
        //this._handlers[hh_const.NET_MSG.ENTER_GAME] = this.onENTER_GAME;
        this._handlers[hh_const.NET_MSG.ME_BET] = this.onME_BET;
        this._handlers[hh_const.NET_MSG.OTHER_BET] = this.onOTHER_BET;
        this._handlers[hh_const.NET_MSG.ME_UP_BANKER] = this.onME_UP_BANKER;
        this._handlers[hh_const.NET_MSG.OTHER_WAIT_UP_BANKER] = this.onOTHER_WAIT_UP_BANKER;
        this._handlers[hh_const.NET_MSG.OTHER_ENTER] = this.onOTHER_ENTER;
        this._handlers[hh_const.NET_MSG.OTHER_LEAVE] = this.onOTHER_LEAVE;
        this._handlers[hh_const.NET_MSG.ME_LEAVE_GAME] = this.onME_LEAVE_GAME;
        this._handlers[hh_const.NET_MSG.ME_LEAVE_BANKER] = this.onME_LEAVE_BANKER;
        this._handlers[hh_const.NET_MSG.ME_KICK_OUT] = this.onME_KICK_OUT;
        this._handlers[hh_const.NET_MSG.BET_STATE] = this.onBET_STATE;
        this._handlers[hh_const.NET_MSG.REWARD_STATE] = this.onREWARD_STATE;
        this._handlers[hh_const.NET_MSG.OTHER_LEAVE_BANKER] = this.onOTHER_LEAVE_BANKER;
        this._handlers[hh_const.NET_MSG.ROOMLIST_REWARD] = this.onROOMLIST_REWARD;
        this._handlers[hh_const.NET_MSG.ROOMLIST_INFO] = this.onROOMLIST_INFO;

    },

    unRegAll () {
        let websocket = common.api.getWebsocket()
        for(var key in hh_const.NET_MSG){
            websocket.unreg(hh_const.NET_MSG[key]);
        }
        this._handlers = {}
    },

    _receiveMsg (serverData) {
        let hh_const = require('hh_const')
        console.log('================' + hh_const.NET_MSG_LOG[serverData.msgType]  + '================')
        if(parseInt(serverData.status)){
            let msgData = serverData.msg
            this._handlers[serverData.msgType].call(this ,msgData)
        }else{
            if(serverData.msg){
                common.ShowTips(serverData.msg.detailmsg || serverData.msg)
            }else{
                common.ShowTips('服务器返回消息msg字段为null,请服务器排查')
            }
        }
    },

    _sendMsg (msgType , data) {
        let websocket = common.api.getWebsocket()
        var packData = {
            msgType : msgType,
            token : window.common.token
        };
        Object.assign(packData, data);
        websocket.sendMsg(packData);
    },

    /**
    * 请求下注
    * @method requestAddBet
    * @param {下注区域} area
    * @param {下注数量} betScore
    */
    requestAddBet (area , betScore) {
        let betList = [0 , 0, 0]
        betList[area] = betScore
        this._sendMsg(hh_const.NET_MSG.ME_BET , {
            betTarget: betList,
            betType: 0,
        })
    },

    /**
    * 请求续投
    * @method requestXt
    */
   requestXt () {
        let betList = [0 , 0, 0]
        hh_data.lastTurnBetRecord.forEach(element => {
            betList[element.area] += element.score
        });
        this._sendMsg(hh_const.NET_MSG.ME_BET , {
            betTarget: betList,
            betType: 1,
        })
    },

    /**
    * 请求进入游戏
    * @method requestEnterGame
    */
    requestEnterGame (roomId) {
        this._sendMsg('7001' , {roomId : roomId});
    },

    /**
    * 请求上庄
    * @method requestUpBanker
    */
    requestUpBanker () {
        this._sendMsg(hh_const.NET_MSG.ME_UP_BANKER , {});
    },

    /**
    * 请求离开游戏
    * @method requestExitGame
    */
    requestExitGame () {
        this._sendMsg(hh_const.NET_MSG.ME_LEAVE_GAME , {});
    },

    /**
    * "自己提前下庄,或者离开上庄列表"
    * @method requestLeaveBanker
    */
    requestLeaveBanker () {
        this._sendMsg(hh_const.NET_MSG.ME_LEAVE_BANKER , {});
    },

    onENTER_GAME (msgData) {
        hh_data.playerInfoList = msgData.players;
        hh_data.playerInfoList.map(x=>x.playerCoins = Number(x.playerCoins))
        hh_data.myGold = Number(msgData.selfCoins);
        hh_data.upBankerList = msgData.masterQueue || []
        hh_data.upBankerList.map(x=>x.playerCoins = Number(x.playerCoins))
        msgData.currentMaster.playerCoins = Number(msgData.currentMaster.playerCoins)
        hh_data.currentBankerInfo = msgData.currentMaster
        hh_data.startCountDown(msgData.period.timeLeft / 1000)
        hh_data.gameState = msgData.period.status === 0 ? hh_const.GAME_STATE.REWARD : hh_const.GAME_STATE.BET
        hh_data.animStage = hh_data.gameState === hh_const.GAME_STATE.REWARD ? hh_const.ANIM_STAGE.WAIT :hh_const.ANIM_STAGE.NONE
        hh_data.allBetAmountList = msgData.totalBetAmount.map(Number)
        hh_data.myBetAmountList = msgData.myBetAmount.map(Number)
        hh_const.REWARD_TIME = Number(msgData.timeConfig[0])
        hh_const.BET_TIME = Number(msgData.timeConfig[1])
        hh_data.minCoionsMaster = msgData.minCoionsMaster
        hh_data.myName = msgData.playerName
        hh_data.winHistoryList = []
        hh_data.cardTypeHistoryList = []
        if(msgData.lastHistoryRoom){
            msgData.lastHistoryRoom.forEach(element => {
                hh_data.winHistoryList.push(Number(element.winner))
                hh_data.cardTypeHistoryList.push(hh_data.convertCardType(Number(element.cardType)))
            });
        }
        if(msgData.persnonalHisotry){
            msgData.persnonalHisotry.forEach(element => {
                element.result.forEach(elem => {
                    elem.bet = Number(elem.bet)
                    elem.result = Number(elem.result)
                });
                element.cardType = hh_data.convertCardType(Number(element.cardtype))
            });
            hh_data.betHistoryList = msgData.persnonalHisotry
        }
        hh_data.isObserve = msgData.isObserve || {canPlay:false,minMonet:0}
        hh_data.updateShowPlayerChairList()
        
        hh_data.initDataFlag = true
    },

    _addBetScore (betList , isMe , betType , playerName) {
        for (let index = 0; index < hh_const.BET_SLOT; index++) {
            if(betList[index] != 0 ){
                let betTempList = hh_data.parseScore(betList[index])
                betTempList.forEach(element => {
                    hh_data.addBetChip(index , element,  isMe , betType , playerName)    
                });
            }
        }
    },
    
    onME_BET (msgData) {
        let betList = msgData.betAmount.map(Number);
        this._addBetScore(betList , true , msgData.betType , msgData.playerName);
        hh_data.tryAddGoldInShowPlayerChairList(msgData.playerName , -parseInt(msgData.betAmount))
    },

    onOTHER_BET (msgData) {
        if(hh_data.getMyName() !== msgData.playerName){
            let betList = msgData.betAmount.map(Number);
            this._addBetScore(betList , false,1 , msgData.playerName);
            hh_data.tryAddGoldInShowPlayerChairList(msgData.playerName , -parseInt(msgData.betAmount))
        }
    },

    onME_UP_BANKER (msgData) {
        common.ShowTips ("申请上庄成功!")
        hh_data.upBankerList.push({playerName: hh_data.getMyName() , playerCoins:hh_data.myGold})
    },

    onOTHER_WAIT_UP_BANKER (msgData) {
        if(hh_data.getMyName() !== msgData.playerName){
            hh_data.upBankerList.push(msgData)
        }
    },

    onOTHER_ENTER(msgData) {
        if(hh_data.getMyName() !== msgData.playerName){
            hh_data.playerInfoList.push(msgData)
        }
    },

    onOTHER_LEAVE(msgData) {
        if(hh_data.getMyName() !== msgData.playerName){
            hh_data.leavePlayerList(msgData.playerName)
        }
    },

    onME_LEAVE_GAME() {
        hh_data.exitGameStatus = true
    },

    onME_LEAVE_BANKER() {
        if(hh_data.isMeBanker()){
            common.ShowTips('操作成功,结算后生效!')    
        }else{
            common.ShowTips('离开上庄队列成功!')    
            hh_data.leaveUpRankerList(hh_data.getMyName())
        }
    },

    onME_KICK_OUT(data) {
        common.ShowTips(data)
    },

    onBET_STATE(msgData) {
        msgData.hostUpdate.playerCoins = Number(msgData.hostUpdate.playerCoins)
        hh_data.currentBankerInfo = msgData.hostUpdate
        hh_data.myGold = Number(msgData.playerCoins)
        hh_data.animStage = hh_const.ANIM_STAGE.NONE
        hh_data.upBankerList = msgData.masterQueue || []
        hh_data.upBankerList.map(x=>x.playerCoins = Number(x.playerCoins))
        hh_data.updateShowPlayerChairList()
        hh_data.changeGameState(hh_const.GAME_STATE.BET)
    },

    onREWARD_STATE (msgData) {
        hh_data.refreshCardResult(msgData.cardInfor)
        let playerInfoList = msgData.settleResult.playerInfos || []
        playerInfoList.map(x=>x.playerCoins = Number(x.playerCoins))
        hh_data.playerInfoList = playerInfoList
        msgData.settleResult.masterInfo.playerCoins = Number(msgData.settleResult.masterInfo.playerCoins)
        hh_data.bankerTempInfo =  msgData.settleResult.masterInfo
        if(!hh_data.isMeBanker()){
            let myInfo = hh_data.getInfoByName(playerInfoList , hh_data.getMyName())
            if (myInfo) {
                hh_data.myTempGold = Number(myInfo.playerCoins);
            }
            else{
                this.serverErrorInfo('在玩家列表中找不到自己')
            }
        }
        else{
            hh_data.myTempGold = Number(msgData.settleResult.masterInfo.playerCoins)
        }
        hh_data.changeGameState(hh_const.GAME_STATE.REWARD)
    },

    onOTHER_LEAVE_BANKER(msgData) {
        if(hh_data.currentBankerInfo.playerName !== msgData.playerName){
            hh_data.leaveUpRankerList(msgData.playerName);
        }
    },

    onROOMLIST_GET(msgData) {
        msgData.forEach(element=>{
            element.roomId = element.id
            hh_data.updateRoomListAllData = element
        })
    },

    onROOMLIST_REWARD(msgData) {
        hh_data.updateRoomRewardLIstData = msgData
    },

    onROOMLIST_INFO(msgData) {
        hh_data.updateRoomListStatus = msgData
    },

    serverErrorInfo (str) {
        str =  "服务器错误:" + str 
        common.ShowTips(str)
        console.log(str)
    }
}

