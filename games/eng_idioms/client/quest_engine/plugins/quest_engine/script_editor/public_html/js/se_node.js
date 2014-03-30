function SENode(/* _QUEST_NODES.* */ type, seEvents, isContinue, storyLine, stage, props) {
    SESpriteObject.call(this);
    this.setDO(new PIXI.Sprite(SENode.TEXTURES.nodes[type]));

    this.seEvents = seEvents;
    this.type = type;
    this.storyLine = storyLine;
    this._stage = stage;
    this.continue = (isContinue !== null && isContinue !== undefined) ?
        isContinue : false;
    if (props === null || props === undefined) {
        //Which fields we have for each type of node
        props = {};
        switch(type) {
            case _QUEST_NODES.NONE:
            break;
            case _QUEST_NODES.PHRASE:
                props.storyLine = null;
                props.id = "";
                props.text = "";
                props.phraseType = _UI_PHRASE_TYPES.SPEAK;
            break;
            case _QUEST_NODES.QUIZ:
                props.storyLine = null;
                props.id = "";
                props.text = "";
                props.phraseType = _UI_PHRASE_TYPES.SPEAK;
                props.ans1 = "";
                props.ans2 = "";
                props.ans3 = "";
                props.ans4 = "";
            break;
            case _QUEST_NODES.ANIM:
                props.storyLine = null;
                props.id = "";
                props.name = "";
            break;
            case _QUEST_NODES.WAIT:
                props.secs = "0";
            break;
            case _QUEST_NODES.STAGE_CLEAR:
            break;
            case _QUEST_NODES.STORYLINE:
                props.objs = [];
            break;
            case _QUEST_NODES.STAGE:
                props.name = "";
            break;
        }
    }
    switch(type) {
        case _QUEST_NODES.STORYLINE:
            this.methods = {};
            this.methods.addObject = storyLineAddObject.bind(this);
        break;
        case _QUEST_NODES.STAGE:
            this.methods = {};
            this.methods.addObject = stageAddObject.bind(this);
            this.methods.takeFromPool = stageTakeFromPool.bind(this);
        break;
    }
    this.props =  props;
    this.inConds = [];
    this.outConds = [];
    this.middle = new PIXI.Point(0, 0);

    this.dragging = { clickPoint : new PIXI.Point(0, 0) };
    this.bounds = new PIXI.Rectangle();
    this.do.mousedown = this.do.touchstart = this.inputEvent.bind(this, "DOWN");
    this.do.mouseup = this.do.touchend = this.inputEvent.bind(this, "UP");
    this.do.mouseout = this.inputEvent.bind(this, "OUT");
    this.do.mouseover = this.inputEvent.bind(this, "IN");
    this.do.mousemove = this.do.touchmove = this.inputEvent.bind(this, "MOVE");
    this.do.click = this.do.tap = this.inputEvent.bind(this, "CLICK");
    this.do.mouseupoutside = this.do.touchendoutside = this.inputEvent.bind(this, "UP_OUTSIDE");

}

SENode.prototype = new SESpriteObject();

SENode.prototype.inputEvent = function(evName, intData) {
    if (evName === "DOWN") {
        var dragPos = this.getLocalPosition(intData);
        this.dragging.clickPoint.x = dragPos.x;
        this.dragging.clickPoint.y = dragPos.y;
        this.seEvents.broadcast({ name : "NODE_DOWN", intData : intData, node : this });
        return;
    }
}

function storyLineAddObject(objId) {
    this.props.objs.push(objId);
    this._stage.methods.takeFromPool(objId);
}

function stageAddObject(objId) {
    this.props.objs.push(objId);
    this.props.objPool.push(objId);
}

function stageTakeFromPool(objId) {
    this.props.objPool.remove(objId);
}

SENode.prototype.setPosition = function(x, y) {
    SESpriteObject.prototype.setPosition.call(this, x, y);
    this.middle.x = this.getX() + this.getWidth() / 2;
    this.middle.y = this.getY() + this.getHeight() / 2;

    for (i = 0; i < this.inConds.length; ++i) {
        var cond = this.inConds[i];
        this.positionInCond(cond);
    }
    for (i = 0; i < this.outConds.length; ++i) {
        var cond = this.outConds[i];
        this.positionOutCond(cond);
    }
};

SENode.prototype.positionInCond = function(cond) {
    cond.setDst(this.middle);
};

SENode.prototype.addInCond = function(cond) {
    this.inConds.push(cond);
    cond.setDstNode(this);
    this.positionInCond(cond);
};

SENode.prototype.positionOutCond = function(cond) {
    cond.setSrc(this.middle);
};

SENode.prototype.addOutCond = function(cond) {
    this.outConds.push(cond);
    cond.setSrcNode(this);
    this.positionOutCond(cond);
};

SENode.prototype.dragTo = function(point) {
    this.setPosition(point.x - this.dragging.clickPoint.x,
        point.y - this.dragging.clickPoint.y);
};

SENode.prototype.endDrag = function() {
    this.dragging.clickPoint.x = 0;
    this.dragging.clickPoint.y = 0;
};

SENode.prototype.contains = function(px, py) {
    var MARGIN = 10;
    this.bounds.x = this.getX() - MARGIN;
    this.bounds.y = this.getY() - MARGIN;
    this.bounds.width = this.getWidth() + 2 * MARGIN;
    this.bounds.height = this.getHeight() + 2 * MARGIN;

    return this.bounds.contains(px, py);
};

function SENodeStaticConstructor(completionCB) {
    SENode.TEXTURE_PATHS = { nodes : {} };
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM] = "images/node_anim.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE] = "images/node_phrase.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ] = "images/node_quiz.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE] = "images/node_stage.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE] = "images/node_stln.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT] = "images/node_wait.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE] = "images/node_none.png";

    var assetsToLoad = $.map(SENode.TEXTURE_PATHS.nodes,
        function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        SENode.TEXTURES = { nodes : {} };
        SENode.TEXTURES.nodes[_QUEST_NODES.ANIM] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM]);
        SENode.TEXTURES.nodes[_QUEST_NODES.PHRASE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.QUIZ] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STAGE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STAGE_CLEAR] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR]);
        SENode.TEXTURES.nodes[_QUEST_NODES.STORYLINE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE]);
        SENode.TEXTURES.nodes[_QUEST_NODES.WAIT] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT]);
        SENode.TEXTURES.nodes[_QUEST_NODES.NONE] =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE]);

        completionCB();
    };
    loader.load();
}
