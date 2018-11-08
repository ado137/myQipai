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
        cardPrefab : cc.Prefab,

        _cardList : [],
        _playIndex : 0,
        _flipIndex: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._cardList= []
        for (let index = 0; index < 6; index++) {
            let node = cc.instantiate(this.cardPrefab);
            node.parent = this['_card' + index];
            node.getComponent('hh_poker').isBack = true
            this._cardList.push(node)
            //node.getComponent(cc.Animation).on("finished" , this.onDealCard , this);
        }
    },

    start () {
        hh_data.animStageNotify.addListener(this.refeshStageUI , this)
        hh_data.gameStateNotify.addListener(this.refreshUI , this);
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        this.node.active = false
        //this.refreshUI()
    },

    onDestroy () {
        hh_data.animStageNotify.removeListener(this.refeshStageUI ,this);
        hh_data.gameStateNotify.removeListener(this.refreshUI , this);
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
    },

    refeshStageUI () {
        if (hh_data.animStage === hh_const.ANIM_STAGE.DEAL_CARD ){
            this.scheduleOnce(() =>{
                this.refreshUI();
                this._playIndex = 0;
                this.fillCardList();
                this.playDealCard()
            }, 1) ;
        }
        else if (hh_data.animStage === hh_const.ANIM_STAGE.FLIP_LEFT_CARD ){
            this.playFlipBySide(0)
        }
        else if (hh_data.animStage === hh_const.ANIM_STAGE.FLIP_Right_CARD ){
            this.playFlipBySide(1)
        }
        else if (hh_data.animStage === hh_const.ANIM_STAGE.SHOW_LEFT_PX ){
            this._cardType0.opacity = 0
            this._cardType0.getComponent(cc.Animation).play('cardType_out')
            this.scheduleOnce(() =>{
                hh_data.animStage = hh_const.ANIM_STAGE.FLIP_Right_CARD
            }, 0.3) ;
        }
        else if (hh_data.animStage === hh_const.ANIM_STAGE.SHOW_RIGHT_PX ){
            this._cardType1.opacity = 0
            this._cardType1.getComponent(cc.Animation).play('cardType_out')
            this.scheduleOnce(() =>{
                this.showResult()
            }, 0.5);
            
        }
        else if(hh_data.animStage === hh_const.ANIM_STAGE.CHIP_ANIM){
            this.node.active = false
        }
        else if(hh_data.animStage === hh_const.ANIM_STAGE.WAIT){
            this.node.active = false
        }
    },

    refreshUI () {
        this.unscheduleAllCallbacks()
        this._cardType0.opacity = 0
        this._cardType1.opacity = 0
        this._playIndex = 0;
        this._cardList.forEach(element => {
            element.getComponent('hh_poker').isBack = true
        });
        this.node.active = false
    },


    onDealCard () {
        let playIndex = this._playIndex;
        if (playIndex == 6) {
            this._flipIndex = 0
            hh_data.animStage = hh_const.ANIM_STAGE.FLIP_LEFT_CARD
            return
        }
        let name = playIndex < 3 ? `fly_l_${playIndex+1}` : `fly_r_${playIndex - 2}`;
        this._cardList[playIndex].active = true
        this._cardList[playIndex].getComponent(cc.Animation).play(name)
        this._playIndex++; 
        hh_data.dealCardFlag = true
    },

    getCarList (side) {
        return side === 0 ? this._cardList.slice(0 , 3) : this._cardList.slice(3 , 6).reverse();
    },

    playFlipBySide (side) {
        let index = 0
        this.getCarList(side).forEach(element => {
            this.scheduleOnce(() =>{
                element.getComponent('hh_poker').flip()
            }, hh_const.FLIP_CARD_TIME*(index++))
        });
        this.scheduleOnce(() =>{
            let stage = side === 0 ? hh_const.ANIM_STAGE.SHOW_LEFT_PX : hh_const.ANIM_STAGE.SHOW_RIGHT_PX;
            hh_data.animStage = stage;
        } , 1.5)
    },

    fillCardList () {
        for (let index = 0; index < 3; index++) {
            this._cardList[index].getComponent('hh_poker').num = hh_data.cardResult[0].cardConetext[index].cardNum - 1
            this._cardList[index].getComponent('hh_poker').color = hh_data.cardResult[0].cardConetext[index].cardColor - 1
        }

        for (let index = 0; index < 3; index++) {
            this._cardList[index+3].getComponent('hh_poker').num = hh_data.cardResult[1].cardConetext[index].cardNum - 1
            this._cardList[index+3].getComponent('hh_poker').color = hh_data.cardResult[1].cardConetext[index].cardColor - 1
        }

        this._cardType0.$MagicSprite.index =hh_data.cardResult[0].cardType
        this._cardType1.$MagicSprite.index =hh_data.cardResult[1].cardType
    },



    playDealCard() {
        this.node.active = true
        this._gongzhu.$Animation.play()
        this._wangzi.$Animation.play()
        this._vs02.$Animation.play()
        this._mask_f.active = false
        this._win_spark.active = false 
        this._light02.$Animation.play()
        this._light002.$Animation.play()
        this._big_light.$Animation.play()
        this._vs01.$Animation.play()

        let winSide = hh_data.getWinSide()
        let loseSide = (winSide +1) % 2
        let winNode = this['_anim_Node' + winSide]
        let loseNode = this['_anim_Node' + loseSide]
        this._win_spark.x = winNode.x
        this._win_spark.y = winNode.y
        this._mask_f.x = loseNode.x
        this._mask_f.y = loseNode.y
        console.log('winSide:' , winSide)
        console.log('loseSide:' , loseSide)
        this.scheduleOnce(() =>{
            this._flipIndex = 0
            hh_data.animStage = hh_const.ANIM_STAGE.FLIP_LEFT_CARD
        }, 1.5);
    },

    showResult (){
        this._win_spark01_effect.$ParticleSystem.resetSystem()
        this._win_spark02_effect.$ParticleSystem.resetSystem()
        this._win_spark03_effect.$ParticleSystem.resetSystem()
        this._niu_win_effect_star.$ParticleSystem.resetSystem()

        this._win_spark.active = true
        this._mask_f.active = true
        this._win.$Animation.play()
        this.scheduleOnce(() =>{
            hh_data.animStage = hh_const.ANIM_STAGE.CHIP_ANIM        
        } , 1.5)
    }

    // update (dt) {},
});
