function SECond(type) {
    this.id = SECond.idCnt++;
    this.changeType(type);
    this.storyline = null;
    this.srcNode = null; //Node which we come through the condition from
    this.dstNode = null; //Node which will be picked if cond is met
    this.deleted = false;

    //Public cond type dependent data is stored in props
    this.props = {};
    SECond.events.condCreated.publish(this);
}

SECond.idCnt = 0;
SECond.events = {
    condCreated : new SEEvent(),
    condDeleted : new SEEvent()
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

SECond.prototype.getSrcNode = function() {
    return this.srcNode;
};

SECond.prototype.setSrcNode = function(node) {
    this.srcNode = node;
};

SECond.prototype.getDstNode = function(node) {
    return this.dstNode;
};

SECond.prototype.setDstNode = function(node) {
    this.dstNode = node;
};

SECond.prototype.propagateStoryline = function(visited, storyline) {
    this.storyline = storyline;
    this.dstNode.propagateStoryline(visited, storyline);
};

SECond.prototype.changeType = function(type) {
    this.type = type;
    this.props = {};
    switch(type) {
        case _QUEST_CONDS.OBJECT_CLICKED:
            this.props.id = "";
        break;
    }
};

SECond.prototype.delete = function() {
    if (!this.deleted) {
        //Use "deleted" flag to break cascade deletion chains
        this.deleted = true;

        if (this.srcNode) {
            this.srcNode.deleteOutCond(this);
        }
        if (this.dstNode) {
            this.dstNode.deleteInCond(this);
        }
        this.storyline = null;
        this.srcNode = null;
        this.dstNode = null;
        SECond.events.condDeleted.publish(this);
    }
};
