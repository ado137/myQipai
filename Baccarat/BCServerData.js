var common = require('Common');
var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.controller = this.node.getComponent('BCController');
        this.websocket = common.api.getWebsocket();

        this.registAll()
    },

    start () {

    },

    onDestroy (){
        //注销消息
        for(var key in BCConstants.MsgType){
            this.websocket.unreg(BCConstants.MsgType[key]);
        }
    },

    /**
     * @description 注册消息
     */
    registAll : function(){
        this.websocket.reg(BCConstants.MsgType.EnterRoom, this.controller.onEnterRoom, this.controller);
        this.websocket.reg(BCConstants.MsgType.OtherPlayersEnter, this.controller.onOtherPlayersEnter, this.controller);
        this.websocket.reg(BCConstants.MsgType.BecomeBanker, this.controller.onBecomeBanker, this.controller);
        this.websocket.reg(BCConstants.MsgType.OtherApplyBanker, this.controller.onOtherApplyBanker, this.controller);
        this.websocket.reg(BCConstants.MsgType.UnBanker, this.controller.onUnBanker, this.controller);
        this.websocket.reg(BCConstants.MsgType.OtherUnBanker, this.controller.onOtherUnBanker, this.controller);
        this.websocket.reg(BCConstants.MsgType.ChipIn, this.controller.onChipIn, this.controller);
        this.websocket.reg(BCConstants.MsgType.OtherChipIn, this.controller.onOtherChipIn, this.controller);
        this.websocket.reg(BCConstants.MsgType.StateNotify, this.controller.onStateNotify, this.controller);
        this.websocket.reg(BCConstants.MsgType.AwardResultNotify, this.controller.onAwardResultNotify, this.controller);
        this.websocket.reg(BCConstants.MsgType.OtherLeave, this.controller.onOtherLeave, this.controller);
        this.websocket.reg(BCConstants.MsgType.Leave, this.controller.onLeave, this.controller);
        this.websocket.reg(BCConstants.MsgType.CoinRecord, this.controller.onCoinRecord, this.controller);
    },


    /**
     * @description 发送消息
     */
    invoke : function(msgType, data){
        var msgType = {
            msgType : msgType,
            roomNum : BCConstants.RoomInfo.roomNum
        };

        var args = msgType;
        if(data) args = Object.assign(msgType, data);

        this.websocket.sendMsg(args);
    }

    // update (dt) {},
});
