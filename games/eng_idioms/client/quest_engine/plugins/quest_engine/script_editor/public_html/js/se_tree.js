function ScriptTreeEditor(rootScope, /*DisplayObject */ parent, seEvents, sceneUpdater, mouseWheelManager) {
    SEDisplayObject.call(this, new PIXI.DisplayObjectContainer());
    this.setPosition(0, 0);
    this.setWH(parent.getWidth(), parent.getHeight());
    this.setParent(parent);
    this.editingBg = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.editingBg.setWH(5000, 5000);
    this.editingBg.setParent(this);
    this.nodesLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.condsLayer = new SEDisplayObject(new PIXI.DisplayObjectContainer());
    this.nodesLayer.setParent(this.editingBg);
    this.condsLayer.setParent(this.editingBg);

    this.seEvents = seEvents;
    this.sceneUpdater = sceneUpdater;
    this.do.mousedown = scriptTreeEditorMouseDown.bind(this);
    this.do.mousemove = scriptTreeEditorMouseMove.bind(this);
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

    this.scope = rootScope;
    this.scope.$on('seEvent', scriptTreeEditorOnSeEvent.bind(this));

    //Looks like XXX but need to inject one instance for all
    //the nodes and conds some way
    //TODO use angular injector someway
    SENode.treeEditor = this;
    SECond.treeEditor = this;
    SECond.sceneUpdater = this.sceneUpdater;
    ToolBarItem.positionValidator = new SEToolBarItemPositionValidator(this);
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

function SEToolBarItemPositionValidator(seTreeEditor) {
    /*
     * Return true if specified rectangular object can be placed on editor.
     * Rect bounds are passed as parameters.
     */
    this.validate = function(intData, item) {
        var rectOrigin = seTreeEditor.getLocalPosition(intData);

        var overallBoundsOk = (
            0 <= rectOrigin.x &&
            0 <= rectOrigin.y &&
            seTreeEditor.getWidth() >= (rectOrigin.x + item.getWidth()) &&
            seTreeEditor.getHeight() >= (rectOrigin.y + item.getHeight())
        ) ? true : false;

        if (!overallBoundsOk)
            return false;

        var NODE_MARGIN = 10;
        var nodesOk = true;
        var nodeHitArea = new PIXI.Rectangle(-NODE_MARGIN, -NODE_MARGIN, 0, 0);
        $.each(seTreeEditor.nodes.all, function(ix, node) {
            nodeHitArea.width = node.getWidth() + 2 * NODE_MARGIN;
            nodeHitArea.height = node.getHeight() + 2 * NODE_MARGIN;
            var rectOriginAtNode = node.getLocalPosition(intData);
            if (nodeHitArea.contains(rectOriginAtNode.x, rectOriginAtNode.y) ||
                nodeHitArea.contains(rectOriginAtNode.x + item.getWidth(), rectOriginAtNode.y) ||
                nodeHitArea.contains(rectOriginAtNode.x, rectOriginAtNode.y + item.getHeight()) ||
                nodeHitArea.contains(rectOriginAtNode.x + item.getWidth(), rectOriginAtNode.y + item.getHeight())) {
                nodesOk = false;
                return false;
            }
        });
        return nodesOk;
    };
}

function scriptTreeEditorOnSeEvent() {
    if (this.seEvents.args.name === "NODE_CREATE") {
        //Position of new node was validated by position validator
        var newNodePt = this.getLocalPosition(this.seEvents.args.intData);
        var newNode = new SENode(this.seEvents.args.type, this.seEvents, false,
            this.nodes.storyLines[0],
            this.nodes.stages[0]);
        newNode.setPosition(newNodePt.x, newNodePt.y);
        newNode.setParent(this.nodesLayer);
        this.nodes.all.push(newNode);
        this.sceneUpdater.up();
        this.seEvents.broadcast({
            name : "NODE_PROP_EDIT",
            obj : newNode
        });
    }
}

function seTreeEditorOnMouseWheel(yDelta) {
    if (yDelta > 0) {
        this.setScale(this.getScale() + 0.1);
    } else if (yDelta < 0) {
        this.setScale(this.getScale() - 0.1);
    }
    this.sceneUpdater.up();
    return false;
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

function scriptTreeEditorMouseMove(intData) {
    //console.log(intData.global.x.toString() + " " + intData.global.y.toString());
};

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
