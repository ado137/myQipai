
var BCConstants = require('BCConstants')
var Enum = require('CommonEnum')
var common = require('Common')
var BCEffects = require('BCEffects')
var gameConstants = require('Constants')
var PlayerData = require("PlayerData")
cc.Class({
    extends: cc.Component,

    properties: {
        //扑克牌
        Poker:{
            default:null,
            type:cc.Prefab
        },
        //筹码
        Chip:{
            default:null,
            type:cc.Prefab
        },

        //下注桌
        Image_table:{
            default:null,
            type:cc.Sprite
        },
        Layout_leftplace:{
            default:null,
            type:cc.Layout
        },
        Layout_rightplace:{
            default:null,
            type:cc.Layout
        },

        //桌子下注点
        Node_betplaces:{
            default:[],
            type:cc.Node
        },

        //桌子下注值
        Node_labels:{
            default:[],
            type:cc.Node
        },

        //其他玩家按钮
        Btn_other:{
            default:null,
            type:cc.Button
        },

        //世界坐标节点
        Node_worldspace:{
            default:null,
            type:cc.Node
        },
        
        //扑克世界坐标
        Node_pokerworld:{
            default:null,
            type:cc.Node
        },

        //下注桌精灵
        Image_tables:{
            default:[],
            type:[cc.Sprite]
        },

        //庄家金币图标
        Image_zhuangGold:{
            default:null,
            type:cc.Sprite
        },
        
        //珠路Scoll
        Scoll_zhulu:{
            default:null,
            type:cc.ScrollView
        },

        //大路Scoll
        Scoll_dalu:{
            default:null,
            type:cc.ScrollView
        },

        //dayanluScoll
        Scoll_dayanlu:{
            default:null,
            type:cc.ScrollView
        },

        //dayanluScoll
        Scoll_xiaolu:{
            default:null,
            type:cc.ScrollView
        },

        //dayanluScoll
        Scoll_yueyoulu:{
            default:null,
            type:cc.ScrollView
        },

        Node_ludan:{
            default:null,
            type:cc.Node
        },

        //控件
        Node_Buttons:{
            default:null,
            type:cc.Node
        },
        //Effects 节点
        Node_Effects:{
            default:null,
            type:cc.Node
        },

        //庄胜负提示
        Node_zhuangTip:{
            default:null,
            type:cc.Node
        },

        //其他玩家胜负提示
        Node_otherTip:{
            default:null,
            type:cc.Node
        },

        //自己玩家胜负提示
        Node_selfTip:{
            default:null,
            type:cc.Node
        },

        //闲赢动画节点
        Node_effectXian:{
            default:null,
            type:cc.Node
        },

        //庄赢动画节点
        Node_effectZhuang:{
            default:null,
            type:cc.Node
        },
        
        //庄家信息节点
        Node_zhuangInfo:{
            default:null,
            type:cc.Node
        }, 

        //自己信息节点
        Node_selfInfo:{
            default:null,
            type:cc.Node
        },

        //上下庄按钮数组
        Btn_dealer:{
            default:[],
            type:[cc.Button]
        },

        //筹码管理节点
        Node_chipController:{
            default:null,
            type:cc.Node
        },

        //音效管理节点
        Node_Audio:{
            default:null,
            type:cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.control = this.node.getComponent('BCController')

        //计算筹码结算脚本
        this.chipCalcultor = this.node.getComponent('ChipsCalculator')

        //获取公用控件脚本
        this.buttonsController = this.Node_Buttons.getComponent('GBInterface')
        
        //获取动画控制脚本
        this.EffectsController = this.Node_Effects.getComponent('GameEffectController')

        //获取开奖牌类型计算脚本
        this.CardTypeCaculation = this.node.getComponent('CardTypeCalculation')

        //获取续投功能脚本
        this.ReBet = this.node.getComponent('BCReBet')

        //获取筹码管理脚本
        this.ChipController = this.Node_chipController.getComponent('ChipController')
        
        //动态加载资源纹理
        this.control.dynamicLoadResouces()

        //清空下注显示label
        this.cleanLabels()

        //注册下注桌子点击事件
        this.registClicks()

        //注册用户金币改变事件
        common.playerData.bindChangePropEvent(PlayerData.ChangeProperty.Coin, this.ChipsIsEnable, this);

        //初始化筹码计算方法
        this.settlCalculatorChips()

        //获取音效管理
        this._audioMrg = this.Node_Audio.getComponent('BCAudioManager')
    },

    start () {
        //获取下注节点世界坐标
        this.schedule(this.getWorldPlace,0.1,0)
    },

    onDestroy(){
        BCConstants._currentBetValue = null
        this.ChipRestValue= []
    },

    /**
     * @description 续投按钮回调 
     */
    onXutou(event){
        for (const key in BCConstants.TableNumber) {
            this.schedule(function(){
                this.betControl(key,BCConstants._currentBetValue,BCConstants.betByWho.others)
            },0.05,50)
        }
    },

    _audioEngine(){
        return common.audio;
    },

    onSet(_event){
        // this.setLudan(BCConstants.ZhuLu.zzd)
        // common.playerData.setCoin(12000)
        BCConstants._gameStatus = BCConstants.gameStatus.startBet
    },

    onQt(_event){
    //     this.setLudan(BCConstants.ZhuLu.xzd)
    //     common.playerData.setCoin(234)
        // this.startToLotter()
        
        BCConstants._gameStatus = BCConstants.gameStatus.startLotter
    },

    /**
     * @description 清空动画
     */
    cleanEffectLottery(){
        this.cleanEffectLotterySignal(this.Node_effectZhuang)
        this.cleanEffectLotterySignal(this.Node_effectXian)
    },

    cleanEffectLotterySignal(_target){
        BCEffects.hideWinners(_target,this)
        _target.getChildByName('Label_type').active = false
        _target.getChildByName('Label_ping').active = false
        _target.getChildByName('Label_normal').active = false
        _target.getChildByName('Label_tianwang').active = false
        _target.getChildByName('Image_bg').active = false
    },

    /**
     * @description 定时器
     * @param {调用一次时间}} _second 
     */
    onTimer(_second){
        if(_second == 0){
            if(BCConstants._gameStatus == BCConstants.gameStatus.startLotter){
                this.buttonsController.setTimerTipsWait()
                this.startToWaitNext()
            }
            else if(BCConstants._gameStatus == BCConstants.gameStatus.startBet){
                this.EffectsController.playEndChipInEffect() //播放停止下注动画
            }
        }

        if(BCConstants._gameStatus == BCConstants.gameStatus.startBet){
            if(_second == 4){
                this.schedule(function(){
                    // this._audioEngine().PlayEffect('bjl-daojishi')
                    this._audioMrg.playdaojishi()
                },1,3)
            }
            if(_second == 3){
                //播放321倒计时动画
                this.EffectsController.playCountDownEffect()
            }   
        }
    },

    /**
     * @description 清空发牌区
     */
    delePokers(){
        var Xian_pokers = this.Layout_leftplace.node.children
        var Zhuang_pokers = this.Layout_rightplace.node.children
        for (let index = 0; index < Xian_pokers.length; index++) {
            Xian_pokers[index].destroy()
        }
        for (let index = 0; index < Zhuang_pokers.length; index++) {
            Zhuang_pokers[index].destroy()
        }
    },

    startToLotter(){
        // this._audioEngine().PlayEffect('bjl-tzxz')
        this._audioMrg.playtzxz()
        //禁用所有下注按钮
        this.ChipController.DisableAllButton(true)
        this.ChipController.DisableRebetBtn(true)

        //隐藏等待下局开始动画
        this.EffectsController.playWaitingForNextGameEffect(false)
        
        //设置游戏状态
        BCConstants._gameStatus = BCConstants.gameStatus.startLotter
        
        //设置提示图片
        this.buttonsController.setTimerTipsAward()
        
        //开始倒计时
        this.buttonsController.startTimer(BCConstants._awardTIme)
        
        //开始发牌
        var _Number = this.DelingController()
        
        this.schedule(function(){
            this.blinkTables()  //桌面闪烁动画
            this.settleChips()  //结算筹码
            this.effectLottery()
            // this.playAudio()
            this._audioMrg.playResult()
            this.judgeLudan(BCConstants.CardTypeArrray)  //设置路单
            cc.log('=====金币输赢======',BCConstants.dealersCoin,BCConstants.playerSettlement,BCConstants.playersCoin,BCConstants.selfCoin)
        },_Number,0)
    },                                                      

    playAudio(){
        this.AudioSrcArray = []
        var m_zValue = BCConstants.ZhuangValue
        var m_xValue = BCConstants.XianValue
        var z_str
        var x_str
        if(m_zValue < 8){
            z_str = 'bjl-z'+ m_zValue
        }else{
            if(BCConstants.CardTypeArrray.zhuangTianWang){
                z_str = 'bjl-ztw'
            }
            else{
                z_str = 'bjl-z'+ m_zValue
            }
        }

        if(m_xValue < 8){
            x_str = 'bjl-x' + m_xValue
        }else{
            if(BCConstants.CardTypeArrray.xianTianWang){
                x_str = 'bjl-xtw'
            }
            else{
                x_str = 'bjl-x' + m_xValue
            }
        }
        this.AudioSrcArray.push(z_str)
        if(BCConstants.CardTypeArrray.zhuangDuiZi){
            this.AudioSrcArray.push('bjl-zd')
        }
        this.AudioSrcArray.push(x_str)
        if(BCConstants.CardTypeArrray.xianDuiZi){
            this.AudioSrcArray.push('bjl-xd')
        }

        if(BCConstants.CardTypeArrray.zhuang){
            this.AudioSrcArray.push('bjl-zy')
        }
        if(BCConstants.CardTypeArrray.xian){
            this.AudioSrcArray.push('bjl-xy')
        }
        if(BCConstants.CardTypeArrray.ping){
            this.AudioSrcArray.push('bjl-p')
        }
        if(BCConstants.CardTypeArrray.tongDianPing){
            this.AudioSrcArray.push('bjl-tdp')
        }

        this._audioEngine().PlayEffect('bjl_win')
        var CurrentAuodi = this.AudioSrcArray[0];
        this._audioEngine().PlayEffect(CurrentAuodi,this.AudioCallback.bind(this))
    },

    AudioCallback()
    {
        this.AudioSrcArray.shift();
        if(this.AudioSrcArray.length>0)
        {
            var CurrentAuodi = this.AudioSrcArray[0];
            this._audioEngine().PlayEffect(CurrentAuodi,this.AudioCallback.bind(this))
        }
    },

    startToBet(_time){
        //清空金币Label
        this.cleanLabels()

        //清空发牌区
        this.delePokers()
        
        //清空桌面闪烁动画
        this.cleanTablesAnimation()
        
        //清空开奖动画
        this.cleanEffectLottery()
        // this._audioEngine().PlayEffect('bjl-ksxz')
        this._audioMrg.playksxz()
        if(BCConstants._dealerStatus != BCConstants.dealerStatus.Dealer){//如果当前状态不为上庄状态
            cc.log('============如果当前状态不为上庄状态=============',BCConstants._dealerStatus)
            //启动所有下注按钮
            this.ChipController.DisableAllButton(false)
            var m_SelfCoin = common.playerData.getCoin()
            common.playerData.setCoin(Number(m_SelfCoin).toFixed(2))
            
            //设置为新的回合状态,判断续投按钮是否可用
            this.ReBet.setAroundStatus(true)
        }


        //关闭正在等待动画
        this.EffectsController.playWaitingForNextGameEffect(false)
        
        //设置游戏状态
        BCConstants._gameStatus = BCConstants.gameStatus.startBet
        
        //设置提示图片
        this.buttonsController.setTimerTipsIn()
  
        //开始倒计时
        if(_time){
            this.buttonsController.startTimer(_time)
        }
        else{
            this.buttonsController.startTimer(BCConstants._gameTime)
        }
        
        //播放开始下注动画
        this.EffectsController.playStartChipInEffect()
        
        if(BCConstants.dealTimes == 0){
            //播放换庄动画
            this.EffectsController.showChangeDealerText(true,1.2)
            // this._audioEngine().PlayEffect('bjl_zjlunhuan')
            this._audioMrg.playzzlh()
        }
        else if(!BCConstants.dealTimes){
            return 
        }
        else{
            //播放连庄次数
            this.EffectsController.showContinueDealText(true,BCConstants.dealTimes,1.2)
        }
    },

    /**
     * @description 等待下局开始
     */
    startToWaitNext(){
        //设置游戏状态
        BCConstants._gameStatus = BCConstants.gameStatus.wait

        //显示等待下一句动画
        this.EffectsController.playWaitingForNextGameEffect(true)
        
        //清空金币Label
        this.cleanLabels()
       
        //清空发牌区
        this.delePokers()
      
        //清空桌面闪烁动画
        this.cleanTablesAnimation()
       
        //清空开奖动画
        this.cleanEffectLottery()

        //开始等待倒计时
        this.buttonsController.startTimer(BCConstants._gameWaitTime)
    },

    initRommInfo(_Msg){
        BCConstants.RoomInfo = _Msg
        BCConstants._gameTime = _Msg.betTime
        BCConstants._awardTIme = _Msg.awardTime
        BCConstants._gameWaitTime = _Msg.waitTime

        cc.log('=======RoomInfo======',BCConstants.RoomInfo)
        this.setSelfInfo(common.playerData.getNickName(),common.playerData.getCoin())
        this.setDealerInfo(BCConstants.RoomInfo.dealer.nickName,BCConstants.RoomInfo.dealer.coin,BCConstants.RoomInfo.dealer.uniqueId)
        this.initLudan()    //初始化历史记录

        //添加其他玩家列表
        for (let index = 0; index < BCConstants.RoomInfo.playerList.length; index++) {
            var info = BCConstants.RoomInfo.playerList[index]
            this.buttonsController.addOtherPlayer(info.nickName,info.coin,2,info.uniqueId)
        }

        //添加庄家队列表
        for (let index = 0; index < BCConstants.RoomInfo.dealerList.length; index++) {
            var info = BCConstants.RoomInfo.dealerList[index]
            this.buttonsController.addDealer(info.nickName,info.coin,info.portrait,info.uniqueId)
            if(info.uniqueId == common.uniqueId){
                BCConstants._dealerStatus = BCConstants.dealerStatus.InTheLine
                this.hideOrShowIsDealer(2)
            }
        }

        if(BCConstants.RoomInfo.gameState == 0){
            this.startToBet(BCConstants.RoomInfo.restSeconds)
            this.schedule(function(){
                this.initBetChip(_Msg.poolAmount,_Msg.myAmount,_Msg.totalAmount)
            },0.5,0)
        }
        else if(BCConstants.RoomInfo.gameState == 1){

            this.EffectsController.playWaitingForNextGameEffect(true)
            this.buttonsController.setTimerTipsWait()
            this.buttonsController.startTimer(BCConstants.RoomInfo.restSeconds)
            // this.judgeLudan(BCConstants.RoomInfo.pokerPatterns)
            //禁用所有下注按钮
            this.ChipController.DisableAllButton(true)
            this.ChipController.DisableRebetBtn(true)
        }

        this.EffectsController.playWatchingGame(_Msg.isObserve.canPlay,_Msg.isObserve.minMoney)
    },

    initBetChip(_otherAmount,_myAmount,_totalAmount){
        var Algorithm = require('BFAlgorithm')
        _myAmount.forEach((element,taNum) => {
            var tableNumber = taNum
            var m_element = Number(element)
            this.ChipRestValue = []
            var MyArray = Algorithm.ChipsGenerator.initChipsByValue(BCConstants.chipsValueArray,m_element)
            MyArray.forEach((element,index) => {
                var chip = cc.instantiate(this.Chip)
                var chipjs = chip.getComponent('BCChip')
                chip.setPosition(this.getRandomSpace(BCConstants.TableArray[tableNumber]))
                chipjs.setChip(this.Node_worldspace,element)
                this.chipCalcultor.AddLocalPlayerBetInfo(element,tableNumber, chip);
            });
            BCConstants._SelfBetValues[tableNumber] = Number(m_element)
            this.Node_labels[tableNumber].getChildByName('Label_all').getComponent(cc.Label).string = Number(m_element).toFixed(2)
        });


        _otherAmount.forEach((element,tabNum) => {
            var tableNumber = tabNum
            var m_element = Number(element)
            var OtherArray = Algorithm.ChipsGenerator.initChipsByValue(BCConstants.chipsValueArray,m_element)
            OtherArray.forEach((element,index) => {
                var chip = cc.instantiate(this.Chip)
                var chipjs = chip.getComponent('BCChip')
                chip.setPosition(this.getRandomSpace(BCConstants.TableArray[tableNumber]))
                chipjs.setChip(this.Node_worldspace,element)
                this.chipCalcultor.AddOtherPlayerBetInfo(element,tableNumber, chip);
            });
            BCConstants._BetValues[tableNumber] = BCConstants._SelfBetValues[tableNumber] + Number(m_element)
            this.Node_labels[tableNumber].getChildByName('Label_self').getComponent(cc.Label).string = BCConstants._BetValues[tableNumber].toFixed(2)
        });
        BCConstants._BetValues[8] += Number(_totalAmount)
        this.Node_labels[8].getChildByName('Label_zxz').getComponent(cc.Label).string = BCConstants._BetValues[8]

    },


    addDealerList(_nickname,_coin,_portrait,_token){
        // common.ShowTips('=======其他玩家上庄=======')
        this.buttonsController.addDealer(_nickname,_coin,_portrait,_token)
    },

    addOtherList(_nickname,_coin,_portrait,_token){
        // common.ShowTips('其他玩家进入房间')
        this.buttonsController.addOtherPlayer(_nickname,_coin,_portrait,_token)
    },

    removeOtherList(_token){
        // common.ShowTips('其他玩家离开游戏')
        this.buttonsController.removeOtherPlayer(_token)
    },

    /**
     * @description 初始化路单
     */
    initLudan(){
        for (let index = 0; index < BCConstants.RoomInfo.historyRecord.length; index++) {
            for (const key in BCConstants.RoomInfo.historyRecord[index]) {
                var temp = []
                temp.push(key)
                temp.push(BCConstants.RoomInfo.historyRecord[index][key])
                this.setLudan(temp)
                this.checkRecordCount(key)
            }  
        }
        this.Scoll_zhulu.node.getComponent('BCSrollController').initRecordCount()
    },

    checkRecordCount(_string){
        
        var pat = new RegExp("_")
        var pat_z = new RegExp("zhuang_")
        var pat_x = new RegExp('xian_')
        var pat_p = new RegExp('ping_')
        var pat_zd = new RegExp('_zhuangdui')
        var pat_xd = new RegExp('_xiandui')
        var pat_sd = new RegExp('_shuangdui')
        
        if(!pat.test(_string)){
            ++BCConstants._RecordCount[_string]
        }else{
            if(pat_z.test(_string)){
                BCConstants._RecordCount.zhuang++
            }  
            if(pat_x.test(_string)){
                BCConstants._RecordCount.xian++
            } 
            if(pat_p.test(_string)){
                BCConstants._RecordCount.ping++
            } 
            if(pat_zd.test(_string)){
                BCConstants._RecordCount.zhuangDuiZi++
            } 
            if(pat_xd.test(_string)){
                BCConstants._RecordCount.xianDuiZi++
            } 
            if(pat_sd.test(_string)){
                BCConstants._RecordCount.zhuangDuiZi++
                BCConstants._RecordCount.xianDuiZi++
            } 
        }
    },

    setDealerInfo(_nickname,_coins,_token){
        this.Node_zhuangInfo.getChildByName('Lab_name').getComponent(cc.Label).string = _nickname
        this.Node_zhuangInfo.getChildByName('Lab_coins').getComponent(cc.Label).string = Number(_coins).toFixed(2)
        this.checkUersBecomeDealer(_token)
    },

    /**
     * @description 玩家自己上庄排队下庄
     * @param {上庄玩家的Token} _token 
     */
    checkUersBecomeDealer(_token){
        cc.log('========玩家自己上庄排队下庄============',_token,common.uniqueId)
        if(_token == common.uniqueId){//庄家为自己时
            common.ShowTips('您当前局为庄家')
            BCConstants._dealerStatus = BCConstants.dealerStatus.Dealer
            this.hideOrShowIsDealer(1)
            this.ChipController.DisableAllButton(true)
            this.ChipController.DisableRebetBtn(true)
        }
        else{//庄家不为自己时
            if(BCConstants._dealerStatus == BCConstants.dealerStatus.Dealer){//目前状态为在上庄状态
                //下庄
                common.ShowTips('你已下庄')
                this.hideOrShowIsDealer(0)
                BCConstants._dealerStatus = BCConstants.dealerStatus.Normal
            }
        }

    },

    setSelfInfo(_nickname,_coins){
        common.playerData.setCoin(_coins)
        common.playerData.setNickName(_nickname)
    },  

    /**
     * @description 路单类型的判定
     */
    judgeLudan(_typeArray){
       var m_CardType = _typeArray
       if(m_CardType.ping){
            this.setLudan(BCConstants.ZhuLu.ping)
            return 
       }
       else if(m_CardType.zhuangDuiZi && m_CardType.xianDuiZi && m_CardType.zhuang){
            this.setLudan(BCConstants.ZhuLu.zsd)
            return 
       }
       else if(m_CardType.zhuangDuiZi && m_CardType.xianDuiZi && m_CardType.xian){
            this.setLudan(BCConstants.ZhuLu.xsd)
            return 
       }
       else if(m_CardType.zhuangDuiZi && m_CardType.zhuang){
            this.setLudan(BCConstants.ZhuLu.zzd)
            return 
       }
       else if(m_CardType.xianDuiZi && m_CardType.zhuang){
            this.setLudan(BCConstants.ZhuLu.zxd)
            return 
       }
       else if(m_CardType.zhuangDuiZi && m_CardType.xian){
            this.setLudan(BCConstants.ZhuLu.xzd)
            return 
        }
        else if(m_CardType.xianDuiZi && m_CardType.xian){
            this.setLudan(BCConstants.ZhuLu.xxd)
            return 
        }
        else if(m_CardType.zhuang){
            this.setLudan(BCConstants.ZhuLu.zhuang)
            return 
        }
        else if(m_CardType.xian){
            this.setLudan(BCConstants.ZhuLu.xian)
            return 
        }
    },
    
    /**
     * @description 胜负提示动画
     */
    winOrLoseEffect(_dealer,_other,_self){
        if(_dealer < 0){
            this.isWinOrLose(this.Node_zhuangTip,false,_dealer)
        }else{
            this.isWinOrLose(this.Node_zhuangTip,true,_dealer)
        }
        this.tipAnimation(this.Node_zhuangTip,cc.p(0,-300))


        if(_other < 0){
            this.isWinOrLose(this.Node_otherTip,false,_other)
        }else{
            this.isWinOrLose(this.Node_otherTip,true,_other)
        }
        this.tipAnimation(this.Node_otherTip,cc.p(0,-140))

        var isBet = true
        for (let index = 0; index < BCConstants._SelfBetValues.length; index++) {
            if(BCConstants._SelfBetValues[index] != 0){
                isBet = false
            }   
        }

        if(BCConstants.playersCoin[common.uniqueId]){
            common.playerData.setCoin(BCConstants.playersCoin[common.uniqueId])
            //禁用所有下注按钮
            this.ChipController.DisableAllButton(true)
            this.ChipController.DisableRebetBtn(true)
        }
        var m_dealerCoin = this.Node_zhuangInfo.getChildByName('Lab_coins').getComponent(cc.Label).string
        var m_coin = Number(m_dealerCoin) + Number(BCConstants.dealersCoin)
        this.Node_zhuangInfo.getChildByName('Lab_coins').getComponent(cc.Label).string = m_coin.toFixed(2)

        if(BCConstants._dealerStatus != BCConstants.dealerStatus.Dealer){
            if(isBet){
                common.ShowTips('当前您没有下注')
                return 
            }    
        }
        
        if(_self < 0){
            this.isWinOrLose(this.Node_selfTip,false,_self)
        }else{
            this.isWinOrLose(this.Node_selfTip,true,_self)
        }
        this.tipAnimation(this.Node_selfTip,cc.p(0,120))
    
        for (const key in BCConstants.playersCoin) { //刷新金币
            this.buttonsController.setPlayersCoin(key,BCConstants.playersCoin[key])
        }
    },

    /**
     * @description 判断显示胜利字体还是失败字体
     * @param {节点}}} _target 
     * @param {状态}} _status 
     */
    isWinOrLose(_target,_status,_value){
        _value = Number(_value)
        var win = _target.getChildByName('Win')
        var lose = _target.getChildByName('Lose')
        win.active = _status
        lose.active = !_status
        win.getComponent(cc.Label).string = '+'+_value.toFixed(2)
        lose.getComponent(cc.Label).string = _value.toFixed(2)
    },

    /**
     * @description 金币结算提示节点的动作
     * @param {节点}} _target 
     * @param {移动距离}} _distance 
     */
    tipAnimation(_target,_distance){
        _target.setPosition(cc.p(0,0))
        _target.opacity = 255
        var movb = cc.moveBy(0.5,_distance).easing(cc.easeBounceOut())
        var del = cc.delayTime(1)
        var fado = cc.fadeOut(0.5)
        _target.runAction(cc.sequence(movb,del,fado)) 
    },

    /**
     * @description 结算筹码
     */
    settleChips(){
        if(BCConstants._winnerArray[BCConstants._winnerArray.length - 1] == 1){
            BCConstants._winnerArray[0] = 1
            BCConstants._winnerArray[4] = 1
        }
        this.chipCalcultor.CalculateResult(BCConstants._winnerArray)
        this.schedule(this.settlZhuang,0.1,0)
        this.schedule(this.dealerLoseChips,BCConstants.FLYTIME+BCConstants.SETTLTIME,0)
        this.schedule(this.playerGetChips,(BCConstants.FLYTIME+BCConstants.SETTLTIME)*2,0)
        this.schedule(function(){
            this.winOrLoseEffect(BCConstants.dealersCoin,BCConstants.playerSettlement,BCConstants.selfCoin)
            this.chipCalcultor.ResetData()
        },(BCConstants.FLYTIME+BCConstants.SETTLTIME)*3,0)
    },

    /**
     * @description 设置路单走势
     * @param {开奖的值} _value 
     */
    setLudan(_value){
        var nod = this.Node_ludan
        var js = nod.getChildByName('Scoll_zhulu').getComponent('BCSrollController')
        var zhi = js.setTip(_value)
    },

    /**
     * @description 发牌控制器
     * @returns 返回最大发牌张数
     */
    DelingController(){
        var zhuangPokers = BCConstants.RoomInfo.pokerGroups.zhuang
        var xianPokers = BCConstants.RoomInfo.pokerGroups.xian
        for (let index = 0; index < zhuangPokers.length; index++) {
            var del = cc.delayTime(2.5+3*index)
            var call = cc.callFunc(function(){
                if(index > 0){
                    this.Deling(zhuangPokers[index][0],zhuangPokers[index][1],BCConstants.DelingPlace.right,zhuangPokers[index])    
                }else{
                    this.Deling(zhuangPokers[index][0],zhuangPokers[index][1],BCConstants.DelingPlace.right)
                }
                
                if(index == 2){
                    var movb = cc.moveBy(0.5,cc.p(-30,0))
                    var del = cc.delayTime(13)
                    var movb2 = cc.moveBy(0.1,cc.p(30,0))
                    this.Layout_rightplace.node.runAction(cc.sequence(movb,del,movb2))
                }
            },this)
            this.node.runAction(cc.sequence(del,call))
        }

        for (let index = 0; index < xianPokers.length; index++) {
            var del = cc.delayTime(1+3*index)
            var call = cc.callFunc(function(){
                if(index > 0){
                    this.Deling(xianPokers[index][0],xianPokers[index][1],BCConstants.DelingPlace.left,xianPokers[index]) 
                }else{
                    this.Deling(xianPokers[index][0],xianPokers[index][1],BCConstants.DelingPlace.left)
                }

                         
                if(index == 2){
                    var movb = cc.moveBy(0.5,cc.p(-30,0))
                    var del = cc.delayTime(13)
                    var movb2 = cc.moveBy(0.1,cc.p(30,0))
                    this.Layout_leftplace.node.runAction(cc.sequence(movb,del,movb2))
                }
            },this)
            this.node.runAction(cc.sequence(del,call))
        }
        if(zhuangPokers.length == 2 && xianPokers.length == 2 ){
            return 7.5 
        }
        return zhuangPokers.length == 3 ? 10.5 : 8.5
    },

    /**
     * @description 发牌
     * @param {点数} value 
     * @param {花色} flo 
     * @param {左右位置} place
     */
    Deling(value,flo,place,isdes){
        // this._audioEngine().PlayEffect('bjl-fapai')
        this._audioMrg.playfapai()
        var pok = cc.instantiate(this.Poker)
        var pokjs = pok.getComponent('BCPoker')
        pokjs.setPoker(value,flo)
        pok.parent = this.Image_table.node
        if(place == BCConstants.DelingPlace.left){
            pokjs.flyTo(this.Layout_leftplace.node,place,isdes)
        }
        else if(place == BCConstants.DelingPlace.right){
            pokjs.flyTo(this.Layout_rightplace.node,place,isdes)
        }
    },

    /**
     * @description 下注控制器
     * @param {桌子名称} _table 
     * @param {下注数量} _value 
     * @param {谁下注}  _who 
     */
    betControl(_table,_value,_who){
        // this._audioEngine().PlayEffect('bjl_chouma_xz')
        this._audioMrg.playbet()
        this.othersBet(this.getRandomSpace(_table),BCConstants.FLYTIME,_value,this.Node_betplaces[BCConstants.TableNumber[_table]],_who,BCConstants.TableNumber[_table])
        this.countBetLabel(BCConstants.TableNumber[_table],_value)
        if(_who == BCConstants.betByWho.self){
            this.countSelfBetLabel(BCConstants.TableNumber[_table],_value)
        }
    },

    /**
     * @description 清0下注label
     */
    cleanLabels(){
        for (let index = 0; index < this.Node_labels.length-1; index++) {
            this.Node_labels[index].getChildByName('Label_all').getComponent(cc.Label).string = '0.00';
            this.Node_labels[index].getChildByName('Label_self').getComponent(cc.Label).string = '0.00';
        }
        this.Node_labels[8].getChildByName('Label_zxz').getComponent(cc.Label).string = '0.00'

        BCConstants._BetValues = [0,0,0,0,0,0,0,0,0]
        BCConstants._SelfBetValues = [0,0,0,0,0,0,0,0]
    },

    /**
     * @description 下注计数
     * @param {桌子编号} _table 
     * @param {值} _value 
     */
    countBetLabel(_table,_value){
        var labAll = this.Node_labels[_table].getChildByName('Label_self')
        BCConstants._BetValues[_table] += Number(_value)
        labAll.getComponent(cc.Label).string = BCConstants._BetValues[_table].toFixed(2)

        BCConstants._BetValues[8] += Number(_value)
        this.Node_labels[8].getChildByName('Label_zxz').getComponent(cc.Label).string = BCConstants._BetValues[8].toFixed(2)
    },

    /**
     * @description 自己下注计数
     * @param {桌子编号} _table 
     * @param {值} _value 
     */
    countSelfBetLabel(_table,_value){
        var labself = this.Node_labels[_table].getChildByName('Label_all')
        BCConstants._SelfBetValues[_table] += Number(_value)
        labself.getComponent(cc.Label).string = BCConstants._SelfBetValues[_table].toFixed(2)
    },

    /**
     * @description 获取桌子随机坐标
     * @param {桌子编号}} string  
     */
    getRandomSpace(_table){
        var pos = cc.p(0,0)
        var _pos = cc.p(0,0)
        _pos = BCConstants.WorldPosition[_table]
        pos.x = _pos.x + this.GetRandom(1,BCConstants.BetTableOffsetCoord[_table][0])
        pos.y = _pos.y + this.GetRandom(1,BCConstants.BetTableOffsetCoord[_table][1])
        return pos
    },

    /**
     * @description 取随机数
     * @param {Min}} 最小值
     * @param {Max}} 最大值
     */
    GetRandom:function(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();  
        var num = Min + Math.round(Rand * Range);
        return num;
    },

    /**
     * @description 其他玩家下注
     * @param {_pos} 下注位置
     * @param {_time} 筹码飞行时间
     * @param {_value} 下注的值
     * @param {_target} 更改的父节点
     * @param {_who} 谁下注
     * @param {_tableNumber} 桌子的编号
     */
    othersBet(_pos,_time,_value,_target,_who,_tableNumber){
        var chip = cc.instantiate(this.Chip)
        var chipjs = chip.getComponent('BCChip')
        if(_who == BCConstants.betByWho.others){
            chip.setPosition(BCConstants.WorldPosition.otherUsers)
            this.chipCalcultor.AddOtherPlayerBetInfo(_value,_tableNumber, chip);
        }
        else if(_who == BCConstants.betByWho.self){
            chip.setPosition(BCConstants.WorldPosition.selfCoin)
            this.chipCalcultor.AddLocalPlayerBetInfo(_value,_tableNumber, chip);
        }
        chipjs.setChip(this.Node_worldspace,_value)
        chipjs.flyTo(_pos,_time,_target,false,0)
    },

    /**
     * @description 仍筹码方法
     * @param {筹码值} _value 
     * @param {初始坐标} _startPos 
     * @param {第一次目的地坐标} _firstPos 
     * @returns 返回筹码节点
     */
    throwBet(_value,_startPos,_firstPos){
        var chip = cc.instantiate(this.Chip)
        var chipjs = chip.getComponent('BCChip')
        chip.setPosition(_startPos)
        chipjs.setChip(this.Node_worldspace,_value)
        chipjs.flyTo(_firstPos,BCConstants.FLYTIME,null,false,0)
        return chip
    },

    /**
     * @description 庄家输的筹码结算
     */
    dealerLoseChips(){
        var selfChips = this.chipCalcultor._m_HostWillPayForLocal
        for (let index = 0; index < selfChips.length; index++) {
            if(selfChips[index].length > 0){
                var flyTime = BCConstants.SETTLTIME/selfChips[index].length
                for (let j = 0; j < selfChips[index].length; j++) {
                    // this._audioEngine().PlayEffect('bjl-chouma_HS_PS')
                    this._audioMrg.playchipFly()
                    var del = cc.delayTime(flyTime*j)
                    var call = cc.callFunc(function(){
                        var tempChip = this.throwBet(selfChips[index][j],BCConstants.WorldPosition.zhuangCoin,this.getRandomSpace(BCConstants.TableArray[index]))
                        this.chipCalcultor.AddLocalPlayerBetInfo(selfChips[index][j],index,tempChip)
                    },this)
                    this.node.runAction(cc.sequence(del,call))
                }
            }  
        }

        var otherChips = this.chipCalcultor._m_HostWillPayForOther
        for (let index = 0; index < otherChips.length; index++) {
            if(otherChips[index].length > 0){
                var flyTime2 = BCConstants.SETTLTIME/otherChips[index].length
                for (let j = 0; j < otherChips[index].length; j++) {
                    // this._audioEngine().PlayEffect('bjl-chouma_HS_PS')
                    this._audioMrg.playchipFly()
                    var del = cc.delayTime(flyTime2*j)
                    var call = cc.callFunc(function(){
                        var tempChip = this.throwBet(otherChips[index][j],BCConstants.WorldPosition.zhuangCoin,this.getRandomSpace(BCConstants.TableArray[index]))
                        this.chipCalcultor.AddOtherPlayerBetInfo(otherChips[index][j],index,tempChip)
                    },this)
                    this.node.runAction(cc.sequence(del,call))
                }
            }  
        }
    },

    /**
     * @description 玩家赢得筹码结算
     */
    playerGetChips(){
        var mineWinChips = this.chipCalcultor._m_LocalPlayerBetInfo;
        var otherWinChips = this.chipCalcultor._m_OtherPlayerBetInfo;
        for (let index = 0; index < mineWinChips.length; index++) {
            var mineTime = BCConstants.SETTLTIME/mineWinChips[index].length
            if(mineWinChips[index].length > 0){
                for (let j = 0; j < mineWinChips[index].length; j++) {
                    this._audioMrg.playchipFly()
                    // this._audioEngine().PlayEffect('bjl-chouma_HS_PS')
                    var del = cc.delayTime(mineTime*j)
                    var call = cc.callFunc(function(){
                        var pos = mineWinChips[index][j].ChipNode.parent.convertToNodeSpaceAR(BCConstants.WorldPosition.selfCoin)
                        var js = mineWinChips[index][j].ChipNode.getComponent('BCChip')
                        js.flyTo(pos,BCConstants.FLYTIME,null,true,0.01)   
                    },this)
                    this.node.runAction(cc.sequence(del,call))
                }
            }      
        }

        for (let index = 0; index < otherWinChips.length; index++) {
            var otherTime = BCConstants.SETTLTIME/otherWinChips[index].length
            if(otherWinChips[index].length > 0){
                for (let j = 0; j < otherWinChips[index].length; j++) {
                    // this._audioEngine().PlayEffect('bjl-chouma_HS_PS')
                    this._audioMrg.playchipFly()
                    var del = cc.delayTime(otherTime*j)
                    var call = cc.callFunc(function(){
                        var pos = otherWinChips[index][j].ChipNode.parent.convertToNodeSpaceAR(BCConstants.WorldPosition.otherUsers)
                        var js = otherWinChips[index][j].ChipNode.getComponent('BCChip')
                        js.flyTo(pos,BCConstants.FLYTIME,null,true,0.01)        
                    },this)
                    this.node.runAction(cc.sequence(del,call))
                }
            }      
        }
    },
    /**
     * @description 获取世界坐标
     */
    getWorldPlace(){
        var index = 0;
        BCConstants.WorldPosition.otherUsers = this.Node_worldspace.convertToNodeSpace(this.Btn_other.node.convertToWorldSpace(cc.p(30,30)))
        BCConstants.WorldPosition.selfCoin = this.Node_worldspace.convertToNodeSpace(cc.find('Canvas/Node_bottom/Node_userinfo/Image_gold').convertToWorldSpace(cc.p(30,30)))
        BCConstants.WorldPosition.zhuangCoin = this.Image_zhuangGold.node.convertToWorldSpaceAR(cc.p(0,0))
        
        for(var key in BCConstants.WorldPosition){
            if(index == 8){
                break
            }
            var pos = this.Node_betplaces[index].convertToWorldSpace(cc.p(0,0));
            BCConstants.WorldPosition[key] = this.Node_worldspace.convertToNodeSpaceAR(pos)
            index++
        }

        this.setPokerPlaceToWorld()
        this.setPokerEffectToWorld()
    },

    /**
     * @description 设置发牌位置到世界坐标节点
     */
    setPokerPlaceToWorld(){
        this.Layout_rightplace.node.setPosition(this.Layout_rightplace.node.convertToWorldSpaceAR(cc.p(0,0)))
        this.Layout_leftplace.node.setPosition(this.Layout_leftplace.node.convertToWorldSpaceAR(cc.p(0,0)))
        
        this.Layout_leftplace.node.parent = this.Node_pokerworld
        this.Layout_rightplace.node.parent = this.Node_pokerworld
    },

    /**
     * @description 设置动画节点到世界坐标节点
     */
    setPokerEffectToWorld(){
        this.Node_effectXian.setPosition(this.Node_effectXian.convertToWorldSpaceAR(cc.p(0,0)))
        this.Node_effectZhuang.setPosition(this.Node_effectZhuang.convertToWorldSpaceAR(cc.p(0,0)))
        
        this.Node_effectXian.parent = this.Node_pokerworld
        this.Node_effectZhuang.parent = this.Node_pokerworld
    },

    /**
     * @description 注册桌面按钮点击事件
     */
    registClicks(){
        for (let index = 0; index < this.Image_tables.length; index++) {
            var js = this.Image_tables[index].node.getComponent('CustomCompoent')
            js.onClick(this.onBetTableClicks.bind(this),index)     
        }
    },

    /**
     * @description 桌子点击回调函数
     * @param {桌子编号} _event 
     */
    onBetTableClicks(_event){
        cc.log('===========当前筹码数量=========',BCConstants._currentBetValue)
        if(!BCConstants._currentBetValue || BCConstants._currentBetValue == 0){
            common.ShowTips('没有选择筹码')
            return 
        }
        if(BCConstants._gameStatus != BCConstants.gameStatus.startBet){
            common.ShowTips('没有到下注时间')
            return 
        }
        var temp = {
            roomNum:BCConstants.RoomInfo.tableNum,
            gameCode:BCConstants.RoomInfo.gameCode,
            chipInAmount:[{chipPoolIndex:_event,chipValue:BCConstants._currentBetValue}],
        }
        this.control.chipIn(temp,function(_data){//玩家下注回调
            if(_data.status == 1){
                var data = _data.msg.chipInAmount
                for (let index = 0; index < data.length; index++) {
                    this.ReBet.recordChip(BCConstants.TableArray[data[index].chipPoolIndex],data[index].chipValue) //记录下注内容
                    this.betControl(BCConstants.TableArray[data[index].chipPoolIndex],data[index].chipValue,BCConstants.betByWho.self)
                    this.ChipController.DisableRebetBtn(true)
                    common.playerData.setCoin(Number(_data.msg.coin).toFixed(2))
                }
            }else{
                common.ShowTips(_data.msg)
            }
        }.bind(this))
    },

    /**
     * @description 筹码选择点击回调
     * @param {点击的位置}} _event 
     */
    onChoiceChipClicks(_event){
        BCConstants._currentBetValue = _event
    },

    /**
     * @description 结算庄家
     */
    settlZhuang(){
        var hostWinChips = this.chipCalcultor._m_HostWin;
        for (let index = 0; index < hostWinChips.length; index++) {
            this.flySignal(hostWinChips[index],BCConstants.WorldPosition.zhuangCoin)
        }
    },

    /**
     * @description 筹码结算计算
     */
    settlCalculatorChips(){  
         //初始化筹码输赢算法
         this.chipCalcultor.Init(BCConstants.chipsValueArray, BCConstants.oddArray);
         this.chipCalcultor.ResetData()
    },

    /**
     * 
     * @param {单个下注桌节点} _nodearry 
     * @param {目的地坐标} _place 
     */
    flySignal(_chipArray,_place){
        for (let index = 0; index < _chipArray.length; index++) {
            // this._audioEngine().PlayEffect('bjl-chouma_HS_PS')
            this._audioMrg.playchipFly()
            var del = cc.delayTime(index*BCConstants.SETTLTIME/_chipArray.length)
            var call = cc.callFunc(function(){
                var js = _chipArray[index].ChipNode.getComponent('BCChip')
                var pos = _chipArray[index].ChipNode.parent.convertToNodeSpaceAR(_place)
                js.flyTo(pos,BCConstants.FLYTIME,null,true,0.01)
            },this)
            this.node.runAction(cc.sequence(del,call))
        }
    },

    /**
     * @description 销毁子节点
     */
    cleanChildren(){
        for (let index = 0; index < this.Node_betplaces.length; index++) {
            var arr = this.Node_betplaces[index]
            for (let i = 0; i < arr.length; i++) {
                arr[i].node.destroy()
            }
        }
    },

    /**
     * @description 设置定时器
     */
    setTimer(_seconds){
        var timer_js = this.Node_timer.getComponent('TimerController')
        timer_js.startTimer(_seconds)
    },

    /**
     * @description 根据牌的类型种类闪耀桌面
     * @param {牌类型表} _typeArray 
     */
    blinkTables(){
        // var _typeArray = this.node.getComponent('CardTypeCalculation').getCardTypeArray()
        // BCConstants.CardTypeArrray = _typeArray
        var _typeArray = BCConstants.CardTypeArrray
        cc.log('======开奖结果广播=======',_typeArray)
        for(var key in _typeArray){
            if(_typeArray[key]){
                this.preTableAnimation(BCConstants.TableNumber[key])
            }
        }

        for (const key in BCConstants.TableNumber) {
            if (_typeArray[key]) {
                BCConstants._winnerArray[BCConstants.TableNumber[key]] = 1       
            }
            else{
                BCConstants._winnerArray[BCConstants.TableNumber[key]] = 0
            }
        }

        var a = this.node.getComponent('SettleCalculator')
        a.UserResult()
    },

    /**
     * @description 单个桌面闪耀方法
     * @param {桌子number}} _tableName 
     */
    preTableAnimation(_tableName){
        var fadi = cc.fadeIn(0.001)
        var del = cc.delayTime(0.4)
        var fado = cc.fadeOut(0.001)
        var del2 = cc.delayTime(0.4)
        var fadi2 = cc.fadeIn(0.001)
        this.Image_tables[_tableName].node.runAction(cc.repeat(cc.sequence(fadi,del,fado,del2,fadi2),5))
    },

    /**
     * @description 清空桌面闪耀动画
     */
    cleanTablesAnimation(){
        for (let index = 0; index < this.Image_tables.length; index++) {
            this.Image_tables[index].node.runAction(cc.fadeOut(0.001))
        }
    },

    /**
     * 
     * @param {隐藏显示上下庄按钮} _index 0 上庄，1，下庄 2,离开队列
     */
    hideOrShowIsDealer(_index){
        for (let index = 0; index < this.Btn_dealer.length; index++) {
            this.Btn_dealer[index].node.active = false;
        }
        this.Btn_dealer[_index].node.active = true
    },

    /**
     * @description 开奖动画
     */
    effectLottery(){
        var m_zhuang = BCConstants.ZhuangValue
        var m_xian = BCConstants.XianValue
        this.Node_effectZhuang.getChildByName('Image_bg').active = true
        this.Node_effectXian.getChildByName('Image_bg').active = true
        
        if(!BCConstants.CardTypeArrray.zhuangTianWang){
            var lab_normal = this.Node_effectZhuang.getChildByName('Label_normal')
            lab_normal.active = true
            lab_normal.getComponent(cc.Label).string = String(m_zhuang) + '点'
        }else{
            var lab_tianwang = this.Node_effectZhuang.getChildByName('Label_tianwang')
            lab_tianwang.active = true
            lab_tianwang.getComponent(cc.Label).string = String(m_zhuang) + '点'
            this.Node_effectZhuang.getChildByName('Label_type').active = true
        }

        if(!BCConstants.CardTypeArrray.xianTianWang){
            var lab_normal = this.Node_effectXian.getChildByName('Label_normal')
            lab_normal.active = true
            lab_normal.getComponent(cc.Label).string = String(m_xian) + '点'
        }else{
            var lab_tianwang = this.Node_effectXian.getChildByName('Label_tianwang')
            lab_tianwang.active = true
            lab_tianwang.getComponent(cc.Label).string = String(m_xian) + '点'
            this.Node_effectXian.getChildByName('Label_type').active = true
        }

        if(m_zhuang > m_xian){
            BCEffects.effectWin(this.Node_effectZhuang.getChildByName('Effect_Win'),this)
        }
        else if(m_zhuang < m_xian){
            BCEffects.effectWin(this.Node_effectXian.getChildByName('Effect_Win'),this)
        }
        else{
            this.Node_effectZhuang.getChildByName('Label_ping').active = true
            this.Node_effectXian.getChildByName('Label_ping').active = true
        }
    },

    /**
     * @description 设置筹码按钮是否可用
     */
    ChipsIsEnable(_data){
        var ChipsChildren = this.Node_chipController.getChildByName('ChipsArea').children
        for (let index = 0; index < ChipsChildren.length; index++) {
            var chip_js = ChipsChildren[index].getComponent('SingleChip')
            var m_ChipAmount = chip_js.GetChipAmount()
            if(_data < m_ChipAmount){
                chip_js.Disable(true)
            }else{
                chip_js.Disable(false)
            }
        }
    },


    
    // update (dt) {},
});
