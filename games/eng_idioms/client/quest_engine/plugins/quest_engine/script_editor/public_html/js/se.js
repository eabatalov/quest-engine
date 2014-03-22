function ScriptEditor(rootScope, seEvents) {
    this.seEvents = seEvents;

    this.stage = new PIXI.Stage(0xFFFFFF, true);

    this.pad = new PIXI.Sprite(ScriptEditor.TEXTURES.bg);
    this.pad.position.x = 0;
    this.pad.position.y = 0;
    //this.pad.width = 1340;//1366;
    //this.pad.height = 768;
    this.stage.addChild(this.pad);

    this.renderer = PIXI.autoDetectRenderer(this.pad.width, this.pad.height,
        $("#scriptEditorCanvas").get(0));
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.width = window.innerWidth.toString() + "px";
    this.renderer.view.style.height = window.innerHeight.toString() + "px";
    this.renderer.view.style.display = "block";
    this.renderer.view.style.zindex = 0;

    //Set editor panels layout
    var TOP_PADDING = 172;
    var BOT_PADDING = 92;
    var LEFT_PADDING_LTB = 120;
    var LEFT_PADDING_SC = 56;
    var SCRIPT_WIDTH = 512 + 100;
    var RIGHT_PADDING_SC = LEFT_PADDING_SC;
    var PROP_WIDTH = 248;
    //XXX tut huinia.
    var PROP_RMARGIN = 100;//LEFT_PADDING_LTB;

    $("#propsDiv").get(0).style.position = "absolute";
    $("#propsDiv").get(0).style.width =
        ((PROP_WIDTH) / this.pad.width * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.height = "100%";
    $("#propsDiv").get(0).style.top = "0";
    $("#propsDiv").get(0).style.right =
        ((PROP_RMARGIN) / this.pad.width * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.display = "block";
    $("#propsDiv").get(0).style.paddingTop =
        (TOP_PADDING / this.pad.height * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style.paddingBottom =
        (BOT_PADDING / this.pad.height * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style.zindex = 1;

    this.panels = {};
    this.panels.ltoolbar = new PIXI.DisplayObjectContainer();
    this.panels.ltoolbar.position.x = LEFT_PADDING_LTB;
    this.panels.ltoolbar.position.y = TOP_PADDING;
    this.panels.ltoolbar.width = 248;
    this.panels.ltoolbar.height = this.pad.height - BOT_PADDING - TOP_PADDING;

    this.panels.script = new PIXI.DisplayObjectContainer();
    this.panels.script.position.x = this.panels.ltoolbar.position.x + this.panels.ltoolbar.width + LEFT_PADDING_SC;
    this.panels.script.position.y = TOP_PADDING;
    this.panels.script.width = SCRIPT_WIDTH;
    this.panels.script.height = this.pad.height - BOT_PADDING - TOP_PADDING;
    this.panels.script.glbPtToIntl = function(glblPt) {
        return new PIXI.Point(
            glblPt.x - this.x,
            glblPt.y - this.y
        );
    };

    this.pad.addChild(this.panels.script);
    this.pad.addChild(this.panels.ltoolbar);

    this.compileBtn = new PIXI.Sprite(ScriptEditor.TEXTURES.compileBtn);
    this.compileBtn.position.x = this.panels.script.position.x + this.panels.script.width
        - this.compileBtn.width - 110 /* XXX */;
    this.compileBtn.position.y = 55;
    this.compileBtn.setInteractive(true);
    this.compileBtn.click = function() {
        this.seEvents.broadcast({
            name : "COMPILE"
        });
    }.bind(this);
    this.pad.addChild(this.compileBtn);

	this.sceneUpdater = { se : this };
	this.sceneUpdater.up = function() {
		this.se.renderer.render(this.se.stage);
	};

    //Setup each panel object
    this.toolbar = new Toolbar(this.panels.ltoolbar, this.seEvents, this.sceneUpdater);
    this.treeEditor = new ScriptTreeEditor(rootScope, this.panels.script, this.seEvents, this.sceneUpdater);

    this.sceneUpdater.up();
	requestAnimFrame(this.sceneUpdater.up.bind(this.sceneUpdater));
}

function ScriptEditorStaticConstructor(completionCB) {
    ScriptEditor.TEXTURE_PATHS = {};
    ScriptEditor.TEXTURE_PATHS.bg = "images/bg.png";
    ScriptEditor.TEXTURE_PATHS.compileBtn = "images/compile.png";

    var assetsToLoad = $.map(ScriptEditor.TEXTURE_PATHS, function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ScriptEditor.TEXTURES = {};
        ScriptEditor.TEXTURES.bg = PIXI.Texture.fromImage(ScriptEditor.TEXTURE_PATHS.bg);
        ScriptEditor.TEXTURES.compileBtn = PIXI.Texture.fromImage(ScriptEditor.TEXTURE_PATHS.compileBtn);
        completionCB();
    };
    loader.load();
}

function ScriptEditorFactory(rootScope, events) {
    return new ScriptEditor(rootScope, events);
}

function ToolbarFactory(scriptEditor) {
    return scriptEditor.toolbar;
}

function TreeEditorFactory(scriptEditor) {
    return scriptEditor.treeEditor;
};
