function StageSearch(script) {
    this.script = script;
}

StageSearch.prototype.delete = function() {
    delete this.script;
};

/*
 * Returns SEStageNode if it exists.
 * Otherwise null.
 */
StageSearch.prototype.search = function(graphObj) {
    if (graphObj instanceof SENode) {
        return this.searchNode(graphObj, {});
    } else if (graphObj instanceof SECond) {
        return this.searchCond(graphObj, {});
    } else {
        console.error("Invalid object was passed");
        return null;
    }
};

StageSearch.prototype.searchNode = function(node, nodesVisited) {
    if (!node || nodesVisited[node.getId()])
        return null;

    nodesVisited[node.getId()] = true;
    if (node.getType() === _QUEST_NODES.STAGE)
        return node;

    for (var i = 0; i < node.getInConds().length; ++i) {
        var cond = node.getInConds()[i];
        var stageNode = this.searchCond(cond, nodesVisited);
        if (stageNode)
            return stageNode;
    }
};

StageSearch.prototype.searchCond = function(cond, nodesVisited) {
    if (!cond)
        return null;

    var parentNode = cond.getSrcNode();
    return this.searchNode(parentNode, nodesVisited);
};
