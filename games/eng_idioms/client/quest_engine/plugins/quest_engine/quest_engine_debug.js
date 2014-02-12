_QUEST_ENGINE_DEBUG = true;
_QUEST_ENGINE_VALIDATE = true;

//Diagnostics, debugging, validation
function showValidationError(errorText) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	alert("Quest logic error has occured:\n"
		+ errorText);
}

function validateCurrentPlayerAction(stageActCont) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	var playerAction = stageActCont.curStageAction().lastPlayerAction;
	if (!(playerAction in _PLAYER_ACTION_DEFINES)) {
		showValidationError("Player action " + playerAction.toString() + "is not a valid action\n"
			+ "Actions valid: \n"
			+ _PLAYER_ACTION_DEFINES.toString());
	}
}

function dumpCurrentPlayerAction(stageActCont) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==PLAYER ACTION==\n" +
		"Current stage: " + stageActCont.curStageName.toString() + "\n"
		+ "Last player action: " + stageActCont.curStageAction().lastPlayerAction.toString() + "\n"
		+ "Last action target id" + stageActCont.curStageAction().lastActionTargetId.toString() + "\n"
	);
}

function validateCurrentUIAction(stageActCont) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	var uiAction = stageActCont.curStageAction().action;
	var uiActor = stageActCont.curStageAction().actor;
	if (!(uiAction in _UI_ACTION_DEFINES)) {
		showValidationError("UI action " + uiAction.toString() + "is not a valid UI action\n"
			+ "UI actions valid: \n"
			+ _UI_ACTION_DEFINES.toString());
	}
	if (!(uiActor in _UI_ACTOR_DEFINES.contains)) {
		showValidationError("UI actor " + uiActor.toString() + "is not a valid UI actor\n"
			+ "UI actors valid: \n"
			+ _UI_ACTOR_DEFINES.toString());
	}
}

function dumpCurrentUIAction(stageActCont) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==UI ACTION==\n"
		+ "actor: " + stageActCont.curStageAction().actor.toString() + "\n"
		+ "action: " + stageActCont.curStageAction().action.toString() + "\n"
		+ "npcActorUID: " + stageActCont.curStageAction().npcActorUID.toString() + "\n"
		+ "animationName: " + stageActCont.curStageAction().animationName.toString() + "\n"
		+ "text: " + stageActCont.curStageAction().text.toString() + "\n"
		+ "answer1Text: " + stageActCont.curStageAction().answer1Text.toString() + "\n"
		+ "answer2Text: " + stageActCont.curStageAction().answer2Text.toString() + "\n"
		+ "answer3Text: " + stageActCont.curStageAction().answer3Text.toString() + "\n"
		+ "answer3Text: " + stageActCont.curStageAction().answer3Text.toString() + "\n"
		+ "answer4Text: " + stageActCont.curStageAction().answer4Text.toString() + "\n"
		+ "rightAnswerIx: " + stageActCont.curStageAction().rightAnswerIx.toString() + "\n"
		+ "delay: " + stageActCont.curStageAction().delay.toString() + "\n"
		+ "continue: " + stageActCont.curStageAction().continue.toString() + "\n"
	);
}

function dumpQuestEvent(questEvent) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==QUEST EVENT==\n"
		+ JSON.stringify(questEvent)
	);
}

function dumpQuestNode(questNode) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==QUEST EVENT==\n"
		+ "type: " + questNode.type.toString() + "\n"
		+ "conds" + questNode.conds.toString() + "\n"
		+ "priv" + questNode.priv.toString() + "\n"
		+ "continue" + questNode.continue.toString() + "\n"
	);
}