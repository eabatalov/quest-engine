function ScriptEditor(events, leftToolbar, treeEditor, toolbarParentSprite, treeEditorParentSprite) {
    this.events = events;
    this.leftToolbar = leftToolbar;
    this.treeEditor = treeEditor;

    this.stage = new PIXI.Stage(0xFFFFFF);

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
    var SCRIPT_WIDTH = 512;
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
    this.panels.ltoolbar = toolbarParentSprite;
    this.panels.ltoolbar.position.x = LEFT_PADDING_LTB;
    this.panels.ltoolbar.position.y = TOP_PADDING;
    this.panels.ltoolbar.width = 248;
    this.panels.ltoolbar.height = this.pad.height - BOT_PADDING - TOP_PADDING;

    this.panels.script = treeEditorParentSprite;
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

    this.updateStage = this.update.bind(this);
    //Create object for each panel
    this.toolbar = new Toolbar(this.panels.ltoolbar);
    this.treeEditor = new ScriptTreeEditor(this.panels.script);
    this.treeEditor.update = this.updateStage;

    this.renderer.render(this.stage);
    requestAnimFrame(this.updateStage);
}

ScriptEditor.prototype.update = function() {
    this.renderer.render(this.stage);
    //requestAnimFrame(this.updateStage);
};

function ScriptEditorStaticConstructor(completionCB) {
    ScriptEditor.TEXTURE_PATHS = {};
    ScriptEditor.TEXTURE_PATHS.bg = "images/bg.png";

    var assetsToLoad = $.map(ScriptEditor.TEXTURE_PATHS, function(value, index) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ScriptEditor.TEXTURES = {};
        ScriptEditor.TEXTURES.bg = PIXI.Texture.fromImage(ScriptEditor.TEXTURE_PATHS.bg);
        completionCB();
    };
    loader.load();
}

function ScriptEditorFactory($rootScope, events, leftToolbar, treeEditor,
    toolbarParentSprite, treeEditorParentSprite) {
    return new ScriptEditor(events, leftToolbar, treeEditor, toolbarParentSprite, treeEditorParentSprite);
};