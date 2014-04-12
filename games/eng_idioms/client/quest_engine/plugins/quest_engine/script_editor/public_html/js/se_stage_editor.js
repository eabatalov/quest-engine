function SEStageEditor(stage, seEventRouter, mouseWheelManager) {
    //Stage dependant stuff
    this.condViews = [];
    this.nodeViews = [];
    this.stage = stage;
    this.addr = SE_ROUTER_EP_ADDR.STAGE_GROUP_FIRST + this.stage.getId();
    this.seEvents = seEventRouter.createEP(this.addr);
    this.seEvents.on(this.onSeEvent, this);

    //Visual stuff
    this.scene = new SEScene();
    this.scene.startPeriodicRendering();
    this.sceneSizeTweak = new SESceneSizeTweak(this.seEvents, this.scene);

    this.pad = new SEDisplayObject(new PIXI.DisplayObjectContainer(), true);
    this.pad.setPosition(0, 0);
    this.pad.setParent(this.scene.getRootSceneObj());
    this.sceneSizeTweak.onSizeChanged = function(w, h) {
        this.pad.setWH(w, h);
        this.pad.setHitArea(new PIXI.Rectangle(0, 0, w, h));
    }.bind(this);

    var VIRTUAL_SIZE = { WIDTH : 10000, HEIGHT : 10000 };
    //We will scale and move this object
    this.editingBg = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.editingBg.setPosition(0, 0);
    this.editingBg.setWH(VIRTUAL_SIZE.WIDTH, VIRTUAL_SIZE.HEIGHT);
    this.editingBg.do.hitArea =
        new PIXI.Rectangle(this.editingBg.getX(), this.editingBg.getY(),
                this.editingBg.getWidth(), this.editingBg.getHeight());
    this.editingBg.setParent(this.pad);
    this.nodesLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.condsLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.condsLayer.setParent(this.editingBg);
    this.nodesLayer.setParent(this.editingBg);

    this.input = { dragging : { nodeView : null, condView: null, all : false, prevAllDragPos : new PIXI.Point(0, 0) } };
    this.pad.do.mousedown = this.pad.do.touchstart = this.onInputEvent.bind(this, "DOWN");
    this.pad.do.mouseup = this.pad.do.touchend = this.onInputEvent.bind(this, "UP");
    this.pad.do.mouseout = this.onInputEvent.bind(this, "OUT");
    this.pad.do.mouseover = this.onInputEvent.bind(this, "IN");
    this.pad.do.mousemove = this.pad.do.touchmove = this.onInputEvent.bind(this, "MOVE");
    this.pad.do.click  = this.pad.do.tap = this.onInputEvent.bind(this, "CLICK");
    this.pad.do.mouseupoutside = this.pad.do.touchendoutside = this.onInputEvent.bind(this, "UP_OUTSIDE");
    mouseWheelManager.onSEDO(this.pad, this.onMouseWheel.bind(this));

    this.posValidator = new SEStageEditorObjPosValidator(this);

    //Initial stage script tree nodes
    var stageNode = this.stage.getStageNode();
    var stageView = new SENodeView(stageNode, this.seEvents);
    stageView.setPosition(0, 0);
    stageView.getNode().setLabel("Stage 1");
    stageView.getNode().addObject(_QUEST_PLAYER_ID);
    stageView.getNode().addObject("older");
    stageView.getNode().addObject("firstLantern");
    stageView.getNode().addObject("secondLantern");
    stageView.getNode().addObject("0");
    this.nodeViews.push(stageView);
    stageView.setParent(this.nodesLayer);

    var cond = this.stage.createCond(_QUEST_CONDS.NONE);
    var condView = new SECondView(cond, this.seEvents);
    this.condViews.push(condView);
    condView.setParent(this.condsLayer);
    stageView.getNode().addOutCond(condView.getCond());
    stageView.positionOutCond(condView);

    var storylineNode = this.stage.createNode(_QUEST_NODES.STORYLINE);
    var storylineView = new SENodeView(storylineNode, this.seEvents);
    storylineView.setPosition(stageView.getX(), stageView.getY() + stageView.getHeight() * 2);
    this.nodeViews.push(storylineView);
    storylineView.setParent(this.nodesLayer);
    storylineView.getNode().addInCond(condView.getCond());
    storylineView.positionInCond(condView);
    storylineView.getNode().addObject(_QUEST_PLAYER_ID, stageView.getNode());
    storylineView.getNode().addObject("older", stageView.getNode());
    storylineView.getNode().addObject("firstLantern", stageView.getNode());
    storylineView.getNode().addObject("secondLantern", stageView.getNode());
    storylineView.getNode().addObject("0", stageView.getNode());
}

