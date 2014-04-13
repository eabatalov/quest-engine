function SESceneSizeTweak(seEventRouter, scene, stage) {
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.scene = scene;
    this.stage = stage;
    this.onSizeChanged = null;
    this.viewWidth = 0;
    this.viewHeight = 0;

    this.jqCanvas = $(scene.getDOMElem());
    this.jqCanvasContainer = $("#scene-editor-canvases-container");
    $(window).resize(this.resizeView.bind(this));

    this.resizeView();
    this.seEvents.on(this.onSeEvent, this);
}

SESceneSizeTweak.prototype.resizeView = function() {
    this.viewWidth = this.jqCanvasContainer.width();
    this.viewHeight = Math.max(this.jqCanvasContainer.height(), 1000);
    this.scene.resize(this.viewWidth, this.viewHeight);
    if (this.onSizeChanged)
        this.onSizeChanged(this.viewWidth, this.viewHeight);
    this.scene.update();
};

SESceneSizeTweak.prototype.onSeEvent = function(msg) {
    if (msg.name === 'STAGE_CHANGED' && this.stage.getId() === msg.stage.getId()) {
        this.resizeView();
    }
};
