// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let Thor = require('Thor');
cc.Class({
    extends: Thor,
    properties: {
        color : {
            default:0,
            notify: function(oldValue){
                this.setPoker()
            },
        },

        num : {
            default:0,
            notify: function(oldValue){
                this.setPoker()
            },
        },

        _isBack : false,
        isBack : {
            type: cc.Boolean,
            set(value) {
                this._back.active  = value 
                this._isBack = value
            },
    
            get() {
                return this._isBack;
            }
        },

    },

    setPoker(){
        var convertColor = {
            '0' : 3,
            '1' : 2,
            '2' : 1,
            '3' : 0,
        }
        var color = convertColor[this.color]
        cc.log('============扑克牌================',color)
        this._PokerSprite.$MagicSprite.index = this.num + 1 + 13*color
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    /**
     * @description 翻牌
     */
    flip : function(){
        this.isBack = true
        var action1 = cc.scaleTo(0.25, 0.05, 1);
        var render = cc.callFunc(function(){
            this.isBack = false
        }, this);
        var action2 = cc.scaleTo(0.25, 1, 1);
        this.node.runAction(cc.sequence(action1, render, action2));
    },

    // update (dt) {},
});
