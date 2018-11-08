var BCConstants = require('BCConstants')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    /**
     * @description 设置筹码纹理
     */
    setChip(_parent,_num){
        var chipMgr = this.getComponent('SingleChip');
        chipMgr.InitByChipAmount(_num);
        this.node.parent = _parent
    },

    changeParent(_parent){
        this.node.setPosition(this.pos)
        this.node.parent = _parent
    },

    /**
     * @param {} _pos 
     * @param {*} _time 
     * @param {*} _target 
     * @param 
     */
    flyTo(_pos,_time,_target,_des,_destime){
        this.pos = _pos
        var del = cc.delayTime(_destime)
        var mov = cc.moveTo(_time,_pos)
        var call = cc.callFunc(function(){
            if(_target){
                var pos = _target.convertToNodeSpaceAR(_pos)
                this.node.setPosition(pos)
                this.node.parent = _target
            }
        },this)
        var call2 = cc.callFunc(function(){
            if(_des){
                this.node.destroy()
            }
        },this)
        this.node.runAction(cc.sequence(mov,call,del,call2))
    },

    destroyChip(){
        this.node.destroy()
    }

    // update (dt) {},
});
