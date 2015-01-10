/*
 * Puts quest events to QuestLevelScriptExecutor queue
 * once its current UI action sequence is finished.
 */
function UIActionSeqStartQuestEventsQueue(levelExecutor) {
    this._levelExecutor = levelExecutor;
    this._qeQueue = new CommandQueue();

    this._levelExecutor.events.idle.
        subscribe(this, this._onLEIdle.bind(this));
}

UIActionSeqStartQuestEventsQueue.prototype.enqueueQuestEvent =
    function(questEvent) {
    if (this._isLevelExecutorReady()) {
        this._levelExecutor.questEventExec(questEvent);
    } else {
        this._qeQueue.enqueueCommand(questEvent);
    }
};

UIActionSeqStartQuestEventsQueue.prototype._onLEIdle =
    function() {
    if (this._isLevelExecutorReady() &&
        !this._qeQueue.isEmpty()) {
        var questEvent = this._qeQueue.getPendingCommand();
        this._qeQueue.completePendingCommand();
        this._levelExecutor.questEventExec(questEvent);
    }
};

UIActionSeqStartQuestEventsQueue.prototype._isLevelExecutorReady =
    function() {
    return this._levelExecutor.isIdle();
};
