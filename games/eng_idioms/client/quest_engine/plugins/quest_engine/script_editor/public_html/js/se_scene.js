function SEScene() {
    this.stage = new PIXI.Stage(0xFFFFFF, true);
    this.renderer = PIXI.autoDetectRenderer(null, null, null, true, true);
    $("#scene-editor-canvases-container").append(this.renderer.view);

    this.periodicRender = false;

    this.update = function() {
        if (this.renderer && this.stage)
            this.renderer.render(this.stage);
    }.bind(this);

    this.runUpLoop = function() {
        if (!this.periodicRender || !this.update || !this.runUpLoop)
            return;
        //TODO remove this update loop once PIXI interaction manager is
        //decoupled from rendering
        //http://www.html5gamedevs.com/topic/1636-interactionmanagerupdate-is-coupled-to-render-loop/
        requestAnimFrame(this.update);
        setTimeout(this.runUpLoop, 1000 / 30); //30 FPS
    }.bind(this);
}

SEScene.prototype.delete = function() {
    this.stopPeriodicRendering();
    jQuery(this.renderer.view).remove();
    delete this.renderer.view;
    delete this.stage;
    delete this.renderer;
    delete this.periodicRender;
    delete this.update;
    delete this.runUpLoop;
};

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
