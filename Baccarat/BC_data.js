/**
 * Date: 2018/9/14
 * Author: Ansen
 * Desc:百家乐 数据层
 */
var BCConstants = require('BCConstants')
var DataNotify = require('DataNotify')

module.exports = {
    /**
     * @description 庄家信息数据
     */
    dealerInfo:null,

    initData(){
        this.gameStatusNotify = DataNotify.create(BCConstants,'_gameStatus')
        this.dealerInfoNotify = DataNotify.create(this,'dealerInfo')
        this.roomInfoNotify = DataNotify.create(BCConstants,'RoomInfo')
        
    },
}