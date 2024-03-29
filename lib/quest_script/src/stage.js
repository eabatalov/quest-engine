function SEStage(name, /* internal use */load) {
    this.stageNode = null;
    this.nodes = {};
    this.conds = {};
    this.events = {
        condCreated : new SEEvent(), /* function(cond) */
        condDeleted : new SEEvent(), /* function(cond) */
        nodeCreated : new SEEvent(), /* function(node) */
        nodeDeleted : new SEEvent(), /* function(node) */
    };

    if (load)
        return;

    this.stageNode = new SEStageNode();
    this.stageNode.props.name = name;
    this.stageNode.setLabel(name);
    this.nodes[this.stageNode.getId()] = this.stageNode;
}

SEStage.prototype.delete = function() {
    //Conds will be deleted automatically
    $.each(this.nodes, function(id, node) {
        this.deleteNode(node);
    });
    delete this.nodes;
    delete this.conds;
    delete this.stageNode;
    $.each(this.events, function(evName, ev) {
        ev.delete();
    });
    delete this.events;
};

SEStage.prototype.save = function() {
    var savedData = {
        ver : 1,
        stageNodeId : this.stageNode.getId(),
        nodes : [],
        conds : []
    };
    $.each(this.nodes, function(id, node) {
        savedData.nodes.push(node.save());
    });
    $.each(this.conds, function(id, cond) {
        savedData.conds.push(cond.save());
    });
    return savedData;
};

SEStage.load = function(savedData) {
    assert(savedData.ver === 1);
    var stage = new SEStage(null, true);
    for (var i = 0; i < savedData.conds.length; ++i) {
        var cond = SECond.load(savedData.conds[i]);
        stage.conds[cond.getId()] = cond;
    }
    for (var i = 0; i < savedData.nodes.length; ++i) {
        var node = SENode.load(savedData.nodes[i], stage.conds);
        stage.nodes[node.getId()] = node;
        if (node.getId() === savedData.stageNodeId) {
            stage.stageNode = node;
        }
    }
    return stage;
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
    this.addNode(node);
    return node;
};

SEStage.prototype.addNode = function(node) {
    this.nodes[node.getId()] = node;
    this.events.nodeCreated.publish(node);
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
    //Double deletion check + erorrs suppression
    if (!this.conds[cond.getId()])
        return;

    delete this.conds[cond.getId()];
    this.events.condDeleted.publish(cond);
    cond.delete();
};

SEStage.prototype.getNodes = function() {
    return this.nodes;
};

SEStage.prototype.getConds = function() {
    return this.conds;
};

SEStage.prototype.getNodeById = function(nodeId) {
    return this.nodes[nodeId];
};

SEStage.prototype.getCondById = function(condId) {
    return this.conds[condId];
};
