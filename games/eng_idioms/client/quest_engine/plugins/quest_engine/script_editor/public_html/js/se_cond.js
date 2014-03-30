function SECond(/* _QUEST_CONDS.* */ type, storyLine, seEvents, props) {
    SEDisplayObject.call(this, new PIXI.Graphics());
    this.points = {};
    this.points.src = new PIXI.Point(0, 0);
    this.points.dst = new PIXI.Point(0, 0);
    this.buttons = {
        del : new SESpriteObject(new PIXI.Sprite(SECond.TEXTURES.buttons.del)),
    }
    this.buttons.del.setParent(this);
    this.buttons.del.do.buttonMode = true;
    this.buttons.del.do.click = this.controlEvent.bind(this, "DEL", "CLICK");

    this.seEvents = seEvents;
    this.type = type;
    this.storyLine = storyLine;
    this.srcNode = null; //Node which we come through the condition from
    this.dstNode = null; //Node which will be picked if cond is met

    if (props !== null && props !== undefined) {
        this.props =  props;
    } else {
        this.changeType(type);
    }

    this.seEvents.on(this.onSeEvent.bind(this));
}

SECond.prototype = new SEDisplayObject(); 

SECond.prototype.contains = function(px, py) {
    if (this.do.hitArea)
        return this.do.hitArea.contains(px, py);
    else
        return false;
};

SECond.prototype.onSeEvent = function(args) {
    if (args.name === "OBJECT_FOCUS") {
        if (args.obj.getId() === this.getId()) {
            this.setControlsVisible(true);
        } else {
            this.setControlsVisible(false);
        };
        //XXX it work without update because we have rendering loop now
        //sceneUpdater.up();
        return;
    }
};

SECond.prototype.controlEvent = function(ctlName, evName) {
    if (ctlName === "DEL" && evName === "CLICK") {
        this.seEvents.broadcast({ name : "COND_DEL_CLICK" , cond : this });
        //console.log(ctlName + " " + evName);
        return;
    }
};

SECond.prototype.delete = function() {
    if (this.srcNode) {
        this.srcNode.deleteOutCond(this);
    }
    if (this.dstNode) {
        this.dstNode.deleteInCond(this);
    }
    this.detachParent();
    this.setInteractive(false);
    this.seEvents.broadcast({ name : "COND_DELETED", cond : this });
};

SECond.prototype.changeType = function(type) {
    this.props = {};
    switch(type) {
        case _QUEST_CONDS.OBJECT_CLICKED:
            this.props.id = "";
        break;
    }
}

SECond.prototype.setSrc = function(point) {
    this.points.src.x = point.x;
    this.points.src.y = point.y;
    this.reDraw();
}

SECond.prototype.setDst = function(point) {
    this.points.dst.x = point.x;
    this.points.dst.y = point.y;
    this.reDraw();
}

SECond.prototype.setSrcNode = function(node) {
    this.srcNode = node;
};

SECond.prototype.setDstNode = function(node) {
    this.dstNode = node;
};

SECond.prototype.setControlsVisible = function(val) {
    this.buttons.del.setVisible(val);
};

SECond.prototype.reDraw = function() {
    var WIDTH = 10;
    var PICK_LEN = 10;

    var srcPt = this.points.src.clone();
    var dstPt = this.points.dst.clone();

    var srcDistance = this.srcNode ? this.srcNode.getWidth() / 2 + 10 : 0;
    var dstDistance = this.dstNode ? this.dstNode.getWidth() / 2 + 10 : 0;
    dstDistance += PICK_LEN;
    
    var vecX = dstPt.x - srcPt.x;
    var vecY = dstPt.y - srcPt.y;
    var r = Math.sqrt(vecX * vecX + vecY * vecY);
    var phi = Math.atan2(vecY, vecX);
    var phiCos = Math.cos(phi);
    var phiSin = Math.sin(phi);

    srcPt.x += srcDistance * phiCos;
    srcPt.y += srcDistance * phiSin;

    dstPt.x -= dstDistance * phiCos;
    dstPt.y -= dstDistance * phiSin;

    this.do.clear();
    this.do.lineStyle(WIDTH, 0x000000, 1);
    this.do.moveTo(srcPt.x, srcPt.y);
    this.do.lineTo(dstPt.x, dstPt.y);
    //Arrow pick
    var PICK_WIDTH = 10;
    //Work with dstPt, srcPt not to create new on
    var phiNormCos = Math.cos(phi + Math.PI / 2);
    var phiNormSin = Math.sin(phi + Math.PI / 2);
    dstPt.x += PICK_LEN * phiCos;
    dstPt.y += PICK_LEN * phiSin;
    srcPt.x = dstPt.x - PICK_LEN * phiCos;
    srcPt.y = dstPt.y - PICK_LEN * phiSin;
    this.do.beginFill(0x000000);
    this.do.moveTo(dstPt.x, dstPt.y);
    srcPt.x += PICK_WIDTH / 2 * phiNormCos;
    srcPt.y += PICK_WIDTH / 2 * phiNormSin;
    this.do.lineTo(srcPt.x, srcPt.y);
    srcPt.x -= PICK_WIDTH * phiNormCos;;
    srcPt.y -= PICK_WIDTH * phiNormSin;
    this.do.lineTo(srcPt.x, srcPt.y);
    this.do.lineTo(dstPt.x, dstPt.y);
    this.do.endFill();
    //
    var len = Math.sqrt(
        (this.points.dst.x - this.points.src.x) * (this.points.dst.x - this.points.src.x) +
        (this.points.dst.y - this.points.src.y) * (this.points.dst.y - this.points.src.y)
    );
    var midX = this.points.src.x + len/2 * phiCos;
    var midY = this.points.src.y + len/2 * phiSin;
    this.buttons.del.setPosition(
        midX - this.buttons.del.getWidth() / 2,
        midY - this.buttons.del.getHeight() / 2
    );
    //XXX it work without update because we have rendering loop now
    //sceneUpdater.up();
}

function SECondStaticConstructor(completionCB) {
    SECond.TEXTURE_PATHS = { buttons : {} };
    SECond.TEXTURE_PATHS.buttons.del = "images/nav/nav_clnode.png";

    var assetsToLoad = $.map(SECond.TEXTURE_PATHS.buttons,
        function(value, index) { return [value]; });

    loader = new PIXI.AssetLoader(assetsToLoad);
    loader.onComplete = function() {
        SECond.TEXTURES = {
            buttons : {
                del : PIXI.Texture.fromImage(SECond.TEXTURE_PATHS.buttons.del) 
            }
        };
        completionCB();
    };
    loader.load();
}
