function ScriptTreeEditor(rootScope, /*DisplayObject */ parent, seEvents, sceneUpdater, mouseWheelManager) {
    SEDisplayObject.call(this, new PIXI.DisplayObjectContainer());
    this.seEvents = seEvents;
    this.sceneUpdater = sceneUpdater;

    var VIRTUAL_SIZE = { WIDTH : 10000, HEIGHT : 10000 };
    this.setPosition(0, 0);
    this.setWH(VIRTUAL_SIZE.WIDTH, VIRTUAL_SIZE.HEIGHT);
    this.setParent(parent);
    //We will scale and move this object
    this.editingBg = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.editingBg.setPosition(0, 0);
    this.editingBg.setWH(VIRTUAL_SIZE.WIDTH, VIRTUAL_SIZE.HEIGHT);
    this.editingBg.do.hitArea =
        new PIXI.Rectangle(this.editingBg.getX(), this.editingBg.getY(),
                this.editingBg.getWidth(), this.editingBg.getHeight());
    this.editingBg.setParent(this);
    this.nodesLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.condsLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.nodesLayer.setParent(this.editingBg);
    this.condsLayer.setParent(this.editingBg);

    this.input = { dragging : { node : null, all : false, prevAllDragPos : new PIXI.Point(0, 0) } };
    this.do.hitArea = new PIXI.Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    this.do.mousedown = this.do.touchstart = scriptTreeEditorInputEvent.bind(this, "DOWN");
    this.do.mouseup = this.do.touchend = scriptTreeEditorInputEvent.bind(this, "UP");
    this.do.mouseout = scriptTreeEditorInputEvent.bind(this, "OUT");
    this.do.mouseover = scriptTreeEditorInputEvent.bind(this, "IN");
    this.do.mousemove = this.do.touchmove = scriptTreeEditorInputEvent.bind(this, "MOVE");
    this.do.click  = this.do.tap = scriptTreeEditorInputEvent.bind(this, "CLICK");
    this.do.mouseupoutside = this.do.touchendoutside = scriptTreeEditorInputEvent.bind(this, "UP_OUTSIDE");
    mouseWheelManager.onSEDO(this, seTreeEditorOnMouseWheel);

    //Initial script tree nodes
    this.conds = [];
    this.nodes = {};
    this.nodes.all = [];
    this.nodes.stages = [
        new SENode(_QUEST_NODES.STAGE, this.seEvents, false, null, null,
            { name : "Stage1", objs : [ _QUEST_PLAYER_ID, "older", "firstLantern", "secondLantern", "0" ], objPool : [] })
    ];
    this.nodes.stages[0]._stage = this.nodes.stages[0];
    this.nodes.stages[0].setPosition(400, this.nodes.stages[0].getHeight());

    this.nodes.storyLines = [
        new SENode(_QUEST_NODES.STORYLINE, this.seEvents, false, null, this.nodes.stages[0],
            { objs: [_QUEST_PLAYER_ID, "older", "firstLantern", "secondLantern", "0"] })
    ];
    this.nodes.storyLines[0].setPosition(this.nodes.stages[0].getX(),
        this.nodes.stages[0].getY() + this.nodes.stages[0].getHeight() * 2);

    this.nodes.stages[0].conds.push(
        new SECond(_QUEST_CONDS.NONE, this.nodes.storyLines[0], this.nodes.storyLines[0], this.seEvents)
    );

    this.conds.push(this.nodes.stages[0].conds[0]);
    this.conds[0].setSrc(new PIXI.Point(
        this.nodes.stages[0].getX() + this.nodes.stages[0].getWidth() / 2,
        this.nodes.stages[0].getY() + this.nodes.stages[0].getHeight()
    ));
    this.conds[0].setDst(new PIXI.Point(
        this.nodes.storyLines[0].getX() + this.nodes.storyLines[0].getWidth() / 2,
        this.nodes.storyLines[0].getY()
    ));

    //Register all initial nodes and conds
    $.each(this.nodes.stages, function(ix, node) {
        this.nodes.all.push(node);
        node.setParent(this.nodesLayer);
    }.bind(this));
    $.each(this.nodes.storyLines, function(ix, node) {
        this.nodes.all.push(node);
        node.setParent(this.nodesLayer);
    }.bind(this));
    $.each(this.conds, function(ix, cond) {
        cond.setParent(this.condsLayer);
    }.bind(this));

    this.seEvents.on(scriptTreeEditorOnSeEvent.bind(this));

    this.nodePositionValidator = new SENodePositionValidator(this);
    //Looks like XXX but need to inject one instance for all
    //the nodes and conds some way
    //TODO use angular injector someway
    SECond.treeEditor = this;
    SECond.sceneUpdater = this.sceneUpdater;
    SECond.positionValidator = new SECondPositionValidator(this);
}