SEStageEditor.prototype = new SEDisplayObject();

SEStageEditor.prototype.getAddr = function() {
    return this.addr;
};

SEStageEditor.prototype.setEnable = function(enable) {
    if (enable) {
        this.scene.show();
        this.scene.startPeriodicRendering();
    } else {
        this.scene.hide();
        this.scene.stopPeriodicRendering();
    }
};

function SEStageEditorObjPosValidator(seTreeEditor) {
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

    this.validateNodeView = function(nodeView) {
        pointList.length = 0;
        p1.x = nodeView.getX();
        p1.y = nodeView.getY();
        p2.x = nodeView.getX();
        p2.y = nodeView.getY() + nodeView.getHeight();
        p3.x = nodeView.getX() + nodeView.getWidth();
        p3.y = nodeView.getY();
        p4.x = nodeView.getX() + nodeView.getWidth();
        p4.y = nodeView.getY() + nodeView.getHeight();
        pointList.push(p1, p2, p3, p4);

        return validatePointList.call(this, nodeView.getId());
    };

    this.validateCondView = function(condView) {
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
        $.each(seTreeEditor.nodeViews, function(ix, nodeView) {
            if (objIdToExclude === nodeView.getId())
                return true;

            for (i = 0; i < pointList.length; ++i) {
                if (nodeView.contains(pointList[i].x, pointList[i].y)) {
                    ok = false;
                    break;
                }
            }
        });

        if (!ok) return ok;

        $.each(seTreeEditor.condViews, function(ix, condView) {
             if (objIdToExclude === condView.getId())
                return true;

                for (i = 0; i < pointList.length; ++i) {
                    if (condView.contains(pointList[i].x, pointList[i].y)) {
                        ok = false;
                        break;
                    }
                }           
        });
        return ok;
    };
}

SEStageEditor.prototype.onSeEvent = function(args) {
    //console.log(args.name);
    if (args.name === "NODE_CREATE") {
        var pos = this.nodesLayer.getLocalPosition(args.intData);
        var newNode = this.stage.createNode(args.type);
        var newNodeView = new SENodeView(newNode, this.seEvents);
        newNodeView.setPosition(pos.x, pos.y);
        //TODO need 100% creation to send confiramation event
        //if (this.posValidator.validateNodeView(newNodeView)) {
            newNodeView.setParent(this.nodesLayer);
            this.nodeViews.push(newNodeView);
            this.scene.update();
        //} else newNode = null; //TODO move node to the nearest appropriate position
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "NODE_CREATED", node : newNodeView.getNode() });
        return;
    }

    if (args.name === "NODE_DRAG") {
        this.input.dragging.nodeView = SENodeView.fromSENode(args.node);
        return; 
    }

    if (args.name === "NODE_END_DRAG") {
        this.input.dragging.nodeView = null;
        return;
    }

    if (args.name === "EDITOR_START_DRAG") {
        var pos = this.pad.getLocalPosition(args.intData);
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
        var newCond = this.stage.createCond(_QUEST_CONDS.NONE);
        var newCondView = new SECondView(newCond, this.seEvents);
        newCondView.setParent(this.condsLayer);
        this.condViews.push(newCondView);
        args.node.addOutCond(newCondView.getCond());
        SENodeView.fromSENode(args.node).positionInCond(newCondView);
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "COND_CREATED", cond : newCondView.getCond() });
        return;
    }

    if (args.name === "COND_START_DRAG") {
        this.input.dragging.condView = SECondView.fromSECond(args.cond);
        return;
    }

    if (args.name === "COND_END_DRAG") {
        this.input.dragging.condView = null;
        return;
    }

    if (args.name === "NODE_ADD_IN_COND") {
        args.node.addInCond(args.cond);
        this.scene.update();
        return;
    }

    if (args.name === "NODE_DELETE") {
        //XXX Implement more user friendly
        if (args.node.getType() === _QUEST_NODES.STAGE)
            return;
        this.deleteNode(args.node);
        return;
    }

    if (args.name === "COND_DELETE") {
        this.deleteCond(args.cond);
    }

    if (args.name === "COND_SNAP_TO_NODE") {
        this.input.dragging.condSnap = true;
        var nodeView = SENodeView.fromSENode(args.node);
        var condView = SECondView.fromSECond(args.cond);
        nodeView.positionInCond(condView);
        nodeView.highlight(true);
        this.scene.update();
        return;
    }

    if (args.name === "COND_UNSNAP_TO_NODE") {
        var nodeView = SENodeView.fromSENode(args.node);
        this.input.dragging.condSnap = false;
        nodeView.highlight(false);
        this.scene.update();
        return;
    }
};

