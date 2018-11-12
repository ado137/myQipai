//  sam  172.20.101.237
//  halen 172.20.101.242
//  henry 172.20.101.170
//  test   172.20.100.204
//  anthony  172.20.101.241
//  faker 172.20.101.163
module.exports = {
    /**
     * @description HTTP地址
    //  */
    HTTP_BASE_URL : 'http://172.20.100.207:9091/',   //测试地址
    //HTTP_BASE_URL : 'http://172.20.101.44:9091/',  //henry
    //HTTP_BASE_URL : 'http://172.20.101.94:9091/',   //vito
    //  HTTP_BASE_URL : 'http://172.20.101.10:9091/',   //faker
    //HTTP_BASE_URL : 'http://172.20.100.15:9091/',   //len
    //HTTP_BASE_URL : 'http://172.20.101.81:9091/',   //helen
    //HTTP_BASE_URL : 'http://172.20.101.82:9091/',   //geoff
    //HTTP_BASE_URL : 'http://172.20.101.24:9091/',   //Len
   //HTTP_BASE_URL : 'http://172.20.101.43:9091/',   //chen
    //HTTP_BASE_URL : 'http://lobby.huihuang100.com:9191/',   //上线
    //HTTP_BASE_URL : 'http://172.20.100.95:9091/',   //预发�
    //HTTP_BASE_URL : 'http://172.20.101.60:9091/',   //logan
    /**
     * @description WebSocket地址
     */
    WEBSOCKET_BASE_URL : 'ws://172.20.100.207:7000/ws',  //测试地址
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.44:7000/ws',  //henry
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.94:7000/ws',  //vito
    //  WEBSOCKET_BASE_URL : 'ws://172.20.101.10:7000/ws',  //faker
    //WEBSOCKET_BASE_URL : 'ws://172.20.100.15:7000/ws',  //len
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.81:7000/ws',  //helen
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.82:7000/ws',  //geoff
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.24:7000/ws',  //Len
   // WEBSOCKET_BASE_URL : 'ws://172.20.101.43:7000/ws',  //chen
    //WEBSOCKET_BASE_URL : 'ws://lobby.huihuang100.com:7100/ws',  //上线
    //WEBSOCKET_BASE_URL : 'ws://172.20.100.95:7100/ws',  //预发�
    //WEBSOCKET_BASE_URL : 'ws://172.20.101.60:7100/ws',  //logan
    /**
     * @description 密钥
    //  */
    //NETWORK_ENCODE_PASSWORD : 'leyingguojimonica',

    /**
     * @description 站点标识
     */
    STATION_MARK:"test102",
    //  STATION_MARK : "test02",
    //STATION_MARK : "ly0001",
    //STATION_MARK: "fqzsLenTes",
    //STATION_MARK : "123456",
    //STATION_MARK : "123456",
    // STATION_MARK : 'voto111',
    // STATION_MARK : 'blank',
    //STATION_MARK : 'lewis',
    // STATION_MARK : 'sam',
    // STATION_MARK : 'tz2018',
    //STATION_MARK : 'julia',
    //STATION_MARK : 'fq01',
    //STATION_MARK : 'bmwbmw',
    // STATION_MARK : 'faker1112',
    //STATION_MARK : 'test02',
    //STATION_MARK : 'game666',
    IS_ENCODING : false,

    HAVE_ENTERED_GAME : false,
    GAME_LIST_INFO:null,
    EXCUTE_HOT_UPDATE : false,


    MsgType : 
    {
        GuestLogin : "1001" ,  //游客登录
        AccountRegister : "1002" ,//账号注册
        UserLogin : "1003"  ,//玩家登录
        FindBackPassword : "1004",  //找回密码
        BindAliPay : "1005",  //绑定支付�
        BindBankCard : "1006" , //绑定银行�
        GetBindCard : "1007",  //获取绑定的提款账�
        DrawOutMoney : "1008" , // 提款
        SetProtrait : "1009",  //设置头像
        OpenSafeBox : "1010", //打开保险�
        SaveMoneyInSafe : "1011" , //向保险箱存钱
        DrawOutMoneyFromSafe : "1012",// 从保险箱取钱
        GetSafeRecord : "1013" ,  //查询保险箱操作历�
        SetSafePassword : "1014", //设置保险箱密�
        ChangeNickName:"1015",  //修改昵称
        GetPayList:"1016",          //获取支付宝密�
        Pay:"1017",             //支付
        SetToken : '1018',//设置站点编号
        CoinsChange : '1019',//玩家金币数量改变
        ActiveInfo:'1020',    //请求活动
        PromoterInfo:'1021',  //请求推广员信�
        //1022
        RequireSpread:'1023',   //查询对应ID推广信息
        ModifyModuler:'1024',   //修改模板
        RequireSupportBankInfo:'1025',   //请求支持的收款银�
        ForgetSafePassword:'1026',   //忘记保险箱密�
        ModifyMsgStatus:'1027',   //修改消息状�
        ServerPushMail:'1028',   //服务器主动推送邮�
        RequireMsgList:'1029',   //获取消息数据List
        RequireLoopEffectList:'1030',   //获取走马灯数据List
        DeleteInfo:'1031',   //删除消息
        DeleteInfoAll:'1032',   //一键删除消�
        BindImportantInfo:'1033',   //绑定用户重要信息（实名）
        RequireMoneyInfo:'1034',   //获取充提记录
        //1035
        SendText:'1036',   //短信发�
        RequireLoginLog:'1037',   //获取登录日志
        //1038
        RequireGameRecord:"1039",  //获取游戏记录
        //1040
        severPay:'1040',
        ChangeGender:"1041",   //更改性别
        GetTuiJianRen:"1042", //获取推荐人ID
        SetSafePassword:"1043", //设置保险箱密�
        GetSpreadDetails:"1044", //获取推广总明�
        BindPhoneNumber:"1045",  //绑定手机�
        GetLoadingTips:"1048"  //获取加载提示
    },

    GameEnumName : cc.Enum
    ({
        BaiRenBenz:-1,      //百人奔驰  0
        FeiQinZouShou:-1,   //飞禽走兽  1 
        JinCanBuYu:-1,      //金蟾捕鱼  2 
        DouDiZhu:-1,        //斗地� 
        BaiRenNiuNiu : -1,  //百人牛牛  4
        HongHeiDaZhan:-1,   //红黑大战  5
        ErRenDouNiu:-1,     //二人斗牛  6 
        BaiRenBaiJiaLe:-1,   //百人百家�
        NiuNiuQiangZhuang:-1,  //牛牛抢庄拼十   8
        ErRenMajong:-1,     //二人麻将       9
        SanZhangPai:-1,     //三张�     10
        BaiRenDice:-1,      //百人摇一� 11
        LiKuiBuYu:-1,   //李逵捕�
        DaNaoTianKong:-1,     //大闹天空   13
        DeZhouPuKe:-1,      //德州扑克 14
        XunLongDuoBao:-1,  //寻龙夺宝 15
        ShiSanShui:-1,      //十三�6    
    }),

    /**
     * @description 返回消息状�
     */
    MsgStatus : {
        SUCCESS : '1',
        FAILURE : '0'
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////     以下都是配置文件 ///////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    LoadingLayer:
    {
        BaiRenBenz:"Texture/LoadingLayer/LoadBG_BaiRenBenz",//百人奔驰
        FeiQinZouShou:"Texture/LoadingLayer/LoadBG_FeiQinZouSou",//飞禽走兽
        JinCanBuYu:"Texture/LoadingLayer/LoadBG_JinCanBuYu",//金蟾捕鱼
        DouDiZhu:"Texture/LoadingLayer/LoadBG_DouDiZhu",//斗地�
        BaiRenNiuNiu:"Texture/LoadingLayer/LoadBG_BaiRenNiuNiu",//百人牛牛
        HongHeiDaZhan:"Texture/LoadingLayer/LoadBG_HongHeiDaZhan",//红黑大战
        ErRenDouNiu:"Texture/LoadingLayer/LoadBG_DouNiuSolo",//二人斗牛
        BaiRenBaiJiaLe:"Texture/LoadingLayer/LoadBG_BaiJiaLe",   //百人百家�
        NiuNiuQiangZhuang:"Texture/LoadingLayer/LoadBG_NiuNiuQiangZhuangPinShi",   //牛牛抢庄拼十
        ErRenMajong:"XXXXXXXXXXXXXXXXXX",                       //二人麻将
        SanZhangPai:"XXXXXXXXXXXXXXXXXX",     //三张�
        BaiRenDice:"Texture/LoadingLayer/LoadBG_BaiRenDice", //百人摇一�
        LiKuiBuYu:"Texture/LoadingLayer/LoadBG_lkpy",   //李逵捕�2
        DaNaoTianKong:"Texture/LoadingLayer/LoadBG_BaiRenBenz",     //大闹天空   13
        DeZhouPuKe:"Texture/LoadingLayer/LoadBG_BaiRenBenz",      //德州扑克 14
        XunLongDuoBao:"Texture/LoadingLayer/LoadBG_BaiRenBenz",  //寻龙夺宝 15
        ShiSanShui:"Texture/LoadingLayer/LoadBG_BaiRenBenz",      //十三�6    
    },

    JoinGameDataType : cc.Enum
    ({
        EnterCode:-1,         
        SceneName : -1,     
        RefreshCode:-1,        
        SecondLayerScene:-1,   
        GameList:-1,       
    }),

    JoinGameInfo: 
    {                    //进入房间消息---场景名字----------  刷新消息------2级界名称- -------------------获取房间列表消息
        BaiRenBenz:         ["2001",    'BaiRenBenz',       "2018",         "BRB_SecondScene",         "2019"],    //百人奔驰
        FeiQinZouShou:      ["3001",    'FeiQinZoushou',    "3018",         "FQ_SecondLayer",          "3019"],    //飞禽走兽
        JinCanBuYu:         ["5001",    'fishGame',         "5017",         "fishRoom",                "5011"],    //金蟾捕鱼
        DouDiZhu:           ["4002",    'DouDiZhu',         "4015",         "DDZ_SecondLayer",         "4001"],    //斗地�
        BaiRenNiuNiu :      ["6001",    'BullFightScene',   "6016",         "BFRoomScene",             "6014"],    //百人牛牛
        HongHeiDaZhan :     ["7001",    'HH',               "7015",         "HH_ChooseRoom",           "7016"],    //红黑大战
        ErRenDouNiu :       ["8004",    'TBFMainScene',     "8019",         "TBFRoomScene",            "8001"],    //二人斗牛
        BaiRenBaiJiaLe:     ["1201",    'BaccaratScene',    "1214",         "BC_SecondScene",          "1215"],    //百人百家�
        NiuNiuQiangZhuang:  ["1101",    'xxxx',             "11xx",         "XXX",                     "xxxx"],    //牛牛抢庄拼十
        ErRenMajong:        ["1301",    'xxxx',             "xxxx",         "XXX",                     "xxxx"],    //二人麻将
        SanZhangPai:        ["1401",    'xxxx',             "xxxx",         "XXX",                     "xxxx"],    //三张�
        BaiRenDice :        ["1501",    'YY',               "1514",         "YY_SecondScene",          "1515"],    //百人摇一�
        LiKuiBuYu:          ["5101",    'likuiFish',        "5117",         "likuiRoom",               "5111"],  //李逵捕�
        DaNaoTianKong:      ["xxxx",    'YY',               "1514",         "XXX",                     "xxxx"],    //大闹天空   13
        DeZhouPuKe:         ["1701",    'DeZhouPuke',       "1718",         "XXX",                     "xxxx"],     //德州扑克 14
        XunLongDuoBao:      ["xxxx",    'YY',               "1514",         "XXX",                     "xxxx"], //寻龙夺宝 15
        ShiSanShui:         ["xxxx",    'YY',               "1514",         "XXX",                     "xxxx"],     //十三�6    
    },

    GameCategory : cc.Enum
    ({
        HotGame:-1,         //热门游戏
        ChessGame : -1,     //棋牌游戏
        FishGame:-1,        //捕鱼游戏
        ESport:-1,          //街机游戏
    }),

    GetCurrentRunningGameIndex()
    {
        var TempIndex  = this.JoinGameDataType.SceneName;
        var CurrentSceneName = cc.director.getScene().name;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(this.JoinGameInfo[key][TempIndex] == CurrentSceneName)
            {
                return Step;
            }
            Step++;
        }

        return -1;
    },

    GetGameIndexBySecondSceneName()
    {
        console.log("cc.director.getScene().name===" + cc.director.getScene().name);
        var TempIndex  = this.JoinGameDataType.SecondLayerScene;
        var CurrentSceneName = cc.director.getScene().name;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(this.JoinGameInfo[key][TempIndex] == CurrentSceneName)
            {
                return Step;
            }
            Step++;
        }

        return -1;
    },

    GetGameListMsgIdByGameIndex(_GameIndex)
    {
        console.log("_GameIndex=====" + _GameIndex);
        var TempIndex  = this.JoinGameDataType.GameList;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(Step == _GameIndex)
            {
                return this.JoinGameInfo[key][TempIndex];
            }
            Step++;
        }

        return "None";
    },

    GetSecondSceneNameByGameIndex(_GameIndex)
    {
        var TempIndex  = this.JoinGameDataType.SecondLayerScene;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(_GameIndex == Step)
            {
                return this.JoinGameInfo[key][TempIndex]
            }
            Step++;
        }
    },

    GetSceneNameByMsgType(_MsgType)
    {
        var MsgCodeIndx  = this.JoinGameDataType.EnterCode;
        var SceneNameIndex =  this.JoinGameDataType.SceneName;
        for(var key in this.JoinGameInfo){
            if(this.JoinGameInfo[key][MsgCodeIndx] == _MsgType){
                return this.JoinGameInfo[key][SceneNameIndex];
            }
        }
    },

    GetSceneNameByGameIndex(_GameIndex)
    {
        var SceneNameType =  this.JoinGameDataType.SceneName;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(Step == _GameIndex)
            {
                return this.JoinGameInfo[key][SceneNameType];
            }
            Step++;
        }
    },

    //通过 游戏编号 获得  刷新消息�
    GetRefresgMsgIDByGameIndex(_GameIndex)
    {
        var RefreshCode =  this.JoinGameDataType.RefreshCode;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(Step == _GameIndex)
            {
                return this.JoinGameInfo[key][RefreshCode];
            }
            Step++;
        }
    },

    //通过 游戏编号 获得  进房间消�
    GetEnterMsgIDByGameIndex(_GameIndex)
    {
        var EnterCode =  this.JoinGameDataType.EnterCode;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(Step == _GameIndex)
            {
                return this.JoinGameInfo[key][EnterCode];
            }
            Step++;
        }
    },

    GetGameIndexByEnterMsg(_MsgType)
    {
        var MsgCodeIndx  = this.JoinGameDataType.EnterCode;
        var Step = 0;
        for(var key in this.JoinGameInfo)
        {
            if(this.JoinGameInfo[key][MsgCodeIndx] == _MsgType)
            {
                return Step;
            }
            Step++;
        }
    },

    AudioConfig : {
        //音效播放状�
        get EffectToggle(){
            let toggle = cc.sys.localStorage.getItem('EffectToggle')
            if(toggle === null || toggle === 'undefined'){
                return true
            }
            return JSON.parse(toggle)
        },

        set EffectToggle(toggle){
            cc.sys.localStorage.setItem('EffectToggle', toggle)
        },

        //背景音乐播放状�
        get MusicToggle(){
            let toggle = cc.sys.localStorage.getItem('MusicToggle')
            if(toggle === null || toggle === 'undefined'){
                return true
            }
            return JSON.parse(toggle)
        },

        set MusicToggle(toggle){
            cc.sys.localStorage.setItem('MusicToggle', toggle)
        },
    },

    ResetDontNeedTipsDeleteMail()
    {
        cc.sys.localStorage.setItem('DontDeleteMailWithOutTips',"false");
    },

    SetDontNeedTipsDeleteMail(_Value)
    {
        if(_Value)
        {
            cc.sys.localStorage.setItem('DontDeleteMailWithOutTips', "true");
        }
        else
        {
            cc.sys.localStorage.setItem('DontDeleteMailWithOutTips', "false ");
        }
    },

    GetDontNeedTipsDeleteMail()
    {
        var Val = cc.sys.localStorage.getItem('DontDeleteMailWithOutTips');

        if(!Val)
        {
            return false;
        }

        if(Val=="true")
        {
            return true;
        }
        else
        {
            return false;
        }
    },
}