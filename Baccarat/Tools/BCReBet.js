var BCConstants = require('BCConstants')
//续投功能
var common = require('Common')
cc.Class({
    extends: cc.Component,

    properties: {
        _ChipBetRecordArray:{
            default:[]
        },
        Node_ChipController:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //获取视图控制脚本
        this.ViewController = this.node.getComponent('BCViewController')

        //获取筹码控制脚本
        this.ChipController = this.Node_ChipController.getComponent('ChipController')
        
        //是否是新的一局
        this._isNewAround = false

        this.control = this.node.getComponent('BCController')
    },

    start () {
    },

    recordChip(_ChipTableIndex,_ChipValue){
        this._isReBet = true
        if(this._isNewAround){
            this.cleanChip()
            this.setAroundStatus(false)
        }
        var temp = []
        temp.push(_ChipTableIndex)
        temp.push(_ChipValue)
        this._ChipBetRecordArray.push(temp)
    },

    cleanChip(){
        this._ChipBetRecordArray = []
    },

    /**
     * @description 设置回合状态，判断续投按钮是否可用
     * @param {} _status 
     */
    setAroundStatus(_status){
        if(_status){
            this._isReBet = false
        }

        this._isNewAround = _status
        if(!this._ChipBetRecordArray.length || !_status){
            this.ChipController.DisableRebetBtn(true)
        }
        else if(_status || this._ChipBetRecordArray.length != 0 ){
            this.ChipController.DisableRebetBtn(false)
        }
    },

    setRecord(){
        if(!this._isReBet){
            this.cleanChip()
        }
    },

    reBet(){
        this._isReBet = true
        if(!this._ChipBetRecordArray.length){
            common.ShowTips('您没有下注记录')
            return 
        }
        var temp = {
            roomNum:BCConstants.RoomInfo.tableNum,
            gameCode:BCConstants.RoomInfo.gameCode,
            chipInAmount:[],
        }

        for (let index = 0; index < this._ChipBetRecordArray.length; index++) {
            let _temp = {
                chipPoolIndex:BCConstants.TableNumber[this._ChipBetRecordArray[index][0]],
                chipValue:this._ChipBetRecordArray[index][1],
            }
            temp.chipInAmount.push(_temp)
        }

        this.control.chipIn(temp,function(_data){
            if(_data.status == 1){
                var data = _data.msg.chipInAmount
                for (let index = 0; index < data.length; index++) {
                    this.ViewController.betControl(BCConstants.TableArray[data[index].chipPoolIndex],data[index].chipValue,BCConstants.betByWho.self)
                    common.playerData.setCoin(Number(_data.msg.coin).toFixed(2))
                }
            }else{
                common.ShowTips(_data.msg)
            }
        }.bind(this))
        this.cleanChip()
    }

    // update (dt) {},
});
