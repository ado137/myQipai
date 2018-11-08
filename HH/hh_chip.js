// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let hh_const = require('hh_const');
let hh_data = require('hh_data');
let Thor = require('Thor');
cc.Class({
    extends: Thor,
    editor: {
        executeInEditMode: false,
    },
    properties: {
        score:{
            default: 1,
            notify: function(oldValue){
                CC_EDITOR || this.getComponent("SingleChip").InitByChipAmount(this.score)
            },
            type: cc.Integer
        },

        isGray:{
            default:false,
            notify: function(oldValue){
                CC_EDITOR || this.getComponent("SingleChip").Disable(this.isGray)
            },
            type: cc.Boolean
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setTouchEnable(enable) {
        this.getComponent(cc.Button).enabled = enable;
    },

    /**
     * @description 飞筹码
     * @param endPos 结束位置(父节点坐标系)
     * @param isDestroy 完成后是否删除
     * @param flyTime 飞行时间
     */        
    fly(endPos , isDestroy , flyTime){
        flyTime = flyTime || hh_const.FLY_CHIP_TIME;
        var action = cc.moveTo(flyTime, endPos);
        //var easing = cc.easeCircleActionOut();
        //action.easing(easing);

        var callBack = cc.callFunc(function(){
            if(isDestroy){
                if(hh_data.chipPool){
                    hh_data.chipPool.put(this.node)
                }
                else{
                    this.node.destroy()    
                }
            }
        }, this);

        this.node.stopAllActions()
        this.node.runAction(cc.sequence(action, callBack));
    }

    // update (dt) {},
});
