_QUEST_ENGINE_DEBUG = true;
_QUEST_ENGINE_VALIDATE = true;

//Diagnostics, debugging, validation
function showValidationError(errorText) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	alert("Quest logic error has occured:\n"
		+ errorText);
}

function showValidationErrorIf(cond, errorText) {
	if (!_QUEST_ENGINE_VALIDATE || !cond)
		return;
	alert("Quest logic error has occured:\n"
		+ errorText);
}

function _str(obj) {
	return obj === null || obj === undefined ? "" : obj.toString();
}

function validatePlayerAction(stageActCont) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	var playerAction = stageActCont.curStageAction().lastPlayerAction;
	if (!(playerAction in _PLAYER_ACTIONS_SET)) {
		showValidationError("Player action " + playerAction.toString() + "is not a valid action\n"
			+ "Actions valid: \n"
			+ JSON.stringify(_PLAYER_ACTIONS_SET));
	}
}

function dumpPlayerAction(stageActCont) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==PLAYER ACTION==\n" +
		"Current stage: " + _str(stageActCont.curStageName) + "\n"
		+ "Last player action: " + _str(stageActCont.curStageAction().lastPlayerAction) + "\n"
		+ "Last action target id" + _str(stageActCont.curStageAction().lastActionTargetId) + "\n"
	);
}

function validateUIAction(stageActCont) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	var uiAction = stageActCont.curStageAction().action;
	var uiActor = stageActCont.curStageAction().actor;
	var uiPhraseType = stageActCont.curStageAction().phraseType;
	if (!(uiAction in _UI_ACTIONS_SET)) {
		showValidationError("UI action " + uiAction.toString() + "is not a valid UI action\n"
			+ "UI actions valid: \n"
			+ JSON.stringify(_UI_ACTIONS_SET));
	}
	if ((uiAction === _UI_ACTIONS.PHRASE || uiAction === _UI_ACTIONS.QUIZ) && !(uiActor in _UI_ACTORS_SET)) {
		showValidationError("UI actor " + uiActor.toString() + "is not a valid UI actor\n"
			+ "UI actors valid: \n"
			+ JSON.stringify(_UI_ACTORS_SET));
	}
	if ((uiAction === _UI_ACTIONS.PHRASE || uiAction === _UI_ACTIONS.QUIZ) && !(uiPhraseType in _UI_PHRASE_TYPES_SET)) {
		showValidationError("UI phrase type " + uiPhraseType.toString() + "is not a valid phrase type\n"
			+ "UI phrase types valid: \n"
			+ JSON.stringify(_UI_PHRASE_TYPES_SET));
	}
}

function dumpUIAction(stageActCont) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==UI ACTION==\n"
		+ "actor: " + _str(stageActCont.curStageAction().actor) + "\n"
		+ "action: " + _str(stageActCont.curStageAction().action) + "\n"
		+ "npcActorUID: " + _str(stageActCont.curStageAction().npcActorUID) + "\n"
		+ "animationName: " + _str(stageActCont.curStageAction().animationName) + "\n"
		+ "text: " + _str(stageActCont.curStageAction().text) + "\n"
		+ "answer1Text: " + _str(stageActCont.curStageAction().answer1Text) + "\n"
		+ "answer2Text: " + _str(stageActCont.curStageAction().answer2Text) + "\n"
		+ "answer3Text: " + _str(stageActCont.curStageAction().answer3Text) + "\n"
		+ "answer3Text: " + _str(stageActCont.curStageAction().answer3Text) + "\n"
		+ "answer4Text: " + _str(stageActCont.curStageAction().answer4Text) + "\n"
		+ "phraseType: " + _str(stageActCont.curStageAction().phraseType) + "\n"
		+ "delay: " + _str(stageActCont.curStageAction().delay) + "\n"
		+ "continue: " + _str(stageActCont.curStageAction().continue) + "\n"
	);
}

function dumpQuestEvent(questEvent) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==QUEST EVENT==\n"
		+ JSON.stringify(questEvent)
	);
}

function validateQuestEvent(questEvent) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;
	if (!(questEvent.type in _QUEST_EVENTS_SET)) {
		showValidationError("Quest event " + JSON.stringify(questEvent) + " is not a valid quest event\n"
			+ "Events valid: \n"
			+ JSON.stringify(_QUEST_EVENTS_SET));
	}
	if (questEvent.type === _QUEST_EVENTS.OBJECT_CLICKED && (typeof questEvent.priv.id === "undefined")) {
		showValidationError("Quest event " + JSON.stringify(questEvent) + "should have priv.id values set");
	}
}

function dumpQuestNode(questNode) {
	if (!_QUEST_ENGINE_DEBUG)
		return;
	console.log("==QUEST NODE==\n"
		+ "type: " + _str(questNode.type) + "\n"
		+ "conds" + _str(questNode.conds) + "\n"
		+ "priv" + _str(questNode.priv) + "\n"
		+ "continue" + _str(questNode.continue) + "\n"
	);
}
