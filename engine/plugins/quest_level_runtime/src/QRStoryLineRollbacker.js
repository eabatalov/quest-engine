/*
 * Single rollback unit.
 * All elements or none should be rollbacked.
 */
function QRStoryLineRollbackSequence() {

}

function QRStoryLineRollbacker(storyLineInterp) {
    this.storyLineNodeId = storyLineInterp.getStorylineNode().getId();
    this.isRollbacking = false;
    this.rollbackableNodesHistory = [];

    //storyLineInterp.events.nodeEnter.subscribe(this, this.onStoryLineNodeEnter);
    //storyLineInterp.events.condEnter.subscribe(this, this.onStoryLineCondEnter);
}

QRStoryLineRollbacker.prototype.getStoryLineNodeId = function() {
    return this.storyLineNodeId;
};

/*
 * True until the last rollback node was executed
 */
QRStoryLineRollbacker.prototype.getIsInProgress = function() {
    return this.isRollbacking;
};

QRStoryLineRollbacker.prototype.getIsRollbackAvail = function() {
    return this._curNodeToRollback() ? true : false;
};

QRStoryLineRollbacker.prototype.step = function() {
    var rollbackNode = this._popCurNodeToRollback();
    this.isRollbacking = this._curNodeToRollback() ? true : false;
    return rollbackNode;
};

QRStoryLineRollbacker.prototype.startRollback = function() {
    assert(!this.isRollbacking);
    this.isRollbacking = this._curNodeToRollback() ? true : false;
};

QRStoryLineRollbacker.prototype.onStoryLineNodeEnter = function(node) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");
    if (QRStoryLineRollbacker._isNodeRollbackable(node, this.rollbackableNodesHistory)) {
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

QRStoryLineRollbacker.prototype.onStoryLineCondEnter = function(cond) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");
    if (!QRStoryLineRollbacker._isCondRollbackable(cond, this.rollbackableNodesHistory))
        this.rollbackableNodesHistory = [];
};

QRStoryLineRollbacker.prototype.isNodeCanRollback = function(node) {
    return this._curNodeToRollback() === node;
};

QRStoryLineRollbacker.prototype._curNodeToRollback = function() {
    if (!this.rollbackableNodesHistory.length)
        return null;
    return this.rollbackableNodesHistory[this.rollbackableNodesHistory.length - 1];
};

QRStoryLineRollbacker.prototype._popCurNodeToRollback = function() {
    return this.rollbackableNodesHistory.pop();
};

QRStoryLineRollbacker._isCondRollbackable = function(cond, hist) {
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

QRStoryLineRollbacker._isNodeRollbackable = function(node, hist) {
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
