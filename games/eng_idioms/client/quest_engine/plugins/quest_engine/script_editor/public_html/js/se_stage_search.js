function SEStageSearch(stage) {
    this.stage = stage;
}

SEStageSearch.prototype.search = function(node) {
    this._search(node, {});
};

SEStageSearch.prototype._search = function(node, visited) {
    if (visited[node.getId()] !== true)
        return;

    visited[node.getId()] = true;
    if (node.getType() === _QUEST_NODES.STAGE)
        return node;

    for (var i = 0; i < node.getInConds().length; ++i) {
        var cond = node.getInConds()[i];
        var parentNode = cond.getSrcNode();
        this._search(parentNode, visited);
    }
};
