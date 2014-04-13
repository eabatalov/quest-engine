SE_ROUTER_EP_ADDR = {
    INVALID : 0,

    BROADCAST_NO_STAGES : 0x4, //2nd bit set
    BROADCAST_CURRENT_STAGE : 0x6, //+1st bit set
    BROADCAST_ALL_STAGES : 0x7, //+0th bit set

    CONTROLS_GROUP : 1000, //Broadcast addr for controls group
    CONTROLS_GROUP_SCRIPT_EDTIOR : 1001,
    CONTROLS_GROUP_LAST : 4999,

    STAGE_CURRENT : 5000, //Only for delivery
    STAGE_GROUP : 5001, //Broadcast add for stage group
    STAGE_GROUP_FIRST : 5002,
    STAGE_GROUP_LAST : 10000
};

function SEEventRouter() {
    this.curStageAddr = SE_ROUTER_EP_ADDR.INVALID;
    this.endPoints = [];
}

SEEventRouter.prototype.createEP = function(epAddr) {
    var newEP = new SEEventEP(epAddr, this);
    this.endPoints.push(newEP);
    return newEP;
};

SEEventRouter.prototype.deleteEP = function(delEP) {
    for (var i = 0; i < this.endPoints.length; ++i){
        var ep = this.endPoints[i];
        if (ep.id === delEP.id) {
            this.endPoints.splice(i, 1);
            return;
        }
    };
};

SEEventRouter.prototype.deliver = function(targetEPAddr, message) {
    var matchControlGroup = targetEPAddr & 0x4 ||
        targetEPAddr === SE_ROUTER_EP_ADDR.CONTROLS_GROUP;
    var matchAllStages = targetEPAddr & 0x1 ||
        targetEPAddr === SE_ROUTER_EP_ADDR.STAGE_GROUP;
    var matchCurStage = targetEPAddr & 0x2 ||
        targetEPAddr === SE_ROUTER_EP_ADDR.STAGE_CURRENT;

    for (var i = 0; i < this.endPoints.length; ++i) {
        var ep = this.endPoints[i];
        var epAddr = ep.addr;

        if (!ep.onEvent.length)
            continue;

        if (epAddr === targetEPAddr) {
            ep.deliver(message);
            continue;
        }

        if (matchControlGroup &&
            (epAddr >= SE_ROUTER_EP_ADDR.CONTROLS_GROUP &&
            epAddr < SE_ROUTER_EP_ADDR.CONTROLS_GROUP_LAST)) {
            ep.deliver(message);
            continue;
        }

        if (matchCurStage && (epAddr === this.curStageAddr)) {
            ep.deliver(message);
            continue;
        }

        if (matchAllStages &&
            (epAddr >= SE_ROUTER_EP_ADDR.STAGE_GROUP &&
            epAddr < SE_ROUTER_EP_ADDR.STAGE_GROUP_LAST)) {
            ep.deliver(message);
            continue;
        }
    }
};

SEEventRouter.prototype.setCurrentStageAddr = function(addr) {
    this.curStageAddr = addr;
};

function SEEventEP(addr, router) {
    this.id = SEEventEP.idCnt++;
    this.addr = addr;
    this.router = router;
    this.onEvent = [];
}

SEEventEP.idCnt = 0;

SEEventEP.prototype.deliver = function(msg) {
    for (var i = 0; i < this.onEvent.length; ++i) {
        var handler = this.onEvent[i];
        if (handler.thiz)
            handler.cb.call(handler.thiz, msg);
        else
            handler.cb(msg);
    }
};

SEEventEP.prototype.send = function(epAddr, message) {
    this.router.deliver(epAddr, message); 
};

SEEventEP.prototype.on = function(cb, thiz) {
    this.onEvent.push({ cb : cb, thiz : thiz });
};

SEEventEP.prototype.delete = function() {
    this.router.deleteEP(this);
    delete this.id;
    delete this.addr;
    delete this.router;
    delete this.onEvent;
};

function SEEventRouterFactory() {
    return new SEEventRouter();
}
