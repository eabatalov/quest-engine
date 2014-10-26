function QRScriptInterpretator(questScriptInterpretator) {
    this.interp = questScriptInterpretator;
    this.nextCondSearch = new NextCondSearch();
}

QRScriptInterpretator.prototype.step = function(questEvent) {
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
    //XXX setCanReverse is set by quest level runtime after call to step
    qrActionsList.push(action);

    if (!this.interp.isSeqInProgress(questEvent)) {
        var qrActionFinishedSeq =
            new QRAction(_QR_ACTION_TYPES.CMD_SEQUENCE_FINISHED);
        qrActionFinishedSeq.setStageName(questEvent.getStageName());
        qrActionsList.push(qrActionFinishedSeq);
    }
    
    return qrActionsList;
};
