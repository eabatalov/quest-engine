/*
 * Represents result of a single interpretator step.
 * @node: the node interpretator has stopped at
 * @cond: condition which was used to get to the @node
 * @prevNode: the node interpretator has started from
 */
function InterpretatorStepResult(node, cond, prevNode) {
    this._node = node;
    this._cond = cond;
    this._prevNode = prevNode;
}

InterpretatorStepResult.prototype.getNode = function() {
    return this._node;
};

InterpretatorStepResult.prototype.getCond = function() {
    return this._cond;
};

InterpretatorStepResult.prototype.getPrevNode = function() {
    return this._prevNode;
};
