/*
 * Helper classes to fix different PIXI issues
 */
function SEDisplayObject() {
    //PIXI display object which is used to draw this object
    this.do = null;
}

SEDisplayObject.prototype.setDO = function(dispObj) {
    this.do = dispObj;
    this.do.setInteractive(true);
    this.do.sedo = this;
};

//Scale independent sizes
SEDisplayObject.prototype.getWidth = function() {
    return this.do.getLocalBounds().width;
};

SEDisplayObject.prototype.getHeight = function() {
    return this.do.getLocalBounds().height;
};

SEDisplayObject.prototype.setWH = function(w, h) {
    this.do.width = w;
    this.do.height = h;
};

//Hiding do to external objects, make access easier
SEDisplayObject.prototype.setPosition = function(x, y) {
    this.do.x = x;
    this.do.y = y;
};

SEDisplayObject.prototype.getX = function() {
    return this.do.x;
};

SEDisplayObject.prototype.getY = function() {
    return this.do.y;
};

SEDisplayObject.prototype.getPos = function() {
    return this.do.position;
};

SEDisplayObject.prototype.setScale = function(val) {
    this.do.scale.x = val;
    this.do.scale.y = val;
};

SEDisplayObject.prototype.getScale = function() {
    return this.do.scale.x;
};

SEDisplayObject.prototype.setAlpha = function(val) {
    this.do.alpha = val;
}

SEDisplayObject.prototype.setParent = function(parent) {
    if (parent instanceof SEDisplayObject) {
        parent.do.addChild(this.do);
    } else {
        parent.addChild(this.do);
    }
};

SEDisplayObject.prototype.detachParent = function() {
    /*Looks like a PIXI bug
    Interation manager throws exception after
    interactive object was deleted*/
    this.do.setInteractive(false);

    if (this.do.parent) {
        this.do.parent.removeChild(this.do);
    }
};

SEDisplayObject.prototype.getLocalPosition = function(intData) {
    /*XXX PixiJS workaround
     * Pixi takes into account only the first parent's base;
     */
    var realGlobal = intData.global;
    var tunedGlobal = intData.global = realGlobal.clone();
    var parent = this.do.parent.parent;
    while(parent) {
        tunedGlobal.x -= parent.position.x;
        tunedGlobal.y -= parent.position.y;
        parent = parent.parent;
    }
    var res = intData.getLocalPosition(this.do);
    intData.global = realGlobal;
    return res;
};

SEDisplayObject.prototype.contains = function(px, py) {
    return this.do.hitArea.contains(px, py)
};

function SESpriteObject() {
    SEDisplayObject.call(this);
}

SESpriteObject.prototype = new SEDisplayObject();

SESpriteObject.prototype.setDO = function(dispObj) {
    SEDisplayObject.prototype.setDO.call(this, dispObj);
    this.do.hitArea = this.do.getLocalBounds().clone();
};

SESpriteObject.prototype.setWH = function(w, h) {
    throw "Setting WH on sprite objects is not allowed";
};
