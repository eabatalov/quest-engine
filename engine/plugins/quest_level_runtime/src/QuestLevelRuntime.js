function QuestLevelRuntime(questLevel) {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
    var scriptInterp = new ScriptInterpretator(questLevel.getScript());
    this.qrScriptInterp = new QRScriptInterpretator(scriptInterp);
    this.qrScriptRevInterp = new QRScriptReverseInterp(scriptInterp);
    this.qrActionExecJS = new QRActionExecJS();
    this.qrActionExecUI = new QRActionExecUI(this.npcUID.bind(this));
}

QuestLevelRuntime.prototype.npcUID = function(stageName, npcIDInStage) {
	return this.stageNPCs[stageName][npcIDInStage];
};

_NPC_INST_PROP_STAGE_IX = 0;
_NPC_INST_PROP_NPC_ID_ON_STAGE_IX = 1;
QuestLevelRuntime.prototype.setupObjects = function(NPCType) {
	var quest = this;

	$.each(NPCType.instances, function(ix, npc) {
		var stageName = npc.instance_vars[_NPC_INST_PROP_STAGE_IX];
		if (!(stageName in quest.stageNPCs)) {
			quest.stageNPCs[stageName] = {};
		}
		quest.stageNPCs[stageName][npc.instance_vars[_NPC_INST_PROP_NPC_ID_ON_STAGE_IX]] = npc.uid;
	});
};

/* 
 * Reads INs parameters, modifies OUTs parameters to specify new UI action.
 * Works accoring to current stage quest script
 */
QuestLevelRuntime.prototype.playerActionExec = function(inAction, outAction) {
    outAction.clearFields();

	validateUIStageActionIN(inAction);
	dumpUIStageActionIn(inAction);

	var questEvent = uiStageActionInToQuestEvent(inAction);
	validateQuestEvent(questEvent);
	dumpQuestEvent(questEvent);

    var nextQRAction = null;
    if (this.qrScriptRevInterp.isMyEvent(questEvent)) 
        nextQRAction = this.qrScriptRevInterp.step(questEvent);
    else {
        nextQRAction = this.qrScriptInterp.step(questEvent);
        nextQRAction.setCanReverse(this.qrScriptRevInterp.
            isNodeCanReverse(nextQRAction.getNode(), questEvent));
    }

    this.qrActionExecJS.exec(nextQRAction, outAction)
    || this.qrActionExecUI.exec(nextQRAction, outAction);

	validateUIStageActionOut(outAction);
	dumpUIStageActionOut(outAction);
};

function uiStageActionInToQuestEvent(action) {
    var type = null;
    var props = null;

	switch(action.getActionType()) {
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.PLAYER_CLICKED:
			type = _QUEST_EVENTS.OBJECT_CLICKED;
            props = { id : _QUEST_PLAYER_ID };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.NPC_CLICKED:
            type = _QUEST_EVENTS.OBJECT_CLICKED;
            props = { id : action.getTargetId() };
		break;
		case  _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER1_CLICKED:
            type = _QUEST_EVENTS.ANSWER_1_CLICKED;
		    props = { id : action.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER2_CLICKED:
            type = _QUEST_EVENTS.ANSWER_2_CLICKED,
			props = { id : action.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER3_CLICKED:
            type = _QUEST_EVENTS.ANSWER_3_CLICKED,
			props = { id : action.getTargetId() };
		break;
		case _UI_STAGE_ACTION_IN.ACTION_TYPES.ANSWER4_CLICKED:
            type = _QUEST_EVENTS.ANSWER_4_CLICKED;
		    props = { id : action.getTargetId() };
		break;
		case  _UI_STAGE_ACTION_IN.ACTION_TYPES.CONTINUE:
            type = _QUEST_EVENTS.CONTINUE;
		break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.CUSTOM_EVENT:
            type = _QUEST_EVENTS.CUSTOM_EVENT;
		    props = { name : action.getName(), id : action.getTargetId() };
		break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.NEXT:
            type = _QUEST_EVENTS.NEXT;
			props = { id : action.getTargetId() };
        break;
        case _UI_STAGE_ACTION_IN.ACTION_TYPES.BACK:
            type = _QUEST_EVENTS.BACK;
            props = { id : action.getTargetId() };
        break;
		default:
			console.error("Invalid player stage action type type: "
                + action.getActionType());
            return null;
	}

	return new QuestEvent(
        action.getStageName(), type, props
    );
}
