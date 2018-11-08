/**
 * Date: 2018/8/15
 * Author: dylan_xi
 * Desc: 红黑-数据层
 * 
 */

let DataNotify = require('DataNotify')
let hh_const = require('hh_const')
module.exports = {

    /**
     * @description 当前下注
     */
    currentBetInfo: null,
    
    /**
     * @description 当前庄家信息
     */
    currentBankerInfo: null,
    
    /**
     * @description 所有玩家下注列表
     */
    allBetAmountList: null,
    
    /**
     * @description 我的下注列表
     */
    myBetAmountList: null,

    /**
     *  @description 我的金币
     */
    myGold: null,
    /**
     *  @description 我的名字
     */
    myName:'',

    /**
     *  @description 我的临时金币
     */
    myTempGold: null,

    /**
     *  @description 庄家临时信息
     */
    bankerTempInfo: null,

    /**
     *  @description 扑克牌结果
     */
    cardResult: null,

    /**
     *  @description 庄家开奖结果
     */
    bankOpenResult: null,

    /**
     *  @description 游戏状态
     */
    gameState: null,

    /**
     *  @description 游戏倒计时
     */
    countDown: null,

    /**
     *  @description 上庄列表
     */
    upBankerList: null,

    /**
     *  @descriptio 输赢历史
     */
    winHistoryList: null,

    /**
     *  @descriptio 牌型历史
     */
    cardTypeHistoryList: null,

    /**
     *  @descriptio 下注记录
     */
    betHistoryList: null,
    
    /**
     *  @descriptio 当前选择的筹码分数
     */
    currentChooseChipScore: 1,

    /**
     *  @descriptio 上局投注记录
     */
    lastTurnBetRecord: null,

    /**
     *  @descriptio 当局投注记录
     */
    currentTurnBetRecord: null,

    /**
     * 初始化数据
     */
    initDataFlag : false,

    /**
     * 动画阶段
     */
    animStage : null,

    /**
     * 游戏玩家信息
     */
    playerInfoList : null,

    /**
     * 最小上庄条件
     */
    minCoionsMaster: null,
    /**
     * 离开房间状态
     */
    exitGameStatus : false,

    /**
     * 倒计时三秒状态
     */
    countDown3Second : false,

    /**
     * 派发筹码flag
     */
    dispatchChipFlag : false,

    /**
     * 发牌flag
     */
    dealCardFlag : false,

    /**
     * 筹码池
     */
    chipPool : null,
    
    /**
     * @description 是否显示
     */
    isObserve:null,

    /**
     * @description 显示席位的玩家列表
     */
    showPlayerChairList:[],

    /**
     * @description 更新房间列表所有数据
     */
    updateRoomListAllData : null,

    /**
     * @description 更新房间列表开奖数据
     */
    updateRoomRewardLIstData : null,
    /**
     * @description 更新房间列表状态信息
     */
    updateRoomListStatus : null,

    init: function(){
        this.initData()
    
        this.animStageNotify.addListener(this.onAnimStageChange , this)
    },

    initData: function(){
        this.currentBetInfoNotify = DataNotify.create(this , "currentBetInfo",  {score : 0,area : 0,isMe: false,playerName : ''})
        this.currentBankerInfoNotify = DataNotify.create(this , "currentBankerInfo" , {playerName : '' , playerCoins : 1000})
        this.allBetAmountListNotify = DataNotify.create(this , "allBetAmountList" , [0 , 0, 0])
        this.myBetAmountListNotify = DataNotify.create(this , "myBetAmountList" , [0 , 0, 0])
        this.myGoldNotify = DataNotify.create(this , "myGold" , 500)
        this.gameStateNotify = DataNotify.create(this , "gameState" , hh_const.GAME_STATE.NONE)
        this.countDownNotify = DataNotify.create(this , "countDown" , 0)
        this.upBankerListNotify = DataNotify.create(this , "upBankerList" , [])
        this.winHistoryListNotify = DataNotify.create(this , "winHistoryList" , [])
        this.cardTypeHistoryListNotify = DataNotify.create(this , "cardTypeHistoryList" , [])
        this.betHistoryListNotify = DataNotify.create(this , "betHistoryList" , [])
        this.currentChooseChipScoreNotify = DataNotify.create(this , "currentChooseChipScore" , -1)
        this.lastTurnBetRecordNotify = DataNotify.create(this , "lastTurnBetRecord" , [])
        this.currentTurnBetRecordNotify = DataNotify.create(this , "currentTurnBetRecord" , [])
        this.initDataFlagNotify = DataNotify.create(this , "initDataFlag" , false)
        this.animStageNotify = DataNotify.create(this , "animStage" , hh_const.ANIM_STAGE.NONE)
        this.playerInfoListNotify = DataNotify.create(this , "playerInfoList" , [])
        this.exitGameStatusNotify = DataNotify.create(this , "exitGameStatus" , false)
        this.countDown3SecondNotify = DataNotify.create(this , "countDown3Second" , false)
        this.dispatchChipFlagNotify = DataNotify.create(this , "dispatchChipFlag" , false)
        this.dealCardFlagNotify = DataNotify.create(this , "dealCardFlag" , false)
        this.isObserveNotify = DataNotify.create(this,'isObserve' , false)
        this.showPlayerChairListNotify = DataNotify.create(this,'showPlayerChairList' , [])
        this.updateRoomListAllDataNotify = DataNotify.create(this,'updateRoomListAllData' , {})
        this.updateRoomRewardLIstDataNotify = DataNotify.create(this,'updateRoomRewardLIstData' , {})
        this.updateRoomListStatusNotify = DataNotify.create(this,'updateRoomListStatus' , {})
    },

    destroy () {
        this.animStageNotify.removeListener(this.onAnimStageChange , this)
        this.initData()     
        window.clearInterval(this.intervalId)
    },

    initFromServer(serverData){

    },

    addBetChip (area ,betScore , isMe , betType , playerName) {
        this.currentBetInfo = {
            score : betScore,
            area : area,
            isMe: isMe,
            playerName : playerName
        }
        if(isMe){
            let myBetAmountList = this.myBetAmountList
            myBetAmountList[area] = parseInt(myBetAmountList[area]) + parseInt(betScore)
            this.myBetAmountList = myBetAmountList
            if(betType != 1){
                this.currentTurnBetRecord.push(this.currentBetInfo)
            }
            this.myGold -= betScore
        }
        let allBetAmountList = this.allBetAmountList
        allBetAmountList[area] = parseInt(allBetAmountList[area]) + parseInt(betScore)
        this.allBetAmountList = allBetAmountList
    },

    getWinCardType() {
        let winSide = this.getWinSide();
        return this.cardResult[winSide].cardType
    },

    getRewardAreas() {
        if (!this.cardResult) {
            return [0]            
        }
        let winSide = this.getWinSide();
        let result = this.getWinCardType()> hh_const.CARD_TYPE.DUI_ZI? [winSide , 2]: [winSide]
        return result
    },

    getWinSide () {
        return this.cardResult[0].whetherWin == 1 ? 0 : 1;
    },

    getNotRewardAreas(){
        return [0,1,2].filter(x=>this.getRewardAreas().indexOf(x) === -1);
    },

    isMeBanker () {
        return this.getMyName() == this.currentBankerInfo.playerName
    },

    changeGameState (state) {
        this.gameState = state;
        this.countDown = (this.gameState === hh_const.GAME_STATE.BET)? hh_const.BET_TIME : hh_const.REWARD_TIME;
        if (state === hh_const.GAME_STATE.BET){
            this.clearBet();
            this.animStage = hh_const.ANIM_STAGE.NONE
        }
        else {
            this.lastTurnBetRecord = this.currentTurnBetRecord
            this.currentTurnBetRecord = []
            this.animStage = hh_const.ANIM_STAGE.DEAL_CARD
        }
    },

    refreshCardResult (cardResult) {
        this.cardResult = cardResult
        this.cardResult.forEach(element => {
            element.cardType = this.convertCardType(element.cardType)
        });
    },

    onAnimStageChange () {
        if (this.animStage === hh_const.ANIM_STAGE.CHIP_ANIM ){
            this.refreshHistory()
        }
    },

    refreshHistory () {
        let winner = this.getWinSide()
        this.winHistoryList.splice(0 , 0, winner)
        this.cardTypeHistoryList.splice(0 , 0, this.cardResult[winner].cardType)
        let myBetResult = {}
        myBetResult.time = Date.parse(new Date());
        myBetResult.result = []
        myBetResult.cardType = this.cardResult[winner].cardType
        let myInfo = this.getInfoByName(this.playerInfoList , this.getMyName())
        let flag = 0
        if (myInfo &&　myInfo.betInfo &&　myInfo.benefit){
            for (let index = 0; index < hh_const.BET_SLOT; index++) {
                flag += this.myBetAmountList[index]
                myBetResult.result.push({bet:this.myBetAmountList[index] , result : myInfo.betInfo[index] , benefit : Number(myInfo.benefit)})
            }
            if(flag !== 0 ){
                this.betHistoryList.splice(0 , 0, myBetResult)
            }
        }
    },

    clearBet(){
        this.allBetAmountList = [0,0,0];
        this.myBetAmountList = [0,0,0];
    },

    getWinPercent (team) {
        let num = 0;
        for (let index = 0; index < 20; index++) {
            num += (this.winHistoryList[index] === 0)? 1 : 0;
        }
        return  team == hh_const.TEAM.HEI? num / 20 : 1 - num / 20;
    },

    getContiueWinList (winHistoryList) {
        let result = []
        let team = winHistoryList[0]
        result.push({count:0 , team: team})
        winHistoryList.forEach(element => {
            if(element === team){
                result[result.length-1].count += 1
            }else{
                team = element
                result.push({count:1 , team: team})
            }
        });
        return result;
    },

    getHistoryWinTimes(area) {
        let count = 0
        if(area < 2){
            this.winHistoryList.forEach(element => {
                if(element === area){
                    count += 1
                }
            });
        }

        if(area === 2){
            this.cardTypeHistoryList.forEach(element => {
                if(element > 0){
                    count += 1
                }
            });
        }

        return count
    },

    checkGoldEnough (gold) {
        return  this.myGold >= gold
    },

    checkHasBetCurrentTurn () {
        return this.currentTurnBetRecord.length !== 0;
    },

    checkHasBetLastTurn () {
        return this.lastTurnBetRecord.length !== 0;
    },

    checkXutouGold() {
        let gold = 0;
        gold = this.lastTurnBetRecord.reduce(function (gold , element){
            gold += element.score;
            return gold;
        } , gold);
        return this.myGold >= gold;
    },

    checkMeInUpBankerList () {
        let flag = false
        this.upBankerList.forEach(element => {
            if(element.playerName === this.getMyName()){
                flag = true;                
            }
        });
        return flag
    },

    getMyName () {
        return this.myName;
    },

    checkHasChooseChipScore() {
        return this.currentChooseChipScore > 0
    },

    getInfoByName (playerInfoList , name) {
        return playerInfoList.find(element => {
            return element.playerName === name;
        });
    },

    getBankerName () {
        return this.currentBankerInfo
    },

    convertCardType (cardType) {
        let viewCardType = cardType - 1
        if(viewCardType < 0) viewCardType = 0;
        return viewCardType
    },

    getUpBankerGold () {
        return this.minCoionsMaster
    },

    checkUpBankerGold () {
        return this.myGold >= this.getUpBankerGold()
    },

    getBankerTimes () {
        return this.currentBankerInfo.hostedTimes + 1
    },

    leaveUpRankerList (playerName){
        let foundIndex = this.upBankerList.findIndex(x => x.playerName === playerName)
        if (foundIndex !== -1) {
            this.upBankerList.splice(foundIndex,1)
        }
    },

    leavePlayerList (playerName){
        let foundIndex = this.playerInfoList.findIndex(x => x.playerName === playerName)
        if (foundIndex !== -1) {
            this.playerInfoList.splice(foundIndex,1)
        }
        this.leaveUpRankerList(playerName)
    },

    parseScore (betScore) {
        let betList = []
        let leftScore = betScore

        for (let index = hh_const.CHIP_CONFIG.length - 1; index >= 0; index--) {
            if(leftScore < 0){
                break
            }
            let betTempScore = hh_const.CHIP_CONFIG[index];
            let tempTimes = Math.floor(leftScore/betTempScore)
            leftScore = leftScore % betTempScore
            for (let times = 0; times < tempTimes; times++) {
                betList.push(betTempScore)                
            }
        }
        return betList
    },

    getBankerResultGold () {
        return Number(this.currentBankerInfo.benefit) || 0
    },

    getMyResultGold () {
        let resultGold = 0
        if(!this.isMeBanker()){
            let myInfo = this.getInfoByName(this.playerInfoList , this.getMyName())
            if (myInfo) {
                resultGold = Number(myInfo.benefit) || 0 
            }
        }
        else{
            resultGold = this.getBankerResultGold();
        }
        return resultGold
    },

    getOtherResultGold () {
        let result = 0
        let otherPlayerList = this.getOtherPlayerList().filter(x=>x.playerName != this.currentBankerInfo.playerName)

        otherPlayerList.forEach(element => {
            result += Number(element.benefit) || 0
        });

        return result
    },

    refreshGoldInfo () {
        if(this.myTempGold){
            this.myGold = this.myTempGold
        }
        this.currentBankerInfo = this.bankerTempInfo
        this.playerInfoList.forEach(element => {
            this.tryUpdateGoldInShowPlayerChairList(element.playerName , element.playerCoins)
        });
    },

    checkHasBet () {
        let result = 0 
        result = this.myBetAmountList.reduce((all , elem)=>all + elem , 0)
        return result !== 0
    },

    startCountDown (countDown) {
        this.countDown = countDown
        let isTrigger3Second = false
        this.intervalId = window.setInterval(()=>{
            this.countDown = this.countDown - 0.02;
            this.countDown = this.countDown < 0 ? 0 : this.countDown;
            if(this.countDown < 3 && this.gameState === hh_const.GAME_STATE.BET &&!isTrigger3Second){
                isTrigger3Second = true
                this.countDown3Second = true
            }
            if (this.gameState === hh_const.GAME_STATE.REWARD || (this.countDown > 3 && this.gameState === hh_const.GAME_STATE.BET)) {
                isTrigger3Second = false
            }
        },20);
    },

    getOtherPlayerList () {
        return this.playerInfoList.filter(x=>x.playerName != this.getMyName() && x.isSystem != 1);
    },

    isSystemBanker () {
        return this.currentBankerInfo.isSystem == 1
    },

    getSortByGoldPlayerList() {
        let resultList = this.playerInfoList.slice()
        resultList.sort(function(lhs , rhs){
            return lhs.playerCoins  < rhs.playerCoins
        })
    },

    updateShowPlayerChairList(){
        let resultList = this.playerInfoList.slice(0 , hh_const.SHOW_CHAIR_NUM)
        resultList.sort(function(lhs , rhs){
            return lhs.playerCoins  < rhs.playerCoins
        })
        this.showPlayerChairList = resultList
    },

    tryAddGoldInShowPlayerChairList(playerName , addGold){
        let player = this.showPlayerChairList.find(element => {
            return element.playerName === playerName;
        });       
        if(player){
            player.playerCoins += addGold
            this.showPlayerChairList = this.showPlayerChairList
        }
    },

    tryUpdateGoldInShowPlayerChairList(playerName , gold){
        let player = this.showPlayerChairList.find(element => {
            return element.playerName === playerName;
        });       
        if(player){
            player.playerCoins = gold
            this.showPlayerChairList = this.showPlayerChairList
        }
    },

    getIndexInShowChairList(playerName){
        for (let index = 0; index < this.showPlayerChairList.length; index++) {
            const element = this.showPlayerChairList[index];
            if(element.playerName === playerName){
                return index
            }
        }
        return -1
    },

    formatGold(gold){
        gold = parseInt(gold)
        if(gold < 10000000){
            return gold.toFixed(2)
        }else{
            gold = gold / 10000
            return gold.toFixed(2) + '万'
        }
    }

}
