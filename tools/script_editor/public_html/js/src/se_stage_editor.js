function SEStageEditor(stage, seEventRouter, mouseWheelManager, /* internal usage */load) {
    if (stage.getNodes().length > 0 || stage.getConds().length > 0)
        throw "Automatic nodes and conds layout is not implemented";
    //Stage dependant stuff
    this.condViews = [];
    this.nodeViews = [];
    this.stage = stage;
    this.addr = SE_ROUTER_EP_ADDR.STAGE_GROUP_FIRST + this.stage.getId();
    this.seEvents = seEventRouter.createEP(this.addr);
    this.seEvHandler = this.seEvents.on(this.onSeEvent, this);
    this.focusedObject = null;

    //Visual stuff
    this.scene = new SEScene();
    this.scene.startPeriodicRendering();
    this.sceneSizeTweak = new SESceneSizeTweak(seEventRouter, this.scene, this.stage);

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
    this.wheelEventHandler = mouseWheelManager.onSEDO(this.pad, this.onMouseWheel.bind(this));

    this.posValidator = new SEStageEditorObjPosValidator(this);

    if (load)
        return;
    //Initial stage script tree nodes
    var stageNode = this.stage.getStageNode();
    var stageView = new SENodeView(stageNode, this.seEvents);
    stageView.setPosition(400, 100);
    stageView.getNode().addObject(_QUEST_PLAYER_ID);
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
}

SEStageEditor.prototype = new SEDisplayObject();

SEStageEditor.prototype.save = function() {
    var savedData = {
        ver : 1,
        nodeViews : [],
        nodeIds : [],
        condViews : [],
        condIds : [],
        scale : this.editingBg.getScale(),
        pos : {
            x : this.editingBg.getPos().x,
            y : this.editingBg.getPos().y
        }
    };
    for (var i = 0; i < this.nodeViews.length; ++i) {
        var nodeView = this.nodeViews[i];
        savedData.nodeViews.push(nodeView.save());
        savedData.nodeIds.push(nodeView.getNode().getId());
    }
    for (var i = 0; i < this.condViews.length; ++i) {
       var condView = this.condViews[i];
        savedData.condViews.push(condView.save());
        savedData.condIds.push(condView.getCond().getId());
    }
    return savedData;
};

SEStageEditor.load = function(stage, seEventRouter, mouseWheelManager, savedData) {
    assert(savedData.ver === 1);
    var stageEditor = new SEStageEditor(stage, seEventRouter, mouseWheelManager, true);
    for (var i = 0; i < savedData.nodeViews.length; ++i) {
        var nodeViewSaved = savedData.nodeViews[i];
        var node = stage.getNodeById(savedData.nodeIds[i]);
        var nodeView = SENodeView.load(node, stageEditor.seEvents, nodeViewSaved);
        stageEditor.nodeViews.push(nodeView);
        nodeView.setParent(stageEditor.nodesLayer);
    }
    for (var i = 0; i < savedData.condViews.length; ++i) {
        var condViewSaved = savedData.condViews[i];
        var cond = stage.getCondById(savedData.condIds[i]);
        var condView = SECondView.load(cond, stageEditor.seEvents, condViewSaved);
        stageEditor.condViews.push(condView);
        condView.setParent(stageEditor.condsLayer);
    }
    stageEditor.editingBg.setScale(savedData.scale);
    stageEditor.editingBg.setPosition(savedData.pos.x, savedData.pos.y);
    return stageEditor;
};

SEStageEditor.prototype.delete = function() {
    this.seEvHandler.delete();
    delete this.seEvHandler;
    this.seEvents.delete();
    delete this.seEvents;
    jQuery.each(this.condViews, function(ix, condView) {
        condView.delete();
    });
    delete this.condViews;
    jQuery.each(this.nodeViews, function(ix, nodeView) {
        nodeView.delete();
    });
    delete this.nodeViews;

    this.pad.do.mousedown = this.pad.do.touchstart = null;
    this.pad.do.mouseup = this.pad.do.touchend = null;
    this.pad.do.mouseout = null;
    this.pad.do.mouseover = null;
    this.pad.do.mousemove = this.pad.do.touchmove = null;
    this.pad.do.click  = this.pad.do.tap = null;
    this.pad.do.mouseupoutside = this.pad.do.touchendoutside = null;
    this.pad.setInteractive(false);
    this.pad.detachParent();
    delete this.pad;

    this.wheelEventHandler.delete();
    delete this.wheelEventHandler;
    delete this.posValidator;

    this.sceneSizeTweak.delete();
    delete this.sceneSizeTweak;
    this.scene.delete();
    delete this.scene;
};

SEStageEditor.prototype.getAddr = function() {
    return this.addr;
};

SEStageEditor.prototype.getStage = function() {
    return this.stage;
};

SEStageEditor.prototype.setEnable = function(enable) {
    if (enable) {
        this.scene.show();
        this.sceneSizeTweak.resizeView();
        this.scene.startPeriodicRendering();
    } else {
        this.scene.hide();
        this.sceneSizeTweak.resizeView();
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

SEStageEditor.prototype._addNodeViewToStage = function(nodeView) {
    nodeView.setParent(this.nodesLayer);
    this.nodeViews.push(nodeView);
    this.scene.update();
};

SEStageEditor.prototype.onSeEvent = function(args) {
    //console.log(args.name);
    if (args.name === "NODE_CREATE") {
        var pos = this.nodesLayer.getLocalPosition(args.intData);
        var newNode = this.stage.createNode(args.type);
        var newNodeView = new SENodeView(newNode, this.seEvents);
        newNodeView.setPosition(pos.x, pos.y);
        //TODO need 100% creation to send confiramation event
        //if (this.posValidator.validateNodeView(newNodeView)) {
            this._addNodeViewToStage(newNodeView);
        //} else newNode = null; //TODO move node to the nearest appropriate position
        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "NODE_CREATED", node : newNode });
        return;
    }

    if (args.name === "NODE_COPY_CREATE") {
        var pos = this.nodesLayer.getLocalPosition(args.intData);
        var newNode = args.nodeView.getNode().copy();
        this.stage.addNode(newNode);

        var newNodeView = new SENodeView(newNode, this.seEvents);
        newNodeView.setPosition(pos.x, pos.y);
        this._addNodeViewToStage(newNodeView);

        this.seEvents.send(SE_ROUTER_EP_ADDR.BROADCAST_NO_STAGES,
            { name : "NODE_COPY_CREATED", node : newNode });
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
        var newCond = this.stage.createCond(_QUEST_CONDS.NEXT);
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

    if (args.name === "OBJECT_FOCUS") {
        if (this.focusedObject) {
            this.focusedObject.setFocused(false);
        }

        var nodeView = SENodeView.fromSENode(args.obj);
        if (nodeView) {
            nodeView.setFocused(true);
            this.focusedObject = nodeView;
        }
        var condView = SECondView.fromSECond(args.obj);
        if (condView) {
            condView.setFocused(true);
            this.focusedObject = condView;
        }
        this.scene.update();
        return;
    }

    if (args.name === "GET_OBJECT_IN_FOCUS") {
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "OBJECT_IN_FOCUS_DELIVER", obj : this.focusedObject });
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
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
        { name : "NODE_DELETED", node : node, stage : this.stage });
    this.scene.update();
};

SEStageEditor.prototype.deleteCond = function(cond) {
    var condView = SECondView.fromSECond(cond);
    this.condViews.removeBySEId(condView.getId());
    condView.delete();
    this.stage.deleteCond(cond);
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
        { name : "COND_DELETED", cond : cond, stage : this.stage });
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
