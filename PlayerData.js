var BaseData = require("BaseData");

var PlayerData = cc.Class({
    extends: BaseData,

    /**
     * @description 初始化数�
     * @param playData
     */
    loadData: function (playData) {
        console.log("MMMMMMMM   " + JSON.stringify(playData))
        if(!playData)
        {
            common.ShowTips("获取用户信息失败");
            return;
        }
        this.realName = playData.realName;
        this.setNickName(playData.nickName);
        this.setGender(playData.gender);
        this.setCoin(playData.coin);
        this.setPlayerID(playData.playerID);
        this.setAliPayAccount(playData.aliPayInfo ? playData.aliPayInfo.aliPayAccount : '');
        this.setAliPayName(playData.aliPayInfo ? playData.aliPayInfo.aliPayName : '');
        this.setBankID(playData.bankInfo ? playData.bankInfo.bankID : '');
        this.setBankAccount(playData.bankInfo ? playData.bankInfo.bankAccount : '');
        this.setPortrait(playData.portrait);
        this.safeBalance = playData.safeBoxInfo.safeBalance ? playData.safeBoxInfo.safeBalance : 0;
        this.safeBalance=parseFloat(this.safeBalance).toFixed(2);
        this.safeFlag = playData.safeBoxInfo.safeFlag ? playData.safeBoxInfo.safeFlag : 0;
        this.setPhoneNumber(playData.phoneNumber);
        this.setOfficialUrl(playData.officialUrl);
        common.payBankFlag = playData.payBankFlag;
        common.payAlipayFlag = playData.payAlipayFlag;
    },

    statics: {
        instance: null
    },

    properties: {
        /**
         * @description 是否是游�
         */
        isVisitor: false,
        /**
         * @description 用户昵称
         */
        nickName: null,
        /**
         * @description 性别
         */
        gender: null,
        /**
         * @description 金币数量
         */
        coin: null,
        /**
         * @description 账号
         */
        playerID: null,
        /**
         * @description 支付宝账�
         */
        aliPayAccount: null,
        /**
         * @description 支付宝名�
         */
        aliPayName: null,
        /**
         * @description 银行ID编码
         */
        bankID: null,
        /**
         * @description 银行账号
         */
        bankAccount: null,
        /**
         * @description 头像
         */
        portrait: null,
        /**
         * @description 保险箱密�
         */
        safePassword: null,
        /**
         * @description 保险箱余�
         */
        safeBalance: null,
        /**
         * @description 操作记录
         */
        safeRecord: null,
        /**
         * @description 手机
         */
        phoneNumber: null,

        officialUrl:null,
    },

    /**
     * @description 是否是游客get,set方法
     */
    getIsVisitor: function () {
        return this.isVisitor;
    },

    setIsVisitor: function (isVisitor) {
        this.isVisitor = isVisitor;
        this.changeProperty(PlayerData.ChangeProperty.IsVisitor, isVisitor);
    },

    /**
     * @description 用户昵称get,set方法
     */
    getNickName: function () {
        return this.nickName;
    },

    setNickName: function (nickName) {
        this.nickName = nickName;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.NickName, nickName);
    },

    /**
     * @description 性别get,set方法
     */
    getGender: function () {
        return this.gender;
    },

    setGender: function (gender) {
        this.gender = gender;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.Gender, gender);
    },

    /**
     * @description 金币get,set方法
     */
    getCoin: function () {
        return this.coin;
    },

    setCoin: function (coin) {
        coin=parseFloat(coin).toFixed(2);
        this.coin = coin;
        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.Coin, coin);
    },

    /**
     * @description 账号get,set方法
     */
    getPlayerID: function () {
        return this.playerID;
    },

    setPlayerID: function (playerID) {
        this.playerID = playerID;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.PlayerID, playerID);
    },

    /**
     * @description 支付宝get,set方法
     */
    getAliPayAccount: function () {
        return this.aliPayAccount;
    },

    setAliPayAccount: function (aliPayAccount) {
        this.aliPayAccount = aliPayAccount;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.AliPayAccount, aliPayAccount);
    },

    /**
     * @description 支付宝get,set方法
     */
    getAliPayName: function () {
        return this.aliPayName;
    },

    setAliPayName: function (aliPayName) {
        this.aliPayName = aliPayName;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.AliPayName, aliPayName);
    },

    /**
     * @description 银行卡get,set方法
     */
    getBankID: function () {
        return this.bankID;
    },

    setBankID: function (bankID) {
        this.bankID = bankID;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.BankID, bankID);
    },

    /**
     * @description 银行卡get,set方法
     */
    getBankAccount: function () {
        return this.bankAccount;
    },

    setBankAccount: function (bankAccount) {
        this.bankAccount = bankAccount;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.BankAccount, bankAccount);
    },

    /**
     * @description 头像get,set方法
     */
    getPortrait: function () {
        return this.portrait || 0;
    },

    setPortrait: function (portrait) {
        this.portrait = portrait;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.Portrait, portrait);
    },

    /**
     * @description 保险箱get,set方法
     */
    getSafePassword: function () {
        return this.safePassword;
    },

    setSafePassword: function (safePassword) {
        this.safePassword = safePassword;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.SafePassword, safePassword);
    },

    /**
     * @description 保险箱get,set方法
     */
    getSafeBalance: function () {
        return this.safeBalance;
    },

    setSafeBalance: function (safeBalance) {
        this.safeBalance = safeBalance;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.SafeBalance, safeBalance);
    },

    /**
     * @description 保险箱get,set方法
     */
    getSafeRecord: function () {
        return this.safeRecord;
    },

    setSafeRecord: function (safeRecord) {
        this.safeRecord = safeRecord;

        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.SafeRecord, safeRecord);
    },

    /**
     * @description 电话号码get,set方法
     */
    getPhoneNumber: function () {
        return this.phoneNumber;
    },

    setPhoneNumber: function (phoneNumber) {
        this.phoneNumber = phoneNumber;
        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.PhoneNumber, phoneNumber);
    },


    /**
     * @description 官网地址
     */
    getOfficialUrl : function()
    {
        return this.officialUrl;
    },

    setOfficialUrl : function(_officialUrl)
    {
        this.officialUrl = _officialUrl;
        //执行回调
        this.changeProperty(PlayerData.ChangeProperty.OfficailUrl, _officialUrl);
    },
});

/**
 * @description 值变换事件枚�
 */
PlayerData.ChangeProperty = cc.Enum({
    NickName: -1,
    Gender: -1,
    Coin: -1,
    PlayerID: -1,
    AliPayAccount: -1,
    AliPayName: -1,
    BankID: -1,
    BankAccount: -1,
    Portrait: -1,
    SafePassword: -1,
    SafeBalance: -1,
    SafeRecord: -1,
    IsVisitor: -1,
    PhoneNumber: -1,
    OfficailUrl:-1,
});

PlayerData.getInstance = function () {
    if (PlayerData.instance == null) {
        PlayerData.instance = new PlayerData();
    }
    return PlayerData.instance;
};

module.exports = PlayerData;