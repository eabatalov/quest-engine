function KeyboardManager(seEventRouter) {
    this._seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.INVALID);
    this._isCtrlDown = false;
    this._isAltDown = false;
    $(document).keydown(this._onKeyDown.bind(this));
    $(document).keyup(this._onKeyUp.bind(this));

    this._lastKeyDownTS = Date.now();
    this._runLostKeyUpsFixFunc = this._runLostKeyUpsFix.bind(this);
    this._runLostKeyUpsFix();
}

KeyboardManager.KEYS = {
    CTRL : 17,
    ALT : 18,
    V : 86,
    C : 67
};

KeyboardManager.prototype._onKeyDown = function(e) {
    if (e.keyCode === KeyboardManager.KEYS.CTRL) {
        this._isCtrlDown = true;
    } else if (e.keyCode === KeyboardManager.KEYS.ALT) {
        this._isAltDown = true;
    } else if (this._isCtrlDown && this._isAltDown &&
        (e.keyCode == KeyboardManager.KEYS.V)) {
        this._seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "PASTE" });
    } else if (this._isCtrlDown && (e.keyCode == KeyboardManager.KEYS.C)) {
        this._seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "COPY" });
    }
    this._lastKeyDownTS = Date.now();
};

KeyboardManager.prototype._onKeyUp = function(e) {
    if (e.keyCode === KeyboardManager.KEYS.CTRL) {
        this._isCtrlDown = false;
    } else if (e.keyCode === KeyboardManager.KEYS.ALT) {
        this._isAltDown = false;
    }
};

KeyboardManager.prototype._runLostKeyUpsFix = function(e) {
    //Don't account long key presses because browser looses
    //keyup events for different reasons
    var secSincleLastKeyDown =
        (Date.now() - this._lastKeyDownTS) / 1000;
    if (secSincleLastKeyDown > 1) {
        this._isAltDown = false;
        this._isCtrlDown = false;
    }
    setTimeout(this._runLostKeyUpsFixFunc, 1000);
};

function KeyboardManagerFactory(seEventRouter) {
	return new KeyboardManager(seEventRouter);
}
