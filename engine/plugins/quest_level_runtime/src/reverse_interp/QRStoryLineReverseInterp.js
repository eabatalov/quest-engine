function QRStoryLineReverseInterp(storyLineInterp) {
    this.storyLineInterp = storyLineInterp;
    this.seqRevIsInProgress = false;
    this.history = [/*QRNodeSequence*/];

    storyLineInterp.events.nodeEnter.subscribe(this, this.onStoryLineNodeEnter);
    storyLineInterp.events.condEnter.subscribe(this, this.onStoryLineCondEnter);
    if (QRStoryLineReverseInterp._nodeIsReversible(storyLineInterp.getCurrentNode(),
        this.history)) {
        this._pushNodeToHist(storyLineInterp.getCurrentNode());
    }
}

QRStoryLineReverseInterp.prototype.getStoryLineNodeId = function() {
    return this.storyLineInterp.getStorylineNode().getId();
};

/*
 * True until the last reverse node was executed
 */
QRStoryLineReverseInterp.prototype.getIsInProgress = function() {
    return this.seqRevIsInProgress;
};

QRStoryLineReverseInterp.prototype.isNodeCanReverse = function(node) {
    return !this.getIsInProgress() &&
        this._curSeqToReverse() &&
        this.history.length > 1 &&
        this._curSeqToReverse().last() === node;
};

QRStoryLineReverseInterp.prototype.step = function() {
    var revNode = null;
    if (!this._curSeqToReverse().last()) {
        //finally move to prev seq
        this.history.pop();
        this.seqRevIsInProgress = false;
        revNode = this._curSeqToReverse().last();
    } else {
        //reverse current seq
        revNode = this._curSeqToReverse().pop();
        this.seqRevIsInProgress = true;
    }
    this.storyLineInterp.setCurrentNode(revNode);
    return revNode;
};

QRStoryLineReverseInterp.prototype.startReverse = function() {
    assert(!this.seqRevIsInProgress);
    this.seqRevIsInProgress = this._curSeqToReverse() ? true : false;
};

QRStoryLineReverseInterp.prototype._curSeqToReverse = function() {
    if (!this.history.length)
        return null;
    return this.history[this.history.length - 1];
};

QRStoryLineReverseInterp.prototype._pushNodeToHist = function(node) {
    if (!this._curSeqToReverse())
        this.history.push(new QRNodeSequence());

    this._curSeqToReverse().push(node);
};

QRStoryLineReverseInterp.prototype.onStoryLineNodeEnter = function(node) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're reversing back!");

    if (QRStoryLineReverseInterp._nodeIsReversible(node, this.history)) {
        if (QRStoryLineReverseInterp._nodeIsReverseUnitSeparator(node, this.history))
            this.history.push(new QRNodeSequence());
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

QRStoryLineReverseInterp.prototype.onStoryLineCondEnter = function(cond) {
    assert(!this.getIsInProgress(),
        "We can't perform normal script excecution when we're reversing back!");

    if (!QRStoryLineReverseInterp._condIsReversible(cond, this.history))
        this.history = this.history.length > 0 ? [] : this.history;
    else if (QRStoryLineReverseInterp._condIsReverseUnitSeparator(cond, this.history))
        this.history.push(new QRNodeSequence());
};
//======================== REVERSE RULES/LIMITATIONS ==============================
QRStoryLineReverseInterp._condIsReversible = function(cond, hist) {
    switch(cond.getType()) {
        /*
         * CUSTOM_EVENT has special compleceted triggering in UI.
         * CUSTOM_EVENT reversing is too complicated to perform.
         */
        case _QUEST_CONDS.CUSTOM_EVENT:
            return false;
        default:
            return true;
    }
};

QRStoryLineReverseInterp._condIsReverseUnitSeparator = function(cond, hist) {
    switch(cond.getType()) {
        case _QUEST_CONDS.NEXT:
            return true;
        default:
            return false;
    }
};

QRStoryLineReverseInterp._nodeIsReversible = function(node, hist) {
    switch(node.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            /* 
             * Function call nodes that can't be rollbacked
             * should have no 'rollbackName' property to indicate that.
             */
            return node.getProp("rollbackName") ? true : false;
        case _QUEST_NODES.QUIZ:
            return false;
        default:
            return true;
    }
};

QRStoryLineReverseInterp._nodeIsReverseUnitSeparator = function(node, hist) {
    return false;
};
