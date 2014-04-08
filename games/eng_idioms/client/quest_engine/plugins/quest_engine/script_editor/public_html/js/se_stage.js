function SEStage(name) {
    this.node = new SEStageNode();
    this.node.props.name = name;
    this.node.setLabel(name);

    this.utils = {
        storylineSearch : new SEStorylineSearch(this),
        stageSearch : new SEStageSearch(this)
    };
    /*
     * Setup initial stage objects 
     */
    var cond = new SECond(_QUEST_CONDS.NONE);
    var storylineNode = new SEStorylineNode();
    this.node.addOutCond(cond);
    storylineNode.addInCond(cond);
}

SEStage.prototype.getName = function() {
    return this.node.props.name;
};

SEStage.prototype.getId = function() {
    return this.node.getId();
};

SEStage.prototype.getNode = function() {
    return this.node;
};
