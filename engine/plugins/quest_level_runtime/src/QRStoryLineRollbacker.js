/*
 * Single rollback unit.
 * All elements or none should be rollbacked.
 */
function QRStoryLineRollbackSequence() {
    this.nodes = [];
}

QRStoryLineRollbackSequence.prototype.last = function() {
    if (this.nodes.length)
        return this.nodes[this.nodes.length - 1];
    else return null;
};

QRStoryLineRollbackSequence.prototype.first = function() {
    if (this.nodes.length)
        return this.nodes[0];
    else return null;
};

QRStoryLineRollbackSequence.prototype.push = function(node) {
    this.nodes.push(node);
};

QRStoryLineRollbackSequence.prototype.pop = function() {
    return this.nodes.pop();
};

QRStoryLineRollbackSequence.prototype.count = function() {
    return this.nodes.length;
};

//=======================================================
// QRStoryLineRollbacker
function QRStoryLineRollbacker(storyLineInterp) {
    this.storyLineInterp = storyLineInterp;
    this.isRollbacking = false;
    this.history = [/*QRStoryLineRollbackSequence*/];

    storyLineInterp.events.nodeEnter.subscribe(this, this.onStoryLineNodeEnter);
    storyLineInterp.events.condEnter.subscribe(this, this.onStoryLineCondEnter);
    if (QRStoryLineRollbacker._isNodeRollbackable(storyLineInterp.getCurrentNode(),
        this.history)) {
        this._pushNodeToHist(storyLineInterp.getCurrentNode());
    }
}

QRStoryLineRollbacker.prototype.getStoryLineNodeId = function() {
    return this.storyLineInterp.getStorylineNode().getId();
};

/*
 * True until the last rollback node was executed
 */
QRStoryLineRollbacker.prototype.getIsInProgress = function() {
    return this.isRollbacking;
};

QRStoryLineRollbacker.prototype.isNodeCanRollback = function(node) {
    return !this.getIsInProgress() &&
        this._curSeqToRollback() &&
        this.history.length > 1 &&
        this._curSeqToRollback().last() === node;
};

QRStoryLineRollbacker.prototype.step = function() {
    var rollbackNode = null;
    if (!this._curSeqToRollback().last()) {
        //finally move to prev seq
        this.history.pop();
        this.isRollbacking = false;
        rollbackNode = this._curSeqToRollback().last();
    } else {
        //rollback current seq
        rollbackNode = this._curSeqToRollback().pop();
        this.isRollbacking = true;
    }
    this.storyLineInterp.setCurrentNode(rollbackNode);
    return rollbackNode;
};

QRStoryLineRollbacker.prototype.startRollback = function() {
    assert(!this.isRollbacking);
    this.isRollbacking = this._curSeqToRollback() ? true : false;
};

QRStoryLineRollbacker.prototype._curSeqToRollback = function() {
    if (!this.history.length)
        return null;
    return this.history[this.history.length - 1];
};

QRStoryLineRollbacker.prototype._pushNodeToHist = function(node) {
    if (!this._curSeqToRollback())
        this.history.push(new QRStoryLineRollbackSequence());

    this._curSeqToRollback().push(node);
};

QRStoryLineRollbacker.prototype.onStoryLineNodeEnter = function(node) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");

    if (QRStoryLineRollbacker._isNodeRollbackable(node, this.history)) {
        if (QRStoryLineRollbacker._isNodeRollbackSeparator(node, this.history))
            this.history.push(new QRStoryLineRollbackSequence());
        this._pushNodeToHist(node);
    } else {
        this.history = this.history.length > 0 ? [] : this.history;
    }
    //TODO remove
    /*jQuery.each(this.history, function(ix, seq) {
        console.log("Seq: ");
        jQuery.each(seq.nodes, function(ix, node) {
            console.log(JSON.stringify(node.getId()), " ");
        });
    });*/
};

QRStoryLineRollbacker.prototype.onStoryLineCondEnter = function(cond) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're rolling back!");

    if (!QRStoryLineRollbacker._isCondRollbackable(cond, this.history))
        this.history = this.history.length > 0 ? [] : this.history;
    else if (QRStoryLineRollbacker._isCondRollbackSeparator(cond, this.history))
        this.history.push(new QRStoryLineRollbackSequence());
};
//======================== ROLLBACKING RULES ==============================
QRStoryLineRollbacker._isCondRollbackable = function(cond, hist) {
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

QRStoryLineRollbacker._isCondRollbackSeparator = function(cond, hist) {
    switch(cond.getType()) {
        case _QUEST_CONDS.NEXT:
            return true;
        default:
            return false;
    }
};

QRStoryLineRollbacker._isNodeRollbackable = function(node, hist) {
    switch(node.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            /* 
             * Function call nodes that can't be rollbacked should
             * should have no 'rollbackName' property to indicate that.
             */
            return node.getProp("rollbackName") ? true : false;
        case _QUEST_NODES.QUIZ:
            return false;
        default:
            return true;
    }
};

QRStoryLineRollbacker._isNodeRollbackSeparator = function(node, hist) {
    return false;
};
