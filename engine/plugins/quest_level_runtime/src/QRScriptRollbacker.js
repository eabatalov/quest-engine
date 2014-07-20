//================================================
//QRStageRollbacker
function QRStageRollbacker(stageInterp) {
    this.stageInterp = stageInterp;
    this.storyLineRollbackers = [];
};

QRStageRollbacker.prototype.addStorylineInterp = function(storyLineInterp) {
    this.storyLineRollbackers.push(new QRStoryLineRollbacker(storyLineInterp));
};

QRStageRollbacker.prototype.eventStoryLineRollbacker = function(questEvent) {
    var storyLineRollbacker = null;
    var storyLineInterp = this.stageInterp.eventStoryLineInterp(questEvent);
    for (var i = 0; i < this.storyLineRollbackers.length; ++i) {
        var stlnRollbacker = this.storyLineRollbackers[i];
        if (stlnRollbacker.getStoryLineNodeId() === storyLineInterp.getStorylineNode().getId()) {
            storyLineRollbacker = stlnRollbacker;
            break;
        }
    }
    return storyLineRollbacker;
};
//=================================================
//QRScriptRollbacker
function QRScriptRollbacker(scriptInterp) {
    this.stageRollbackers = {};
    this.nextCondSearch = new NextCondSearch();

    var thiz = this;
    scriptInterp.forEachStageInterp(function(stageInterp) {
        thiz.stageRollbackers[stageInterp.getStageName()] =
            new QRStageRollbacker(stageInterp);

        stageInterp.forEachStorylineInterp(function(storylineInterp) {
            thiz.stageRollbackers[stageInterp.getStageName()].
                addStorylineInterp(storylineInterp);
        });
    });
}

QRScriptRollbacker.prototype.isMyEvent = function(questEvent) {
    return this._eventRollbacker(questEvent).getIsInProgress() ||
        questEvent.getType() === _QUEST_EVENTS.BACK;
};

QRScriptRollbacker.prototype.isNodeCanRollback = function(node, questEvent) {
    var storyLineRollbacker = this._eventRollbacker(questEvent);
    return storyLineRollbacker.isNodeCanRollback(node);
};

QRScriptRollbacker.prototype.step = function(questEvent) {
    var eventRollbacker = this._eventRollbacker(questEvent);
    assert(eventRollbacker);
    if (questEvent.getType() === _QUEST_EVENTS.BACK) {
        assert(!this.isRollbacking);
        this._startNewRollback(eventRollbacker);
    }

    var nextNode = eventRollbacker.step();
    return this.makeAction(nextNode, eventRollbacker);
};

QRScriptRollbacker.prototype._startNewRollback = function(storylineRollbacker) {
    storylineRollbacker.startRollback();
};

QRScriptRollbacker.prototype._eventRollbacker = function(questEvent) {
    var stageRollbacker = this.stageRollbackers[questEvent.getStageName()];
    assert(stageRollbacker);
    var storyLineRollbacker = stageRollbacker.eventStoryLineRollbacker(questEvent);
    return storyLineRollbacker;
};

QRScriptRollbacker.prototype.makeAction = function(node, rollbacker) {
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

    action.setHasNext(this.nextCondSearch.get(node) !== null);
    action.setContinue(node.getContinue() || rollbacker.getIsInProgress());
    action.setCanRollback(rollbacker.isNodeCanRollback(node));
    return action;
};