SEStageEditor.prototype.deleteNode = function(node) {
    var nodeView = SENodeView.fromSENode(node);
    this.nodeViews.removeBySEId(nodeView.getId());
    nodeView.delete();
    node.events.inCondDeleted.subscribe(this, this.deleteCond);
    node.events.outCondDeleted.subscribe(this, this.deleteCond);
    this.stage.deleteNode(node);
    this.scene.update();
};

SEStageEditor.prototype.deleteCond = function(cond) {
    var condView = SECondView.fromSECond(cond);
    this.condViews.removeBySEId(condView.getId());
    condView.delete();
    this.stage.deleteCond(cond);
    this.scene.update();
};

SEStageEditor.prototype.onMouseWheel = function(yDelta) {
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
    this.scene.update();
    return false;
};

SEStageEditor.prototype.editorMouseEvent = function(intData) {
    var pt = this.editingBg.getLocalPosition(intData);
    return this.posValidator.pointIsNotContained(pt.x, pt.y);
};

SEStageEditor.prototype.onInputEvent = function(evName, intData) {
    if (evName === "MOVE") {
        if (this.input.dragging.nodeView) {
            var oldX = this.input.dragging.nodeView.getX();
            var oldY = this.input.dragging.nodeView.getY();
            var newDragPos = this.nodesLayer.getLocalPosition(intData);
            this.input.dragging.nodeView.dragTo(newDragPos);
            if (this.posValidator.validateNodeView(this.input.dragging.nodeView)) {
                this.scene.update();
            } else {
                this.input.dragging.nodeView.setPosition(oldX, oldY);
            }
        } else if (this.input.dragging.condView && ! this.input.dragging.condSnap) {
            var pt = this.condsLayer.getLocalPosition(intData);
            this.input.dragging.condView.setDst(pt);
            this.scene.update();
        } else if (this.input.dragging.all) {
            var BOUNDS = { MIN_X : -250, MAX_X : 250, MIN_Y : -250, MAX_Y : 250 };
            var mPos = this.pad.getLocalPosition(intData);
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
            this.scene.update();
        }
        return;
    }

    if (evName === "CLICK" && this.editorMouseEvent(intData)) {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "EDITOR_CLICK", intData : intData });
        return;
    }

    if (evName === "DOWN" && this.editorMouseEvent(intData)) {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "EDITOR_DOWN", intData : intData });
        return;
    }

    if (evName === "UP" &&
        (this.input.dragging.nodeView || this.input.dragging.all)) {
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES, { name : "EDITOR_UP" });
        return;
    }

    if (evName === "UP" && this.input.dragging.condView) {
        var pt = this.condsLayer.getLocalPosition(intData);
        if (this.editorMouseEvent(intData) ||
            this.input.dragging.condView.contains(pt.x, pt.y))
        {
            this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES, { name : "EDITOR_UP" });
            return;
        }
    }

    if (evName === "UP_OUTSIDE") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "EDITOR_UP_OUTSIDE" });
        return;
    }
};

function SEStageEditorStaticConstructor(completionCB) {
    completionCB();
}
