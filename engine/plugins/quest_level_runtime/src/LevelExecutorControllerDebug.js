_QUEST_ENGINE_DEBUG = true;
_QUEST_ENGINE_VALIDATE = true;

//Diagnostics, debugging, validation
function showValidationError(errorText) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;

	console.error(
        "Quest validation error has occured:\n"
		+ errorText
    );
}

function showValidationErrorIf(cond, errorText) {
	if (!_QUEST_ENGINE_VALIDATE || !cond)
		return;
    showValidationError(errorText);
}

function validateUIStageActionIN(action) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;

    if (!(action.getActionType() in _UI_STAGE_ACTION_IN.ACTION_TYPES_SET)) {
		showValidationError("UIStageActionIn: \n"
            + action.toString()
            + "\nhas not valid action type\n"
			+ "Actions valid: \n"
			+ JSON.stringify(_PLAYER_ACTIONS_SET));
	}
}

function dumpUIStageActionIn(action) {
	if (!_QUEST_ENGINE_DEBUG)
		return;

	console.log(
        "UIStageActionIn: \n" +
        action.toString()
    );
}

function validateUIStageActionOut(action) {
	if (!_QUEST_ENGINE_VALIDATE)
		return;

    var isError = false;

	if (!(action.getActionType() in _UI_STAGE_ACTION_OUT.ACTION_TYPES_SET)) {
		showValidationError("UIStageActionOut has not valid action type\n"
			+ "valid action types: \n"
			+ JSON.stringify(_UI_STAGE_ACTION_OUT.ACTION_TYPES_SET));
        isError = true;
	}

	if ((action.getActionType()  === _UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE ||
        action.getActionType() === _UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ) &&
        !(action.getActorType() in _UI_STAGE_ACTION_OUT.ACTORS_SET)) {
		showValidationError("UIStageActionOut has not valid actor type\n"
			+ "valid actor types: \n"
			+ JSON.stringify(_UI_STAGE_ACTION_OUT.ACTORS_SET));
        isError = true;
	}

	if ((action.getActionType() === _UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE ||
        action.getActionType() === _UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ) &&
        !(action.getPhraseType() in _UI_STAGE_ACTION_OUT.PHRASE_TYPES_SET)) {
		showValidationError("UIStageActionOut has not valid phrase type\n"
			+ "valid phrase types: \n"
			+ JSON.stringify(_UI_STAGE_ACTION_OUT.PHRASE_TYPES_SET));
        isError = true;
	}

    if (isError) {
        showValidationError("UIStageActionOut: \n"
            + action.toString()
        );
    }
}

function dumpUIStageActionOut(action) {
	if (!_QUEST_ENGINE_DEBUG)
		return;

	console.log("UIStageActionOut: \n"
        + action.toString()
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

	if (questEvent.type === _QUEST_EVENTS.OBJECT_CLICKED &&
        (typeof questEvent.props.id === "undefined")) {
		showValidationError("Quest event " + JSON.stringify(questEvent) +
            "should have props.id values set");
	}
}

function dumpQuestNode(questNode) {
	if (!_QUEST_ENGINE_DEBUG)
		return;

	console.log("==QUEST NODE==\n"
        + JSON.stringify(questNode.save(), null, '\t')
	);
}
