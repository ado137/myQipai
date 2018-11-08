
cc.Class({
    extends: cc.Component,

    properties: {
        ZhuangPlace:{
            default:null,
            type:cc.Node
        },
        XianPlace:{
            default:null,
            type:cc.Node
        },

        CardTypeArrray:[]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },

    /**
     * @description 获取牌型最终点数
     * @param {庄闲节点} _target}
     */
    getCount(_target){
        var PokerArray = _target.children
        var m_PokerTotalValue = 0
        for (let index = 0; index < PokerArray.length; index++) {
            var Poker_js = PokerArray[index].getComponent('BCPoker')
            if(Poker_js.getPoker() >= 10){
                continue
            }
            m_PokerTotalValue += Poker_js.getPoker()
        }  
        return m_PokerTotalValue%10
    },

    /**
     * @description 是否有对
     * @param {庄闲节点}} _target 
     */
    getCardPairType(_target){
        var PokerArray = _target.children
        if(PokerArray[0].getComponent('BCPoker').getPoker() == PokerArray[1].getComponent('BCPoker').getPoker()){
            return true
        }
        return false
    },

    isTongdianping(){
        var zhuangArray = this.ZhuangPlace.children
        var xianArray = this.XianPlace.children
        if(zhuangArray.length != xianArray.length){
            return false
        }
        for(var i=0;i<zhuangArray.length;i++){
            if(zhuangArray[i].getComponent('BCPoker').getPoker() != xianArray[i].getComponent('BCPoker').getPoker()){
                return false
            }
        }
        return true
    },

    getZhuangValue(){
        return this.getCount(this.ZhuangPlace)
    },

    getXianValue(){
        return this.getCount(this.XianPlace)
    },

    /**
     * @description 获取牌型的所有种类
     */
    getCardTypeArray(){
        this.CardTypeArrray = {
            zhuang:null,
            zhuangTianWang:null,
            tongDianPing:null,
            xianTianWang:null,
            xian:null,
            xianDuiZi:null,
            zhuangDuiZi:null,
            ping:null,
        }
        if(this.getCount(this.XianPlace) > this.getCount(this.ZhuangPlace)){
            this.CardTypeArrray.xian = true
        }
        else if(this.getCount(this.XianPlace) < this.getCount(this.ZhuangPlace)){
            this.CardTypeArrray.zhuang = true
        }
        if(this.getCount(this.ZhuangPlace) >= 8){
            this.CardTypeArrray.zhuangTianWang = true
        }
        if(this.getCount(this.XianPlace) >= 8){
            this.CardTypeArrray.xianTianWang = true
        }
        if(this.getCardPairType(this.ZhuangPlace)){
            this.CardTypeArrray.zhuangDuiZi = true
        }
        if(this.getCardPairType(this.XianPlace)){
            this.CardTypeArrray.xianDuiZi = true
        }
        if(this.getCount(this.ZhuangPlace) == this.getCount(this.XianPlace)){
            this.CardTypeArrray.ping = true
        }
        if(this.isTongdianping()){
            this.CardTypeArrray.tongDianPing = true
        }
        return this.CardTypeArrray
    }

    // update (dt) {},
});
