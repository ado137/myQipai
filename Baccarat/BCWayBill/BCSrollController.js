var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
        TipSpace:null,
        ListItem:{
            default:null,
            type:cc.Prefab
        },

        Scroll_dalu:{
            default:null,
            type:cc.ScrollView
        },

        Node_tipLabels:{
            default:null,
            type:cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.TipSpace = [0,0] 
        this.initList(BCConstants.m_ZlListNumber)
        for (const key in BCConstants._RecordCount) {
            BCConstants._RecordCount[key] = 0
        }
        for (const key in BCConstants.CardTypeArrray) {
            BCConstants.CardTypeArrray[key] = null
        }
        this._RecordCount = {
            zhuang:0,
            xian:0,
            ping:0,
            zhuangDuiZi:0,
            xianDuiZi:0,
        }
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

    setTip(_string){
        // this.setRecordCount()
        this.checkRecordCount(_string[0])
        var parent = this.getComponent(cc.ScrollView).content
        if(this.TipSpace[0] > parent.children.length - 1)
        {  
            var item = cc.instantiate(this.ListItem) 
            item.parent = parent
        }
        var child = parent.children
        var item = child[this.TipSpace[0]] 
        var tips = item.children
        var js = tips[this.TipSpace[1]].getComponent('BCTipItemController')
        js.setFrameZhulu(_string)
        this.count()
        if(this.TipSpace[0] >= 9){
            this.getComponent(cc.ScrollView).scrollToRight(1);
        }
        var currntSet = this.setDaluTip(_string)
        return currntSet
    },

    /**
     * @description 设置开奖记录
     */
    setRecordCount(){
        for (var key in BCConstants.CardTypeArrray) {
            if(BCConstants.CardTypeArrray[key]){
                if(key == 'zhuangTianWang' || key == 'tongDianPing' || key == 'xianTianWang'){
                    continue
                }
                this.setRecordCountSignal(key)
            }
        }
    },

    checkRecordCount(_string){
        cc.log('============checkRecordCount=基数字符串================',this._RecordCount)
        
        var pat = new RegExp("_")
        var pat_z = new RegExp("zhuang_")
        var pat_x = new RegExp('xian_')
        var pat_p = new RegExp('ping_')
        var pat_zd = new RegExp('_zhuangdui')
        var pat_xd = new RegExp('_xiandui')
        var pat_sd = new RegExp('_shuangdui')
        
        if(!pat.test(_string)){
            this._RecordCount[_string]++
        }else{
            if(pat_z.test(_string)){
                this._RecordCount.zhuang++
            }  
            if(pat_x.test(_string)){
                this._RecordCount.xian++
            } 
            if(pat_p.test(_string)){
                this._RecordCount.ping++
            } 
            if(pat_zd.test(_string)){
                this._RecordCount.zhuangDuiZi++
            } 
            if(pat_xd.test(_string)){
                this._RecordCount.xianDuiZi++
            } 
            if(pat_sd.test(_string)){
                this._RecordCount.zhuangDuiZi++
                this._RecordCount.xianDuiZi++
            } 
        }
        this.refreshRecord()
    },

    refreshRecord(){
        for (const key in this._RecordCount) {
            if(key != 'undefined'){
                this.Node_tipLabels.getChildByName(key).getComponent(cc.Label).string = this._RecordCount[key]                
            }
        }
    },


    /**
     * @description 初始化历史记录
     */
    initRecordCount(){
        for (const key in BCConstants._RecordCount) {
            this.Node_tipLabels.getChildByName(key).getComponent(cc.Label).string = BCConstants._RecordCount[key]
        }
    },

    onDestroy(){
    },

    setRecordCountSignal(_string){
        BCConstants._RecordCount[_string]++
        cc.log('==========设置记录计数单个==========',_string,BCConstants._RecordCount[_string])
        this.Node_tipLabels.getChildByName(_string).getComponent(cc.Label).string = BCConstants._RecordCount[_string]
    },

    test(){
        var parent = this.getComponent(cc.ScrollView).content
        var item = cc.instantiate(this.ListItem) 
        item.parent = parent
    },

    count(){
        if(this.TipSpace[1] == 5){
            this.TipSpace[0]++;
            this.TipSpace[1] = 0;
        }else{
            this.TipSpace[1]++
        }
    },

    setDaluTip(_string){
        var str = _string
        var temp = []
        temp[0] = 'dl_' + str[0]
        temp[1] = str[1]
        var js = this.Scroll_dalu.getComponent('BCSrollDaluController')
        var b = js.setTip(temp)   
        return b
    }

    // update (dt) {},
});
