function Clipboard(seEventRouter) {
    this._seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this._seEvents.on(this._onSEEvent, this);
    this._clipboardObject = null;
}

Clipboard.prototype._onSEEvent = function(args) {
    if (args.name === "COPY_OBJECT_TO_CLIPBOARD") {
        this._clipboardObject = args.obj;
        return;
    }

    if (args.name === "GET_OBJECT_FROM_CLIPBOARD") {
        this._seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP,
            { name : "OBJECT_IN_CLIPBOARD_DELIVER", obj : this._clipboardObject });
        return;
    }
};

function ClipboardFactory(seEventRouter) {
	return new Clipboard(seEventRouter);
}
