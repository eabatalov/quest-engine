function SECond(type) {
    this.id = SECond.idCnt++;
    this.srcNode = null; //Node which we come through the condition from
    this.dstNode = null; //Node which will be picked if cond is met
    this.deleted = false;

    //Public cond type dependent data is stored in props
    this.setType(type);
    SECond.events.condCreated.publish(this);

    this.events = {
        typeChanged : new SEEvent(),
        srcNodeChanged : new SEEvent()
    };
}

SECond.idCnt = 0;
SECond.events = {
    condCreated : new SEEvent(), /* function(cond) */
    condDeleted : new SEEvent() /* function(cond) */
};

SECond.prototype.delete = function() {
    if (!this.deleted) {
        //Use "deleted" flag to break cascade deletion chains
        this.deleted = true;
        SECond.events.condDeleted.publish(this);
        jQuery.each(this.events, function(evName, ev) {
            ev.delete();
        });

        if (this.srcNode) {
            this.srcNode.deleteOutCond(this);
        }
        if (this.dstNode) {
            this.dstNode.deleteInCond(this);
        }
        delete this.srcNode;
        delete this.dstNode;
        delete this.id;
        delete this.type;
        delete this.deleted;
        delete this.props;
        delete this.events;
    }
};

SECond.prototype.save = function() {
    return {
        ver : 1,
        id : this.id,
        type : this.type,
        props : this.props
    };
};

SECond.load = function(savedData) {
    //Nodes will set our src/dst nodes on its load
    assert(savedData.ver === 1);
    SECond.idCnt = Math.max(SECond.idCnt, savedData.id + 1);

    var cond = new SECond();
    cond.id = savedData.id;
    cond.type = savedData.type;
    cond.props = savedData.props;
    return cond;
};

SECond.prototype.getId = function() {
    return this.id;
};

SECond.prototype.getType = function() {
    return this.type;
};

SECond.prototype.setProp = function(name, value) {
    this.props[name] = value;
};

SECond.prototype.getProps = function() {
    return this.props;
};

SECond.prototype.getProp = function(propName) {
    return this.props[propName];
};

SECond.prototype.getSrcNode = function() {
    return this.srcNode;
};

SECond.prototype.setSrcNode = function(node) {
    var oldNode = this.srcNode;
    this.srcNode = node;
    if (oldNode !== this.srcNode)
        this.events.srcNodeChanged.publish(this);
};

SECond.prototype.getDstNode = function(node) {
    return this.dstNode;
};

SECond.prototype.setDstNode = function(node) {
    this.dstNode = node;
};

SECond.prototype.setType = function(type) {
    this.type = type;
    this.props = {};
    switch(type) {
        case _QUEST_CONDS.OBJECT_CLICKED:
            this.props.id = "";
        break;
        case _QUEST_CONDS.NEXT:
            this.props.clearStage = true;
        break;
    }
    if (this.events)
        this.events.typeChanged.publish(this);
};
