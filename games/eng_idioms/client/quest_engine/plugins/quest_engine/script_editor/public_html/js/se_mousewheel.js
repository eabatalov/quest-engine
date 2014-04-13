function DOMObjMouseWheelEventHandler(mwManger, cb, jqDOMObj) {
    if (arguments.length === 0)
        return;

    this.id = DOMObjMouseWheelEventHandler.idCnt++;
    this.mwManager = mwManger;
    this.cb = cb;
    this.jqDOMObj = jqDOMObj;
    this.mouseWheelCB = function (e) {
		return this.cb(e.originalEvent.wheelDelta || e.originalEvent.deltaY);
		/* http://learn.javascript.ru/mousewheel */
	}.bind(this);
    this.enable();
}

DOMObjMouseWheelEventHandler.idCnt = 0;

DOMObjMouseWheelEventHandler.prototype.delete = function() {
    this.disable();
    delete this.id;
    delete this.mwManager;
    delete this.mouseWheelCB;
    delete this.cb;
    delete this.jqDOMObj;
};

DOMObjMouseWheelEventHandler.prototype.enable = function() {
    this.jqDOMObj.on('mousewheel wheel', null, this.mouseWheelCB);
};

DOMObjMouseWheelEventHandler.prototype.disable = function() {
    this.jqDOMObj.off('mousewheel wheel', null, this.mouseWheelCB);
};

function SEDOMouseWheelEventHandler(mwManager, cb, sedo) {
    DOMObjMouseWheelEventHandler.call(this, mwManager, this.mouseWheelCB.bind(this), jQuery(document.body));
    this.origMouseOver = sedo.do.mouseover;
    this.origMouseOut = sedo.do.mouseout;
    this.sedo = sedo;
    this.isMouseOnObj = false;
    this.sedoCB = cb;

	this.sedo.do.mouseover = function(intData) {
		this.isMouseOnObj = true;
		if (this.origMouseOver)
            this.origMouseOver(intData);
	}.bind(this);

	this.sedo.do.mouseout = function(intData) {
		this.isMouseOnObj = false;
		if (this.origMouseOut)
            this.origMouseOut(intData);
	}.bind(this);
}

SEDOMouseWheelEventHandler.prototype = new DOMObjMouseWheelEventHandler();
SEDOMouseWheelEventHandler.prototype.mouseWheelCB = function(yDelta) {
    if (this.isMouseOnObj)
		return this.sedoCB.call(this.sedo, yDelta);
	else
		return this.mwManager.useDefaultWheelEvents;
};

SEDOMouseWheelEventHandler.prototype.delete = function() {
    DOMObjMouseWheelEventHandler.prototype.delete.call(this);
    this.sedo.do.mouseover = this.origMouseOver;
    this.sedo.do.mouseout = this.origMouseOut;
    delete this.sedo;
    delete this.sedoCB;
    delete this.origMouseOver;
    delete this.origMouseOut;
    delete this.isMouseOnObj;
};

function MouseWheelManager() {
	//Make scene not scrollable and etc
	this.useDefaultWheelEvents = true;
}

/*
 * cb == function(yDelta)
 * pixiObj - any interactive pixi object
 * onInteractive should be called after object interactive events were set up
 * returns true when wnats event to propagate
 */
MouseWheelManager.prototype.onSEDO = function(sedo, cb) {
    return new SEDOMouseWheelEventHandler(this, cb, sedo);
};

MouseWheelManager.prototype.onDocument = function (cb) {
    return new DOMObjMouseWheelEventHandler(this, cb, jQuery(document.body));
};

MouseWheelManager.prototype.onSelector = function(selector, cb) {
    return new DOMObjMouseWheelEventHandler(this, cb, jQuery(selector));
};

function MouseWheelManagerFactory() {
	return new MouseWheelManager();
}
