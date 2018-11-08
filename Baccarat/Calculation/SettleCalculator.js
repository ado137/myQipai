var BCConstants = require('BCConstants')
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.a_TableIndex = [0,1,2,3,4,5,6,7]
        this.a_TableOdds = [2,3,33,3,2,12,12,9]
        this.UsersBetInfo = new Object()
        this.Result = {}

    },

    initTable(_tableIndex,_odds){
        this.TableOddsInfo = {}

    },

    setUserBetValue(_token,_tableIndex,_value){
        if(!this.UsersBetInfo[_token]){
            this.UsersBetInfo[_token] = new Object()
        }
        if(!this.UsersBetInfo[_token][_tableIndex]){
            this.UsersBetInfo[_token][_tableIndex] = 0
        }
        this.UsersBetInfo[_token][_tableIndex] += Number(_value)
    },

    UserResult(){
        for (const key in this.UsersBetInfo) {
            var result = this.calculerSignalWinOrLose(this.UsersBetInfo[key])
            this.Result[key] = result
        }
        cc.log('========输赢结果========',this.Result)
        this.Clean()
    },

    calculerSignalWinOrLose(_obj){
        var m_WinValue = 0
        var m_LoseValue = 0
        for (let index = 0; index < BCConstants._winnerArray.length; index++) {
            if(BCConstants._winnerArray[index] == 1){
                if(_obj[index]){
                    cc.log('======胜利=====',_obj[index],this.a_TableOdds[index])
                    m_WinValue += _obj[index]*this.a_TableOdds[index]
                }
            }else{
                if(_obj[index]){
                    cc.log('======输=====',_obj[index])
                    m_LoseValue += _obj[index]
                }         
            }         
        }
        return m_WinValue - m_LoseValue
    },

    Clean(){
        this.UsersBetInfo = {}
        this.Result = {}
    },

    start () {

    },

    // update (dt) {},
});
