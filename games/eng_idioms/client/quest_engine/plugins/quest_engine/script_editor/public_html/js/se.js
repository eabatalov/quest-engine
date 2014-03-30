function ScriptEditor(rootScope, seEvents, mouseWheelManager) {
    this.stage = new PIXI.Stage(0xFFFFFF, true);

    this.pad = new SEDisplayObject(new PIXI.Sprite(ScriptEditor.TEXTURES.bg));
    this.pad.setPosition(0, 0);
    this.pad.setParent(this.stage);

    this.setupEventHandlers(rootScope, seEvents);
    this.sceneUpdater = new SceneUpdater(this);
    this.sizeManager = new SizeManager(rootScope, seEvents, this);
    this.inputManager = new SEInputManager(seEvents);
    this.treeEditor = new ScriptTreeEditor(rootScope, this.pad, seEvents,
        this.sceneUpdater, mouseWheelManager);
}

ScriptEditor.prototype.setupEventHandlers = function($rootScope, seEvents) {
    $rootScope.$on('SIZES_INIT_COMPLITED', function() {
            this.sceneUpdater.runUpLoop();
            /*this.sceneUpdater.up();
              requestAnimFrame(this.sceneUpdater.up);*/
    }.bind(this));
};

function ScriptEditorStaticConstructor(completionCB) {
    ScriptEditor.TEXTURE_PATHS = {};
    ScriptEditor.TEXTURE_PATHS.bg = "images/scene_tile.png";

    var assetsToLoad = $.map(ScriptEditor.TEXTURE_PATHS, function(value, ix) { return [value]; });
    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        ScriptEditor.TEXTURES = {};
        ScriptEditor.TEXTURES.bg =
            PIXI.Texture.fromImage(ScriptEditor.TEXTURE_PATHS.bg);
        completionCB();
    };
    loader.load();
}

function ScriptEditorFactory(rootScope, events, mouseWheelManager) {
    return new ScriptEditor(rootScope, events, mouseWheelManager);
}

function TreeEditorFactory(scriptEditor) {
    return scriptEditor.treeEditor;
}

/* Auxilary classes with dedicated responsibilities */
function SizeManager($rootScope, seEvents, se) {
    this.initNum = 3;

    this.onInitCompleted = function() {
        if (this.initNum !== 0)
            return;
        this.jqCanvas = $("#scriptEditorCanvas");
        this.jqPropWindow = $("#propsDiv");
        this.jqToolbar = $("#toolbarDiv");
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.calcViewWH();
        se.renderer = PIXI.autoDetectRenderer(this.viewWidth, this.viewHeight, this.jqCanvas.get(0), true);
        this.resizeView();
        $rootScope.$emit("SIZES_INIT_COMPLITED");
    };

    this.calcViewWH = function() {
        this.viewWidth = this.jqCanvas.parent().width();
        this.viewHeight = $(window).height() * 0.8;
    };

    this.resizeView = function() {
        this.calcViewWH();
        se.renderer.resize(this.viewWidth, this.viewHeight);
        se.pad.setWH(this.viewWidth, this.viewHeight);
        this.jqPropWindow.height(this.viewHeight);
        this.jqPropWindow.height(this.viewHeight);
        this.jqToolbar.height(this.viewHeight);
    }.bind(this);

    var signalOneInitCompleted = function() {
        this.initNum -= 1;
        this.onInitCompleted();
    }.bind(this);
    $(document).ready(signalOneInitCompleted);
    $rootScope.$on('TOOLBAR_INITED', signalOneInitCompleted);
    $rootScope.$on('PROPS_WIND_INITED', signalOneInitCompleted);

    $(window).resize(this.resizeView);
}

function SceneUpdater(se) {
    this.up = function() {
        se.renderer.render(se.stage);
    }.bind(this);

    this.runUpLoop = function() {
        //TODO remove this update loop once PIXI interaction manager is
        //decoupled from rendering
        //http://www.html5gamedevs.com/topic/1636-interactionmanagerupdate-is-coupled-to-render-loop/
        requestAnimFrame(this.up);
        setTimeout(this.runUpLoop, 1000 / 30); //30 FPS
    }.bind(this);
}