ScriptTreeEditor.prototype = new SEDisplayObject();

function SECondPositionValidator(seTreeEditor) {
    this.validate = function(intData, cond) {
        var rectOrigin = seTreeEditor.getLocalPosition(intData);

        var overallBoundsOk = (
            0 <= rectOrigin.x &&
            0 <= rectOrigin.y &&
            seTreeEditor.getWidth() >= (rectOrigin.x + SECond.CIRCLE_RADIUS) &&
            seTreeEditor.getHeight() >= (rectOrigin.y + SECond.CIRCLE_RADIUS)
        ) ? true : false;

        return overallBoundsOk
    }
}

function SENodePositionValidator(seTreeEditor) {
    /*
     * Return true if specified rectangular object can be placed on editor.
     * Rect bounds are passed as parameters.
     */
    this.validate = function(vNode) {
        var NODE_MARGIN = 10;
        var nodesOk = true;
        var nodeHitArea = new PIXI.Rectangle(0, 0, 0, 0);
        var vNodeRect = new PIXI.Rectangle(vNode.getX(), vNode.getY(), vNode.getWidth(), vNode.getHeight());
        $.each(seTreeEditor.nodes.all, function(ix, node) {
            if (vNode.id === node.id)
                return true;

            nodeHitArea.x = node.getX() - NODE_MARGIN;
            nodeHitArea.y = node.getY() - NODE_MARGIN;
            nodeHitArea.width = node.getWidth() + 2 * NODE_MARGIN;
            nodeHitArea.height = node.getHeight() + 2 * NODE_MARGIN;
            if (nodeHitArea.contains(vNodeRect.x, vNodeRect.y) ||
                nodeHitArea.contains(vNodeRect.x + vNodeRect.width, vNodeRect.y) ||
                nodeHitArea.contains(vNodeRect.x, vNodeRect.y + vNodeRect.height) ||
                nodeHitArea.contains(vNodeRect.x + vNodeRect.width, vNodeRect.y + vNodeRect.height)) {
                    nodesOk = false;
                    return false;
            }
        });
        return nodesOk;
    };
}

function scriptTreeEditorOnSeEvent(args) {
    if (args.name === "NODE_CREATE") {
        var pos = this.nodesLayer.getLocalPosition(args.intData);
        var newNode = new SENode(args.type,
            this.seEvents, false,
            this.nodes.storyLines[0],
            this.nodes.stages[0]);
        newNode.setPosition(pos.x, pos.y);
        newNode.setParent(this.nodesLayer);
        this.nodes.all.push(newNode);
        this.sceneUpdater.up();
        return;
    }

    if (args.name === "NODE_DRAG") {
        this.input.dragging.node = args.node;
        return; 
    }

    if (args.name === "NODE_END_DRAG") {
        this.input.dragging.node = null;
        return;
    }

    if (args.name === "EDITOR_START_DRAG") {
        var pos  = this.getLocalPosition(args.intData);
        this.input.dragging.prevAllDragPos.x = pos.x;
        this.input.dragging.prevAllDragPos.y = pos.y;
        this.input.dragging.all = true;
        return;
    }

    if (args.name === "EDITOR_END_DRAG") {
        this.input.dragging.all = false;
        this.input.dragging.prevAllDragPos.x = 0;
        this.input.dragging.prevAllDragPos.y = 0;
        return;
    }
}

