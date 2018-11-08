let hh_data = require('hh_data');
let hh_const = require('hh_const');
var Constants = require('Constants');
cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            default: null,
            url: cc.AudioClip
        },


        tzxz: {
            default: null,
            url: cc.AudioClip
        },

        ksxz: {
            default: null,
            url: cc.AudioClip
        },

        danzhang: {
            default: null,
            url: cc.AudioClip
        },

        duizi: {
            default: null,
            url: cc.AudioClip
        },

        shunzi: {
            default: null,
            url: cc.AudioClip
        },

        jinhua: {
            default: null,
            url: cc.AudioClip
        },

        shunjin: {
            default: null,
            url: cc.AudioClip
        },

        baozi: {
            default: null,
            url: cc.AudioClip
        },
        fapai: {
            default: null,
            url: cc.AudioClip
        },

        kaipai: {
            default: null,
            url: cc.AudioClip
        },

        chouma_xiazhu: {
            default: null,
            url: cc.AudioClip
        },

        chouma_paifa: {
            default: null,
            url: cc.AudioClip
        },

        daojishi: {
            default: null,
            url: cc.AudioClip
        },

        
        win: {
            default: null,
            url: cc.AudioClip
        },

        lose: {
            default: null,
            url: cc.AudioClip
        },

        danzhang1: {
            default: null,
            url: cc.AudioClip
        },

        duizi1: {
            default: null,
            url: cc.AudioClip
        },

        shunzi1: {
            default: null,
            url: cc.AudioClip
        },

        jinhua1: {
            default: null,
            url: cc.AudioClip
        },

        shunjin1: {
            default: null,
            url: cc.AudioClip
        },

        zhuangjialunhuan: {
            default: null,
            url: cc.AudioClip
        },

        _enableStateAudio : true,
        _enableChipAudio : true,
    },

    onLoad () {
    },

    start () {
        //this.playMusic()
        hh_data.gameStateNotify.addListener(this.onGameStateChange , this);
        hh_data.animStageNotify.addListener(this.onAnimStageChange , this)
        hh_data.countDown3SecondNotify.addListener(this.onCountDown3Second , this)
        hh_data.currentBetInfoNotify.addListener(this.onflyBetChip , this);
        hh_data.dispatchChipFlagNotify.addListener(this.onDispatchChip , this);
        hh_data.dealCardFlagNotify.addListener(this.onDealCard , this);
        hh_data.initDataFlagNotify.addListener(this.refreshUI , this);
        hh_data.currentBankerInfoNotify.addListener(this.onCurrentBankerInfo ,this);
    },

    onDestroy () {
        //this.pauseMusic()
        hh_data.gameStateNotify.removeListener(this.onGameStateChange , this);
        hh_data.animStageNotify.removeListener(this.onAnimStageChange , this)
        hh_data.countDown3SecondNotify.removeListener(this.onCountDown3Second , this)
        hh_data.currentBetInfoNotify.removeListener(this.onflyBetChip , this);
        hh_data.dispatchChipFlagNotify.removeListener(this.onDispatchChip , this);
        hh_data.dealCardFlagNotify.removeListener(this.onDealCard , this);
        hh_data.initDataFlagNotify.removeListener(this.refreshUI , this);
        hh_data.currentBankerInfoNotify.removeListener(this.onCurrentBankerInfo ,this);
    },

    refreshUI() {
        this._enableStateAudio = true
    },

    onGameStateChange (state , oldState) {
        if(!this._enableStateAudio) return
        this._enableStateAudio = false
        this.scheduleOnce(()=>{
            this._enableStateAudio = true
        }, 1)

        if (hh_data.gameState === hh_const.GAME_STATE.REWARD&& oldState != hh_const.GAME_STATE.NONE) {
            this._playSFX(this.tzxz)
        }
        else if (hh_data.gameState === hh_const.GAME_STATE.BET&& oldState != hh_const.GAME_STATE.NONE) {
            this._playSFX(this.ksxz)
        }
    },

    onAnimStageChange (animStage) {
    if (animStage === hh_const.ANIM_STAGE.FLIP_LEFT_CARD ||
                 animStage === hh_const.ANIM_STAGE.FLIP_Right_CARD){
            this._playSFX(this.kaipai)
            this.schedule(()=>{
                this._playSFX(this.kaipai)
            }, hh_const.FLIP_CARD_TIME , 2)
        }
        else if (animStage === hh_const.ANIM_STAGE.SHOW_LEFT_PX){
            let cardType = hh_data.cardResult[0].cardType
            this.playCardTypeSfx(cardType)
        }
        else if (animStage === hh_const.ANIM_STAGE.SHOW_RIGHT_PX){
            let cardType = hh_data.cardResult[1].cardType
            this.playCardTypeSfx(cardType)
        }
        else if (animStage === hh_const.ANIM_STAGE.SHOW_SCORE){
             let myResultGold = hh_data.getMyResultGold()
             if(myResultGold > 0){
                this._playSFX(this.win)
             }
             else if (myResultGold < 0){
                this._playSFX(this.lose)
            }
        }
    },

    playCardTypeSfx(cardType){
        let audioID = this._playSFX(this.getCardTypeVoice(cardType))
        cc.audioEngine.setFinishCallback(audioID , ()=>
            this._playSFX(this.getCardTypeVoice1(cardType))
        )
    },

    getCardTypeVoice(cardType) {
        let cfg = [this.danzhang , this.duizi , this.shunzi , this.jinhua , this.shunjin , this.baozi]
        return cfg[cardType]
    },

    getCardTypeVoice1(cardType) {
        let cfg = [this.danzhang1 , this.duizi1 , this.shunzi1 , this.jinhua1 , this.shunjin1]
        if(cardType > hh_const.CARD_TYPE.SHUN_JIN){
            return cfg[hh_const.CARD_TYPE.SHUN_JIN]
        }
        return cfg[cardType]
    },

    playMusic: function() {
        cc.audioEngine.playMusic( this.bgm, true );
        if(!Constants.AudioConfig.MusicToggle && Constants.AudioConfig.MusicToggle !== undefined) {
            this.pauseMusic()
        }
    },

    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function(clip) {
        if(Constants.AudioConfig.EffectToggle == undefined || Constants.AudioConfig.EffectToggle) {
            return cc.audioEngine.playEffect( clip, false );
        }
    },

    onCountDown3Second () {
        this._playSFX(this.daojishi)   
        this.schedule(()=>{
            this._playSFX(this.daojishi)   
        }, 1 , 2)     
    },

    onflyBetChip () {
        if(!this._enableChipAudio) return
        this._enableChipAudio = false
        this.scheduleOnce(()=>{
            this._enableChipAudio = true
        }, 0.02)
        this.scheduleOnce(function(){
            this._playSFX(this.chouma_xiazhu)
        }, hh_const.FLY_CHIP_TIME);
    },

    onDispatchChip () {
        this._playSFX(this.chouma_paifa)
    },

    onDealCard () {
        this._playSFX(this.fapai)
    },

    onCurrentBankerInfo (currentInfo , oldInfo) {
        if(currentInfo.playerName !=  oldInfo.playerName && oldInfo.playerName != ''){
            this._playSFX(this.zhuangjialunhuan)
        }
    },
});
