function QRScriptReverseInterp(scriptInterp) {
    this.stageRevInterps = {};
    this.nextCondSearch = new NextCondSearch();

    var thiz = this;
    scriptInterp.forEachStageInterp(function(stageInterp) {
        thiz.stageRevInterps[stageInterp.getStageName()] =
            new QRStageReverseInterp(stageInterp);

        stageInterp.forEachStorylineInterp(function(storylineInterp) {
            thiz.stageRevInterps[stageInterp.getStageName()].
                addStorylineInterp(storylineInterp);
        });
    });
}

QRScriptReverseInterp.prototype.isMyEvent = function(questEvent) {
    return this._eventRevInterp(questEvent).getIsInProgress() ||
        questEvent.getType() === _QUEST_EVENTS.BACK;
};

QRScriptReverseInterp.prototype.isNodeCanReverse = function(node, questEvent) {
    var storyLineRevInterp = this._eventRevInterp(questEvent);
    return storyLineRevInterp.isNodeCanReverse(node);
};

QRScriptReverseInterp.prototype.step = function(questEvent) {
    var eventRevInterp = this._eventRevInterp(questEvent);
    assert(eventRevInterp);
    if (questEvent.getType() === _QUEST_EVENTS.BACK) {
        this._startNewReverse(eventRevInterp);
    }

    var nextNode = eventRevInterp.step();
    return this.makeAction(nextNode, eventRevInterp);
};

QRScriptReverseInterp.prototype._startNewReverse = function(storyLineRevInterp) {
    storyLineRevInterp.startReverse();
};

QRScriptReverseInterp.prototype._eventRevInterp = function(questEvent) {
    var stageRevInterp = this.stageRevInterps[questEvent.getStageName()];
    assert(stageRevInterp);
    var storyLineRevInterp = stageRevInterp.eventStoryLineRevInterp(questEvent);
    return storyLineRevInterp;
};

QRScriptReverseInterp.prototype.makeAction = function(node, nodeStoryLineRevInterp) {
    var action = null;

    switch(node.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            if (node.getProp('source') === SEFuncCallNode.sources.c2) {
                action = new QRAction(_QR_ACTION_TYPES.FUNC_CALL);
			    action.name = node.getProp("rollbackName");
            } else {
                action = new QRAction(_QR_ACTION_TYPES.NONE);
            }
        break;
        case _QUEST_NODES.PLAYER_MOVEMENT:
            action = new QRAction(_QR_ACTION_TYPES.PLAYER_MOVEMENT);
            action.enabled = !node.getProp("enabled");
        break;
        case _QUEST_NODES.PHRASE:
            action = new QRAction(_QR_ACTION_TYPES.PHRASE);
            action.initFromNode(node);
        break;
        case _QUEST_NODES.QUIZ:
            action = new QRAction(_QR_ACTION_TYPES.QUIZ);
            action.initFromNode(node);
        break;
        case _QUEST_NODES.NOTIFICATION:
            action = new QRAction(_QR_ACTION_TYPES.NOTIFICATION);
            action.initFromNode(node);
        break;
        default:
            action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
    };

    var actCont = _QR_ACTION_CONTINUATION_TYPES.NONE;
    if (nodeStoryLineRevInterp.getIsInProgress())
        actCont = _QR_ACTION_CONTINUATION_TYPES.CONTINUE_UI_CLEAR;
    else if (node.getContinue())
        actCont = _QR_ACTION_CONTINUATION_TYPES.CONTINUE;

    action.setHasNext(this.nextCondSearch.get(node) !== null);
    action.setContinuation(actCont);
    action.setCanReverse(nodeStoryLineRevInterp.isNodeCanReverse(node));
    action.setIsReverse(true);
    return action;
};
