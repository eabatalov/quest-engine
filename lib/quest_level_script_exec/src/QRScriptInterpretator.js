function QRScriptInterpretator(questScriptInterpretator) {
    this.interp = questScriptInterpretator;
    this.nextCondSearch = new NextCondSearch();
}

QRScriptInterpretator.prototype.step = function(questEvent, isActionCanReverseFunc) {
    var qrActionsList = [];
    var addStartSeq = !this.interp.isSeqInProgress(questEvent);

    var stepResult = this.interp.step(questEvent);
    var nextNode = stepResult.getNode();
    var usedCond = stepResult.getCond();

    var action = new QRAction();
    action.initFromNode(nextNode);
    action.initFromCond(usedCond);
    action.setStageName(questEvent.getStageName());
    action.setHasNext(this.nextCondSearch.get(nextNode) !== null);
    action.setContinuation(
        nextNode.getContinue() ? _QR_ACTION_CONTINUATION_TYPES.CONTINUE
        : _QR_ACTION_CONTINUATION_TYPES.NONE
    );
    action.setCanReverse(isActionCanReverseFunc(action));
    qrActionsList.push(action);

    if (stepResult.getPrevNode().getId() === nextNode.getId()) {
        return [QRAction.genNoAction(action)];
    }

    if (addStartSeq) {
        qrActionsList.unshift(QRAction.genCmdSeqStart(action));
    }

    if (!this.interp.isSeqInProgress(questEvent)) {
        qrActionsList.push(QRAction.genCmdSeqFinish(action));
    }
    
    return qrActionsList;
};
