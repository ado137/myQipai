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
    properties: {
        headIndex :{
            'default': 0,
            notify(oldValue) {
                (this._isOnLoadCalled != 0) && (this._head.$MagicSprite.index = this.headIndex)
            }
        },
        gold :{
            'default': 0,
            notify(oldValue) {
                (this._isOnLoadCalled != 0) && (this._player_gold.$Label.string = hh_data.formatGold(this.gold))
            }
        },

        playerName : '',

        chairIndex : 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if(!CC_EDITOR){
            hh_data.currentBetInfoNotify.addListener(this.onCurrentBetInfo ,this)
        }
    },

    onDestroy () {
        if(!CC_EDITOR){
            hh_data.currentBetInfoNotify.removeListener(this.onCurrentBetInfo ,this)
        }        
    },

    onCurrentBetInfo (currentBetInfo) {
        if(currentBetInfo.playerName === this.playerName){
            let isleft = this.chairIndex % 2 === 0
            let animName = isleft ? 'head_move_left' : 'head_move_right'
            this._head.$Animation.play(animName)
        }
    }

    // update (dt) {},
});
