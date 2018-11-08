var Constants = require('Constants');
var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            default: null,
            url: cc.AudioClip
        },

        zhuang_Count:{
            default:[],
            url:[cc.AudioClip]
        },

        xian_Count:{
            default:[],
            url:[cc.AudioClip]
        },

        bet: {
            default: null,
            url: cc.AudioClip
        },

        awardcountdown:{
            default: null,
            url: cc.AudioClip
        },

        deling:{
            default: null,
            url: cc.AudioClip
        },

        ChipFly:{
            default: null,
            url: cc.AudioClip
        },

        win:{
            default: null,
            url: cc.AudioClip
        },

        lose:{
            default: null,
            url: cc.AudioClip
        },

        award:{
            default: null,
            url: cc.AudioClip
        },

        ping:{
            default: null,
            url: cc.AudioClip
        },

        tongdianping:{
            default: null,
            url: cc.AudioClip
        },

        xiantianwang:{
            default: null,
            url: cc.AudioClip
        },

        xiandui:{
            default: null,
            url: cc.AudioClip
        },

        xianwin:{
            default: null,
            url: cc.AudioClip
        },

        zhuangtianwang:{
            default: null,
            url: cc.AudioClip
        },

        zhuangdui:{
            default: null,
            url: cc.AudioClip
        },

        zhuangwin:{
            default: null,
            url: cc.AudioClip
        },

        zzlh:{
            default: null,
            url: cc.AudioClip
        },
        
        ksxz:{
            default: null,
            url: cc.AudioClip
        },

        tzxz:{
            default: null,
            url: cc.AudioClip
        },

        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        // this.playBGM()
    },

    onDestroy(){
        this.stopBGM()
    },

    _playSFX: function(clip) {
        if(Constants.AudioConfig.EffectToggle) {
            return cc.audioEngine.playEffect( clip, false );
        }
    },

    playBGM(){
        cc.audioEngine.playMusic(this.bgm,true)
    },

    stopBGM(){
        cc.audioEngine.stopMusic()
    },

    playzhuangCount(_index){
        this._playSFX(this.zhuang_Count[_index])
    },
    
    playxianCount(_index){
        this._playSFX(this.xian_Count[_index])
    },

    playbet(){
        this._playSFX(this.bet)
    },

    playdaojishi(){
        this._playSFX(this.awardcountdown)
    },

    playfapai(){
        this._playSFX(this.deling)
    },

    playchipFly(){
        this._playSFX(this.chipFly)
    },

    playwin(){
        this._playSFX(this.win)
    },

    playlose(){
        this._playSFX(this.lose)
    },
    
    playzzlh(){
        this._playSFX(this.zzlh)
    },

    playksxz(){
        this._playSFX(this.ksxz)
    },

    playtzxz(){
        this._playSFX(this.tzxz)
    },

    playResult(){
        this.AudioSrcArray = []
        var m_zValue = BCConstants.ZhuangValue
        var m_xValue = BCConstants.XianValue
        var z_str
        var x_str

        if(m_zValue < 8){
            z_str = this.zhuang_Count[m_zValue]
        }else{
            if(BCConstants.CardTypeArrray.zhuangTianWang){
                z_str = this.zhuangtianwang
            }
            else{
                z_str = this.zhuang_Count[m_zValue]
            }
        }

        if(m_xValue < 8){
            x_str = this.xian_Count[m_xValue]
        }else{
            if(BCConstants.CardTypeArrray.xianTianWang){
                x_str = this.xiantianwang
            }
            else{
                x_str = this.xian_Count[m_xValue]
            }
        }

        this.AudioSrcArray.push(z_str)
        if(BCConstants.CardTypeArrray.zhuangDuiZi){
            this.AudioSrcArray.push(this.zhuangdui)
        }
        this.AudioSrcArray.push(x_str)
        if(BCConstants.CardTypeArrray.xianDuiZi){
            this.AudioSrcArray.push(this.xiandui)
        }

        if(BCConstants.CardTypeArrray.zhuang){
            this.AudioSrcArray.push(this.zhuangwin)
        }
        if(BCConstants.CardTypeArrray.xian){
            this.AudioSrcArray.push(this.xianwin)
        }
        if(BCConstants.CardTypeArrray.ping){
            this.AudioSrcArray.push(this.ping)
        }
        if(BCConstants.CardTypeArrray.tongDianPing){
            this.AudioSrcArray.push(this.tongdianping)
        }

        var AudioId = this._playSFX(this.ResultArray[0])
        cc.audioEngine.setFinishCallback(AudioId,this.audioCallBack.bind(this))
    },

    audioCallBack()
    {
        this.AudioSrcArray.shift();
        if(this.AudioSrcArray.length>0)
        {
            var AudioId = this._playSFX(this.ResultArray[0])
            cc.audioEngine.setFinishCallback(AudioId,this.audioCallBack.bind(this))
        }
    },
    // update (dt) {},
});
