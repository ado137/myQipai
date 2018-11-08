var control = require('BCController')
var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
        _PokerValue:null,
        PokerSpine:{
            default:null,
            type:cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    // /**
    //  * 
    //  * @param {点数} _value 
    //  * @param {花色} _flo 
    //  */
    // setPoker(_value,_flo){
    //     _value++
    //     this._PokerValue = _value
    //     var up = this.node.getChildByName('Image_bg').getChildByName('up').getComponent('MagicSprite');
    //     var up_flo = this.node.getChildByName('Image_bg').getChildByName('flowers').getComponent('MagicSprite');
    //     var down = this.node.getChildByName('Image_bg').getChildByName('down').getComponent('MagicSprite');
    //     var down_flo = this.node.getChildByName('Image_bg').getChildByName('flowers2').getComponent('MagicSprite');
    //     var flo_name = _flo - 1
    //     if(_flo%2 == 0){
    //         var val_name = _value - 1
    //     }else{
    //         var val_name = _value + 12 
    //     }   
    //     up.index = val_name
    //     up_flo.index = flo_name
    //     down.index = val_name
    //     down_flo.index = flo_name
    // },

    setPoker(_value,_flo){
        this._PokerValue = ++_value
        var PokerSprite = this.node.getChildByName('Image_bg').getChildByName('PokerSprite').getComponent('MagicSprite');

        PokerSprite.index = _value + (_flo-1)*13
    },

    /**
     * @description 获取扑克点数
     */
    getPoker(){
        return this._PokerValue
    },

    /**
     * @description 设置背景的显示
     * @param {true 显示背景 false 隐藏背景} state 
     */
    setPokerBack(state){
        if(state){
            var back = this.node.getChildByName('Image_back')
            back.active = true
        }else{
            var back = this.node.getChildByName('Image_back')
            back.active = false
        }
    },

    /**
     * @description 扑克飞行动作
     * @param {执行作用完成后加入的父节点}} parent 
     * @param {1 左边 2 右边} place
     * @param
     */
    flyTo(parent,place,Anim){
        var ani = this.getComponent(cc.Animation)
        if(Anim){
            ani.on('finished', function(){
                this.node.position = cc.p(50,0)
                var SpineNode = cc.instantiate(this.PokerSpine)
                SpineNode.parent = parent
                var sp_js = SpineNode.getComponent('BCPokerSpine')
                sp_js.startAnimation(Anim)
                this.node.destroy()
            }, this);
        }else{
            ani.on('finished', function(){
                this.node.position = cc.p(50,0)
                this.node.parent = parent
                this.flipTo()
            }, this);    
        }
        if(place == BCConstants.DelingPlace.left){
            ani.play('MoveLeftPoker')
        }
        else if(place == BCConstants.DelingPlace.right){
            ani.play('MoveRightPoker')
        }
    },

    flipTo(){
        var sca = cc.scaleTo(0.2,0,1)
        var call = cc.callFunc(function(){
            this.setPokerBack(false)
        },this)
        var sca2 = cc.scaleTo(0.2,1,1)

        this.node.runAction(cc.sequence(sca,call,sca2))
    },

    delePoker(){
        this.node.destroy()
    },
    

    start () {

    },

    // update (dt) {},
});
