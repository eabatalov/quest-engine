function SECond(/* _QUEST_CONDS.* */ type, storyLine, seEvents, props) {
    SEDisplayObject.call(this, new PIXI.Graphics());
    this.points = {};
    this.points.src = new PIXI.Point(0, 0);
    this.points.dst = new PIXI.Point(0, 0);
    this.points.srcVisible = new PIXI.Point(0, 0);
    this.points.dstVisible = new PIXI.Point(0, 0);
    this.points.draw = new PIXI.Point(0, 0);

    this.buttons = {
        del : new SESpriteObject(new PIXI.Sprite(SECond.TEXTURES.buttons.del)),
    }
    this.buttons.del.setParent(this);
    this.buttons.del.do.buttonMode = true;
    this.buttons.del.do.click = this.controlEvent.bind(this, "DEL", "CLICK");
    this.setControlsVisible(false);

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

    this.do.click = this.do.tap = this.inputEvent.bind(this, "CLICK");
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

SECond.prototype.isCondEvent = function(intData) {
    var p = this.getLocalPosition(intData);
    if (this.buttons.del.getVisible() && this.buttons.del.contains(p.x, p.y))
        return false;
    else return true;
};

SECond.prototype.inputEvent = function(evName, intData) {
    console.log(evName);
    if (evName === "CLICK" && this.isCondEvent(intData)) {
        this.seEvents.broadcast({ name : "COND_CLICK", cond : this });
        return;
    }
}

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
    var WIDTH = 15;
    var CLICK_WIDTH = WIDTH * 2;
    var PICK_LEN = 40;
    var PICK_WIDTH = WIDTH * 2.5;
    var SRC_DIST = 1;
    var DST_DIST = 1;

    var srcPt = this.points.srcVisible;
    srcPt.x = this.points.src.x;
    srcPt.y = this.points.src.y;
    var dstPt = this.points.dstVisible;
    dstPt.x = this.points.dst.x;
    dstPt.y = this.points.dst.y;

    var vecX = dstPt.x - srcPt.x;
    var vecY = dstPt.y - srcPt.y;
    var r = Math.sqrt(vecX * vecX + vecY * vecY);
    var phi = Math.atan2(vecY, vecX);
    var phiCos = Math.cos(phi);
    var phiSin = Math.sin(phi);
    var phiNormCos = Math.cos(phi + Math.PI / 2);
    var phiNormSin = Math.sin(phi + Math.PI / 2);

    var len = Math.sqrt(
        (this.points.dst.x - this.points.src.x) * (this.points.dst.x - this.points.src.x) +
        (this.points.dst.y - this.points.src.y) * (this.points.dst.y - this.points.src.y)
    );
    var midX = this.points.src.x + len/2 * phiCos;
    var midY = this.points.src.y + len/2 * phiSin;

    var srcDistance = 0;
    if (this.srcNode) {
        var srcDiagLen = Math.sqrt(Math.pow(this.srcNode.getWidth(), 2) + Math.pow(this.srcNode.getHeight(), 2));
        srcDistance = srcDiagLen / 2 + SRC_DIST;
    }
    var dstDistance = 0;
    if (this.dstNode) {
        var dstDiagLen = Math.sqrt(Math.pow(this.dstNode.getWidth(), 2) +  Math.pow(this.dstNode.getHeight(), 2));
        dstDistance = dstDiagLen / 2 + DST_DIST;
        dstDistance += PICK_LEN;
    }
    if (len - srcDistance - dstDistance <= 0) {
        srcDistance = len / 2 - PICK_LEN / 2;
        dstDistance = len / 2 + PICK_LEN / 2;
    }

    srcPt.x += srcDistance * phiCos;
    srcPt.y += srcDistance * phiSin;
    dstPt.x -= dstDistance * phiCos;
    dstPt.y -= dstDistance * phiSin;

    this.do.clear();
    this.do.lineStyle(WIDTH, 0x000000, 1);
    this.do.moveTo(srcPt.x, srcPt.y);
    this.do.lineTo(dstPt.x, dstPt.y);
    //Arrow pick
    this.do.lineStyle(1, 0x000000, 1);
    this.do.beginFill(0x000000);
    var pt = this.points.draw;
    pt.x = dstPt.x; pt.y = dstPt.y;
    pt.x += PICK_LEN * phiCos;
    pt.y += PICK_LEN * phiSin;
    this.do.moveTo(pt.x, pt.y);

    pt.x -= PICK_LEN * phiCos + PICK_WIDTH / 2 * phiNormCos;
    pt.y -= PICK_LEN * phiSin + PICK_WIDTH / 2 * phiNormSin;
    this.do.lineTo(pt.x, pt.y);

    pt.x += PICK_WIDTH * phiNormCos;;
    pt.y += PICK_WIDTH * phiNormSin;
    this.do.lineTo(pt.x, pt.y);

    pt.x += PICK_LEN * phiCos - PICK_WIDTH / 2 * phiNormCos;
    pt.y += PICK_LEN * phiSin - PICK_WIDTH / 2 * phiNormSin;
    this.do.lineTo(pt.x, pt.y);
    this.do.endFill();
    //Place button in the middle
    this.buttons.del.setPosition(
        midX - this.buttons.del.getWidth() / 2,
        midY - this.buttons.del.getHeight() / 2
    );
    //Hit area
    var hitAreaPoints = [
        new PIXI.Point(this.points.srcVisible.x + CLICK_WIDTH / 2 * phiNormCos, this.points.srcVisible.y + CLICK_WIDTH / 2 * phiNormSin),
        new PIXI.Point(this.points.srcVisible.x - CLICK_WIDTH / 2 * phiNormCos, this.points.srcVisible.y - CLICK_WIDTH / 2 * phiNormSin),
        new PIXI.Point(this.points.dstVisible.x + PICK_LEN * phiCos - CLICK_WIDTH / 2 * phiNormCos,
            this.points.dstVisible.y + PICK_LEN * phiSin - CLICK_WIDTH / 2 * phiNormSin),
        new PIXI.Point(this.points.dstVisible.x + PICK_LEN * phiCos + CLICK_WIDTH / 2 * phiNormCos,
            this.points.dstVisible.y + PICK_LEN * phiSin + CLICK_WIDTH / 2 * phiNormSin),
        new PIXI.Point(this.points.srcVisible.x + CLICK_WIDTH / 2 * phiNormCos, this.points.srcVisible.y + CLICK_WIDTH / 2 * phiNormSin)
    ];
    this.do.hitArea = new PIXI.Polygon(hitAreaPoints);
    //Debug
    /*this.do.lineStyle(1, 0x000000, 1);
    for (i = 1; i < hitAreaPoints.length; ++i) {
        this.do.moveTo(hitAreaPoints[i - 1].x, hitAreaPoints[i - 1].y);
        this.do.lineTo(hitAreaPoints[i].x, hitAreaPoints[i].y);
    }*/
    this.do.moveTo(hitAreaPoints[hitAreaPoints.length - 1].x, hitAreaPoints[hitAreaPoints.length - 1].y);
    this.do.lineTo(hitAreaPoints[0].x, hitAreaPoints[0].y);
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
