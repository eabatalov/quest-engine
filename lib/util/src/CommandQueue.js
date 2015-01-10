/*
 * Multyple command producers
 * Single commands consumer
 * command queue.
 */
function CommandQueue() {
    this._pendingCommands = [];
    this._commandPendingEvent = new SEEvent(/* Command object */);
    this._emptyEvent = new SEEvent();
}

CommandQueue.prototype.delete = function() {
    delete this._pendingCommands;
    this._commandPendingEvent.delete();
    delete this._commandPendingEvent;
};

//returns event handler object with delete method
CommandQueue.prototype.onCommandPending = function(thiz, callback) {
    return this._commandPendingEvent.subscribe(thiz, callback);
};

CommandQueue.prototype.onEmpty = function(thiz, callback) {
    return this._emptyEvent.subscribe(thiz, callback);
};

CommandQueue.prototype.getPendingCommand = function() {
    assert(this._pendingCommands.length > 0, "CommandQueue: command is pending");
    return this._pendingCommands[0];
};

CommandQueue.prototype.isEmpty = function() {
    return this._pendingCommands.length == 0;
};

CommandQueue.prototype.enqueueCommand = function(command) {
    this._pendingCommands.push(command);
    if (this._pendingCommands.length === 1) {
        this._commandPendingEvent.publish(this.getPendingCommand());
    }
};

CommandQueue.prototype.completePendingCommand = function() {
    this._pendingCommands.shift();
    if (this._pendingCommands.length > 0) {
        this._commandPendingEvent.publish(this.getPendingCommand());
    } else {
        this._emptyEvent.publish();
    }
};
