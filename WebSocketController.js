var Constants = require('Constants');
var GamesBaseLayer = require('GamesBaseLayer');
var customerUtils = require('customerUtils')
var WontRespondMsg= 
{                    
    BaiRenBenz:         [],    //百人奔驰
    FeiQinZouShou:      [],    //飞禽走兽
    JinCanBuYu:         ["5005",'5002','5004'],    //金蟾捕鱼
    DouDiZhu:           [],    //斗地�
    BaiRenNiuNiu :      [],    //百人牛牛
    HongHeiDaZhan :     [],    //红黑大战
    ErRenDouNiu :       [],    //二人斗牛
    BaiRenBaiJiaLe:     [],    //百人百家�
    NiuNiuQiangZhuang:  [],    //牛牛抢庄拼十
    ErRenMajong:        [],    //二人麻将
    SanZhangPai:        [],    //三张�
    BaiRenDice :        [],    //百人摇一�
    Hall:               ["1009","1015","1030","1031","1032","1041"],    //大厅
    LikuiPaiyu:         ["5105",'5102','5104']
};


var WebSocketController =cc.Class({
    
    extends: cc.Component,

    properties: {
        m_webSocket: {
            default: null
        },


        m_webSocketGame: {
            default: null
        },


        m_CurrentSocket: {
            default: null
        },

        m_agrs :
        {
            default: {}
        },

        //消息超时秒数
        timeOut : 8,
        heartBeatStart : false,
        sendTimer : 0,
        _m_CurrentSendingMsgArray:[],
        _m_IsUpdating:false,
        _m_GameSocketCloseCallback:null,
    },
 
    statics: {
        instance: null,
        _ReLogin:false,
    },

    startHeartBeat(){
        this.heartBeatStart = true;

        var Find = false;
        for(let key in this.m_agrs)
        {
            if(this.m_agrs[key].isSend)
            {
                if(this.m_agrs[key].heartBeat >= this.timeOut) 
                {
                    common.ShowTips('服务器响应超时，消息号['+key+']');
                    //console.log('服务器响应超时，消息号['+key+']');
                    Find = true;
                    break;
                }
                this.m_agrs[key].heartBeat++;
            }
        }

        if(Find)
        {
            window.common.ui.loading.hide();
            this.resetAllMsgStatus();
            this.m_CurrentSocket.close();
        }

        this.scheduleOnce(this.startHeartBeat.bind(this), 1);
    },

    resetAllMsgStatus(){
        for(let key in this.m_agrs){
            this.m_agrs[key].isSend = false;
            this.m_agrs[key].heartBeat = 0;
        }
    },

    sendTimeListener(msgType)
    {
        this._m_CurrentSendingMsgArray.push(msgType);
    },

    update(dt)
    {
        if(this._m_CurrentSendingMsgArray.length)
        {
            if(this.m_CurrentSocket.bufferedAmount == 0)
            {
                var CurrentMsgCode = this._m_CurrentSendingMsgArray[0];
                //cc.log('=====消息发送时长['+CurrentMsgCode+']===='+this.sendTimer);
                this.sendTimer = 0;
                this._m_CurrentSendingMsgArray.shift();
                return;
            }
            this.sendTimer+=dt;
        }
    },

    /**
     * @description websocket初始�
     * @param {*} url [websocket地址]
     */
    init : function(url, open, target, gameIndex)
    {
        console.log("common.getBeNetwork()===" + common.getBeNetwork());
        if(common.getBeNetwork()==false)
        {
            common.ShowTips("请确定手机接入网络");
            this.disconnetToReset();
            return;
        }
        if(this._m_IsUpdating==false)
        {
            cc.director.getScheduler().scheduleUpdate(this, 0, false, this.update);
            this._m_IsUpdating = true;
        }

        //console.log("url ==== " + url);
        if(gameIndex){
            this.m_webSocketGame = new WebSocket(url);
            this.m_webSocketGame.onclose = this.onGameSocketClose.bind(this);
            this.m_webSocketGame.onerror = this.onGameSocketError.bind(this);
            this.m_CurrentSocket = this.m_webSocketGame;
        }   
        else
        {
            this.m_webSocket = new WebSocket(url);
            this.m_webSocket.onclose = this.onHallSocketClose.bind(this);
            this.m_webSocket.onerror = this.onSocketError.bind(this);
            this.m_CurrentSocket = this.m_webSocket;
        }

        this.m_CurrentSocket.binaryType = "arraybuffer";
        this.m_CurrentSocket.onmessage = this.onReciveMsg.bind(this);
        this.m_CurrentSocket.onopen = this.onOpenSocket.bind(this);
        this.onopen = open.bind(target);
    },
    /**
     * @description 注册消息与回调函数在场景初始化的时候，把这个场景相关的通信回调函数都注册一
     * @param {*} _MsgNumber [消息号]
     * @param {*} _callback [回调函数]
     */
    reg : function(_MsgNumber, _callback, _target)  
    {
        if(!_callback){
            return;
        }
        
        if(!this.m_agrs[_MsgNumber]){
            this.m_agrs[_MsgNumber] = {isSend : false, heartBeat :0 , sequence: [{callBack:_callback, target:_target}]};
        }else{
            this.m_agrs[_MsgNumber].sequence.push({callBack:_callback, target:_target});
        }
    },

    /**
     * @方法描述 移除已经注册的回调函数在场景销毁时，把这个场景初始化时注册的通信回调函数函数全部移除
     * @param {*} _MsgNumber [消息号]
     * @param {*} _ByOrder [是否按顺序销毁]
     */
    unreg : function(_MsgNumber, _ByOrder)  
    {
        if(_ByOrder){
            delete this.m_agrs[_MsgNumber];
        }else{
            if(this.m_agrs[_MsgNumber])
            {
                this.m_agrs[_MsgNumber].sequence.shift();
            }
        }
    },

    /**
     * @description 移除已经注册的回调函数在场景销毁时，把这个场景初始化时注册的通信回调函数函数全部移除
     * @param {*} _MsgNumber [消息号]
     */
    clearReg : function()  
    {
        if(!this.m_agrs) return;

        for(var key in this.m_agrs){
            delete this.m_agrs[key];
        }
        this.m_agrs = null;
        this.m_agrs = {};
    },

    /**
     * @description
     */
    closeSocket : function(){

        if(this.m_webSocket)
        {
            this.m_webSocket.close();
        }
        if(this.m_webSocketGame)
        {
            this.m_webSocketGame.close();
        }
    },

    /**
     * @description 向服务器发送发送消�
     * @param {*} _Param [消息内容]
     */
    sendMsg : function(_Param)
    {
        if (!this.m_CurrentSocket) { return; }
        if (this.m_CurrentSocket.readyState == WebSocket.OPEN)
        {
            //用户token
            _Param.token = window.common.token;
            _Param.uniqueId = window.common.uniqueId;

            //start timer
            var msgType = _Param.msgType;

            var NeedRecordMsg = true;
            
            for(var key in WontRespondMsg)
            {
                var CurrentMsgArray = WontRespondMsg[key];
                for(var k = 0 ; k < CurrentMsgArray.length ; k++)
                {
                    var TempMsg = CurrentMsgArray[k];
                    if(TempMsg==msgType)
                    {
                        NeedRecordMsg = false;
                        break;
                    }
                }

                if(NeedRecordMsg==false)
                {
                    break;
                }
            }

            this.m_agrs[msgType].isSend = NeedRecordMsg;

            var buf = JSON.stringify(_Param);

            //加密
            if(Constants.IS_ENCODING){
                buf = window.common.code.encode(buf);
            }

            // cc.log("当前发送地址==="+this.m_CurrentSocket.url);
            //cc.log("sendMsg======"+buf);
            console.log("sendMsg======"+buf);

            this.m_CurrentSocket.send(buf);
            //cc.log('=========Socket.bufferedAmount========'+this.m_CurrentSocket.bufferedAmount);
            this._DeltaTime = 0;
            this.sendTimeListener(msgType);
        }
        else
        {
            /*var warningStr = "send binary websocket instance wasn't ready...";
            this.websocket.string = i18n.t("cases/05_scripting/11_network/NetworkCtrl.js.10") + warningStr;
            this.scheduleOnce(function () {
                this.sendWebSocketBinary();
            }, 1);*/
        }
    },

    //******************************************************************* */
    //WebSocket的回调函�
    //******************************************************************* */
    onReciveMsg:function(data)     
    {
        if(data.data)
        {
            //解密
            var jsonStr = data.data;
            if(Constants.IS_ENCODING){
                jsonStr = window.common.code.decode(data.data);
            }
            var json = JSON.parse(jsonStr);
            //cc.log("socket返回=="+JSON.stringify(json));
            if(json.status ==  "-99")
            {
                common.ShowTips("账号异地登录");
                WebSocketController._ReLogin = true;
                this.disconnetToReset();
                return;
            }


            if(json.msg)
            {
                var listener = this.m_agrs[json.msgType];
                if(listener)
                {
                    listener.isSend = false;
                    listener.heartBeat = 0;

                    for(var i = 0; i<listener.sequence.length;i++)
                    {
                        var callBack = listener.sequence[i].callBack;
                        var target = listener.sequence[i].target;
                        callBack.call(target, json);
                    }
                }
            }
            else
            {
                window.common.ShowTips('服务器返回Msg为空');
                window.common.ui.loading.hide();
                Constants.HAVE_ENTERED_GAME = false;
            }
        }
        else
        {
            window.common.ShowTips("服务器返回数据为null");
            window.common.ui.loading.hide();
            Constants.HAVE_ENTERED_GAME = false;
        }
    },

    ////Socket状�
    GameSocketStatus()
    {
        if(this.m_webSocketGame)
        {
            if(this.m_webSocketGame.readyState == WebSocket.OPEN)
            {
                return true;
            }
        }

        return false;
    },

    HallSocketStatus()
    {
        if(this.m_webSocket)
        {
            if(this.m_webSocket.readyState == WebSocket.OPEN)
            {
                return true;
            }
        }

        return false;
    },

    onOpenSocket:function(data)
    {
        console.log('websocket is open!');
        console.log(data);

        //开启心跳计时器
        if(!this.heartBeatStart){
            this.startHeartBeat();
        }

        this.scheduleOnce(function(){
            if(this.onopen){
                this.onopen(data);
                this.onopen = null;
            }
        }, 0);
    },

    onSocketError:function(data)
    {
        console.log("大厅错误   "+JSON.stringify(data));
    },

    onGameSocketError:function(data)
    {
        console.log("游戏Socket错误   "+JSON.stringify(data));
    },
    ////////////////////////////////////////
    //主动关闭socket
    ////////////////////////////////////////
    closeHallSocket()
    {
        if (!this.m_webSocket)
        { 
            console.log("关闭大厅socket,但是大厅socket是空");
            return; 
        }
        this.m_webSocket.onclose = this.onCostomCloseHallSocket.bind(this);
        this.m_webSocket.close();
    },

    closeGameSocket()
    {
        if (!this.m_webSocketGame)
        { 
            console.log("关闭游戏socket,但是游戏socket是空");
            return; 
        }
        this.m_webSocketGame.onclose = this.onCostomCloseGameSocket.bind(this);
        this.m_CurrentSocket = this.m_webSocket;
        this.m_webSocketGame.close();
    },

    ////////////////////////////////////////
    //socket关闭回调
    ////////////////////////////////////////
    onCostomCloseHallSocket(data)
    {
        console.log("客户端主动断开 大厅socket   "+JSON.stringify(data));
    },

    onHallSocketClose:function(data) 
    {
        console.log("大厅socket 自动断开  "+JSON.stringify(data));
        this.disconnetToReset();
    },

    onCostomCloseGameSocket:function(data)//游戏socket主动断开
    {
        if(!this.m_webSocketGame)
        {
            return;
        }
        
        delete this.m_webSocketGame;
        this.m_webSocketGame = null;
        console.log("游戏socket被玩家主动关闭");
        //common.DeleteCurrentTips();
        this.clearReg();
        common.playerData.clearChangePropEvent();
    },

    onGameSocketClose:function(data)//游戏socket自动断开
    {
        console.log("游戏SOCKET连接 自动 断开===" + JSON.stringify(data));
        if(!this.m_webSocketGame)
        {
            return;
        }
        delete this.m_webSocketGame;
        this.m_webSocketGame = null;

        if(this._m_GameSocketCloseCallback)
        {
            this._m_GameSocketCloseCallback();
        }
        common.ShowTips("与服务器失去连接");
        console.log("游戏连接已断开");
    },

    disconnetToReset : function()
    {
        common.playerData.clearChangePropEvent();
        this.clearReg();
        if(this.m_webSocketGame)
        {
            delete this.m_webSocketGame;
        }
        if(this.m_webSocket)
        {
            delete this.m_webSocket;
        }
        this._m_GameSocketCloseCallback = null;
        this.m_webSocketGame = null;
        this.m_webSocket = null;
        customerUtils.loadScene('Login',common.ui.loading.hide);
    },
   
    SetGameSocketAutoCloseCallback(_Callback)
    {
        this._m_GameSocketCloseCallback = _Callback;
    },
});

WebSocketController.getInstance = function () 
{
    if (WebSocketController.instance == null) {
        WebSocketController.instance = new WebSocketController();
    }
    return WebSocketController.instance;
};