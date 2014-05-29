/*
 * Helper classes to fix different PIXI issues
 */
function SEDisplayObject(dispObj, interactive) {
    this.id = SEDisplayObject.seqID++;
    //PIXI display object which is used to draw this object
    if (dispObj === undefined)
        this.do = null;
    else
        this.setDO(dispObj, interactive);
}

SEDisplayObject.seqID = 0;

SEDisplayObject.prototype.getId = function() {
    return this.id;
};

function SEObjectConfig() {
    Array.prototype.removeBySEId = function(id) {
        for (i = 0; i < this.length; ++i) {
            if (this[i].getId() === id) {
                this.splice(i, 1);
                break;
            }
        }
        return this;
    };
}

SEDisplayObject.prototype.setDO = function(dispObj, interactive) {
    this.do = dispObj;
    this.setInteractive(interactive ? interactive : true);
    this.do.sedo = this;
};

SEDisplayObject.prototype.setInteractive = function(val) {
    this.do.interactive = val;
};

SEDisplayObject.prototype.getInteractive = function() {
    return this.do.interactive;
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
    /* XXX
    Looks like a PIXI bug
    Interation manager throws exception after
    interactive object was deleted
    */
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

SEDisplayObject.prototype.getVisible = function() {
    return this.do.visible;
};

SEDisplayObject.prototype.setHitArea = function(hitArea) {
    this.do.hitArea = hitArea;
};

SEDisplayObject.prototype.delete = function() {
    delete this.id;
    delete this.do;
};
/*
 * Sprite object with sizes independent of its scale
 */
function SESpriteObject(dispObj, interactive) {
    SEDisplayObject.call(this, dispObj, interactive);
}

SESpriteObject.prototype = new SEDisplayObject();

SESpriteObject.prototype.setDO = function(dispObj, interactive) {
    SEDisplayObject.prototype.setDO.call(this, dispObj, interactive);
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

SESpriteObject.prototype.setTexture = function(texture) {
    this.do.setTexture(texture);
};

/*
 * Text object
 */
function SETextObject(dispObj, interactive) {
    SEDisplayObject.call(this, dispObj, interactive);
    dispObj.__se = this;
}

SETextObject.prototype = new SEDisplayObject();

SETextObject.prototype.setStyle = function(val) {
    var fontStr = "";
    fontStr += val.font.bold ? "bold " : "";
    fontStr += val.font.height.toString() + val.font.unit + " " + val.font.typeFace;
    this.do.setStyle({
        font : fontStr,
        fill : val.color,
        align: val.align,
        stroke : val.stroke,
        strokeThickness : val.strokeThickness,
        wordWrap : val.wordWrap,
        wordWrapWidth : val.wordWrapWidth
    });
};

SETextObject.prototype.setText = function(val) {
    this.do.setText(val);
};

(function() {
    /*
    PIXI's bug from HELL:
    in function PIXI.Text.prototype.determineFontHeight = function(fontStyle)
    PIXI determines font height using KOSTIL from HELL.
    It creates new div in html body. This div gets default style determined by document css.
    In our case div has 100% width and height. But PIXI thinks that it has 0 W and H.
    XXX use temporal hack to fix
    */
    PIXI.Text.prototype.determineFontHeight = function() {
        return this.__se ? this.__se.height : 20;
    };
})();

SETextObject.prototype.setWH = function(w, h) {
    this.width = w;
    this.height= h;
};

SETextObject.prototype.delete = function() {
    //XXX private API usage
    PIXI.Texture.removeTextureFromCache(this.do.canvas._pixiId);
    delete PIXI.BaseTextureCache[this.do.canvas._pixiId];
    this.do.destroy(true);
    SEDisplayObject.prototype.delete.call(this);
};
