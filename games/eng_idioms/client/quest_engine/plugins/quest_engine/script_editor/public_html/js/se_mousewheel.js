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
	var thiz = this;
	var isMouseOnObj = false;

	var objMouseOver = sedo.do.mouseover;
	sedo.do.mouseover = function(intData) {
		isMouseOnObj = true;
		if (objMouseOver) objMouseOver(intData);
	};

	var objMouseOut = sedo.mouseout;
	sedo.do.mouseout = function(intData) {
		isMouseOnObj = false;
		if (objMouseOut) objMouseOut(intData);
	}

	this.onDocument(function(yDelta) {
		if (isMouseOnObj)
			return cb.call(sedo, yDelta);
		else
			return thiz.useDefaultWheelEvents;
	});
};

MouseWheelManager.prototype.onDocument = function (cb) {
	this.onSelector(document.body, cb);
};

MouseWheelManager.prototype.onSelector = function(selector, cb) {
	$(selector).on('mousewheel wheel', function (e) {
		return cb(e.originalEvent.wheelDelta || e.originalEvent.deltaY);
		/* http://learn.javascript.ru/mousewheel */
	});
};

function MouseWheelManagerFactory() {
	return new MouseWheelManager();
}
