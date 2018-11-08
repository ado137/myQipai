
let hh_data = require('hh_data');
let hh_net = require('hh_net');
var SecondLayer = require("SecondLayer");
cc.Class({
    extends: SecondLayer,

    properties: 
    {
        roomElemPrefab : cc.Prefab,
        roomContent : cc.Node,
    },

    __preload() {
        hh_data.init()
        hh_net.registAll()
    },

    onLoad()
    {
        this._super();
        this.node.getChildByName('_labelMyName').getComponent(cc.Label).string = common.playerData.nickName
        this.node.getChildByName('_labelMyGold').getComponent(cc.Label).string = hh_data.formatGold(common.playerData.getCoin())
    },

    onDestroy()
    {
        if(!CC_EDITOR){
            hh_data.updateRoomListAllDataNotify.addListener(this.onUpdateRoomListAllDataRefresh , this);
        }
        hh_data.destroy()
        hh_net.unRegAll()
        this._super();
    },

    start()
    {
        this._super();
        if(!CC_EDITOR){
            hh_data.updateRoomListAllDataNotify.addListener(this.onUpdateRoomListAllDataRefresh , this);
        }
    },

    onUpdateRoomListAllDataRefresh(data){
        let elem = cc.instantiate(this.roomElemPrefab);
        elem.parent = this.roomContent;
        elem.getComponent('hh_roomElem').roomId = data.roomId
        elem.getComponent('hh_roomElem').delayRefreshAllData(data)
    },

    BaseListMsg(_data)//当房间列表消息回来 会自动跑到这里来
    {
        hh_net.onROOMLIST_GET(_data)
    },

    OnExit(_Event)
    {
        this.BaseExit();  //退出二级界面请调用基类方法BaseExit
    },

});

