function SESceneSizeTweak(seEvents, scene) {
    this.onSizeChanged = null;
    this.initNum = 3;

    this.onInitCompleted = function() {
        if (this.initNum !== 0)
            return;
        this.jqCanvas = $(scene.getDOMElem());
        this.jqPropWindow = $("#propsDiv");
        this.jqToolbar = $("#toolbarDiv");
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.calcViewWH();
        this.resizeView();
    };

    this.calcViewWH = function() {
        this.viewWidth = this.viewHeight = this.jqCanvas.parent().width() * 1;
    };

    this.resizeView = function() {
        this.calcViewWH();
        scene.resize(this.viewWidth, this.viewHeight);
        this.jqPropWindow.height(this.viewHeight);
        this.jqToolbar.height(this.viewHeight);
        if (this.onSizeChanged)
            this.onSizeChanged(this.viewWidth, this.viewHeight);
        scene.update();
    }.bind(this);

    var signalOneInitCompleted = function() {
        this.initNum -= 1;
        this.onInitCompleted();
    }.bind(this);
    $(document).ready(signalOneInitCompleted);
    seEvents.on(function(msg) {
        if (msg.name === 'TOOLBAR_INITED' || msg.name === 'PROPS_WIND_INITED')
            signalOneInitCompleted();
    });

    $(window).resize(this.resizeView);
}
