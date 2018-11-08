var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
        TipSpace:null,
        SignalLine:null,
        DoubleArrayOfHistory:[],
        lastTip:null,
        ListItem:{
            default:null,
            type:cc.Prefab
        },
    },
                                                   
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initList(BCConstants.m_XllListNumber)
        // this.lastTip = BCConstants.AwordType.zhuang
        this.TipSpace = [0,0]
        this.SignalLine = [0,0,0,0,0,0]
        this.isTurn = false
        this.initArray()
        

    },

    start () {
        // this.schedule(function(){
        //     this.setTip(BCConstants.DaLu.zhuang,this.TipSpace)
        // },2,0)

    },

    /**
     * @description 初始化列表
     * @param {} _number 
     */
    initList(_number){
        var parent = this.getComponent(cc.ScrollView).content
        for (let index = 0; index < _number; index++) {
            var item = cc.instantiate(this.ListItem) 
            item.parent = parent      
        }
    },

    recordTip(_type,_string){

    },

    setTip(_string){
        this.countSpace(_string[1])
        var parent = this.getComponent(cc.ScrollView).content

        var child = parent.children
        var item = child[this.TipSpace[0]] 
        var tips = item.children
        var Tip = tips[this.TipSpace[1]].getChildByName('Tip')
        Tip.active = true
        var frame = Tip.getComponent('MagicSprite')
        switch(_string[0]){
            case BCConstants.DaYanLu.zhuang[0]:
                frame.index = 0
                break
            case BCConstants.DaYanLu.xian[0]:
                frame.index = 1
                break
            case BCConstants.XiaoLu.zhuang[0]:
                frame.index = 2
                break
            case BCConstants.XiaoLu.xian[0]:
                frame.index = 3
                break
            case BCConstants.YueYouLu.zhuang[0]:
                frame.index = 4
                break
            case BCConstants.YueYouLu.xian[0]:
                frame.index = 5
                break  
        }
        this.lastTip = _string[1]

        if(this.TipSpace[0] >= 24){
            this.getComponent(cc.ScrollView).scrollToRight(1);
        }
    },

    initArray(){
        var len = this.getComponent(cc.ScrollView).content.children.length
        for (let index = 0; index < len; index++) {
            var newArray = this.SignalLine.map(item => item);
            this.DoubleArrayOfHistory.push(newArray)   
        }
    },

    countSpace(_type){
        var parent = this.getComponent(cc.ScrollView).content
        if(_type == this.lastTip){
            if(this.TipSpace[1] == 5||this.getArrayNext() != 0){
                this.TipSpace[0]++
                if(this.TipSpace[0] > parent.children.length - 1)
                {  
                    var parent = this.getComponent(cc.ScrollView).content
                    var item = cc.instantiate(this.ListItem) 
                    item.parent = parent
                    var newArray = this.SignalLine.map(item => item);
                    this.DoubleArrayOfHistory.push(newArray) 
                }
                this.setArray(_type)
                this.isTurn = true
                return 
            }
            this.TipSpace[1]++
        }else{
            this.TipSpace[0] = this.getFirstLine()
            this.TipSpace[1] = 0
            if(this.TipSpace[0] > parent.children.length - 1)
            {  
                var parent = this.getComponent(cc.ScrollView).content
                var item = cc.instantiate(this.ListItem) 
                item.parent = parent
                var newArray = this.SignalLine.map(item => item);
                this.DoubleArrayOfHistory.push(newArray) 
            }
        }
        this.setArray(_type)
    },

    setArray(_type){
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = _type
    },

    getArrayNext(){
        return this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1] + 1]
        
    },

    getFirstLine(){
        for (let index = 0; index < this.DoubleArrayOfHistory.length; index++) {
            if(this.DoubleArrayOfHistory[index][0] == 0){
                return index
            }   
        }
        return this.DoubleArrayOfHistory.length
    }


    // update (dt) {},
});
