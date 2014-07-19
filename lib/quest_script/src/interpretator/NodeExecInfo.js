function NodeExecInfo(node) {
    this.node = node;
    this.hasNext = false;
    this.hasBack = false;
}

NodeExecInfo.prototype.getNode = function() {
    return this.node;
};

NodeExecInfo.prototype.setHasNext = function(hasNext) {
    this.hasNext = hasNext;
};

NodeExecInfo.prototype.getHasNext = function() {
    return this.hasNext;
};

NodeExecInfo.prototype.setHasBack = function(hasBack) {
    this.hasBack = hasBack;
};

NodeExecInfo.prototype.getHasBack = function() {
    return this.hasBack;
};
