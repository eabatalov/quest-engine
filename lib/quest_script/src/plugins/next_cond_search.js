function NextCondSearch() {
}

/*
 * returns first 'NEXT' SECond object if reachable from @node
 * returns null if no 'NEXT' SECond is reachable from @node
 */
NextCondSearch.prototype.get = function(/* SENode */node) {
    return this._get(node, {});
}

NextCondSearch.prototype._get = function(/* SENode */ node, visited) {
    if (node.getContinue() || visited[node.getId()])
        return null;

    visited[node.getId()] = true;
    var i;
    var conds = node.getOutConds();
    var condsNum = conds.length;

    for (i = 0; i < condsNum; ++i) {
        var cond = conds[i];
        if (cond.getType() === _QUEST_CONDS.NEXT) {
            return cond;
        }
        if (cond.getType() === _QUEST_CONDS.CONTINUE ||
            cond.getType() === _QUEST_CONDS.NONE) {
            var recCond = this._get(cond.getDstNode(), visited);
            if (recCond)
                return recCond;
        }
    }
    return null;
};
