/*
 * Represents result of a single interpretator step.
 * @node: the node interpretator has stopped at
 * @cond: condition which was used to get to the @node
 */
function InterpretatorStepResult(node, cond) {
    this._node = node;
    this._cond = cond;
}

InterpretatorStepResult.prototype.getNode = function() {
    return this._node;
};

InterpretatorStepResult.prototype.getCond = function() {
    return this._cond;
};
