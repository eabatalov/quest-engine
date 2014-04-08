function SEScene() {
    this.stage = new PIXI.Stage(0xFFFFFF, true);
    this.renderer = PIXI.autoDetectRenderer(null, null, null, true);
    $("#scene-editor-canvases-ontainer").append(this.renderer.view);

    this.periodicRender = false;

    this.update = function() {
        this.renderer.render(this.stage);
    }.bind(this);

    this.runUpLoop = function() {
        if (!this.periodicRender)
            return;
        //TODO remove this update loop once PIXI interaction manager is
        //decoupled from rendering
        //http://www.html5gamedevs.com/topic/1636-interactionmanagerupdate-is-coupled-to-render-loop/
        requestAnimFrame(this.update);
        setTimeout(this.runUpLoop, 1000 / 30); //30 FPS
    }.bind(this);
}

SEScene.prototype.resize = function(w, h) {
    this.renderer.resize(w, h);
};

SEScene.prototype.getRootSceneObj = function() {
    return this.stage;
};

SEScene.prototype.getDOMElem = function() {
    return this.renderer.view;
};

SEScene.prototype.startPeriodicRendering = function() {
    if (this.periodicRender)
        return;

    this.periodicRender = true;
    this.runUpLoop();
};

SEScene.prototype.stopPeriodicRendering = function() {
    this.periodicRender = false;
};

SEScene.prototype.show = function() {
    $(this.renderer.view).show();
};

SEScene.prototype.hide = function() {
    $(this.renderer.view).hide();
};
