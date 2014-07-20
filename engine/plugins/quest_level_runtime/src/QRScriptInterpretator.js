function QRScriptInterpretator(questScriptInterpretator) {
    this.interp = questScriptInterpretator;
    this.nextCondSearch = new NextCondSearch();
}

QRScriptInterpretator.prototype.step = function(questEvent) {
    var nextNode = this.interp.step(questEvent);
    var action = new QRAction();
    action.initFromNode(nextNode);
    action.setHasNext(this.nextCondSearch.get(nextNode) !== null);
    action.setContinue(nextNode.getContinue());
    //setCanRollback is set by quest level runtime
    return action;
};
