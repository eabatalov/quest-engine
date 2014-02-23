function SECond(/* _QUEST_COND_* */ type, /* SENode */ node, storyLine, seEvents, props) {
    PIXI.Graphics.call(this);
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
    this.setInteractive(true);
    this.click = condClicked.bind(this);
}

function condChangeType(type) {
    this.props = {};
    switch(type) {
        case _QUEST_COND_OBJECT_CLICKED:
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
    this.clear();
    var WIDTH = 5;
    var CLICK_WIDTH = WIDTH + 10;
    this.lineStyle(WIDTH, 0x000000, 1);
    this.moveTo(this.points.src.x, this.points.src.y);
    this.lineTo(this.points.dst.x, this.points.dst.y);

    this.drawCircle(this.points.dst.x, this.points.dst.y, WIDTH);
    //XXX error here
    this.hitArea = new PIXI.Polygon([
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
            obj : intData.target
        });
    }
}

function SECondStaticConstructor(completionCB) {
    SECond.prototype = new PIXI.Graphics();
    SECond.prototype.constructor = SECond;
    completionCB();
}