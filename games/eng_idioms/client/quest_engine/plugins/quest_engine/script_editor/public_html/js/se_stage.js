function SEStage(name) {
    this.node = new SEStageNode();
    this.node.props.name = name;
    this.node.setLabel(name);

    var cond = new SECond(_QUEST_CONDS.NONE);
    var storylineNode = new SEStorylineNode();
    this.node.addOutCond(cond);
    storylineNode.addInCond(cond);

    this.utils = {
        storylineSearch : new SEStorylineSearch(this),
        stageSearch : new SEStageSearch(this)
    };
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
