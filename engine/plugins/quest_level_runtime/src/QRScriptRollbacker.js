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

function QRScriptRollbacker(scriptInterp) {
    this.isRollBackPending = false;
    this.stageRollbackers = {};

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
    return false;
    return this.isRollBackPending ||
        questEvent.getType() === _QUEST_EVENTS.BACK;
};

QRScriptRollbacker.prototype.isNodeCanRollback = function(node, questEvent) {
    return false;
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

    var action = new QRAction(nextNode);
    action.setHasNext(this.nextCondSearch.get(nextNode) !== null);
    action.setContinue(nextNode.getContinue());
    //setCanRollback is set by quest level runtime
    return action;
};

QRScriptRollbacker.prototype._startNewRollback = function(storylineRollbacker) {
    storylineRollbacker.startRollback();
};

QRScriptRollbacker.prototype._eventRollbacker = function(questEvent) {
    var stageRollbacker = this.stageRollbackers[questEvent.getName()];
    assert(stageRollbacker);
    var storyLineRollbacker = stageRollbacker.eventStoryLineRollbacker(questEvent);
    return storyLineRollbacker;
};
/*
QuestLevelRuntime.prototype.questNodeExecInfoToUIStageActionOut =
function(questNodeExecInfo, action) {
    action.setHasNext(questNodeExecInfo.getHasNext() ? 1 : 0);
    action.setHasBack(questNodeExecInfo.getCanRollback() ? 1 : 0);
    action.setIsContinue(questNodeExecInfo.getContinue() ? 1 : 0);

    if (questNodeExecInfo.getIsNodeToRollback())
        return this.questNodeExecInfoRollbackToUIStageActionOut(questNodeExecInfo, action);
    else
        return this.questNodeExecInfoDirectToUIStageActionOut(questNodeExecInfo, action);
};
//XXX
QuestLevelRuntime.prototype.questNodeExecInfoRollbackToUIStageActionOut =
    function(questNodeExecInfo, action) {
    assert(questNodeExecInfo.getIsNodeToRollback());

    var questNode = questNodeExecInfo.getNode();
	switch(questNode.getType()) {
        case _QUEST_NODES.FUNC_CALL:
            if (questNode.getProp('source') === SEFuncCallNode.sources.c2) {
			    action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.FUNC_CALL);
                var funcName = questNode.getProp("rollbackName");
			    action.setFuncName(funcName);
            } else {
                action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
            }
        break;
        case _QUEST_NODES.PLAYER_MOVEMENT:
            action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PLAYER_MOVEMENT);
            //invert
            action.setEnabled(questNode.getProp("enabled") ? 0 : 1);
        break;
        default:
            action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
            //There is also no sense in rollbacking ANIM node
    };
};
*/
