/**
 * @description 百家乐公用常量
 */
module.exports = {
    /**
    * @description 动态资源路径根目录
    */
    ResUrl : {
        Chips : 'Texture/Games/Baccarat/BCChips',
        Pokers : 'Texture/Games/Baccarat/Poker',
        Icons : 'resources/Texture/Games/BullFight/Icons/',
        WayBills:'Texture/Games/Baccarat/BCWayBill',
    },
    /**
     * @description 扑克牌纹理
     */
    _pokersFrame : null,
    _chipsFrame : null,

    /**
     * @description 路单纹理
     */
    _WayBillFrame:null,
   
    /**
     * @description 当前下住值
     */
    _currentBetValue:null,
   
    /**
     * @description 游戏时间
     */
    _gameTime:15,

    /**
     * @description 游戏开奖时间
     */
    _awardTIme:10,

    /**
     * @description 游戏等待时间
     */
    _gameWaitTime:5,
    /**
     * @description 游戏状态
     */
    _gameStatus:null,

    /**
     * @description 游戏状态属性 
     */
    gameStatus:cc.Enum({
        startBet:-1,
        startLotter:-1,
        wait:-1
    }),

    /**
     * @description 上庄状态属性
     */
    _dealerStatus:null,
    
    /**
     * @description 上庄状态属性
     */
    dealerStatus:cc.Enum({
        Dealer:-1,      //自己为庄家
        InTheLine:-1,   //在排庄队列中
        Normal:-1       //为玩家状态
    }),

    /**
     * @description 世界坐标
     */
    WorldPosition:{
        zhuang:null,
        zhuangTianWang:null,
        tongDianPing:null,
        xianTianWang:null,
        xian:null,
        xianDuiZi:null,
        zhuangDuiZi:null,
        ping:null,
        otherUsers:null,
        selfCoin:null,
        zhuangCoin:null,
    },

    /**
     * @description 筹码飞行速度
     */
    FLYTIME:0.3,

    /**
     * @description 结算飞行总时间
     */

     SETTLTIME:1,

    /**
      * @description 单个筹码值
      */
     chipsValueArray : [1,10,50,100,500,1000,5000,10000],

    /**
     * @description 桌子倍率数组
     */
    oddArray:[2,3,33,3,2,12,12,9],

    /**
     * @description 下注值
     */
    _BetValues:[0,0,0,0,0,0,0,0,0],

    _SelfBetValues:[0,0,0,0,0,0,0,0],

    /**
     * @description 开奖记录计数
     */
    _RecordCount:{
        zhuang:0,
        xian:0,
        ping:0,
        zhuangDuiZi:0,
        xianDuiZi:0,
    },

    /**
     * @description 桌子编号
     */
    TableNumber:cc.Enum({
        zhuang:-1,
        zhuangTianWang:-1,
        tongDianPing:-1,
        xianTianWang:-1,
        xian:-1,
        xianDuiZi:-1,
        zhuangDuiZi:-1,
        ping:-1,
    }),

    TableArray:[
        'zhuang',
        'zhuangTianWang',
        'tongDianPing',
        'xianTianWang',
        'xian',
        'xianDuiZi',
        'zhuangDuiZi',
        'ping',
    ],

    /**
     * @description 下注桌偏移坐标量
     */
    BetTableOffsetCoord:{
        zhuang:[300,130],
        zhuangTianWang:[150,50],
        tongDianPing:[150,50],
        xianTianWang:[150,50],
        xian:[300,130],
        xianDuiZi:[150,50],
        zhuangDuiZi:[150,50],
        ping:[300,130],
    },
    
    /**
     * @description 下注桌回调函数集合
     */
    onTableCallBacks:[],

    /**
     * @description 发牌位置
     */
    DelingPlace:cc.Enum({
        left:-1,
        right:-1
    }),

    /**
     * @description 下注人员
     */
    betByWho:cc.Enum({
        others:-1,
        self:-1
    }),
    /////////////////////////////////////////路单///////////////////////////////////////////////////
    m_ZlListNumber:9, //珠路初始化列表数目
    m_DlListNumber:19, // 大路初始化列表数目
    m_XllListNumber:24,//小路初始化列表数目
    
    
    /**
     * @description 开奖类型分类
     */
    AwordType:{
        zhuang:1,
        xian:2
    },
    
    /**
     * @description 大路
    */
    DaLu:{
        zhuang:['dl_zhuang',1],
        zzd:['dl_zhuang_zhuangdui',1],
        zxd:['dl_zhuang_xiandui',1],
        zsd:['dl_zhuang_shuangdui',1],
        
        xian:['dl_xian',2],
        xzd:['dl_xian_zhuangdui',2],
        xxd:['dl_xian_xiandui',2],
        xsd:['dl_xian_shuangdui',2],
        
        xianping:['dl_xianping'],
        zhuangping:['dl_zhuangping'],
        
        ping:['dl_ping'],
        pzd:['dl_ping_zhuangdui'],
        pxd:['dl_ping_xiandui'],
        psd:['dl_ping_shuangdui']
    },

    /**
     * @description 珠路
     */
    ZhuLu:{
        zhuang:['zhuang',1],
        zzd:['zhuang_zhuangdui',1],
        zxd:['zhuang_xiandui',1],
        zsd:['zhuang_shuangdui',1],
        
        xian:['xian',2],
        xzd:['xian_zhuangdui',2],
        xxd:['xian_xiandui',2],
        xsd:['xian_shuangdui',2],
        
        ping:['ping'],
        pzd:['ping_zhuangdui'],
        pxd:['ping_xiandui'],
        psd:['ping_shuangdui']
    },

    /**
     * @description 大眼路
     */
    DaYanLu:{
        zhuang:['dyl_zhuang',1],
        xian:['dyl_xian',2],
    },

    /**
     * @description 小路
     */
    XiaoLu:{
        zhuang:['xl_zhuang',1],
        xian:['xl_xian',2],
    },

    /**
     * @description 小强路
     */
    YueYouLu:{
        zhuang:['yyl_zhuang',1],
        xian:['yyl_xian',2],
    },

    ///////////////////////房间数据//////////////////////////
     /**
     * @description 胜利的桌子
     */
    _winnerArray:[0,0,0,0,0,0,0,0],
    RoomInfo : {
        tableNum:'10001',
        selfCoins: "0",
        gameState : 0,
        gameCode : '123123',
        restSeconds : 5,
        playerList:
                   [{
                        nickName:'赌神的赌神1',
                        portrait : 6,
                        coin : '12350.3',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec1'
                    },{
                        nickName:'赌神的赌神2',
                        portrait : 0,
                        coin : '12350.60',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec2'
                    },{
                        nickName:'赌神的赌神3',
                        portrait : 4,
                        coin : '12350.34',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec3'
                    },{
                        nickName:'赌神的赌神4',
                        portrait : 2,
                        coin : '12350.00',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec4'
                    },{
                        nickName:'赌神的赌神5',
                        portrait : 3,
                        coin : '12350.00',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec5'
                    },{
                        nickName:'赌神的赌神6',
                        portrait : 1,
                        coin : '12350.00',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec6'
                    },{
                        nickName:'赌神的赌神7',
                        portrait : 2,
                        coin : '12350.00',
                        token: '0740a2d9-217b-42c4-8baf-386ba22feec7'
                    }],
       dealerList:
                   [{
                        nickName:'庄家1',
                        portrait : 1,
                        coin :'3466797.00',
                        token:'0740a2d9-217b-42c4-8baf-386ba22feec1'
                    },{
                        nickName:'庄家2',
                        portrait : 0,
                        coin :'3466797.00',
                        token:'0740a2d9-217b-42c4-8baf-386ba22feec2'
                    },{
                        nickName:'庄家3',
                        portrait : 2,
                        coin :'3466797.00',
                        token:'0740a2d9-217b-42c4-8baf-386ba22feec3'
                    }],
       dealer : 
       {
            nickName : '庄家',
            coin : '112536.00',
            restHost : 10,
            maxHost : 30,
            token : '0740a2d9-217b-42c4-8baf-386ba22fee98'
       },
       historyRecord : //历史开奖记录
       [
          ['zhuang',1],//（闲家的输赢情况，1代表赢，0代表输）
       ],

        pokerGroups : //(庄闲各一家))
        {      
            zhuang:[[5,1],[4,3],[5,4]],
            xian: [[5,2],[2,4],[4,4]]
        },
        pokerPatterns : {//(每组牌的牌型)
            zhuang:null,
            zhuangTianWang:null,
            tongDianPing:null,
            xianTianWang:null,
            xian:null,
            xianDuiZi:null,
            zhuangDuiZi:null,
            ping:null,
        },
  },
  dealTimes:2, //当前连庄数
  
  dealersCoin: +2000.0,
  playerSettlement :-2000.0,
  selfCoin:-200,
  playersCoin:null,
  userCoin:null,
  
  
  //牌型
  CardTypeArrray : {
    zhuang:null,
    zhuangTianWang:null,
    tongDianPing:null,
    xianTianWang:null,
    xian:null,
    xianDuiZi:null,
    zhuangDuiZi:null,
    ping:null,
    },

ZhuangValue:0,
XianValue:0,

///////////////////////////////////////////消息号////////////////////////////////
    /**
     * @description 消息号
     */
    MsgType : {
        EnterRoom : '1201',
        OtherPlayersEnter : '1202',
        BecomeBanker : '1203',
        OtherApplyBanker : '1204',
        UnBanker : '1205',
        OtherUnBanker : '1206',
        ChipIn : '1207',
        OtherChipIn : '1208',
        StateNotify : '1209',
        AwardResultNotify : '1210',
        OtherLeave : '1211',
        Leave : '1212',
        CoinRecord : '1213',

        GetRoomList: '1215',
        UpdateReWard : '1216',
        UpdateRoomInfo : '1217',
    },


}


