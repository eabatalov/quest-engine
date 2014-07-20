function QRScriptRollbacker(scriptInterp) {

}

QRScriptRollbacker.prototype.isMyEvent = function(questEvent) {
    return false;
};

QRScriptRollbacker.prototype.isNodeCanRollback = function(node, questEvent) {
    return false;
};

QRScriptRollbacker.prototype.step = function(questEvent) {
    return null;
}
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
