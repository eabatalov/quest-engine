function QuestLevelRuntime(questLevel) {
    var scriptInterp = new ScriptInterpretator(questLevel.getScript());
    this.qrScriptInterp = new QRScriptInterpretator(scriptInterp);
    this.qrScriptRevInterp = new QRScriptReverseInterp(scriptInterp);
    this.qrActionExecJS = new QRActionExecJS();
    this.qrActionExecUI = new QRActionExecUI();
}

/*
 * returns QRAction as a response to @questEvent
 */
QuestLevelRuntime.prototype.questEventExec = function(questEvent) {
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

    return nextQRAction;
};
