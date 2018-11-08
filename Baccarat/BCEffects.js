/**
 * @description 特效
 */
module.exports = {
        /**
         * @description 赢字特效
         */
        effectWin : function(s_win, target){

            cc.log('=================effectWin=============')
            //整个节点缩小到1:1
            var labelAct = cc.scaleTo(0.1, 1, 1);
            labelAct.easing(cc.easeCircleActionIn());
            s_win.runAction(labelAct);

            //整个节点fadeIn
            var fadeAct = cc.fadeIn(0.1);
            fadeAct.easing(cc.easeCircleActionIn());
            s_win.runAction(fadeAct);

            //赢字移动
            var text = s_win.getChildByName('TextWin');
            var nowTextY = text.getPosition().y;
            text.setPosition(0,nowTextY-20);

            //爆炸效果
            var boomCall = cc.callFunc(function(){
                var boom = s_win.getChildByName('Effects').getChildByName('Boom');
                
                boom.active = true;
                boom.getComponent(cc.ParticleSystem).resetSystem();
                target.scheduleOnce(function(){
                    boom.active = false;
                    var circle =  s_win.getChildByName('Effects').getChildByName('Circle');
                    var sunLight =  s_win.getChildByName('Effects').getChildByName('SunLight');
                    var blin =  s_win.getChildByName('Effects').getChildByName('Blin');

                    circle.active = true;
                    sunLight.active = true;
                    blin.active = true;
                },1.2);
                
            }, target);

            var textAct = cc.moveTo(0.5, 0, nowTextY);
            textAct.easing(cc.easeCircleActionIn());
            text.runAction(cc.sequence(textAct, boomCall));   
        },

        /**
         * @description 隐藏赢家
         */
        hideWinners : function(_typespace,target){
                var s_win = _typespace.getChildByName('Effect_Win');
                //还原特效
                s_win.setScale(1.3,1.3);
                s_win.opacity = 0;

                var circle =  s_win.getChildByName('Effects').getChildByName('Circle');
                var sunLight =  s_win.getChildByName('Effects').getChildByName('SunLight');
                var blin =  s_win.getChildByName('Effects').getChildByName('Blin');

                circle.active = false;
                sunLight.active = false;
                blin.active = false;
        },

        /**
        * @description 牛牛特效
        */
        effectNiuNiu : function(lightLabel, target){
            var effect = lightLabel.getChildByName('effects');
            var boom = effect.getChildByName('LightBoom');
            var line = effect.getChildByName('LightLine');

            boom.active = true;
            line.active = true;

            target.scheduleOnce(function(){
                boom.active = false;
                line.active = false;
            }, 3);

            var lightLeft = effect.getChildByName('LightLebalLeft');
            lightLeft.setScale(-1,0);
            var lightRight = effect.getChildByName('LightLebalRight');
            lightRight.setScale(1,0);

            var act1 = cc.fadeIn(0.5);
            act1.easing(cc.easeCircleActionIn());
            var act2 = cc.fadeOut(1);
            act2.easing(cc.easeCircleActionOut());

            var act3 = cc.fadeIn(0.5);
            act3.easing(cc.easeCircleActionIn());
            var act4 = cc.fadeOut(1);
            act4.easing(cc.easeCircleActionOut());

            var sc1 = cc.scaleTo(0.5,-1.5,-1);
            sc1.easing(cc.easeCircleActionIn());
            var sc2 = cc.scaleTo(1,-1,0);
            sc2.easing(cc.easeCircleActionIn());

            var sc3 = cc.scaleTo(0.5,1.5,1);
            sc3.easing(cc.easeCircleActionIn());
            var sc4 = cc.scaleTo(1,1,0);
            sc4.easing(cc.easeCircleActionIn());

            lightLeft.runAction(cc.sequence(act1, act2));
            lightRight.runAction(cc.sequence(act3, act4));

            lightLeft.runAction(cc.sequence(sc1, sc2));
            lightRight.runAction(cc.sequence(sc3, sc4));

        },

        /**
        * @description 牛N特效
        */
        effectNiuN : function(lightLabel, target){
            var effect = lightLabel.getChildByName('effects');
            var pop = effect.getChildByName('LightPop');

            pop.active = true;

            var move = cc.moveTo(0.2, -60, 0);
            pop.runAction(move);

            target.scheduleOnce(function(){
                pop.active = false;
                pop.setPosition(0,0);
            }, 2);
        }

}
