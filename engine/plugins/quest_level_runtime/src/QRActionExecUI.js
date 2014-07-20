function QRActionExecUI(npcUID) {
    this.npcUID = npcUID;
}

QRActionExecUI.prototype.exec = function(qrAction, uiStageActionOut) {
    this.setNodeSpecificUIStageActionOutFields(qrAction.getNode(), uiStageActionOut);
    return true;
};

QRActionExecUI.prototype.setNodeSpecificUIStageActionOutFields =
function(questNode, action) {
    var setActorInfo = false;
	switch(questNode.getType()) {
		case _QUEST_NODES.NONE:
		case _QUEST_NODES.STORYLINE:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
		break;
		case _QUEST_NODES.PHRASE:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE);
			action.setText(questNode.getProp("text"));
			action.setPhraseType(questNode.getProp("phraseType"));
			setActorInfo = true;
		break;
		case _QUEST_NODES.QUIZ:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ);
			action.setText(questNode.getProp("text"));
			action.setPhraseType(questNode.getProp("phraseType"));
            action.setAnswer1Text(questNode.getProp("ans1"));
            action.setAnswer2Text(questNode.getProp("ans2"));
            action.setAnswer3Text(questNode.getProp("ans3"));
            action.setAnswer4Text(questNode.getProp("ans4"));
			setActorInfo = true;
		break;
		case _QUEST_NODES.ANIM:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.ANIMATION);
			action.setAnimationName(questNode.getProp("name"));
			setActorInfo = true;
		break;
		case _QUEST_NODES.WAIT:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.DELAY);
			action.setDelaySec(questNode.getProp("secs"));
		break;
		case _QUEST_NODES.STAGE_CLEAR:
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
		break;
		case _QUEST_NODES.FUNC_CALL:
            if (questNode.getProp('source') === SEFuncCallNode.sources.c2) {
			    action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.FUNC_CALL);
                var funcName = questNode.getProp("name");
			    action.setFuncName(funcName);
            } else {
                action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
            }
		break;
        case _QUEST_NODES.NOTIFICATION:
            action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NOTIFICATION);
            action.setText(questNode.getProp("text"));
        break;
        case _QUEST_NODES.PLAYER_MOVEMENT:
            action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PLAYER_MOVEMENT);
            action.setEnabled(questNode.getProp("enabled") === true ? 1 : 0);
        break;
		default:
			console.error("Error. Invalid quest node type: " +
                questNode.getType().toString());
			action.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
	}

	if (setActorInfo) {
		action.setActorType(
            questNode.getProp("id") === _QUEST_PLAYER_ID ? "PLAYER" : "NPC"
        );
		action.setNPCActorUID(
            questNode.getProp("id") !== _QUEST_PLAYER_ID ?
			    this.npcUID(action.getStageName(), questNode.getProp("id"))
                : null
        );
	}
};

