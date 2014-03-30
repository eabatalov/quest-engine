/*
 * Helper classes to fix different PIXI issues
 */
function SEDisplayObject(dispObj) {
    this.id = SEDisplayObject.seqID++;
    //PIXI display object which is used to draw this object
    if (dispObj === undefined)
        this.do = null;
    else
        this.setDO(dispObj);
}

SEDisplayObject.seqID = 0;

SEDisplayObject.prototype.getId = function() {
    return this.id;
};

SEDisplayObject.prototype.setDO = function(dispObj) {
    this.do = dispObj;
    this.do.setInteractive(true);
    this.do.sedo = this;
};

//Scale independent sizes
SEDisplayObject.prototype.getWidth = function() {
    return this.do.width;
};

SEDisplayObject.prototype.getHeight = function() {
    return this.do.height;
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
    return intData.getLocalPosition(this.do);
};

SEDisplayObject.prototype.getParentBasedPosition = function(intData) {
    return intData.getLocalPosition(this.do.parent);
};

SEDisplayObject.prototype.contains = function(px, py) {
    if (this.do.hitArea) {
        return this.do.hitArea.contains(px - this.getX(), py - this.getY());
    } else {
        var rect = new PIXI.Rectangle(this.getX(), this.getY(), this.getWidth(), this.getHeight());
        return rect.contains(px, py);
    }
};

SEDisplayObject.prototype.setVisible = function(val) {
    this.do.visible = val;
};

/*
 * Sprite object with sizes independent of its scale
 */
function SESpriteObject(dispObj) {
    SEDisplayObject.call(this, dispObj);
}

SESpriteObject.prototype = new SEDisplayObject();

SESpriteObject.prototype.setDO = function(dispObj) {
    SEDisplayObject.prototype.setDO.call(this, dispObj);
    this.do.hitArea = this.do.getLocalBounds().clone();
};

//Scale independent sizes
SESpriteObject.prototype.getWidth = function() {
    return this.do.texture.width;
};

SESpriteObject.prototype.getHeight = function() {
    return this.do.texture.height;
};

SESpriteObject.prototype.setWH = function(w, h) {
    throw "Setting WH on sprite objects is not allowed";
};
