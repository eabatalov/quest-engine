function SECond(/* _QUEST_CONDS.* */ type, /* SENode */ node, storyLine, seEvents, props) {
    SEDisplayObject.call(this);
    this.setDO(new PIXI.Graphics());
    this.points = {};
    this.points.src = new PIXI.Point(0, 0);
    this.points.dst = new PIXI.Point(0, 0);

    this.seEvents = seEvents;
    this.type = type;
    this.storyLine = storyLine;
    this.changeType = condChangeType;
    this.setSrc = condSetSrc;
    this.setDst = condSetDst;
    this.reDraw = condDrawEdge;
    this.node = node; //Node which will be picked if cond is met
    if (props !== null && props !== undefined) {
        this.props =  props;
    } else {
        this.changeType(type);
    }

    this.dragging = {};
    this.dragging.pending = false;
    this.dragging.circle = new PIXI.Circle(0, 0, 0);

    this.do.click = condClicked.bind(this);
    this.do.mousedown = this.do.touchstart = condMouseDown.bind(this);
    this.do.mouseup = this.do.mouseupoutside = this.do.touchend =
        this.do.touchendoutside = condMouseUp.bind(this);
    this.do.mousemove = this.touchmove = condMouseMove.bind(this);
}

SECond.prototype = new SEDisplayObject(); 
SECond.prototype.constructor = SECond;

SECond.CIRCLE_RADIUS = 5;

function condMouseDown(intData) {
    if (!this.dragging.pending) {
        var clickPt = this.do.parent.sedo.getLocalPosition(intData);
        this.dragging.circle.x = this.points.dst.x;
        this.dragging.circle.y = this.points.dst.y;
        this.dragging.circle.radius = SECond.CIRCLE_RADIUS;

        if (this.dragging.circle.contains(clickPt.x, clickPt.y)) {
            this.do.alpha = 0.5;
            this.dragging.intData = intData;
            this.dragging.pending = true;
            this.dragging.srcPos = this.do.position.clone();
        }
    }
}

function condMouseMove(intData) {
    if (this.dragging.pending)
    {
        //var wh
        //if (!ToolBarItem.position.verify(this.dragging.intData, wh))
        //    return;

        var newPosition = this.do.parent.sedo.getLocalPosition(this.dragging.intData);
        this.setDst(newPosition);
        SECond.sceneUpdater.up();
    }
}

function condMouseUp(intData) {
    if (this.dragging.pending) {
        //Do nothing
    }

    this.do.alpha = 1;
    this.dragging.pending = false;
    this.dragging.intData = null;
    this.srcPos = null;
    SECond.sceneUpdater.up();
}

function condChangeType(type) {
    this.props = {};
    switch(type) {
        case _QUEST_CONDS.OBJECT_CLICKED:
            this.props.id = "";
        break;
    }
}

function condSetSrc(point) {
    this.points.src = point;
    this.reDraw();
}

function condSetDst(point) {
    this.points.dst = point;
    this.reDraw();
}

function condDrawEdge() {
    this.do.clear();
    var WIDTH = 5;
    var CLICK_WIDTH = WIDTH + 10;
    this.do.lineStyle(WIDTH, 0x000000, 1);
    this.do.moveTo(this.points.src.x, this.points.src.y);
    this.do.lineTo(this.points.dst.x, this.points.dst.y);

    this.do.drawCircle(this.points.dst.x, this.points.dst.y, SECond.CIRCLE_RADIUS);
    //XXX error here
    this.do.hitArea = new PIXI.Polygon([
        new PIXI.Point(this.points.src.x, this.points.src.y + CLICK_WIDTH / 2),
        new PIXI.Point(this.points.src.x - CLICK_WIDTH / 2, this.points.src.y),
        new PIXI.Point(this.points.src.x, this.points.src.y - CLICK_WIDTH / 2),
        new PIXI.Point(this.points.src.x + CLICK_WIDTH / 2, this.points.src.y),

        new PIXI.Point(this.points.dst.x, this.points.dst.y - CLICK_WIDTH / 2),
        new PIXI.Point(this.points.dst.x + CLICK_WIDTH / 2, this.points.dst.y),
        new PIXI.Point(this.points.dst.x, this.points.dst.y + CLICK_WIDTH / 2),
        new PIXI.Point(this.points.dst.x - CLICK_WIDTH / 2, this.points.dst.y)
    ]);
}

function condClicked(intData) {
    if (intData.originalEvent.shiftKey) {
        SECond.treeEditor.deleteCond(this);
    } else {
        this.seEvents.broadcast({
            name : "COND_PROP_EDIT",
            obj : this
        });
    }
}

function SECondStaticConstructor(completionCB) {
    completionCB();
}
