var common = require('Common');
//var hh_net = require('hh_net');



/**
 * @description 红黑网络数据接收器
 */
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log('注册网络消息');
        this.websocket = common.api.getWebsocket();
        //注册消息
        this.registAll();
    },

    onDestroy (){
        cc.log('注销网络消息');
        hh_net.unRegAll()
    },

    start () {
        
    },

    /**
     * @description 注册消息
     */
    registAll : function(){
        hh_net.registAll()
    },
});
