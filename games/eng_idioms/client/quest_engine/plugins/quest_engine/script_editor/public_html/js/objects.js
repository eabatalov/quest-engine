function SENode(/* _QUEST_NODE_* */ type, isContinue, priv) {
    PIXI.Sprite.call(this, TEXTURES.nodes[type]);
    this.width = 56;
    this.height = 56;

    this.type = type;
    this.continue = (isContinue !== null && isContinue !== undefined) ?
        isContinue : false;
    if (priv === null || priv === undefined) {
        priv = {};
        switch(type) {
            case _QUEST_NODE_NONE:
            break;
            case _QUEST_NODE_PHRASE:
                priv.id = "TYPE SPEAKER OBJECT ID";
                priv.text = "PHRASE TEXT";
            break;
            case _QUEST_NODE_QUIZ:
                priv.id = "TYPE SPEAKER OBJECT ID";
                priv.text = "QUIZ TEXT";
                priv.ans1 = "ANSWER OPTION 1";
                priv.ans2 = "ANSWER OPTION 2";
                priv.ans3 = "ANSWER OPTION 3";
                priv.ans4 = "ANSWER OPTION 4";
            break;
            case _QUEST_NODE_ANIM:
                priv.id = "TYPE OBJECT ID";
                priv.name = "ANIMATION NAME";
            break;
            case _QUEST_NODE_WAIT:
                priv.secs = "SECONDS TO WAIT FOR";
            break;
            case _QUEST_NODE_STAGE_CLEAR:
            break;
            case _QUEST_NODE_STORYLINE:
                priv.objs = [];
            break;
            case _QUEST_NODE_STAGE:
                priv.name = "TYPE STAGE NAME";
            break;
        }
    }
    this.priv =  priv;
    this.conds = [];
    this.setInteractive(true);
    this.click = nodeClicked;
}

function nodeClicked(interactionData) {
    var uiEvents = angular.element($("#toolbarAndTreeCanvas").get(0)).injector().
            get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "NODE_PROP_EDIT",
        obj : interactionData.target
    });
}

function SECond(/* _QUEST_COND_* */ type, /* SENode */ node, priv) {
    PIXI.Graphics.call(this);
    this.points = {};
    this.points.src = new PIXI.Point(0, 0);
    this.points.dst = new PIXI.Point(0, 0);

    this.type = type;
    this.changeType = condChangeType;
    this.setSrc = condSetSrc;
    this.setDst = condSetDst;
    this.reDraw = condDrawEdge;
    this.node = node; //Node which will be picked if cond is met
    if (priv !== null && priv !== undefined) {
        this.priv =  priv;
    } else {
        this.changeType(type);
    }
    this.setInteractive(true);
    this.click = condClicked;
}

function condChangeType(type) {
    this.priv = {};
    switch(type) {
        case _QUEST_COND_OBJECT_CLICKED:
            this.priv.id = "TYPE CLICKED OBJECT ID";
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
    var CLICK_WIDTH = 10;
    var WIDTH = 5;
    this.lineStyle(WIDTH, 0x000000, 1);
    this.moveTo(this.points.src.x, this.points.src.y);
    this.lineTo(this.points.dst.x, this.points.dst.y);

    this.drawCircle(this.points.dst.x, this.points.dst.y, 5);

    var x1 = this.points.src.x < this.points.dst.x ?
        this.points.src.x : this.points.dst.x;
    var y1 = this.points.src.y < this.points.dst.y ?
        this.points.src.y : this.points.dst.y
    var x2 = this.points.src.x >= this.points.dst.x ?
        this.points.src.x : this.points.dst.x;
    var y2 = this.points.src.y >= this.points.dst.y ?
        this.points.src.y : this.points.dst.y
    var width = x2 - x1 > 0 ? x2 - x1 : CLICK_WIDTH;
    var height = y2 - y1 > 0 ? y2 - y1 : CLICK_WIDTH;

    this.hitArea = new PIXI.Rectangle(x1, y1, width, height);
}

function condClicked(interactionData) {
    var uiEvents = angular.element($("#toolbarAndTreeCanvas").get(0)).injector().
            get('ScriptEditorEvents');
    uiEvents.broadcast({
        name : "COND_PROP_EDIT",
        obj : interactionData.target
    });
}