// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let hh_data = require('hh_data');
let Thor = require('Thor');

cc.Class({
    extends: Thor,
    editor: {
        executeInEditMode: false,
    },
    properties: {
        playerNum : 6,
        playerPrefab : cc.Prefab,
        _playerList : []
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._playerList= []
        for (let index = 0; index < this.playerNum; index++) {
            let node = cc.instantiate(this.playerPrefab);
            node.parent = this['_playerNode' + index]
            node.active = false
            node.getComponent('hh_playerHeadUI').chairIndex = index
            this._playerList.push(node)
        }
    },

    start () {
        if(!CC_EDITOR){
            hh_data.showPlayerChairListNotify.addListener(this.onshowPlayerChairListRefresh ,this)
        }
    },

    onDestroy () {
        if(!CC_EDITOR){
            hh_data.showPlayerChairListNotify.removeListener(this.onshowPlayerChairListRefresh ,this)
        }        
    },

    onshowPlayerChairListRefresh(playerChairList){
        for (let index = 0; index < this.playerNum; index++) {
            let player = playerChairList[index]
            if(player){
                this._playerList[index].active = true
                this._playerList[index].getComponent('hh_playerHeadUI').headIndex = player.portrait
                this._playerList[index].getComponent('hh_playerHeadUI').playerName = player.playerName
                this._playerList[index].getComponent('hh_playerHeadUI').gold = player.playerCoins
            }else{
                this._playerList[index].active = false
            }
        }
    },

    // update (dt) {},
});
