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
    var nextQRAction = this.makeAction(nextNode, eventRevInterp);
    nextQRAction.setStageName(questEvent.getStageName());
    return nextQRAction;
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

    if (nodeStoryLineRevInterp.getIsInProgress())
        action = this._reversedActionFromNode(node);
    else
        action = this._preservedActionFromNode(node);

    var actCont = _QR_ACTION_CONTINUATION_TYPES.NONE;
    if (nodeStoryLineRevInterp.getIsInProgress())
        actCont = _QR_ACTION_CONTINUATION_TYPES.CONTINUE_UI_CLEAR;
    else if (node.getContinue())
        actCont = _QR_ACTION_CONTINUATION_TYPES.CONTINUE;

    action.setHasNext(this.nextCondSearch.get(node) !== null);
    action.setContinuation(actCont);
    action.setCanReverse(nodeStoryLineRevInterp.isNodeCanReverse(node));
    return action;
};

//Node side effects should be reversed
QRScriptReverseInterp.prototype._reversedActionFromNode = function(node) {
    var action = null;

    switch(node.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            if (node.getProp('source') === SEFuncCallNode.sources.c2) {
                action = new QRAction(_QR_ACTION_TYPES.FUNC_CALL);
			    action.name = node.getProp("rollbackName");
                action.source = node.getProp('source');
            } else {
                //We don't rollback js functions
                action = new QRAction(_QR_ACTION_TYPES.NONE);
            }
        break;
        case _QUEST_NODES.PLAYER_MOVEMENT:
            action = new QRAction(_QR_ACTION_TYPES.PLAYER_MOVEMENT);
            action.enabled = !node.getProp("enabled");
        break;
        default:
            action = new QRAction(_QR_ACTION_TYPES.STAGE_CLEAR);
    };
    return action;
};

//Node side effects should be preserved
QRScriptReverseInterp.prototype._preservedActionFromNode = function(node) {
    var action = null;

    switch(node.getType()) {
        case _QUEST_NODES.PHRASE:
        case _QUEST_NODES.QUIZ:
        case _QUEST_NODES.NOTIFICATION:
        case _QUEST_NODES.ANIM:
        case _QUEST_NODES.WAIT:
        case _QUEST_NODES.STAGE_CLEAR:
            action = new QRAction();
            action.initFromNode(node);
        break;
        default:
            action = new QRAction(_QR_ACTION_TYPES.NONE);
    };
    return action;
};
