var Constants = require('Constants');
var HttpLoader = require('HttpLoader');
var HotUpdate = require('HotUpdate');
var WebSocketUtil = require('WebSocketController');
var Base64Util = require('Base64Util');
var fiter = require("filter");
var Base64Util = require('Base64Util');
var LoadingLayer = require('LoadingLayer');
var TipsClass = require('TipsController');
var AudioManager = require('AudioManager');
var SecondLayer = require('SecondLayer');
/**
 * @description 游戏公用工具类
 * @class
 */
module.exports = {
    /**
     * @description 用户信息
     * @property
     */
    playerData: null,

    /**
     * @description token,用户识别码
     */
    token: null,

    /**
     * @description 用户唯一标识
     */
    uniqueId: null,
    /**
     * @description 调试模式
     */
    testMode: false,
    /**
     * @description 二维码地址
     */
    url:null,
    /**
     * @description 接口工具类
     */
    api: {
        /**
         * @方法描述 发送HTTP请求
         * @param {*} params [请求参数]
         */
        httpPost: function (params) {
            //获取http工具类实例
            var http = HttpLoader.getInstance();
            //发送post请求
            http.httpPost(
                Constants.HTTP_BASE_URL + params.action,
                params.params,
                params.callback,
                params.error);
        },

        /**
         * @方法描述 热更新
         * @param {*} params [请求参数]
         */
        hotUpdate: function (params) {
            //获取热更新工具类实例
            var hotUpdate = HotUpdate.getInstance();
            //开始热更新
            hotUpdate.goUpdate({
                manifestUrl: params.manifestUrl,
                callBack: params.callBack
            });
        },

        url : null,
        
        /**
         * @方法描述 建立websocket连接
         * @param {*} open 连接成功回调
         */
        initWebsocket: function (open, target, gameId) {
            console.log("initWebsocket gameId ==" + gameId);
            var url = Constants.WEBSOCKET_BASE_URL;
            if (gameId) {
                url = this.getGameConfigByGameId(gameId).gameUrl;
            }
            WebSocketUtil.getInstance().init(url, open, target, gameId);
        },

        _setToken: function (callback) {
            var websocket = WebSocketUtil.getInstance();
            websocket.reg(Constants.MsgType.SetToken, function (data) {
                websocket.unreg(Constants.MsgType.SetToken);
                //初始化游戏配置
                if (data.status == Constants.MsgStatus.SUCCESS) {
                    common.playerData.loadData(data.msg.playerData);
                    Constants.GAME_LIST_INFO = data.msg.gameConfig;
                    common.uniqueId = data.msg.uniqueId;
                    callback(data.msg);
                }
                else {
                    common.ui.loading.hide();
                    common.ShowTips("获取游戏配置列表失败");
                }
            }, this);
            websocket.sendMsg({ msgType: Constants.MsgType.SetToken, token: window.common.token });
            console.log("发送获取房间列表消息");
        },

        closeWebsocket()
        {
            var websocket = WebSocketUtil.getInstance();
            websocket.closeHallSocket();
            websocket.closeGameSocket();
            websocket.disconnetToReset();
        },
        /**
         * @方法描述 获取websocket实例
         */
        getWebsocket: function () {
            return WebSocketUtil.getInstance();
        },

        getGameConfigByGameId: function (gameId) {
            for (var i = 0; i < Constants.GAME_LIST_INFO.length; i++) {
                if (parseInt(Constants.GAME_LIST_INFO[i].gameId) == gameId) {
                    return Constants.GAME_LIST_INFO[i];
                }
            }
        }
    },

    /**
     * @description ui工具
     */
    ui: {
        loading: {
            show(_GameIndex)  //这是一个constans.js里面游戏枚举  GameEnumName : cc.Enum
            {
                LoadingLayer.StaticShow(_GameIndex);
            },

            hide() {
                LoadingLayer.StaticHide();
            }
        },
    },

    audio: {
        ToggleEffect(toggle) {
            AudioManager.ToggleEffects(toggle);
        },

        ToggleMusic(toggle) {
            AudioManager.ToggleMusic(toggle);
        }
    },

    /**
     * @description 常用工具
     */
    util: {
        /**
         * @description 取得一个区间的随机整数
         * @param {*} n 起始值
         * @param {*} m 结束值
         */
        randomNum: function (n, m) {
            var random = Math.floor(Math.random() * (m - n + 1) + n);
            return random;
        },

        GetItemByIndex(data, index) {
            var i = 0;
            for (var k in data) {
                if (i == index) {
                    return data[k];
                }
                i++;
            }
        },

        getDeviceId: function () {
            var deviceId = cc.sys.localStorage.getItem('deviceId');
            if (deviceId) {
                return deviceId;
            } else {
                deviceId = this.getUUID();
                cc.sys.localStorage.setItem('deviceId', deviceId);
                return deviceId;
            }
        },

        getUUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },

        caculate: {
            add(num1, num2, fixed) {
                var r1, r2, m, n;
                try { r1 = num1.toString().split(".")[1].length } catch (e) { r1 = 0 }
                try { r2 = num2.toString().split(".")[1].length } catch (e) { r2 = 0 }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((num1 * m + num2 * m) / m).toFixed(fixed);
            }
        },

        /**
         * @description 获取url参数
         */
        getUrlParams: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },

        DumpMemory() {
            var cache = [];
            console.log("内存使用情况=======" + JSON.stringify(cc.loader._cache, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }));

            cache = null;
        },

        /**
         * @description 判断是都是在网页游戏中
         */
        isWebGameRunning(){
            if(!cc.sys.isNative){
                let token = this.getUrlParams('token');
                let gameId = this.getUrlParams('gameId');
                if(token && gameId){
                    return true;
                }
            }
            return false;
        },

        sysTips : [],

        getRandomTips(){
            let ranNum = this.randomNum(0, this.sysTips.length-1);
            return this.sysTips[ranNum];
        }
    },

    /**
     * @description 加解密工具
     */
    code: {

        /**
         * @方法描述 参数加密
         * @param {*} source 被加密的字符串
         */
        encode: function (source) {

            source = encodeURIComponent(source);

            var arr1 = getBytes(source);

            var arr2 = getBytes(Constants.NETWORK_ENCODE_PASSWORD);

            var bytes = xorByteArray(arr1, arr2);

            var encodeStr = Base64Util.encode(byteToString(bytes));

            return encodeStr;
        },

        /**
         * @方法描述 参数解密
         * @param {*} source 要被解密的字符串
         */
        decode: function (source) {

            var arr2 = getBytes(Constants.NETWORK_ENCODE_PASSWORD);
            var arr1 = getBytes(Base64Util.decode(source));

            var bytes = xorByteArray(arr1, arr2);

            var decodeStr = byteToString(bytes);

            decodeStr = decodeURIComponent(decodeStr);

            return decodeStr;
        },
    },
    //取全屏模糊frame
    getburlFrame() {
        var canvas = cc.find("Canvas");
        var renderTexture = cc.RenderTexture.create(cc.visibleRect.width, cc.visibleRect.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        renderTexture.begin();
        canvas._sgNode.visit();
        renderTexture.end();
        if (cc.sys.isNative) {
            //web上要绑定的才能用有点坑爹
            fiter.GaussianBlur(renderTexture.getSprite());
        }
        renderTexture.getSprite().setAnchorPoint(0, 0);
        var render = cc.RenderTexture.create(cc.visibleRect.width, cc.visibleRect.height, cc.Texture2D.PIXEL_FORMAT_RGB888);
        render.begin();
        renderTexture.visit();
        render.end();
        var frame = render.getSprite().getSpriteFrame();
        return frame;
    },
    tackPhoto: function (node, fileName) {
        console.log(" 拍照   ");
        var pp = node.parent;
        var op = node.position;
        var runScene = cc.director.getScene();
        var nn = new cc.Node();
        runScene.addChild(nn);
        nn.x = node.width / 2;
        nn.y = node.height / 2;
        node.parent = runScene;
        node.position = cc.p(node.width / 2, node.height / 2);
        var renderTexture = cc.RenderTexture.create(node.width, node.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        renderTexture.setVisible(false);
        nn._sgNode.addChild(renderTexture);
        renderTexture.begin();
        runScene._sgNode.visit();
        renderTexture.end();
        renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        node.active=false;
        setTimeout(function () {
            node.parent = pp;
            node.position = op;
            node.active=true;
        },10);
        nn.destroy();
    },

    /**
     * @description 公用即用即删的信息提示框，信息提示框统一用这个接口
     * @param {*} _TipsContent  需要提示的文字
     */
    ShowTips(_TipsContent) {
        TipsClass.StaticShowTips(_TipsContent);
    },

    DeleteCurrentTips() {
        TipsClass.ForceDeleteLastTips();
    },

    /**
     * @description 显示具体游戏的二级房间选择页面
     * @param {*} _GameIndex  这是一个constans.js里面游戏枚举  GameEnumName : cc.Enum
     */
    // ShowSecondLayer(_GameIndex) {
    //     SecondLayer.StaticShow(_GameIndex);
    // },

    // CloseSecondLayer() {
    //     SecondLayer.TryDeleteSecondLayer();
    // },
    loadImg: function (sp, url, auto) {
        var width = sp.node.width;
        var height = sp.node.height;
        if ("http" == url.substring(0, 4)) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                if ("http:" == url.substring(0, 5)) {
                    url = "https" + url.substring(4, url.length);
                }
            }
            cc.loader.load(url, function (err, textTure) {
                if (err) {
                    cc.error('加载图片出错了' + err);
                } else {
                    var spriteFrame = new cc.SpriteFrame();
                    spriteFrame.setTexture(textTure);
                    sp.spriteFrame = spriteFrame;
                    if (!auto) {
                        var nWidth = sp.node.width;
                        var nHeight = sp.node.height;
                        sp.node.setScale(width / nWidth, height / nHeight);
                    }
                }
            });
        } else {
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.error('加载图片出错了' + err);
                } else {
                    sp.spriteFrame = spriteFrame;
                    if (!auto) {
                        var nWidth = sp.node.width;
                        var nHeight = sp.node.height;
                        sp.node.setScale(width / nWidth, height / nHeight);
                    }
                }
            });
        }
    },
    getDaysInMonth(year, month) {
        month = parseInt(month, 10) + 1;
        var temp = new Date(year + "/" + month + "/");
        temp.setDate(0);
        return temp.getDate();
    },
    padding(num, length) {
        return (Array(length).join("0") + num).slice(-length);
    },
    clearnTime(){
        if(this.timeId){
            clearTimeout(this.timeId);
        }
    },
    getBeNetwork() {
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "beNateWork", "()Z");
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod("AppController", "beNateWork");
                //return jsb.reflection.callStaticMethod("AppController", "copy:",text);
            }
        }
        return true;
    },

    GetScanCodeUrl()
    {
        return this.url;
    },

    //通过原生平台更改站点
    SetStationMarkByNative()
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //Constants.STATION_MARK = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "beNateWork", "()Z");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            Constants.STATION_MARK = jsb.reflection.callStaticMethod("AppController", "getStationMark");
        }
    },

};

/**
 * @描述 字符串转byte数组
 * @param {*} str 
 */
function getBytes(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    return bytes;
}

/**
 * @描述 byte数组转字符串
 * @param {*} arr 
 */
function byteToString(arr) {
    if (typeof arr === 'string') {
        return arr;
    }
    var str = '',
        _arr = arr;
    for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for (var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
    return str;
}

/**
 * @描述 将两个byte数组进行亦或运算
 * @param {*} arr1 
 * @param {*} arr2 
 */
function xorByteArray(arr1, arr2) {
    var len2 = arr2.length;
    var arr3 = [];
    for (var i = 0; i < arr1.length; i++) {
        var val = arr1[i] ^ arr2[i % len2];

        arr3.push(val);
    }
    return arr3;
}