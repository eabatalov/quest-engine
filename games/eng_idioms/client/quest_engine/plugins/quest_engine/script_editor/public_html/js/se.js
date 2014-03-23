function ScriptEditor(rootScope, seEvents, mouseWheelManager) {
    this.seEvents = seEvents;

    this.stage = new PIXI.Stage(0xFFFFFF, true);

    this.pad = new SESpriteObject();
    this.pad.setDO(new PIXI.Sprite(ScriptEditor.TEXTURES.bg));
    this.pad.setPosition(0, 0);
    this.pad.setParent(this.stage);

    this.renderer = PIXI.autoDetectRenderer(this.pad.getWidth(), this.pad.getHeight(),
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
        ((PROP_WIDTH) / this.pad.getWidth() * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.height = "100%";
    $("#propsDiv").get(0).style.top = "0";
    $("#propsDiv").get(0).style.right =
        ((PROP_RMARGIN) / this.pad.getWidth() * window.innerWidth).toString() + "px";
    $("#propsDiv").get(0).style.display = "block";
    $("#propsDiv").get(0).style.paddingTop =
        (TOP_PADDING / this.pad.getHeight() * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style.paddingBottom =
        (BOT_PADDING / this.pad.getHeight() * window.innerHeight).toString() + "px";
    $("#propsDiv").get(0).style.zindex = 1;

    this.panels = {};
    this.panels.ltoolbar = new SEDisplayObject();
    this.panels.ltoolbar.setDO(new PIXI.DisplayObjectContainer());
    this.panels.ltoolbar.setPosition(LEFT_PADDING_LTB, TOP_PADDING);
    this.panels.ltoolbar.setWH(
        248,
        this.pad.getHeight() - BOT_PADDING - TOP_PADDING
    );

    this.panels.script = new SEDisplayObject();
    this.panels.script.setDO(new PIXI.DisplayObjectContainer());
    this.panels.script.setPosition(
        this.panels.ltoolbar.getX() + this.panels.ltoolbar.getWidth() + LEFT_PADDING_SC,
        TOP_PADDING);
    this.panels.script.setWH(
        SCRIPT_WIDTH,
        this.pad.getHeight() - BOT_PADDING - TOP_PADDING
    );

    this.panels.script.setParent(this.pad);
    this.panels.ltoolbar.setParent(this.pad);

    this.compileBtn = new SESpriteObject();
    this.compileBtn.setDO(new PIXI.Sprite(ScriptEditor.TEXTURES.compileBtn));
    this.compileBtn.setPosition(
        this.panels.script.getX() + this.panels.script.getWidth() - this.compileBtn.getWidth() /* XXX */,
        55
    );
    this.compileBtn.do.click = function() {
        this.seEvents.broadcast({
            name : "COMPILE"
        });
    }.bind(this);
    this.compileBtn.setParent(this.pad);

    this.sceneUpdater = { se : this };
    this.sceneUpdater.up = function() {
        this.se.renderer.render(this.se.stage);
    }.bind(this.sceneUpdater);
    this.sceneUpdater.runUpLoop = function() {
        //TODO remove this update loop once PIXI interaction manager is
        //decoupled from rendering
        //http://www.html5gamedevs.com/topic/1636-interactionmanagerupdate-is-coupled-to-render-loop/
        requestAnimFrame(this.up);
        setTimeout(this.runUpLoop, 1000 / 30); //30 FPS
    }.bind(this.sceneUpdater);

    //Setup each panel object
    this.toolbar = new Toolbar(this.panels.ltoolbar, this.seEvents, this.sceneUpdater);
    this.treeEditor = new ScriptTreeEditor(rootScope, this.panels.script, this.seEvents,
        this.sceneUpdater, mouseWheelManager);

    this.sceneUpdater.runUpLoop();
    /*this.sceneUpdater.up();
    requestAnimFrame(this.sceneUpdater.up);*/
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

function ScriptEditorFactory(rootScope, events, mouseWheelManager) {
    return new ScriptEditor(rootScope, events, mouseWheelManager);
}

function ToolbarFactory(scriptEditor) {
    return scriptEditor.toolbar;
}

function TreeEditorFactory(scriptEditor) {
    return scriptEditor.treeEditor;
};
