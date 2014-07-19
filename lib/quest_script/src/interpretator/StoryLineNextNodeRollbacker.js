function StoryLineNextNodeRollbacker(storyLineInterp) {
    this.isRollbacking = false;
    this.node = null;

    storyLineInterp.events.nodeEnter.subscribe(this, this.onStoryLineNodeEnter);
    storyLineInterp.events.condEnter.subscribe(this, this.onStoryLineCondEnter);
}

StoryLineNextNodeRollbacker.prototype.getIsInProgress = function() {
    return this.isRollbacking;
};

StoryLineNextNodeRollbacker.prototype.getIsRollbackAvail = function() {
    return false;
};

StoryLineNextNodeRollbacker.prototype.step = function() {

};

StoryLineNextNodeRollbacker.prototype.getCurNode = function() {
    return null;
};

StoryLineNextNodeRollbacker.prototype.startNextRollbackFrom = function(startNode) {

};

StoryLineNextNodeRollbacker.prototype.onStoryLineNodeEnter = function(node) {
    this.node = node;
};

StoryLineNextNodeRollbacker.prototype.onStoryLineCondEnter = function(cond) {

};
