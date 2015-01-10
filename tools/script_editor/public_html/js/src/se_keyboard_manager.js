function KeyboardManager(seEventRouter) {
    this._seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.INVALID);
    this._runListner();
}

KeyboardManager.prototype._runListner = function() {
    var isCtrlDown = false;
    var CTRL_KEY = 17, V_KEY = 86, C_KEY = 67;
    var thiz = this;

    $(document).keydown(function(e) {
        if (e.keyCode == CTRL_KEY) isCtrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == CTRL_KEY) isCtrlDown = false;
    });

    $(document).keydown(function(e) {
        if (isCtrlDown && (e.keyCode == V_KEY)) {
            thiz._seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "PASTE" });
            return false;
        }
        if (isCtrlDown && (e.keyCode == C_KEY)) {
            thiz._seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "COPY" });
            return false;
        }
    });
};

function KeyboardManagerFactory(seEventRouter) {
	return new KeyboardManager(seEventRouter);
}
