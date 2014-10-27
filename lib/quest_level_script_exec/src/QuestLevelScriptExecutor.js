/*
 * Manages queues of quest events (in) and qractions (out).
 * Arbitrates quest events between their executors.
 */
function QuestLevelScriptExecutor(questLevel) {
    var scriptInterp = new ScriptInterpretator(questLevel.getScript());
    this.qrScriptInterp = new QRScriptInterpretator(scriptInterp);
    this.qrScriptRevInterp = new QRScriptReverseInterp(scriptInterp);
    this.qrActionExecJS = new QRActionExecJS();
    this.qrActionExecUI = new QRActionExecUI();

    this._questEventsQueue = new CommandQueue();
    this._questEventsQueue.onCommandPending(this, this._onQuestEventPending);
    this._qrActionsQueue = new CommandQueue();
    this._qrActionsQueue.onCommandPending(this, this._onQRActionPending);

    this._allowQuestEventsAutoGeneration = true;

    this.events = {
        //This executor has started prcessesing QuestEvent
        questEventExec : new SEEvent(/*QuestEvent*/),
        //QRAction execution is pending
        qrActionPending : new SEEvent(/*QRAction*/)
    };
}

QuestLevelScriptExecutor.prototype.questEventExec = function(questEvent) {
    this._questEventsQueue.enqueueCommand(questEvent);
};

QuestLevelScriptExecutor.prototype.currentQRActionProcCompleted = function() {
    if (this._allowQuestEventsAutoGeneration) {
        var qrAction = this._qrActionsQueue.getPendingCommand();
        if (qrAction.getContinuation() == _QR_ACTION_CONTINUATION_TYPES.CONTINUE) {
            var contQE = new QuestEvent(qrAction.getStageName(), _QUEST_EVENTS.CONTINUE);
            this.questEventExec(contQE);
        }
    }
    this._qrActionsQueue.completePendingCommand();
};

QuestLevelScriptExecutor.prototype.stopEventsAutoGeneration = function() {
    this._allowQuestEventsAutoGeneration = false;
};

QuestLevelScriptExecutor.prototype._onQuestEventPending = function(questEvent) {
    thiz = this;
    this.events.questEventExec.publish(questEvent);
    var nextQRActions = null;

    if (this.qrScriptRevInterp.isMyEvent(questEvent)) {
        nextQRActions = this.qrScriptRevInterp.step(questEvent);
    } else {
        nextQRActions = this.qrScriptInterp.step(questEvent,
            function(action) {
                return action.getNode() ?
                    thiz.qrScriptRevInterp.isNodeCanReverse(
                        action.getNode(), questEvent
                    ) : false;
            }
        );
    }

    jQuery.each(nextQRActions, function(ix, nextQRAction) {
        thiz.qrActionExecJS.exec(nextQRAction)
        thiz.qrActionExecUI.exec(nextQRAction);
        thiz._qrActionsQueue.enqueueCommand(nextQRAction);
    });

    this._questEventsQueue.completePendingCommand();
};

QuestLevelScriptExecutor.prototype._onQRActionPending = function(qrAction) {
    //Non UI processing first
    switch (qrAction.getType()) {
        case _QR_ACTION_TYPES.NONE:
            this.currentQRActionProcCompleted();
        return; //Empty QR action shouldn't propagate to UI
        case _QR_ACTION_TYPES.WAIT:
            setTimeout(this.currentQRActionProcCompleted.bind(this), qrAction.secs * 1000);
        return; //No need to handle in UI
    }

    this.events.qrActionPending.publish(qrAction);
};
