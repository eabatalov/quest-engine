function QRScriptInterpretator(questScriptInterpretator) {
    this.interp = questScriptInterpretator;
    this.nextCondSearch = new NextCondSearch();
}

QRScriptInterpretator.prototype.step = function(questEvent, isActionCanReverseFunc) {
    var qrActionsList = [];
    if (!this.interp.isSeqInProgress(questEvent)) {
        var qrActionStartSeq =
            new QRAction(_QR_ACTION_TYPES.CMD_SEQUENCE_STARTED);
        qrActionStartSeq.setStageName(questEvent.getStageName());
        qrActionsList.push(qrActionStartSeq);
    }

    var nextNode = this.interp.step(questEvent);
    var action = new QRAction();
    action.initFromNode(nextNode);
    action.setStageName(questEvent.getStageName());
    action.setHasNext(this.nextCondSearch.get(nextNode) !== null);
    action.setContinuation(
        nextNode.getContinue() ? _QR_ACTION_CONTINUATION_TYPES.CONTINUE
        : _QR_ACTION_CONTINUATION_TYPES.NONE
    );
    action.setCanReverse(isActionCanReverseFunc(action));
    qrActionsList.push(action);

    if (!this.interp.isSeqInProgress(questEvent)) {
        qrActionsList.push(QRAction.genCmdSeqFinish(action));
    }
    
    return qrActionsList;
};
