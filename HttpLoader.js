var Constants = require('Constants');

var HttpLoader = cc.Class({
    extends: cc.Component,
 
    properties: 
    {
        
    },
 
    statics: 
    {
        instance: null
    },
 
    // use this for initialization
    onLoad: function () 
    {

    },
 
    /**
     * @描述 http post提交
     * @param {*} url
     * @param {*} param
     * @param {*} callBack
     * @param {*} error
     */
    httpPost: function (url, param, callBack, error)
     {

        if(!common.getBeNetwork()){
            common.ShowTips('无网络连接');
            common.ui.loading.hide();
            return;
        }

        var xhr = cc.loader.getXMLHttpRequest();
        //参数
        var params = '';

        if(param){
            //站点标识
            param.stationMark = Constants.STATION_MARK;
            param.deviceType = cc.sys.os;

            cc.log('HTTP Send:'+JSON.stringify(param));
            //加密
            params = JSON.stringify(param);
            if(Constants.IS_ENCODING){
                params = window.common.code.encode(params);
            }

            cc.log(params);
        }
        //5 seconds for timeout
        xhr.timeout = 5000;
        xhr.open("POST", encodeURI(url), true);

        xhr.setRequestHeader("Content-Type", "application/json");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.ontimeout = function(event) {
            window.common.ShowTips("连接服务器超时");
            window.common.ui.loading.hide();
        }

        //回调函数
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && (xhr.status >=200 && xhr.status<300)){
                var response = xhr.responseText;

                //解密
                if(Constants.IS_ENCODING){
                    response = window.common.code.decode(response);
                }

                cc.log('HTTP Recieve:'+response);
                callBack(JSON.parse(response));
            }else if(xhr.readyState == 4 && (xhr.status <200 || xhr.status>=300)){
                if(error){
                    error(xhr.statusText);
                }else{
                    window.common.ShowTips("服务器无响应");
                }
                window.common.ui.loading.hide();
            }
        }

        xhr.send(params);
     }
});
 
 HttpLoader.getInstance = function () 
 {
     if (HttpLoader.instance == null) {
         HttpLoader.instance = new HttpLoader();
     }
     return HttpLoader.instance;
 };

