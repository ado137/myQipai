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
        //dayanluScoll
        Scoll_dayanlu:{
            default:null,
            type:cc.ScrollView
        },

        //dayanluScoll
        Scoll_xiaolu:{
            default:null,
            type:cc.ScrollView
        },

        //dayanluScoll
        Scoll_yueyoulu:{
            default:null,
            type:cc.ScrollView
        },

        //预测位庄
        Node_ForeZhuang:{
            default:null,
            type:cc.Node
        },

        //预测位闲
        Node_ForeXian:{
            default:null,
            type:cc.Node
        },
        
    },
                                                   
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initList(BCConstants.m_DlListNumber)
        this.TipSpace = [0,0]
        this.SignalLine = [0,0,0,0,0,0]
        this.PreLine = []

        ////////////////////预测记录数据////////////////////////
        this._TipSpace = [0,0]
        this._SignalLine = [0,0,0,0,0,0]
        this._PreLine = []
        this._currentLine = 0
        this._lastTip
        ////////////////////预测记录数据////////////////////////
    
        this.CurrentLine = 0
        this.isline = false

        this.isThroughPoint = false //是否经大眼仔路过基准点
        this.isThroughXiaoluPoint = false
        this.isThroughYueyouluPoint = false
        
        
        this.isTurn = false
        this.initArray()
    },

    start () {
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

    ////////////////////预测记录数据////////////////////////
    coutSp(_type){
        var temp_preline1 = this.PreLine.map(item => item)
        var temp_preline2 = this.PreLine.map(item => item)
        
        if(_type == 1){
            temp_preline1[temp_preline1.length - 1]++ 
            var zhuang = temp_preline1
            temp_preline2[temp_preline2.length] = 1
            var xian = temp_preline2
        }
        else if(_type == 2){
            temp_preline1[temp_preline1.length] = 1 
            var zhuang = temp_preline1
            temp_preline2[temp_preline2.length - 1]++
            var xian = temp_preline2
        }

        var foreValue = []
        foreValue.push(this.judgeWay(zhuang,3)) //第二个参数为与向前第几行比较
        foreValue.push(this.judgeWay(zhuang,4))
        foreValue.push(this.judgeWay(zhuang,5))

        foreValue.push(this.judgeWay(xian,3))
        foreValue.push(this.judgeWay(xian,4))
        foreValue.push(this.judgeWay(xian,5))

        return foreValue
    },

    judgeWay(_arrayLine,_lastLineNum){
        if(_arrayLine[_arrayLine.length - 1] == 1){ //换列
            if(_arrayLine[_arrayLine.length - 2] == _arrayLine[_arrayLine.length - _lastLineNum]){
                return BCConstants.DaYanLu.zhuang
            }else{
                return BCConstants.DaYanLu.xian
            }
        }else{//向下
            if(_arrayLine[_arrayLine.length - 1] <= _arrayLine[_arrayLine.length - _lastLineNum + 1]){
                return BCConstants.DaYanLu.zhuang
            }
            else if(_arrayLine[_arrayLine.length - 1] - _arrayLine[_arrayLine.length - _lastLineNum + 1] == 1){
                return BCConstants.DaYanLu.xian
            }else{
                return BCConstants.DaYanLu.zhuang
            }
        }
        return [0,0]
    },
    

    ////////////////////预测记录数据////////////////////////
    setTip(_string){
        var temp;
        if(!_string[1]){
            this.setHe()
            return
        }else{
            this.countSpace(_string[1])
            temp = _string[1]
        }
        var foreVlaue = this.coutSp(_string[1])
        this.setFore(foreVlaue)
        var parent = this.getComponent(cc.ScrollView).content
    
        this.judgeDayanzai(temp)
        this.judgeXiaolu(temp)
        this.judgeYueyoulu(temp)
        
        var child = parent.children
        var item = child[this.TipSpace[0]] 
        var tips = item.children
        
        var js = tips[this.TipSpace[1]].getComponent('BCTipItemController')
        js.setFrameDalu(_string,this.lastTip)
        this.lastTip = temp
        if(this.TipSpace[0] >= BCConstants.m_DlListNumber ){
            this.getComponent(cc.ScrollView).scrollToRight(1);
        }
        return foreVlaue
    },

    setHe(){
        var parent = this.getComponent(cc.ScrollView).content
        var child = parent.children
        var item = child[this.TipSpace[0]] 
        var tips = item.children
        var js = tips[this.TipSpace[1]].getComponent('BCTipItemController')
        js.setHe()
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
            if(this.isline){
                this.CurrentLine++
            }
            this.isline = true
            this.PreLine[this.CurrentLine] = 0
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
        this.PreLine[this.CurrentLine] += 1
    },

    deleArray(_space){
        this.DoubleArrayOfHistory[this._space[0]][this._space[1]] = 0
        this.PreLine[this.CurrentLine] -= 1
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
    },

    /**
     * @description 大眼仔路走势判断
     * @param {当前庄闲类型}} _type 
     */
    judgeDayanzai(_type){
        if(this.TipSpace[0]>0 && this.TipSpace[1]>0 || this.TipSpace[0]>1 && this.TipSpace[1]>=0 || this.isThroughPoint){
            if(_type != this.lastTip){ //换列
                if(this.PreLine[this.CurrentLine-1] == this.PreLine[this.CurrentLine-2]){
                    this.setDayanluTip(BCConstants.DaYanLu.zhuang)
                    return BCConstants.DaYanLu.zhuang
                }else{
                    this.setDayanluTip(BCConstants.DaYanLu.xian)
                    return BCConstants.DaYanLu.xian
                }

            }else{  //向下
                if(this.PreLine[this.CurrentLine] <= this.PreLine[this.CurrentLine - 1]){
                    this.setDayanluTip(BCConstants.DaYanLu.zhuang)
                    return BCConstants.DaYanLu.zhuang
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 1] == 1){
                    this.setDayanluTip(BCConstants.DaYanLu.xian)
                    return BCConstants.DaYanLu.xian
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 1] >= 2){
                    this.setDayanluTip(BCConstants.DaYanLu.zhuang)
                    return BCConstants.DaYanLu.zhuang
                }
            }

            this.isThroughPoint = true
        }
    },

    judgeXiaolu(_type){
        if(this.TipSpace[0]>1 && this.TipSpace[1]>0 || this.TipSpace[0]>2 && this.TipSpace[1]>=0 || this.isThroughXiaoluPoint){
            if(_type != this.lastTip){ //换列
                if(this.PreLine[this.CurrentLine-1] == this.PreLine[this.CurrentLine-3]){
                    this.setXiaoluTip(BCConstants.XiaoLu.zhuang)
                    return BCConstants.XiaoLu.zhuang
                }else{
                    this.setXiaoluTip(BCConstants.XiaoLu.xian)
                    return BCConstants.XiaoLu.xian
                    cc.log('===================蓝灯========================')
                }
            }else{  //向下
                if(this.PreLine[this.CurrentLine] <= this.PreLine[this.CurrentLine - 2]){
                    this.setXiaoluTip(BCConstants.XiaoLu.zhuang)
                    return BCConstants.XiaoLu.zhuang
                    cc.log('===================红灯========================')
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 2] == 1){
                    this.setXiaoluTip(BCConstants.XiaoLu.xian)
                    return BCConstants.XiaoLu.xian
                    cc.log('===================蓝灯========================')
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 2] >= 2){
                    this.setXiaoluTip(BCConstants.XiaoLu.zhuang)
                    return BCConstants.XiaoLu.zhuang
                    cc.log('===================红灯========================')
                }
                cc.log('==============向下===============',this.TipSpace[0],this.CurrentLine)
            }
            this.isThroughXiaoluPoint = true
        }
    },

    judgeYueyoulu(_type){
        if(this.TipSpace[0]>2 && this.TipSpace[1]>0 || this.TipSpace[0]>3 && this.TipSpace[1]>=0 || this.isThroughYueyouluPoint){
            if(_type != this.lastTip){ //换列
                if(this.PreLine[this.CurrentLine-1] == this.PreLine[this.CurrentLine-4]){      
                    this.setYueyouluTip(BCConstants.YueYouLu.zhuang)
                    return BCConstants.YueYouLu.zhuang
                    cc.log('===================红灯========================')
                }else{
                    this.setYueyouluTip(BCConstants.YueYouLu.xian)
                    return BCConstants.YueYouLu.xian
                    cc.log('===================蓝灯========================')
                }

            }else{  //向下
                if(this.PreLine[this.CurrentLine] <= this.PreLine[this.CurrentLine - 3]){
                    this.setYueyouluTip(BCConstants.YueYouLu.zhuang)
                    return BCConstants.YueYouLu.zhuang
                    cc.log('===================红灯========================')
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 3] == 1){
                    this.setYueyouluTip(BCConstants.YueYouLu.xian)
                    return BCConstants.YueYouLu.xian
                    cc.log('===================蓝灯========================')
                }
                else if(this.PreLine[this.CurrentLine] - this.PreLine[this.CurrentLine - 3] >= 2){
                    this.setYueyouluTip(BCConstants.YueYouLu.zhuang)
                    return BCConstants.YueYouLu.zhuang
                    cc.log('===================红灯========================')
                }
            }
            this.isThroughYueyouluPoint = true
        }
    },

    /**
     * @description 设置预测值
     * @param {预测值数组}} _stringArray 
     */
    setFore(_stringArray){
        var Framez_dyl = this.Node_ForeZhuang.getChildByName('Image_dayanlu').getComponent('MagicSprite')
        var Framez_xl = this.Node_ForeZhuang.getChildByName('Image_xiaolu').getComponent('MagicSprite')
        var Framez_yyl = this.Node_ForeZhuang.getChildByName('Image_yueyoulu').getComponent('MagicSprite')

        var Framex_dyl = this.Node_ForeXian.getChildByName('Image_dayanlu').getComponent('MagicSprite')
        var Framex_xl = this.Node_ForeXian.getChildByName('Image_xiaolu').getComponent('MagicSprite')
        var Framex_yyl = this.Node_ForeXian.getChildByName('Image_yueyoulu').getComponent('MagicSprite')

        if(_stringArray[0][1] == 1){
            Framez_dyl.index = 0
        }   
        else if(_stringArray[0][1] == 2){
            Framez_dyl.index = 1
        }

        if(_stringArray[1][1] == 1){
            Framez_xl.index = 0
        }   
        else if(_stringArray[1][1] == 2){
            Framez_xl.index = 1
        }


        if(_stringArray[2][1] == 1){
            Framez_yyl.index = 0
        }   
        else if(_stringArray[2][1] == 2){
            Framez_yyl.index = 1
        }

        if(_stringArray[3][1] == 1){
            Framex_dyl.index = 0
        }   
        else if(_stringArray[3][1] == 2){
            Framex_dyl.index = 1
        }

        if(_stringArray[4][1] == 1){
            Framex_xl.index = 0
        }   
        else if(_stringArray[4][1] == 2){
            Framex_xl.index = 1
        }

        if(_stringArray[5][1] == 1){
            Framex_yyl.index = 0
        }   
        else if(_stringArray[5][1] == 2){
            Framex_yyl.index = 1
        }
    },

    setDayanluTip(_string){
        var js = this.Scoll_dayanlu.getComponent('BCSrollXiaoluController')
        js.setTip(_string)
    },

    setXiaoluTip(_string){
        var js = this.Scoll_xiaolu.getComponent('BCSrollXiaoluController')
        js.setTip(_string)
    },
    setYueyouluTip(_string){
        var js = this.Scoll_yueyoulu.getComponent('BCSrollXiaoluController')
        js.setTip(_string)
    }
    
    // update (dt) {},
});
