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
    this.condsLayer.setParent(this.editingBg);
    this.nodesLayer.setParent(this.editingBg);

    this.input = { dragging : { node : null, cond: null, all : false, prevAllDragPos : new PIXI.Point(0, 0) } };
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
    this.nodes.stages[0].setPosition(0, 0);

    this.nodes.storyLines = [
        new SENode(_QUEST_NODES.STORYLINE, this.seEvents, false, null, this.nodes.stages[0],
            { objs: [_QUEST_PLAYER_ID, "older", "firstLantern", "secondLantern", "0"] })
    ];
    this.nodes.storyLines[0].setPosition(this.nodes.stages[0].getX(),
        this.nodes.stages[0].getY() + this.nodes.stages[0].getHeight() * 2);

    var firstCond = new SECond(_QUEST_CONDS.NONE, this.nodes.storyLines[0], this.seEvents);

    this.nodes.stages[0].addOutCond(firstCond);
    this.nodes.storyLines[0].addInCond(firstCond);
    this.conds.push(firstCond);

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

    this.posValidator = new SEEditorPositionValidator(this);
}

ScriptTreeEditor.prototype = new SEDisplayObject();

function SEEditorPositionValidator(seTreeEditor) {
    var pointList = [];
    //points pool
    var p1 = new PIXI.Point(0, 0);
    var p2 = new PIXI.Point(0, 0);
    var p3 = new PIXI.Point(0, 0);
    var p4 = new PIXI.Point(0, 0);
    var p5 = new PIXI.Point(0, 0);
    var p6 = new PIXI.Point(0, 0);
    var p7 = new PIXI.Point(0, 0);
    var p8 = new PIXI.Point(0, 0);

    this.validateNode = function(node) {
        pointList.length = 0;
        p1.x = node.getX();
        p1.y = node.getY();
        p2.x = node.getX();
        p2.y = node.getY() + node.getHeight();
        p3.x = node.getX() + node.getWidth();
        p3.y = node.getY();
        p4.x = node.getX() + node.getWidth();
        p4.y = node.getY() + node.getHeight();
        pointList.push(p1, p2, p3, p4);

        return validatePointList.call(this, node.getId());
    };

    this.validateCond = function(cond) {
        return true;
    };

    this.pointIsNotContained = function(px, py) {
        //Doesn't point is contained within some editor object?
        pointList.length = 0;
        p1.x = px;
        p1.y = py;
        pointList.push(p1);
        return validatePointList.call(this);
    };

    function validatePointList(objIdToExclude) {
        var ok = true;
        $.each(seTreeEditor.nodes.all, function(ix, node) {
            if (objIdToExclude === node.getId())
                return true;

            for (i = 0; i < pointList.length; ++i) {
                if (node.contains(pointList[i].x, pointList[i].y)) {
                    ok = false;
                    break;
                }
            }
        });

        if (!ok) return ok;

        $.each(seTreeEditor.conds, function(ix, cond) {
             if (objIdToExclude === cond.getId())
                return true;

                for (i = 0; i < pointList.length; ++i) {
                    if (cond.contains(pointList[i].x, pointList[i].y)) {
                        ok = false;
                        break;
                    }
                }           
        });
        return ok;
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
        //TODO need 100% creation to send confiramation event
        //if (this.posValidator.validateNode(newNode)) {
            newNode.setParent(this.nodesLayer);
            this.nodes.all.push(newNode);
            this.sceneUpdater.up();
        //} else newNode = null; //TODO move node to the nearest appropriate position
        this.seEvents.broadcast({ name : "NODE_CREATED", node : newNode });
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
        var pos  = this.editingBg.getLocalPosition(args.intData);
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

    if (args.name === "COND_CREATE_FROM_NODE") {
        var newCond = new SECond(_QUEST_CONDS.NONE, this.nodes.storyLines[0], this.seEvents);
        newCond.setParent(this.condsLayer);
        this.conds.push(newCond);
        args.node.addOutCond(newCond);
        args.node.positionInCond(newCond);
        this.seEvents.broadcast({ name : "COND_CREATED", cond : newCond });
        return;
    }

    if (args.name === "COND_START_DRAG") {
        this.input.dragging.cond = args.cond;
        return;
    }

    if (args.name === "COND_END_DRAG") {
        this.input.dragging.cond = null;
        return;
    }

    if (args.name === "NODE_ADD_IN_COND") {
        args.node.addInCond(args.cond);
        this.sceneUpdater.up();
        return;
    }

    if (args.name === "NODE_DELETE") {
        this.nodes.all.removeBySEId(args.node.getId());
        this.nodes.stages.removeBySEId(args.node.getId());
        this.nodes.storyLines.removeBySEId(args.node.getId());
        args.node.delete(function(cond) { this.conds.removeBySEId(cond.getId()); }.bind(this));
        this.sceneUpdater.up();
        return;
    }

    if (args.name === "COND_DELETE") {
        this.conds.removeBySEId(args.cond.getId());
        args.cond.delete();
        this.sceneUpdater.up();
        return;
    }

    if (args.name === "COND_SNAP_TO_NODE") {
        this.input.dragging.condSnap = true;
        args.node.positionInCond(args.cond);
        args.node.highlight(true);
        return;
    }

    if (args.name === "COND_UNSNAP_TO_NODE") {
        this.input.dragging.condSnap = false;
        args.node.highlight(false);
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

ScriptTreeEditor.prototype.editorMouseEvent = function(intData) {
    var pt = this.editingBg.getLocalPosition(intData);
    return this.posValidator.pointIsNotContained(pt.x, pt.y);
}

function scriptTreeEditorInputEvent(evName, intData) {
    if (evName === "MOVE") {
        if (this.input.dragging.node) {
            var oldX = this.input.dragging.node.getX();
            var oldY = this.input.dragging.node.getY();
            var newDragPos = this.nodesLayer.getLocalPosition(intData);
            this.input.dragging.node.dragTo(newDragPos);
            if (this.posValidator.validateNode(this.input.dragging.node)) {
                this.sceneUpdater.up();
            } else {
                this.input.dragging.node.setPosition(oldX, oldY);
            }
        } else if (this.input.dragging.cond && ! this.input.dragging.condSnap) {
            var pt = this.condsLayer.getLocalPosition(intData);
            this.input.dragging.cond.setDst(pt);
            this.sceneUpdater.up();
        } else if (this.input.dragging.all) {
            var BOUNDS = { MIN_X : -250, MAX_X : 250, MIN_Y : -250, MAX_Y : 250 };
            var mPos = this.editingBg.getLocalPosition(intData);
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

    if (evName === "CLICK" && this.editorMouseEvent(intData)) {
        this.seEvents.broadcast({ name : "EDITOR_CLICK", intData : intData });
        return;
    }

    if (evName === "DOWN" && this.editorMouseEvent(intData)) {
        this.seEvents.broadcast({ name : "EDITOR_DOWN", intData : intData });
        return;
    }

    if (evName === "UP" &&
        (this.input.dragging.node || this.input.dragging.all) &&
        true) {
            this.seEvents.broadcast({ name : "EDITOR_UP" });
        return;
    }

    if (evName === "UP" && this.input.dragging.cond) {
        var pt = this.editingBg.getLocalPosition(intData);
        if (this.editorMouseEvent(intData) ||
            this.input.dragging.cond.contains(pt.x, pt.y))
        {
            this.seEvents.broadcast({ name : "EDITOR_UP" });
            return;
        }
    }

    if (evName === "UP_OUTSIDE") {
        this.seEvents.broadcast({ name : "EDITOR_UP_OUTSIDE" });
        return;
    }
}

function ScriptTreeEditorStaticConstructor(completionCB) {
    completionCB();
}
