function SEStage(name) {
    this.stageNode = new SEStageNode();
    this.stageNode.props.name = name;
    this.stageNode.setLabel(name);
    this.nodes = {};
    this.nodes[this.stageNode.getId()] = this.stageNode;
    this.conds = {};

    this.events = {
        condCreated : new SEEvent(), /* function(cond) */
        condDeleted : new SEEvent(), /* function(cond) */
        nodeCreated : new SEEvent(), /* function(node) */
        nodeDeleted : new SEEvent(), /* function(node) */
    };
}

SEStage.prototype.save = function() {
    var savedData = {
        ver : 1,
        stageNodeId : this.stageNode.getId(),
        nodes : [],
        conds : []
    };
    $.each(this.nodes, function(id, node) {
        savedData.nodes.push(node);
    });
    $.each(this.conds, function(id, cond) {
        savedData.conds.push(cond);
    });
};

SEStage.load = function(savedData) {
    assert(savedData.ver === 1);
    var conds = [];
    for (var i = 0; i < savedData.conds.length; ++i) {
        conds.push(SECond.load(savedData.conds[i]));
    }
    for (var i = 0; i < savedData.nodes.length; ++i) {
        var node = SENode.load(savedData.nodes[i], conds);
        if (node.getId() === savedData.stageNodeId)
            this.stageNode = node;
    }
};

SEStage.prototype.getName = function() {
    return this.stageNode.props.name;
};

SEStage.prototype.getId = function() {
    return this.stageNode.getId();
};

SEStage.prototype.getStageNode = function() {
    return this.stageNode;
};

SEStage.prototype.createNode = function(nodeType) {
    var node = SENodeFabric(nodeType);
    this.nodes[node.getId()] = node;
    this.events.nodeCreated.publish(node);
    return node;
};

SEStage.prototype.deleteNode = function(node) {
    delete this.nodes[node.getId()];
    node.events.inCondDeleted.subscribe(this, this.deleteCond);
    node.events.outCondDeleted.subscribe(this, this.deleteCond);
    this.events.nodeDeleted.publish(node);
    node.delete();
};

SEStage.prototype.createCond = function(condType) {
    var cond = new SECond(condType);
    this.conds[cond.getId()] = cond;
    this.events.condCreated.publish(cond);
    return cond;
};

SEStage.prototype.deleteCond = function(cond) {
    delete this.conds[cond.getId()];
    this.events.condDeleted.publish(cond);
    cond.delete();
};

SEStage.prototype.delete = function() {
    //Conds will be deleted automatically
    $.each(this.nodes, function(id, node) {
        this.deleteNode(node);
    });
    delete this.nodes;
    delete this.conds;
    delete this.stageNode;
    delete this.events;
};
