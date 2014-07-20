function StoryLineRollbacker(storyLineInterp) {
    this.isRollbacking = false;
    this.rollbackableNodesHistory = [];

    storyLineInterp.events.nodeEnter.subscribe(this, this.onStoryLineNodeEnter);
    storyLineInterp.events.condEnter.subscribe(this, this.onStoryLineCondEnter);
}

/*
 * True until the last rollback node was executed
 */
StoryLineRollbacker.prototype.getIsInProgress = function() {
    return this.isRollbacking;
};

StoryLineRollbacker.prototype.getIsRollbackAvail = function() {
    return this._curNodeToRollback() ? true : false;
};

StoryLineRollbacker.prototype.step = function() {
    var rollbackNode = this._popCurNodeToRollback();
    this.isRollbacking = this._curNodeToRollback() ? true : false;
    return rollbackNode;
};

StoryLineRollbacker.prototype.startRollback = function() {
    assert(!this.isRollbacking);
    this.isRollbacking = this._curNodeToRollback() ? true : false;
};

StoryLineRollbacker.prototype.onStoryLineNodeEnter = function(node) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");
    if (StoryLineRollbacker._isNodeRollbackable(node, this.rollbackableNodesHistory)) {
        this.rollbackableNodesHistory.push(node);
    } else {
        this.rollbackableNodesHistory = [];
    }
    console.log(JSON.stringify(
        jQuery.map(this.rollbackableNodesHistory, function(node) {
            return node.getId();
        })
    ));
};

StoryLineRollbacker.prototype.onStoryLineCondEnter = function(cond) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");
    if (!StoryLineRollbacker._isCondRollbackable(cond, this.rollbackableNodesHistory))
        this.rollbackableNodesHistory = [];
};

StoryLineRollbacker.prototype._curNodeToRollback = function() {
    if (!this.rollbackableNodesHistory.length)
        return null;
    return this.rollbackableNodesHistory[this.rollbackableNodesHistory.length - 1];
};

StoryLineRollbacker.prototype._popCurNodeToRollback = function() {
    return this.rollbackableNodesHistory.pop();
};

StoryLineRollbacker._isCondRollbackable = function(cond, hist) {
    //XXX This is UI not script level logic
    switch(cond.getType()) {
        /*
         * CUSTOM_EVENT has special compleceted triggering in UI.
         * CUSTOM_EVENT rollbacking is too complicated to perform.
         */
        case _QUEST_CONDS.CUSTOM_EVENT:
            return false;
        default:
            return true;
    }
};

StoryLineRollbacker._isNodeRollbackable = function(node, hist) {
    //XXX This is UI not script level logic
    if (hist.length &&
        hist[hist.length - 1].getType() === _QUEST_NODES.QUIZ)
        return false; //Player can't make wrong answer and rollback to answer again

    switch(node.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            /* 
             * Function call nodes that can't be rollbacked should
             * should have no 'rollbackName' property to indicate that.
             */
            return node.getProp("rollbackName") ? true : false;
        default:
            return true;
    }
};
