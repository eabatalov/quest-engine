function ScriptTreeEditor(/*DisplayObject */ parentPanel, seEvents) {
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
    this.setInteractive(true);
    this.mousedown = scriptTreeEditorMouseDown.bind(this);
    this.mouseup = scriptTreeEditorMouseUp.bind(this);
    this.mouseupoutside = scriptTreeEditorMouseUpOutside.bind(this);

    //Initial script tree nodes
    this.conds = [];
    this.nodes = {};
    this.nodes.all = [];
    this.nodes.storyLines = [
        new SENode(this.seEvents, _QUEST_NODE_STORYLINE, false, { objs: [] })
    ];
    this.nodes.stages = [
        new SENode(this.seEvents, _QUEST_NODE_STAGE, false, { name : "TYPE STAGE NAME", objs : [],
            objPool : []})
    ];
    this.nodes.stages[0].x = this.width / 2;
    this.nodes.stages[0].y = this.nodes.stages[0].height;
    this.nodes.stages[0].conds.push(
        new SECond(this.seEvents, _QUEST_COND_NONE, null, this.nodes.storyLines[0])
    );
    this.nodes.storyLines[0].x = this.nodes.stages[0].x;
    this.nodes.storyLines[0].y = this.nodes.stages[0].y + this.nodes.stages[0].height * 2;

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
}

function scriptTreeEditorMouseDown(intData) {
    if (intData.originalEvent.ctrlKey) {
        this.mouse.x = intData.global.x;
        this.mouse.y = intData.global.y;
    }
}

function scriptTreeEditorMouseUp(intData) {
    if (this.mouse.x !== -1) {
        var newCond = new SECond(this.seEvents, _QUEST_COND_NONE);

        newCond.setSrc(this.parent.glbPtToIntl(this.mouse));
        newCond.setDst(this.parent.glbPtToIntl(intData.global));

        this.conds.push(newCond);
        this.addChild(newCond);
        this.update();

        this.mouse.x = -1;
        this.mouse.y = -1;
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

function TreeEditorFactory(treeEditorParentSprite, seEvents) {
    return new ScriptTreeEditor(treeEditorParentSprite, seEvents);
};