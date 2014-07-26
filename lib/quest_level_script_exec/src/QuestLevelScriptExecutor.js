function QuestLevelScriptExecutor(questLevel) {
    var scriptInterp = new ScriptInterpretator(questLevel.getScript());
    this.qrScriptInterp = new QRScriptInterpretator(scriptInterp);
    this.qrScriptRevInterp = new QRScriptReverseInterp(scriptInterp);
    this.qrActionExecJS = new QRActionExecJS();
    this.qrActionExecUI = new QRActionExecUI();

    this.events = {
        //This executor has started prcessesing QuestEvent
        questEventExec : new SEEvent(/*QuestEvent*/),
        //QRAction execution is pending
        qrActionPending : new SEEvent(/*QRAction*/)
    };
}

/*
 * returns QRAction as a response to @questEvent
 */
QuestLevelScriptExecutor.prototype.questEventExec = function(questEvent) {
    this.events.questEventExec.publish(questEvent);
    var nextQRAction = null;

    if (this.qrScriptRevInterp.isMyEvent(questEvent))
        nextQRAction = this.qrScriptRevInterp.step(questEvent);
    else {
        nextQRAction = this.qrScriptInterp.step(questEvent);
        nextQRAction.setCanReverse(this.qrScriptRevInterp.
            isNodeCanReverse(nextQRAction.getNode(), questEvent));
    }

    this.qrActionExecJS.exec(nextQRAction)
    this.qrActionExecUI.exec(nextQRAction);

    this.events.qrActionPending.publish(nextQRAction);
};
