var gameConstants = require('Constants')
var BCConstants = require('BCConstants')
var GamesBaseLayer = require('GamesBaseLayer')
var common = require('Common')
var BC_data = require('BC_data')
cc.Class({
    extends: GamesBaseLayer,

    properties: {
        Node_ChipController:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    __preload(){
        this._super()
        BC_data.initData()
    },
      
    // onLoad () {

    // },

    // start () {
    //     // //初始化房间信息
    //     // this.schedule(function(){
    //     //     this.ViewController.initRommInfo()
    //     // },1,0)
    // },

    //需要子类覆�正常进入游戏
    InitWithNormalEnter(_Msg)
    {
            this.InitAll(_Msg);
    },
    //需要子类覆�断线重连进入游戏
    InitWithReconnect(_Msg)
    {
            this.InitAll(_Msg);
    },

    InitAll(_Msg){
        //获取界面控制脚本
        this.ViewController = this.node.getComponent('BCViewController')

        //获取交互脚本
        this.Controller = this.node.getComponent('BCController')

        //获取筹码控制脚本
        this.ChipController = this.Node_ChipController.getComponent('ChipController')
        this.ViewController.initRommInfo(_Msg);

    },

    /**
     * @description 当前玩家申请上庄按钮回调
     */
    onBecomeBanker(_event){
        this.Controller.becomeBanker(BCConstants.RoomInfo.tableNum,function(_data){
            if(_data.status == 1){
                // common.ShowTips('加入上庄队列')
                this.ViewController.hideOrShowIsDealer(2)
                BCConstants._dealerStatus = BCConstants.dealerStatus.InTheLine

            }else{
                common.ShowTips(_data.msg)
            }
        })
    },

    /**
     * @description 当前玩家申请下庄按钮
     * @param {*} _event 
     */
    onLeaveBanker(_event){
        this.Controller.unBanker(BCConstants.RoomInfo.tableNum,function(_data){
            if(_data.status == 1){
                // common.ShowTips(_data.msg)
                this.ViewController.hideOrShowIsDealer(0)
                BCConstants._dealerStatus = BCConstants.dealerStatus.Normal
            }else{
                common.ShowTips(_data.msg)
            }
        })
    },

    /**
     * @description 当前玩家退出队列按钮
     * @param {*} _event 
     */
    onLeaveBankerLine(_event){
        this.Controller.unBanker(BCConstants.RoomInfo.tableNum,function(_data){
            if(_data.status == 1){
                common.ShowTips('离开排庄队列')
                this.ViewController.hideOrShowIsDealer(0)
                BCConstants._dealerStatus = BCConstants.dealerStatus.Normal
            }else{
                common.ShowTips(_data.msg)
            }
        })
    },

    onReBetClick(_event){
        var ReBetController = this.node.getComponent('BCReBet')
        //续投
        ReBetController.reBet()
        //设置续投按钮不可用
        this.ChipController.DisableRebetBtn(true)
    },

    onExit(_event){
        this.Controller.leave(null,function(_data){
            if(_data.status == '1'){
                this.BaseExcutiveExitGame();
            
            }else{
                common.ShowTips(_data.msg)
            }
        }.bind(this))
    }




    // update (dt) {},
});
