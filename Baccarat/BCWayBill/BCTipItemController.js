
var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
        Tip:{
            default:null,
            type:cc.Node
        },
        Zd:{
            default:null,
            type:cc.Sprite
        },
        Xd:{
            default:null,
            type:cc.Sprite
        },
        Lab:{
            default:null,
            type:cc.Label
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.m_CountNum = 0
    },

    start () {

    },

    setHe(){
        this.m_CountNum ++
        this.Lab.string = this.m_CountNum
    },

    setFrameZhulu(_string){
        this.Tip.active = true;
        if(_string[1] == 1){
            this.Tip.getComponent('MagicSprite').index = 0
        }
        else if(_string[1] == 2){
            this.Tip.getComponent('MagicSprite').index = 1
        }
        else{
            this.Tip.getComponent('MagicSprite').index = 2
        }

        switch(_string[0]){
            
            //判断珠路庄
            case BCConstants.ZhuLu.zhuang[0]:
            {
                break
            }
            case BCConstants.ZhuLu.zzd[0]:
            {
                this.Zd.node.active = true
                break
            }
            case BCConstants.ZhuLu.zxd[0]:
            {
                this.Xd.node.active = true
                break
            }
            case BCConstants.ZhuLu.zsd[0]:
            {
                this.Xd.node.active = true
                this.Zd.node.active = true
                break
            }

            //判断珠路闲
            case BCConstants.ZhuLu.xian[0]:
            {
                break
            }
            case BCConstants.ZhuLu.xzd[0]:
            {
                this.Zd.node.active = true
                break
            }
            case BCConstants.ZhuLu.xxd[0]:
            {
                this.Xd.node.active = true
                break
            }
            case BCConstants.ZhuLu.xsd[0]:
            {
                this.Xd.node.active = true
                this.Zd.node.active = true
                break
            }

            //判断珠路平
            case BCConstants.ZhuLu.ping[0]:
            {
                break
            }
            case BCConstants.ZhuLu.pzd[0]:
            {
                this.Zd.node.active = true
                break
            }
            case BCConstants.ZhuLu.pxd[0]:
            {
                this.Xd.node.active = true
                break
            }
            case BCConstants.ZhuLu.psd[0]:
            {
                this.Zd.node.active = true
                this.Xd.node.active = true
                break
            }



        }
    },

    setFrameDalu(_string,_type){
        var ping;
        if(_type == 1){
            ping = BCConstants.DaLu.zhuangping[0]
        }
        else if(_type == 2){
            ping = BCConstants.DaLu.xianping[0]
        }
        else{
            ping = BCConstants.DaLu.zhuangping[0]
        }
        this.Tip.active = true
        switch(_string[0]){
            //判断大路庄
            case BCConstants.DaLu.zhuang[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 3
                break
            }
            case BCConstants.DaLu.zzd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 3
                this.Zd.node.active = true
                break
            }
            case BCConstants.DaLu.zxd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 3
                this.Xd.node.active = true
                break
            }
            case BCConstants.DaLu.zsd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 3
                this.Zd.node.active = true
                this.Xd.node.active = true
                break
            }

            //判断大路闲
            case BCConstants.DaLu.xian[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 4
                break
            }
            case BCConstants.DaLu.xzd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 4
                this.Zd.node.active = true
                break
            }
            case BCConstants.DaLu.xxd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 4
                this.Xd.node.active = true
                break
            }
            case BCConstants.DaLu.xsd[0]:
            {
                this.Tip.getComponent('MagicSprite').index = 4
                this.Zd.node.active = true
                this.Xd.node.active = true
                break
            }

            //判断大路平
            case BCConstants.DaLu.ping[0]:
            {
                this.Tip.spriteFrame = BCConstants._WayBillFrame[ping]
                break
            }
            case BCConstants.DaLu.pzd[0]:
            {
                this.Tip.spriteFrame = BCConstants._WayBillFrame[ping]
                this.Zd.node.active = true
                break
            }
            case BCConstants.DaLu.pxd[0]:
            {
                this.Tip.spriteFrame = BCConstants._WayBillFrame[ping]
                this.Xd.node.active = true
                break
            }
            case BCConstants.DaLu.psd[0]:
            {
                this.Tip.spriteFrame = BCConstants._WayBillFrame[ping]
                this.Zd.node.active = true
                this.Xd.node.active = true
                break
            }
 
        }
    }
    // update (dt) {},
});
