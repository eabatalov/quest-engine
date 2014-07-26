function QRScriptInterpretator(questScriptInterpretator) {
    this.interp = questScriptInterpretator;
    this.nextCondSearch = new NextCondSearch();
}

QRScriptInterpretator.prototype.step = function(questEvent) {
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
    return action;
};
