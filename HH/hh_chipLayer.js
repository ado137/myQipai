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

/**
 * @description 筹码飞行类型配置
 */
let FLY_TYPE = cc.Enum({
    CHAIR_TABLE: -1,
    OTHER_TBALE : -1, 
    ME_TABLE : -1,
    TABLE_BANKER : -1,
    TABLE_OTHER : -1,
    TABLE_ME : -1,
    BANKER_TABLE : -1
});

/**
 * @description 结算动画节奏配置
 */
let RESULT_ANIM_CONFIG = 
[
    {animTime:0 , flyType: FLY_TYPE.TABLE_BANKER},
    {animTime:1 , flyType: FLY_TYPE.BANKER_TABLE},
    {animTime:2 , flyType: FLY_TYPE.TABLE_OTHER},
    {animTime:2 , flyType: FLY_TYPE.TABLE_ME},
];

let CHANGE_TO_WAIT_TIME = 2

cc.Class({
    extends: Thor,

    properties: {
        chipPrefab: cc.Prefab,     //筹码的prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._chipList = [];
        this.clearChipList()
        let bankerPos = this._bankerPos.getPosition()
        let otherPos = this._otherPos.getPosition()
        let myPos = this._mePos.getPosition()

        this.flyDataCfg = {
            [FLY_TYPE.CHAIR_TABLE]  :   {beginPos: otherPos,  endPos: null,      isShow:true},
            [FLY_TYPE.OTHER_TBALE]  :   {beginPos: otherPos,  endPos: null,      isShow:true},
            [FLY_TYPE.ME_TABLE]     :   {beginPos: myPos,      endPos: null,      isShow:true},
            [FLY_TYPE.TABLE_BANKER] :   {beginPos: null,      endPos: bankerPos, isShow:false},
            [FLY_TYPE.TABLE_OTHER]  :   {beginPos: null,      endPos: otherPos,  isShow:false},
            [FLY_TYPE.TABLE_ME]     :   {beginPos: null,      endPos: myPos,     isShow:false},
            [FLY_TYPE.BANKER_TABLE] :   {beginPos: bankerPos, endPos: null,      isShow:true},
        }

        hh_data.chipPool = new cc.NodePool();
    },

    start () {
        hh_data.myBetAmountListNotify.addListener(this.refreshBetUI ,this);
        hh_data.allBetAmountListNotify.addListener(this.refreshBetUI ,this);
        hh_data.currentBetInfoNotify.addListener(this.onBetChip , this);
        hh_data.initDataFlagNotify.addListener(this.onInitDataFlag , this);
        hh_data.gameStateNotify.addListener(this.onGameStateChange , this);
        hh_data.animStageNotify.addListener(this.onAnimStage , this)
        //this.refreshUI()
    },

    onBetChip (){
        this.flyBetChip(hh_data.currentBetInfo)
    },

    onAnimStage () {
        if (hh_data.animStage === hh_const.ANIM_STAGE.CHIP_ANIM ){
            this.playResultChipAnim()
            this.handleLightAreaAction(hh_data.gameState === hh_const.GAME_STATE.REWARD)
        }
    },

    refreshUI () {
        this.unscheduleAllCallbacks()
        this.refreshBetUI()
        this.clearChipList()
        this.handleLightAreaAction(false)
    },

    onInitDataFlag () {
        this.refreshUI()
        if(hh_data.animStage === hh_const.ANIM_STAGE.WAIT )
        {
            return
        }
        for (let area = 0; area < hh_const.BET_SLOT; area++) {
            let myAmount = hh_data.myBetAmountList[area]
            let otherAmount = hh_data.allBetAmountList[area] - hh_data.myBetAmountList[area]
            let myChipSlot = hh_data.parseScore(myAmount)
            let otherChipSlot = hh_data.parseScore(otherAmount)
            myChipSlot.forEach(element => {
                this.flyBetChip({score: element , area: area , isMe: true} , 0)
            });

            otherChipSlot.forEach(element => {
                this.flyBetChip({score: element , area: area , isMe: false} , 0)
            });
        }
    },

    clearChipList () {
        for (let index = 0; index < hh_const.BET_SLOT; index++) {
            this._chipList[index] = []
        }
        let unuseList = []
        for (var i = 0; i < this._chipNode.children.length; ++i) {
            let node = this._chipNode.children[i]
            unuseList.push(node)
        }
        unuseList.forEach(element => {
            hh_data.chipPool.put(element)
        });

        this._chipNode.removeAllChildren()
    },

    refreshBetUI () {
        for (let index = 0; index < hh_const.BET_SLOT; index++) {
            let myBetLable = this['_labelMyGold'+ index].$Label;
            let allBetLable = this['_labelAllGold' + index].$Label;
            myBetLable.string = hh_data.myBetAmountList[index];
            allBetLable.string = hh_data.allBetAmountList[index];
        }
    },

    onGameStateChange (state) {
        if (hh_data.gameState === hh_const.GAME_STATE.BET) {
            this.refreshUI()
        }
    },

    flyBetChip (betInfo , flyTime) {
        flyTime = flyTime || hh_const.FLY_BET_CHIP_TIME
        let chip = this.createChip(betInfo.score , betInfo.area , betInfo.isMe);
        chip.active = true
        let flyType = betInfo.isMe? FLY_TYPE.ME_TABLE : FLY_TYPE.OTHER_TBALE;
        if(flyType === FLY_TYPE.OTHER_TBALE && hh_data.getIndexInShowChairList(betInfo.playerName) != -1){
            flyType = FLY_TYPE.CHAIR_TABLE
        }
        this.flyChip(chip ,flyType, flyTime, betInfo.playerName);
    },

    playResultChipAnim() {
        let self = this;
        let getChip = function (flyType) {
            let chips = []
            if (flyType === FLY_TYPE.TABLE_ME || flyType === FLY_TYPE.TABLE_OTHER) {
                chips = self.getTableChipsByOwner(flyType === FLY_TYPE.TABLE_ME)
            }
            else if (flyType === FLY_TYPE.TABLE_BANKER) {
                chips = self.getTableChipsByAreas(hh_data.getNotRewardAreas())
                for (const area of hh_data.getNotRewardAreas()) {
                    self._chipList[area] = [];
                }
            }
            else if (flyType === FLY_TYPE.BANKER_TABLE) {
                chips = self.copyTableChipsByAreas(hh_data.getRewardAreas())
            }
            return chips
        }

        RESULT_ANIM_CONFIG.forEach(element => {
            this.scheduleOnce(() =>{
                let chips = getChip(element.flyType);
                for (let index = 0; index < chips.length; index++) {
                    const chip = chips[index];
                    self.delayFlyChip(chip , element.flyType , 0.4/chips.length*index)
                }
                if (chips.length > 0) {
                    hh_data.dispatchChipFlag = true
                }
            }, element.animTime)
        });
        this.scheduleOnce(() =>{
            hh_data.animStage = hh_const.ANIM_STAGE.SHOW_SCORE
        } , CHANGE_TO_WAIT_TIME);
    },  

    createChip (score , area , isMe) {
        var node = null
        if(hh_data.chipPool.size() > 0){
            node = hh_data.chipPool.get()
        }else{
            cc.log('createChip')
            node = cc.instantiate(this.chipPrefab);
        }
        this._chipNode.addChild(node)
        let hh_chip = node.getComponent("hh_chip");
        hh_chip.setTouchEnable(false)
        hh_chip.isGray = false;
        hh_chip.score = score;
        node.scaleX = hh_const.TABLE_CHIP_SCALE;
        node.scaleY = hh_const.TABLE_CHIP_SCALE;

        node.isMe = isMe
        node.area = area
        this._chipList[area].push(node)
        node.active = false
        return node;
    },

    delayFlyChip(chip , flyType , delayTime) {
        this.scheduleOnce(()=>{
           this.flyChip(chip , flyType)
        }, delayTime)
    },

    flyChip (chip , flyType, flyTime , playerName) {
        let data = this.flyDataCfg[flyType];
        if (data == null) {
            return;
        };
        chip.active = true
        let beginPos = data.beginPos;
        let endPos = data.endPos;
        let isShow = data.isShow;
        if(flyType === FLY_TYPE.CHAIR_TABLE){
            let index = hh_data.getIndexInShowChairList(playerName)
            beginPos = this['_playerNode'+ index].getPosition()
        }
        let hh_chip = chip.getComponent("hh_chip");
        let tablePos = this.getAreaRandomPos(chip.area);
        beginPos ? (endPos = tablePos) : (beginPos = tablePos);
        chip.setPosition(beginPos)
        hh_chip.fly(endPos , !isShow , flyTime);
    },

    onDestroy () {
        this._chipList = []
        if(hh_data.chipPool) {
            hh_data.chipPool.clear()
            hh_data.chipPool = null
        }
        hh_data.myBetAmountListNotify.removeListener(this.refreshBetUI ,this);
        hh_data.allBetAmountListNotify.removeListener(this.refreshBetUI ,this);
        hh_data.currentBetInfoNotify.removeListener(this.onBetChip , this)
        hh_data.initDataFlagNotify.removeListener(this.onInitDataFlag , this);
        hh_data.gameStateNotify.removeListener(this.onGameStateChange , this);
        hh_data.animStageNotify.addListener(this.onAnimStage , this)
    },


    getAreaRandomPos(areaIndex) {
        let area = this['_chipArea' + areaIndex];
        let randomX = Math.random() * (area.width) + (area.x - area.width/2);
        let randomY = Math.random() * (area.height) + (area.y - area.height/2);
        return cc.v2(randomX , randomY);
    },

    getTableChipsByOwner (isMe) {
        let result = []
        result = this._chipList.reduce(function (t , element){
            element.filter(x=>x.isMe === isMe).reduce(function (t , elem){
                t.push(elem);
                return t
            } , t);
            return t;
        } , result);
        return result;
    },

    getTableChipsByAreas (areas) {
        let result = []
        for (const area of areas) {
            this._chipList[area].reduce(function (t , element){
                t.push(element)
                return t;
            } , result);
        }
        return result;
    },

    copyChipList(chipList) {
        return chipList.map(x=> this.createChip(x.getComponent("hh_chip").score , x.area , x.isMe));
    },

    copyTableChipsByArea(area) {
        let times = 1
        if (area == 2 ){
            let cardType = hh_data.getWinCardType()
            times = hh_const.BENEFIT[cardType]
        }
        let chips = this._chipList[area]
        let result = []
        let oneTimeCopyChips = this.copyChipList(chips)
        result = result.concat(oneTimeCopyChips)
        for (let index = 0; index < times-1; index++) {
            result = result.concat(this.copyChipList(oneTimeCopyChips))
        }
        return result
    },

    copyTableChipsByAreas(areas){
        let result = []
        areas.forEach(element => {
            result = result.concat(this.copyTableChipsByArea(element))
        });
        return result
    },

    handleLightAreaAction(isPlay){
        let areas = hh_data.getRewardAreas()
        for (let index = 0; index < hh_const.BET_SLOT; index++) {
            let lightArea = this['_lightArea'+ index];
            if(!isPlay){
                lightArea.active = false;
            }
            else{
                if (areas.indexOf(index) === -1){
                    lightArea.active = false;
                }
                else{
                    lightArea.active = true;
                    lightArea.stopAllActions()
                    lightArea.opacity = 255;
                    let ac1 = cc.delayTime(1);
                    let ac2 = cc.callFunc(function(){lightArea.opacity = 0 });
                    let ac3 = cc.delayTime(0.5);
                    let ac4 = cc.callFunc(function(){lightArea.opacity = 255 });
                    lightArea.runAction(cc.repeatForever(cc.sequence(ac1,ac2,ac3,ac4)));
                }
            }
        }
    }

    // update (dt) {},
});
