module.exports = {
    /**
     * @description 筹码配置
     */
    CHIP_CONFIG : [1,10,50,100,500,1000,5000,10000],    

    /**
     * @description 盘口数量
     */
    BET_SLOT : 3,

    /**
     * @description 筹码飞行时间
     */
    FLY_CHIP_TIME : 0.4,

    /**
     * @description 筹码飞行时间
     */
    FLY_BET_CHIP_TIME : 0.3,


    /**
     * @description 桌面筹码缩放
     */
    TABLE_CHIP_SCALE : 0.4,


    /**
     * @description 发牌时间
     */
    DEAL_CARD_TIME : 0.35,

    /**
     * @description 翻牌时间
     */
    FLIP_CARD_TIME : 0.5,

    /**
     * @description 显示席位数量
     */
    SHOW_CHAIR_NUM : 6,

    /**
     * @description 游戏状态
     */
    GAME_STATE : cc.Enum({
        //下注阶段
        BET : -1,   
        //开奖阶段
        DUI_ZI : -1,
        //等待阶段
        WAIT : -1,
        //初始化阶段
        NONE: -1,
    }),

    /**
     * @description 下注时间
     */
    BET_TIME: 10,

    /**
     * @description 开奖时间
     */
    REWARD_TIME: 10,


    /**
     * @description 牌型
     */
    CARD_TYPE : cc.Enum({
        //单张
        DAN_ZHANG : -1,   
        //对子
        DUI_ZI : -1,
        //顺子
        SHUN_ZI : -1,
        //金花
        JIN_HUA : -1,
        //顺金
        SHUN_JIN: -1,
        //豹子
        BAO_ZI: -1,
    }),

    /**
     * @description 赔率
     */
    BENEFIT : {
        //单张
        0 : 1,   
        //对子
        1 : 1,
        //顺子
        2 : 2,
        //金花
        3 : 3,
        //顺金
        4: 5,
        //豹子
        5: 10,
    },

    /**
     * @description 盘口
     */
    PAN_KOU : cc.Enum({
        //船长
        CHUAN_ZI : -1,   
        //公主
        GONG_ZHU : -1,
        //幸运一击
        LUCKY : -1,
    }),

    /**
     * @description 队伍
     */
    TEAM : cc.Enum({
        //船长
        HEI : -1,   
        //公主
        HONG : -1,
    }),

    /**
     * @description 盘口名字
     */
    PAN_KOU_STR : {
        [0] : "海盗船长",
        [1] : "公主战士",
        [2] : "幸运一击"
    },

    /**
     * @description 牌型
     */
    CARD_TYPE_STR : {
        //单张
        [0] : "单张",   
        //对子
        [1] : "对子",   
        //顺子
        [2] : "顺子",   
        //金花
        [3] : "金花",   
        //顺金
        [4]: "顺金",   
        //豹子
        [5]: "豹子",   
    },

    /**
     * @description 网络消息类型
     */
    NET_MSG : {
        //玩家下注
        ME_BET : 7002,
        //其他玩家下注
        OTHER_BET : 7003,
        //玩家自己发起上庄
        ME_UP_BANKER : 7004,
        //其他玩家进入庄家排队
        OTHER_WAIT_UP_BANKER : 7005,
        //新玩家进入
        OTHER_ENTER : 7006,
        //新玩家离开
        OTHER_LEAVE : 7007,
        //当前玩家离开房间
        ME_LEAVE_GAME : 7008,
        //自己提前下庄或者离开上庄列表
        ME_LEAVE_BANKER : 7009,
        //玩家被踢出房间
        ME_KICK_OUT : 7010,
        //可下注状态通知
        BET_STATE : 7011,
        //开奖状态通知
        REWARD_STATE : 7012,
        //其他玩家下庄或者离开上庄队列
        OTHER_LEAVE_BANKER : 7014,
        //房间列表更新中奖
        ROOMLIST_REWARD : 7017,
        //房间更新其他信息
        ROOMLIST_INFO : 7018,
    },


        /**
     * @description 网络消息日志
     */
    NET_MSG_LOG : {
        7002: '玩家下注',
        7003: '其他玩家下注',
        7004: '玩家自己发起上庄',
        7005: '其他玩家进入庄家排队',
        7006: '新玩家进入',
        7007: '新玩家离开',
        7008: '当前玩家离开房间',
        7009: '自己提前下庄或者离开上庄列表',
        7010: '玩家被踢出房间',
        7011: '可下注状态通知',
        7012: '开奖状态通知',
        7014: '其他玩家下庄或者离开上庄队列',
        7017: '房间更新中奖',
        7018: '房间更新其他信息',        
    },

    /**
     * @description 动画阶段
     */
    ANIM_STAGE: cc.Enum({
        //无
        NONE : -1,   
        //发牌
        DEAL_CARD : -1,   
        //翻左边牌
        FLIP_LEFT_CARD : -1, 
        //翻右边牌
        FLIP_Right_CARD : -1, 
        //显示左边牌型
        SHOW_LEFT_PX : -1, 
        //显示右边牌型
        SHOW_RIGHT_PX : -1, 
        //筹码动画
        CHIP_ANIM : -1, 
        //結算分數
        SHOW_SCORE : -1,
        //等待
        WAIT : -1,
    }),
    
    /**
    * @description 网络错误消息
    */
    NET_ERROR_MSG : {
        ['101']:"条件不满足",
        ['102']:"下注数字错误",
        ['103']:"下注额过大",
        ['104']:"下注金额超过余额 ",
        ['105']:"庄家无法赔付这么多下注额", 
        ['106']:"下注时间结束",
        ['107']:"余额小于上庄最低要求",
        ['108']:"上庄队列已满", 
        ['109']:"自己就在庄家队列", 
        ['110']:"当前玩家不是庄家也不在庄家列表", 
        ['111']:"当前玩家长时间不参与",
        ['112']:"下注金额过小",
        ['113']:"当前没有庄家,下注失败",
    }
}