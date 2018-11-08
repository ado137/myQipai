var BC_data = require('BC_data')

cc.Class({
    extends: cc.Component,

properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        BC_data.gameStatusNotify.addListener(this.onGameStatus,this)
        BC_data.dealerInfoNotify.addListener(this.onDealerInfo,this)
        BC_data.roomInfoNotify.addListener(this,)
    },

    start () {

    },

    onDestroy(){

    },
    onGameStatus(_data){
        cc.log('=========游戏状态改变============',_data)
    },

    onDealerInfo(_data){
        
    },

    onRoomInfo(_data){
        cc.log('房间信息',_data)
    }


    // update (dt) {},
});
