function ScriptTreeEditor(rootScope, /*DisplayObject */ parentPanel, seEvents, sceneUpdater) {
    PIXI.Sprite.call(this, ScriptTreeEditor.TEXTURES.bg);
    this.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    parentPanel.addChild(this);

    //XXX
    //this.update is initialized externally
    this.mouse = {
        x: -1,
        y: -1
    };
    this.seEvents = seEvents;
	this.sceneUpdater = sceneUpdater;
    this.setInteractive(true);
    this.mousedown = scriptTreeEditorMouseDown.bind(this);
    this.mouseup = scriptTreeEditorMouseUp.bind(this);
    this.mouseupoutside = scriptTreeEditorMouseUpOutside.bind(this);
    this.deleteNode = scriptTreeEditorDeleteNode;
    this.deleteCond = scriptTreeEditorDeleteCond;

    //Initial script tree nodes
    this.conds = [];
    this.nodes = {};
    this.nodes.all = [];
    this.nodes.stages = [
        new SENode(_QUEST_NODES.STAGE, this.seEvents, false, null, null,
            { name : "Stage1", objs : [ _QUEST_PLAYER_ID, "older", "firstLantern", "secondLantern", "0" ], objPool : [] })
    ];
    this.nodes.stages[0]._stage = this.nodes.stages[0];
    this.nodes.stages[0].x = this.width / 2;
    this.nodes.stages[0].y = this.nodes.stages[0].height;

    this.nodes.storyLines = [
        new SENode(_QUEST_NODES.STORYLINE, this.seEvents, false, null, this.nodes.stages[0], { objs: [_QUEST_PLAYER_ID, "older", "firstLantern", "secondLantern", "0"] })
    ];
    this.nodes.storyLines[0].x = this.nodes.stages[0].x;
    this.nodes.storyLines[0].y = this.nodes.stages[0].y + this.nodes.stages[0].height * 2;

    this.nodes.stages[0].conds.push(
        new SECond(_QUEST_CONDS.NONE, this.nodes.storyLines[0], this.nodes.storyLines[0], this.seEvents)
    );

    this.conds.push(this.nodes.stages[0].conds[0]);
    this.conds[0].setSrc(new PIXI.Point(
        this.nodes.stages[0].x + this.nodes.stages[0].width / 2,
        this.nodes.stages[0].y + this.nodes.stages[0].height
    ));
    this.conds[0].setDst(new PIXI.Point(
        this.nodes.storyLines[0].x + this.nodes.storyLines[0].width / 2,
        this.nodes.storyLines[0].y
    ));

    //Register all initial nodes and conds
    $.each(this.nodes.stages, function(ix, node) {
        this.nodes.all.push(node);
        this.addChild(node);
    }.bind(this));
    $.each(this.nodes.storyLines, function(ix, node) {
        this.nodes.all.push(node);
        this.addChild(node);
    }.bind(this));
    $.each(this.conds, function(ix, cond) {
        this.addChild(cond);
    }.bind(this));

    this.scope = rootScope;
    this.scope.$on('seEvent', scriptTreeEditorOnSeEvent.bind(this));

    //Looks like XXX but need to inject onve instance for all
    //the nodes and conds some way
    SENode.treeEditor = this;
    SECond.treeEditor = this;
}

function scriptTreeEditorOnSeEvent() {
    if (this.seEvents.args.name === "NODE_CREATE") {
        var newNodePt = this.seEvents.args.intData.getLocalPosition(this);

		if (!this.hitArea.contains(newNodePt.x, newNodePt.y)) {
			return;
		}

        var newNode = new SENode(this.seEvents.args.type, this.seEvents, false,
			this.nodes.storyLines[0],
			this.nodes.stages[0]);
        newNode.position = newNodePt;

		if (newNodePt.x < 0 || newNodePt.y < 0 ||
            newNodePt.x > this.width - newNode.width ||
            newNodePt.y > this.height - newNode.height) {
            return;
        }

        this.addChild(newNode);
        this.nodes.all.push(newNode);
        this.sceneUpdater.up();
        this.seEvents.broadcast({
            name : "NODE_PROP_EDIT",
            obj : newNode
        });
    }
}

function scriptTreeEditorMouseDown(intData) {
    if (intData.originalEvent.ctrlKey) {
        this.mouse.x = intData.global.x;
        this.mouse.y = intData.global.y;
    }
}

function scriptTreeEditorMouseUp(intData) {
    if (this.mouse.x !== -1) {
        var newCond = new SECond(_QUEST_CONDS.NONE, null, this.nodes.storyLines[0], this.seEvents);

        newCond.setSrc(this.parent.glbPtToIntl(this.mouse));
        newCond.setDst(this.parent.glbPtToIntl(intData.global));

        this.conds.push(newCond);
        this.addChild(newCond);
        this.sceneUpdater.up();

        this.mouse.x = -1;
        this.mouse.y = -1;

        this.seEvents.broadcast({
            name : "COND_PROP_EDIT",
            obj : newCond
        });
    }
}

function scriptTreeEditorMouseUpOutside(intData) {
    //Mouse up outside can be called when we "up" on some object
    //located in script tree editor area. Check it.
    if (this.hitArea.contains(this.parent.glbPtToIntl(intData.global))) {
        this.mouseup(intData);
    } else {
        this.mouse.x = -1;
        this.mouse.y = -1;
    }
}

function scriptTreeEditorDeleteNode(node) {
    this.nodes.all.remove(node);
    this.removeChild(node);
    this.sceneUpdater.up();
}

function scriptTreeEditorDeleteCond(cond) {
    this.conds.remove(cond);
    this.removeChild(cond);
    this.sceneUpdater.up();
}

function ScriptTreeEditorStaticConstructor(completionCB) {
    ScriptTreeEditor.TEXTURE_PATHS = {};
    ScriptTreeEditor.TEXTURE_PATHS.bg = "images/scene_tile.png";

    var assetsToLoad = $.map(ScriptTreeEditor.TEXTURE_PATHS, function(value, ix) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ScriptTreeEditor.TEXTURES = {};
        ScriptTreeEditor.TEXTURES.bg =
            PIXI.Texture.fromImage(ScriptTreeEditor.TEXTURE_PATHS.bg);
        ScriptTreeEditor.prototype = new PIXI.Sprite(ScriptTreeEditor.TEXTURES.bg);
        ScriptTreeEditor.prototype.constructor = ScriptTreeEditor;
        completionCB();
    };
    loader.load();
}
