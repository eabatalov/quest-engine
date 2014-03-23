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
	$(selector).on('DOMMouseScroll mousewheel wheel', function (e) {
		return cb(e.originalEvent.detail ||
			e.originalEvent.wheelDelta ||
			e.originalEvent.wheelDeltaY);
		/* http://learn.javascript.ru/mousewheel
		if(e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
			//alternative options for wheelData: wheelDeltaX & wheelDeltaY
			//scroll down
			cb();
		} else {
			//scroll up
			cb();
		}
		//prevent page fom scrolling
		return false;*/
	});
};

function MouseWheelManagerFactory() {
	return new MouseWheelManager();
}
