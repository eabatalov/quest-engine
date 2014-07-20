function QRAction(node) {
    this.node = node;
    this.hasNext = false;
    this.canRollback = false;
    this.continue = false;
    this.isRollback = false;
}

QRAction.prototype.getNode = function() {
    return this.node;
};

QRAction.prototype.setHasNext = function(hasNext) {
    this.hasNext = hasNext;
};

QRAction.prototype.getHasNext = function() {
    return this.hasNext;
};

QRAction.prototype.setCanRollback = function(value) {
    this.canRollback = value;
};

QRAction.prototype.getCanRollback = function() {
    return this.canRollback;
};

QRAction.prototype.getContinue = function() {
    return this.continue;
};

QRAction.prototype.setContinue = function(isContinue) {
    this.continue = isContinue;
};

QRAction.prototype.setIsRollback = function(isRollback) {
    this.isRollback = isRollback;
};

QRAction.prototype.getIsRollback = function() {
    return this.isRollback;
};
