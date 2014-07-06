function QuestLevelRuntime() {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
	this.scriptInterp = null;
    this.nextCondSearch = new NextCondSearch();
    this.events = {
        scriptLoaded : null
    };
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

//TODO make it 'setLevel(level)'
QuestLevelRuntime.prototype.setupScript = function(scriptURL) {
	jQuery.getScript(scriptURL, function( data, textStatus, jqxhr ) {
		console.log("Quest script load was performed");
		console.log("Script URL: " + scriptURL);
		//console.log(data); // Data returned
		console.log(textStatus); // Success
		console.log(jqxhr.status); // 200
        console.log("Starting up script interpretator");
        this.scriptInterp = new ScriptInterpretator(getQuestScript());
        if (this.events.scriptLoaded)
            this.events.scriptLoaded();
	}.bind(this));
};

/* 
 * Reads INs parameters, modifies OUTs parameters to specify new UI action.
 * Works accorind to current stage quest script
 */
QuestLevelRuntime.prototype.playerActionExec = function(uiActionManager) {

    var inAction = uiActionManager.getCurrentStageUIActionIN();
    var outAction = uiActionManager.getCurrentStageUIActionOUT();
    outAction.clearFields();

    if (!this.scriptInterp) {
        console.warn("Game action was performed before script runtime was initialized");
        this.questNodeToUIStageActionOut(SENodeFabric(_QUEST_NODES.NONE), outAction);
        return;
    }

	validateUIStageActionIN(inAction);
	dumpUIStageActionIn(inAction);

	var questEvent = uiStageActionInToQuestEvent(inAction);
	validateQuestEvent(questEvent);
	dumpQuestEvent(questEvent);

	var questNode = this.scriptInterp.step(questEvent);
	dumpQuestNode(questNode);

	this.questNodeToUIStageActionOut(questNode, outAction);
	validateUIStageActionOut(outAction);
	dumpUIStageActionOut(outAction);
};

QuestLevelRuntime.prototype.questNodeToUIStageActionOut = function(questNode, action) {
    action.setHasNext(this.nextCondSearch.get(questNode) === null ? 0 : 1);

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
			    action.setFuncName(questNode.getProp("name"));
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
    action.setIsContinue(questNode.getContinue() === true ? 1 : 0);
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
		default:
			console.error("Invalid player stage action type type: "
                + action.getActionType());
            return null;
	}

	return new QuestEvent(
        action.getStageName(), type, props
    );
}