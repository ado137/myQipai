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
let hh_const = require('hh_const');
let Thor = require('Thor');
cc.Class({
    extends: Thor,

    editor: {
        executeInEditMode: false,
    },


    properties: {

    },

    _onButtonHistoryTouchEnd () {
        cc.log('_onbuttonHistory')
        this.node.parent.parent.getComponent('hh_mainLayer').openHistoryUI()
    }

    // update (dt) {},
});
