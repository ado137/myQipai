cc.Class({
    extends: cc.Component,
    properties: {
        _canvas: null,
        points: {
            default: [],
            type: cc.Vec2,
        },

        tablenumber:0

    },

    /**
     * @description 计算基准点坐标
     */
    CalculateCoord(){
        this.coord = []
        var child = this.node.children
        for (let index = 0; index < child.length; index++) {
            this.points.push(child[index].getPosition())
        }
    },


    onLoad() {
        this.CalculateCoord();
        this._canvas = cc.find('Canvas');
        this._canvas.on(cc.Node.EventType.TOUCH_END, (e) => {
            let location = e.getLocation();
            let isContain = this.check(location);
            this.check(location);
            if(isContain){
                this.node.opacity = 0
                this.callback(this.msg)
            }
        }, this);
        this._canvas.on(cc.Node.EventType.TOUCH_START, (e) => {
            let location = e.getLocation();
            let isContain = this.check(location);
            if(isContain){
                this.node.opacity = 255
                cc.log('touchdown')
            }
        }, this);
        this._canvas.on(cc.Node.EventType.TOUCH_END, (e) => {
            this.node.opacity = 0
        }, this);
    },

    onClick(_callback,_msg){
        this.callback = _callback
        this.msg = _msg
    },
    check(location) {
        let node = this.node;
        let pointInNode = node.convertToNodeSpaceAR(location);
        if (pointInNode.x < -node.width / 2 || pointInNode.x > node.width / 2 || pointInNode.y > node.height / 2 || pointInNode.y < -node.height / 2) {
            return false;
        }

        let i, j, c = false;

        let nvert = this.points.length;
        let testx = pointInNode.x;
        let testy = pointInNode.y;
        let vert = this.points;

        for (i = 0, j = nvert - 1; i < nvert; j = i++) {
            if (((vert[i].y > testy) != (vert[j].y > testy)) &&
                (testx < (vert[j].x - vert[i].x) * (testy - vert[i].y) / (vert[j].y - vert[i].y) + vert[i].x))
                c = !c;
        }

        return c;
    }




});