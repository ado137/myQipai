

cc.Class({
    extends: cc.Component,

    properties: {
        FlowerSpine:{
            default:null,
            type:cc.Node
        },
        QueenSpine:{
            default:null,
            type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {

    },

    startAnimation(_nameString){
        var spine = this.node.getComponent('sp.Skeleton')
        var pokerName = ''
        var flowerName = ''
        if(_nameString[1]%2 == 0){
            pokerName = String(_nameString[0])+ 'r'
        }else{
            pokerName = String(_nameString[0])+ 'b'
        }
        flowerName = 'flower' + String(_nameString[1])
        spine.setSkin(pokerName)
        spine.setAnimation(0,'animation',false)

        this.startFlower(flowerName)
        this.startQueen(_nameString)
    },

    startFlower(_string){
        var spine = this.FlowerSpine.getComponent('sp.Skeleton')
        spine.setSkin(_string)
        spine.setAnimation(0,'animation',false)
    },

    startQueen(_nameString){
        if(_nameString[0] < 10){
            return 
        }
        var spine = this.QueenSpine.getComponent('sp.Skeleton')
        var spineName = String(_nameString[1]) + '-' + String(++_nameString[0]) 
        cc.log('==========显示特殊牌型动画=============',spineName)
        spine.setSkin(spineName) 
        spine.setAnimation(0,'animation',false)
    }

    // update (dt) {},
});