function seTreeEditorOnMouseWheel(yDelta) {
    var MIN_ZOOM = 0.2;
    var MAX_ZOOM = 5;

    if (yDelta > 0) {
        if (this.editingBg.getScale() < MAX_ZOOM) {
            this.editingBg.setScale(this.editingBg.getScale() + 0.1);
        }
    } else if (yDelta < 0) {
        if (this.editingBg.getScale() > MIN_ZOOM) {
            this.editingBg.setScale(this.editingBg.getScale() - 0.1);
        }
    }
    this.sceneUpdater.up();
    return false;
}

function scriptTreeEditorInputEvent(evName, intData) {
    if (evName === "MOVE") {
        if (this.input.dragging.node) {
            var oldX = this.input.dragging.node.getX();
            var oldY = this.input.dragging.node.getY();
            var newDragPos = this.nodesLayer.getLocalPosition(intData);
            this.input.dragging.node.dragTo(newDragPos);
            if (this.nodePositionValidator.validate(this.input.dragging.node)) {
                this.sceneUpdater.up();
            } else {
                this.input.dragging.node.setPosition(oldX, oldY);
            }
        } else if (this.input.dragging.all) {
            console.log("dragging all editor");
            var BOUNDS = { MIN_X : -250, MAX_X : 250, MIN_Y : -250, MAX_Y : 250 };
            var mPos = this.getLocalPosition(intData);
            var dx = mPos.x - this.input.dragging.prevAllDragPos.x;
            var dy = mPos.y - this.input.dragging.prevAllDragPos.y;
            var newX = this.editingBg.getX() + dx;
            var newY = this.editingBg.getY() + dy;
            if (newX >= BOUNDS.MIN_X && newX <= BOUNDS.MAX_X &&
                newY >= BOUNDS.MIN_Y && newY <= BOUNDS.MAX_Y) {
                this.editingBg.setPosition(newX, newY);
            }
            this.input.dragging.prevAllDragPos.x = mPos.x;
            this.input.dragging.prevAllDragPos.y = mPos.y;
            this.sceneUpdater.up();
        }
        return;
    }

    if (evName === "CLICK") {
        console.log(evName);
        this.seEvents.broadcast({ name : "EDITOR_CLICK", intData : intData });
        return;
    }

    if (evName === "DOWN") {
        console.log(evName);
        this.seEvents.broadcast({ name : "EDITOR_DOWN", intData : intData });
        return;
    }

    if (evName === "UP") {
        console.log(evName);
        this.seEvents.broadcast({ name : "EDITOR_UP" });
        return;
    }

    if (evName === "UP_OUTSIDE") {
        console.log(evName);
        this.seEvents.broadcast({ name : "EDITOR_UP_OUTSIDE" });
        return;
    }
}

function scriptTreeEditorMouseDown(intData) {
    if (intData.originalEvent.ctrlKey) {
        var newCond = new SECond(_QUEST_CONDS.NONE, null, this.nodes.storyLines[0], this.seEvents);
        newCond.setParent(this.condsLayer);
        this.conds.push(newCond);

        var src = this.getLocalPosition(intData);
        newCond.setSrc(src);
        newCond.setDst(src);

        this.seEvents.broadcast({
            name : "COND_PROP_EDIT",
            obj : newCond
        });
        newCond.beginDragging(intData);
    }
}

ScriptTreeEditor.prototype.deleteNode = function(node) {
    this.nodes.all.remove(node);
    node.detachParent();
    this.sceneUpdater.up();
};

ScriptTreeEditor.prototype.deleteCond = function(cond) {
    this.conds.remove(cond);
    cond.detachParent();
    this.sceneUpdater.up();
}

function ScriptTreeEditorStaticConstructor(completionCB) {
    completionCB();
}

function PositionValidatorFactory(treeEditor) {
    return treeEditor.positionValidator;
}
