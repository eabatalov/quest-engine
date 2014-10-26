function UIStageActionIn() {
    this.clearFields();
};

UIStageActionIn.prototype.clearFields = function() {
	this.stageName = "";
	this.actionType = "";
	this.targetId = "";
    this.name = ""; //only for CUSTOM_EVENT for now
};

UIStageActionIn.prototype.setStageName = function(stageName) {
    this.stageName = stageName;
};

UIStageActionIn.prototype.getStageName = function() {
    return this.stageName;
};

UIStageActionIn.prototype.setActionType = function(actionType) {
    this.actionType = actionType;
};

UIStageActionIn.prototype.getActionType = function() {
    return this.actionType;
};

UIStageActionIn.prototype.setTargetId = function(targetId) {
    this.targetId = targetId;
};

UIStageActionIn.prototype.getTargetId = function() {
    return this.targetId;
};

UIStageActionIn.prototype.setName = function(name) {
    this.name = name;
};

UIStageActionIn.prototype.getName = function() {
    return this.name;
};

UIStageActionIn.prototype.toString = function() {
    return JSON.stringify(this, null, '\t');
};

function uiStageActionInToQuestEvent(uiActionIn) {
    var type = null;
    var props = null;

	switch(uiActionIn.getActionType()) {
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.PLAYER_CLICKED:
			type = _QUEST_EVENTS.OBJECT_CLICKED;
            props = { id : _QUEST_PLAYER_ID };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.NPC_CLICKED:
            type = _QUEST_EVENTS.OBJECT_CLICKED;
            props = { id : uiActionIn.getTargetId() };
		break;
		case  _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER1_CLICKED:
            type = _QUEST_EVENTS.ANSWER_1_CLICKED;
		    props = { id : uiActionIn.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER2_CLICKED:
            type = _QUEST_EVENTS.ANSWER_2_CLICKED,
			props = { id : uiActionIn.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER3_CLICKED:
            type = _QUEST_EVENTS.ANSWER_3_CLICKED,
			props = { id : uiActionIn.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER4_CLICKED:
            type = _QUEST_EVENTS.ANSWER_4_CLICKED;
		    props = { id : uiActionIn.getTargetId() };
		break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.CUSTOM_EVENT:
            type = _QUEST_EVENTS.CUSTOM_EVENT;
		    props = { name : uiActionIn.getName(), id : uiActionIn.getTargetId() };
		break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.NEXT:
            type = _QUEST_EVENTS.NEXT;
			props = { id : uiActionIn.getTargetId() };
        break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.BACK:
            type = _QUEST_EVENTS.BACK;
            props = { id : uiActionIn.getTargetId() };
        break;
		default:
			console.error("Invalid player stage action type type: "
                + uiActionIn.getActionType());
            return null;
	}
    return new QuestEvent(uiActionIn.getStageName(), type, props);
}
