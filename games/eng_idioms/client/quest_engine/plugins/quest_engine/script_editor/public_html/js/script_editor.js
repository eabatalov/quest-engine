function ScriptEditor() {
    var assetsToLoad = [
        "images/bg.png",
        "images/scene_tile.png",
        "images/node_anim.png",
        "images/node_phrase.png",
        "images/node_quiz.png",
        "images/node_stage.png",
        "images/node_stcl.png",
        "images/node_stln.png",
        "images/node_wait.png",
        "images/node_none.png"
    ];
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = this.onAssetsLoaded.bind(this);
    loader.load();
}

TEXTURES = {};

ScriptEditor.prototype.onAssetsLoaded = function() {
    // create an new instance of a pixi stage
    this.stage = new PIXI.Stage(0xFFFFFF);

    TEXTURES = {};
    TEXTURES.nodes = {};
    TEXTURES.bg = PIXI.Texture.fromImage("images/bg.png");
    TEXTURES.scriptBg = PIXI.Texture.fromImage("images/scene_tile.png");
    TEXTURES.nodes[_QUEST_NODE_ANIM] = PIXI.Texture.fromImage("images/node_anim.png");
    TEXTURES.nodes[_QUEST_NODE_PHRASE] = PIXI.Texture.fromImage("images/node_phrase.png");
    TEXTURES.nodes[_QUEST_NODE_QUIZ] = PIXI.Texture.fromImage("images/node_quiz.png");
    TEXTURES.nodes[_QUEST_NODE_STAGE] = PIXI.Texture.fromImage("images/node_stage.png");
    TEXTURES.nodes[_QUEST_NODE_STAGE_CLEAR] = PIXI.Texture.fromImage("images/node_stcl.png");
    TEXTURES.nodes[_QUEST_NODE_STORYLINE] = PIXI.Texture.fromImage("images/node_stln.png");
    TEXTURES.nodes[_QUEST_NODE_WAIT] = PIXI.Texture.fromImage("images/node_wait.png");
    TEXTURES.nodes[_QUEST_NODE_NONE] = PIXI.Texture.fromImage("images/node_none.png");

    var TOP_PADDING = 172;
    var BOT_PADDING = 92;
    var LEFT_PADDING_LTB = 120;
    var LEFT_PADDING_SC = 56;
    var SCRIPT_WIDTH = 512;
    var RIGHT_PADDING_SC = LEFT_PADDING_SC;
    var PROP_WIDTH = 248;
    //XXX tut huinia.
    var PROP_RMARGIN = 100;//LEFT_PADDING_LTB;

    this.layers = {};    
    this.layers.bg = new PIXI.Sprite(TEXTURES.bg);
    this.layers.bg.position.x = 0;
    this.layers.bg.position.y = 0;
    //this.layers.bg.width = 1340;//1366;
    //this.layers.bg.height = 768;

    this.layers.ltoolbar = new PIXI.DisplayObjectContainer();
        //new PIXI.TilingSprite(TEXTURES.ltoolbarBG, 0, 0);
    this.layers.ltoolbar.position.x = LEFT_PADDING_LTB;
    this.layers.ltoolbar.position.y = TOP_PADDING;
    this.layers.ltoolbar.width = 248;
    this.layers.ltoolbar.height = this.layers.bg.height - BOT_PADDING - TOP_PADDING;

    this.layers.script = //new PIXI.DisplayObjectContainer();
        new PIXI.Sprite(TEXTURES.scriptBg, 0, 0);
    this.layers.script.position.x = this.layers.ltoolbar.position.x + this.layers.ltoolbar.width + LEFT_PADDING_SC;
    this.layers.script.position.y = TOP_PADDING;
    this.layers.script.width = SCRIPT_WIDTH;
    this.layers.script.height = this.layers.bg.height - BOT_PADDING - TOP_PADDING;

    this.stage.addChild(this.layers.bg);
    this.stage.addChild(this.layers.script);
    this.stage.addChild(this.layers.ltoolbar);

    // create a renderer instance.
    this.renderer = PIXI.autoDetectRenderer(this.layers.bg.width, this.layers.bg.height,
        $("#toolbarAndTreeCanvas").get(0));
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.width = window.innerWidth.toString() + "px";
    this.renderer.view.style.height = window.innerHeight.toString() + "px";
    this.renderer.view.style.display = "block";
    this.renderer.view.style["z-index"] = 0;

    $("#propsDiv").get(0).style.position = "absolute";
    $("#propsDiv").get(0).style.width =
        ((PROP_WIDTH) / this.layers.bg.width * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.height = "100%";
    $("#propsDiv").get(0).style.top = "0";
    $("#propsDiv").get(0).style.right =
        ((PROP_RMARGIN) / this.layers.bg.width * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.display = "block";
    $("#propsDiv").get(0).style["padding-top"] =
        (TOP_PADDING / this.layers.bg.height * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style["padding-bottom"] =
        (BOT_PADDING / this.layers.bg.height * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style["z-index"] = 1;

    // add the renderer view element to the DOM
    window.document.body.appendChild(this.renderer.view);

    //XXX FIXUP inheritance
    SENode.prototype = new PIXI.Sprite(TEXTURES.bg);
    SENode.prototype.constructor = SENode; 
    SECond.prototype = new PIXI.Graphics();
    SECond.prototype.constructor = SECond;
    Toolbar.prototype = new PIXI.DisplayObjectContainer();
    Toolbar.prototype.constructor = Toolbar;

    //Initial script nodes
    this.conds = [];
    this.nodes = {};
    this.nodes.all = [];
    this.nodes.storyLines = [
        new SENode(_QUEST_NODE_STORYLINE, false, { objs: [] })
    ];
    this.nodes.stages = [
        new SENode(_QUEST_NODE_STAGE, false, { name : "TYPE STAGE NAME", objs : [],
            objPool : []})
    ];
    this.nodes.stages[0].x = this.layers.script.width / 2;
    this.nodes.stages[0].y = this.nodes.stages[0].height;
    this.nodes.stages[0].conds.push(
        new SECond(_QUEST_COND_NONE, null, this.nodes.storyLines[0])
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
        this.layers.script.addChild(node);
    }.bind(this));
    $.each(this.nodes.storyLines, function(ix, node) {
        this.nodes.all.push(node);
        this.layers.script.addChild(node);
    }.bind(this));
    $.each(this.conds, function(ix, cond) {
        this.layers.script.addChild(cond);
    }.bind(this));

    this.toolbar = new Toolbar();
    this.toolbar.height = this.layers.ltoolbar.height;
    this.toolbar.width = this.layers.ltoolbar.width;
    this.layers.ltoolbar.addChild(this.toolbar);

    this.renderer.render(this.stage);
    this.updateStage = this.update.bind(this);
    requestAnimFrame(this.updateStage);

    this.mouse = {
        x: -1,
        y: -1
    };
    this.layers.script.setInteractive(true);
    this.layers.script.mousedown = this.scriptMouseDown.bind(this);
    this.layers.script.mouseup = this.scriptMouseUp.bind(this);
    this.layers.script.mouseupoutside = this.scriptMouseUpOutside.bind(this);
}

ScriptEditor.prototype.update = function() {
    this.renderer.render(this.stage);
    //requestAnimFrame(this.updateStage);
};

ScriptEditor.prototype.scriptMouseDown = function(interactionData) {
    if (interactionData.originalEvent.ctrlKey) {
        this.mouse.x = interactionData.global.x;
        this.mouse.y = interactionData.global.y;
    }
}

ScriptEditor.prototype.scriptMouseUp = function(interactionData) {
    //alert("scriptMouseUp");
    if (this.mouse.x !== -1) {
        var newCond = new SECond(_QUEST_COND_NONE);

        newCond.setSrc(new PIXI.Point(
            this.mouse.x - this.layers.script.x,
            this.mouse.y - this.layers.script.y
        ));
        newCond.setDst(new PIXI.Point(
            interactionData.global.x - this.layers.script.x,
            interactionData.global.y - this.layers.script.y
        ));

        this.conds.push(newCond);
        this.layers.script.addChild(newCond);
        this.updateStage();

        this.mouse.x = -1;
        this.mouse.y = -1;
    }
}

ScriptEditor.prototype.scriptMouseUpOutside =  function(interactionData) {
    this.mouse.x = -1;
    this.mouse.y = -1;
}