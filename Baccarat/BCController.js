var BCConstants = require('BCConstants')
var common = require('Common')

cc.Class({
    extends: cc.Component,

    properties: {
        _pokersFrame : null,
        Gamebutton:{
            default:null,
            type:cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        //服务端交互脚本
        this.server = this.node.getComponent('BCServerData')

        //获取界面控制脚本
        this.ViewController = this.node.getComponent('BCViewController')

        //获取计算输赢结果脚本
        this.settleCalculator = this.node.getComponent('SettleCalculator')

        this.paneler = this.Gamebutton.getComponent('GBInterface')

        //获取续投功能脚本
        this.ReBet = this.node.getComponent('BCReBet')

    },

    start () {

    },

     /**
     * @deprecated 动态加载资源
     */
    dynamicLoadResouces : function(){
        //筹码资源
        cc.loader.loadResDir(BCConstants.ResUrl.Chips, cc.SpriteFrame, function(err, frames){
            BCConstants._chipsFrame = {};
            for(let i=0; i<frames.length; i++){
                var key = frames[i]._name;

                BCConstants._chipsFrame[key] = frames[i];

                cc.loader.setAutoRelease(frames[i], true);
            }
        }.bind(this));

        //扑克资源
        cc.loader.loadResDir(BCConstants.ResUrl.Pokers, cc.SpriteFrame, function(err, frames){
            BCConstants._pokersFrame = {};
            for(let i=0; i<frames.length; i++){
                //cc.log('===============loadResDir======================',frames)
                var key = frames[i]._name;

                BCConstants._pokersFrame[key] = frames[i];

                cc.loader.setAutoRelease(frames[i], true);
            }
        }.bind(this));

        //路单资源
        cc.loader.loadResDir(BCConstants.ResUrl.WayBills, cc.SpriteFrame, function(err, frames){
            BCConstants._WayBillFrame = {};
            for(let i=0; i<frames.length; i++){
                //cc.log('===============loadResDir======================',frames)
                var key = frames[i]._name;

                BCConstants._WayBillFrame[key] = frames[i];

                cc.loader.setAutoRelease(frames[i], true);
            }
        }.bind(this));
    },

    /**
     * @description 当前玩家进入房间
     */
    enterRoom : function(data, callback){
        this.enterRoomCallback = callback;
        this.server.invoke(BCConstants.MsgType.EnterRoom, data);
    },

    /**
     * @description 当前玩家进入房间回调
     */
    onEnterRoom(data){
        this.enterRoomCallback(data);
        cc.log('==============当前玩家进入房间回调================')
    },

    /**
     * @description 当前玩家申请上庄 1203
     */
    becomeBanker : function(data, callback){
        this.becomeBankerCallback = callback;
        this.server.invoke(BCConstants.MsgType.BecomeBanker, data);
    },
    
    /**
     * @description 当前玩家申请上庄 1203
     */
    onBecomeBanker(data){
        this.becomeBankerCallback(data);
    },

    /**
     * @description 当前玩家申请下庄
     */
    unBanker : function(data, callback){
        this.unBankerCallback = callback;
        this.server.invoke(BCConstants.MsgType.UnBanker, data);
    },


    /**
     * @description 当前玩家申请下庄 1205
     */
    onUnBanker(data){
        this.unBankerCallback(data);
        if(data.status == require('BFConstants').MsgStatus.SUCCESS){
            this.paneler.removeDealer(window.common.uniqueId);
            this.myDealer = false;
        }
    },

    /**
     * @description 当前玩家下注
     */
    chipIn : function(data, callback){
        this.chipInCallback = callback;
        this.server.invoke(BCConstants.MsgType.ChipIn, data);
    },

    /**
     * @description 当前玩家下注
     */
    onChipIn(data){
        this.chipInCallback(data);
    },

    /**
     * @description 当前玩家退出房间 1212
     */
    leave : function(data, callback){
        this.leaveRoomCallback = callback;
        this.server.invoke(BCConstants.MsgType.Leave, data);
    },

    /**
     * @description 当前玩家离开房间 1212
     */
    onLeave(_data){
        cc.log('=======离开房间1========')
        this.leaveRoomCallback(_data);
        cc.log('=======离开房间2========')
    
    },

    /**
     * @description 其他玩家进入房间 1202
     */
    onOtherPlayersEnter(_data){
        
        var data = _data.msg
        //加入其他玩家列表
        this.ViewController.addOtherList(data.nickName,data.coin,data.portrait,data.uniqueId)
        
    },

    /**
     * @description 其他玩家上庄 1204
     */
    onOtherApplyBanker(_data){
        var data = _data.msg
        //加入上莊列表
        this.ViewController.addDealerList(data.playerName,data.coin,data.portrait,data.uniqueId)
    },

    /**
     * @description 其他玩家下庄
     */
    onOtherUnBanker(data){
        //從上莊列表移除玩家
        this.paneler.removeDealer(data.msg.uniqueId);
    },


    /**
     * @description 其他玩家下注 1208
     */
    onOtherChipIn(data){
        var BCConstants = require('BCConstants');
        if(data.status == 0){
            common.ShowTips(data.msg)
            return 
        }
        var token = data.msg.uniqueId;
        var chipInAmount = data.msg.chipInAmount;
        if(BCConstants._gameStatus == BCConstants.gameStatus.startBet){
            for (let index = 0; index < chipInAmount.length; index++) {
                this.ViewController.betControl(BCConstants.TableArray[chipInAmount[index].chipPoolIndex],chipInAmount[index].chipValue,BCConstants.betByWho.others)
                this.settleCalculator.setUserBetValue(token,chipInAmount[index].chipPoolIndex,chipInAmount[index].chipValue)
            }
        }
    },

    /**
     * @description 游戏状态通知 1209
     */
    onStateNotify(data){
        cc.log('==========游戏状态通知===============',data)
        var BCConstants = require('BCConstants'); 
        if(data.status == 1){
            if(data.msg.state == 0){
                this.ViewController.setDealerInfo(data.msg.dealer.nickName,data.msg.dealer.coin,data.msg.dealer.uniqueId)
                BCConstants.dealTimes = data.msg.dealer.dealTimes
                BCConstants.RoomInfo.gameCode = data.msg.gameCode
                this.ViewController.startToBet()       
            }
            else if(data.msg.state == 0){
                common.ShowTips('停止下注')
                this.ViewController._audioEngine().PlayEffect('bjl-tzxz')
            }
        }
        else{
            common.ShowTips(data.msg)
        }
        
    },

    /**
     * @description 开奖结果广播
     */
    onAwardResultNotify(data){
        var BCConstants = require('BCConstants');
        if(data.status == 1){
            BCConstants.RoomInfo.pokerGroups = data.msg.pokerGroups
            for (const key in BCConstants.CardTypeArrray) {
                if(data.msg.pokerPatterns[key]){
                    BCConstants.CardTypeArrray[key] = true
                }else{
                    BCConstants.CardTypeArrray[key] = null
                }
            }
            BCConstants.ZhuangValue = data.msg.pokerValue.zhuang
            BCConstants.XianValue = data.msg.pokerValue.xian 
            cc.log('======开奖结果广播=======',BCConstants.CardTypeArrray)
            this.ViewController.startToLotter() //开始开奖
            this.ReBet.setRecord()
        }else{
            common.ShowTips(data.msg)
        }
    },

    /**
     * @description 其他玩家离开房间 1211
     */
    onOtherLeave(data){
        //从玩家列表移除玩家
        this.ViewController.removeOtherList(data.msg);
    },

    /**
     * @description 每局金币输赢情况 1213
     */
    onCoinRecord(_data){
        var data = _data.msg
        BCConstants.dealersCoin = data.dealersCoin || 0
        BCConstants.playersCoin = data.playersCoin || {}
        if(data.userCoin[common.uniqueId]){
            var selfCoin = data.userCoin[common.uniqueId]
        }else{
            var selfCoin = 0
        }
        BCConstants.selfCoin = BCConstants.playersCoin[common.uniqueId] - common.playerData.getCoin()
        // BCConstants.selfCoin = Number(selfCoin)
        BCConstants.playerSettlement = Number(data.playerSettlement) - Number(selfCoin)


    },



    // update (dt) {},
});
