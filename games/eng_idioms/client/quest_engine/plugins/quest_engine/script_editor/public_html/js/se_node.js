function SENode(/* _QUEST_NODES.* */ type, seEvents, isContinue, storyLine, stage, props) {
    SESpriteObject.call(this, new PIXI.Sprite(SENode.TEXTURES.nodes[type]));
    this.buttons = {
        del : new SESpriteObject(new PIXI.Sprite(SENode.TEXTURES.buttons.del)),
        cond : new SESpriteObject(new PIXI.Sprite(SENode.TEXTURES.buttons.cond))
    };
    this.label = new SESpriteObject(new PIXI.Sprite(SENode.TEXTURES.label));
    this.buttons.del.setParent(this);
    this.buttons.cond.setParent(this);
    this.label.setParent(this);
    var CONTROL_DIST = 10;
    this.label.setPosition((this.getWidth() - this.label.getWidth()) / 2, this.getHeight() + CONTROL_DIST);
    this.buttons.del.setPosition(-CONTROL_DIST, -CONTROL_DIST);
    this.buttons.cond.setPosition(this.getWidth() - this.buttons.cond.getWidth() + CONTROL_DIST, -CONTROL_DIST);
    this.buttons.del.do.buttonMode = true;
    this.buttons.cond.do.buttonMode = true;
    this.setControlsVisible(false);

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
    this.buttons.del.do.click = this.controlEvent.bind(this, "DEL", "CLICK");
    this.buttons.cond.do.click = this.controlEvent.bind(this, "COND", "CLICK");

    this.seEvents.on(this.onSeEvent.bind(this));
}

SENode.prototype = new SESpriteObject();

SENode.prototype.isNodeEvent = function(intData) {
    var p = this.getLocalPosition(intData);
    if (this.buttons.del.contains(p.x, p.y) ||
        this.buttons.cond.contains(p.x, p.y))
        return false;
    else return true;
};

SENode.prototype.onSeEvent = function(args) {
    if (args.name === "OBJECT_FOCUS") {
        if (args.obj.getId() === this.getId()) {
            this.setControlsVisible(true);
        } else {
            this.setControlsVisible(false);
        };
        return;
    }
};

SENode.prototype.inputEvent = function(evName, intData) {
    if (evName === "DOWN" && this.isNodeEvent(intData)) {
        var dragPos = this.getLocalPosition(intData);
        this.dragging.clickPoint.x = dragPos.x;
        this.dragging.clickPoint.y = dragPos.y;
        this.seEvents.broadcast({ name : "NODE_DOWN", intData : intData, node : this });
        return;
    }
}

SENode.prototype.controlEvent = function(ctlName, evName) {
    if (ctlName === "DEL" && evName === "CLICK") {
        this.seEvents.broadcast({ name : "NODE_DEL_CLICK" , node : this });
        //console.log(ctlName + " " + evName);
        return;
    }

    if (ctlName === "COND" && evName === "CLICK") {
        this.seEvents.broadcast({ name : "NODE_NEW_COND_CLICK" , node : this });
        //console.log(ctlName + " " + evName);
        return;
    }
};

SENode.prototype.setControlsVisible = function(val) {
    this.buttons.del.setVisible(val);
    this.buttons.cond.setVisible(val);
};

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

SENode.prototype.deleteInCond = function(dCond) {
    for (i = 0; i < this.inConds.length; ++i) {
        var cond = this.inConds[i];
        if (cond.getId() == dCond.getId()) {
            this.inConds.splice(i, 1);
            return;
        }
    }
};

SENode.prototype.positionOutCond = function(cond) {
    cond.setSrc(this.middle);
};

SENode.prototype.addOutCond = function(cond) {
    this.outConds.push(cond);
    cond.setSrcNode(this);
    this.positionOutCond(cond);
};

SENode.prototype.deleteOutCond = function(dCond) {
    for (i = 0; i < this.outConds.length; ++i) {
        var cond = this.outConds[i];
        if (cond.getId() == dCond.getId()) {
            this.outConds.splice(i, 1);
            return;
        }
    }
};

SENode.prototype.delete = function() {
    for (i = 0; i < this.inConds.length; ++i) {
        var cond = this.inConds[i];
        cond.delete();
    }
    for (i = 0; i < this.outConds.length; ++i) {
        var cond = this.outConds[i];
        cond.delete();
    }
    this.detachParent();
    this.setInteractive(false);
    this.seEvents.broadcast({ name : "NODE_DELETED", node : this });
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

    return this.bounds.contains(px, py) ||
        this.buttons.del.contains(px - this.getX(), py - this.getY()) ||
        this.buttons.cond.contains(px - this.getX(), py - this.getY());
};

function SENodeStaticConstructor(completionCB) {
    SENode.TEXTURE_PATHS = { nodes : {}, buttons : {} };
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.ANIM] = "images/node_anim.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.PHRASE] = "images/node_phrase.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.QUIZ] = "images/node_quiz.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE] = "images/node_stage.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STAGE_CLEAR] = "images/node_stcl.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.STORYLINE] = "images/node_stln.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.WAIT] = "images/node_wait.png";
    SENode.TEXTURE_PATHS.nodes[_QUEST_NODES.NONE] = "images/node_none.png";
    SENode.TEXTURE_PATHS.buttons.del = "images/nav/nav_clnode.png";
    SENode.TEXTURE_PATHS.buttons.cond = "images/nav/nav_arrnode.png";
    SENode.TEXTURE_PATHS.label = "images/nav/nav_namenode.png";

    var assetsToLoad = $.map(SENode.TEXTURE_PATHS.nodes,
        function(value, index) { return [value]; });
     assetsToLoad = assetsToLoad.concat($.map(SENode.TEXTURE_PATHS.buttons,
        function(value, index) { return [value]; }));
    assetsToLoad.push(SENode.TEXTURE_PATHS.label);

    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        SENode.TEXTURES = { nodes : {}, buttons : {} };
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
        SENode.TEXTURES.buttons.del =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.buttons.del);
        SENode.TEXTURES.buttons.cond =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.buttons.cond);
        SENode.TEXTURES.label =
            PIXI.Texture.fromImage(SENode.TEXTURE_PATHS.label);

        completionCB();
    };
    loader.load();
}
