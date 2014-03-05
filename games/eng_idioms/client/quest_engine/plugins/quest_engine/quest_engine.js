/*
	This class contains all the quest game engine logic and state.
*/
function QuestEngine() {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
	this.questInterpr = new QuestInterpretator(getQuestScript());
}

QuestEngine.prototype.npcUID = function(stageName, npcIDInStage) {
	return this.stageNPCs[stageName][npcIDInStage];
}

QuestEngine.prototype.playerActionExec = function(stageActCont) {
	this.playerActionExec(stageActCont);
};

_NPC_INST_PROP_STAGE_IX = 0;
_NPC_INST_PROP_NPC_ID_ON_STAGE_IX = 1;
QuestEngine.prototype.setupObjects = function(NPCType, GameActionType) {
	var quest = this;
	var gameAction = GameActionType.getFirstPicked();

	$.each(NPCType.instances, function(ix, npc) {
		var stageName = npc.instance_vars[_NPC_INST_PROP_STAGE_IX];
		if (!(stageName in gameAction.stageActions)) {
			var stageAction = new gameAction.StageAction();
			stageAction.stageName = stageName;
			gameAction.stageActions[stageName] = stageAction;
			quest.stageNPCs[stageName] = {};
		}
		quest.stageNPCs[stageName][npc.instance_vars[_NPC_INST_PROP_NPC_ID_ON_STAGE_IX]] = npc.uid;
	});
}

QuestEngine.prototype.setupScript = function(scriptURL) {
	//Temporarely disabled
	/*jQuery.getScript(scriptURL, function( data, textStatus, jqxhr ) {
		console.log("Quest script load was performed");
		console.log("Script URL: " + scriptURL);
		//console.log(data); // Data returned
		console.log(textStatus); // Success
		console.log(jqxhr.status); // 200
	});*/
}

/* 
 * Reads INs parameters, modifies OUTs parameters to specify new action.
 * Works accorind to current stage quest script
 */
QuestEngine.prototype.playerActionExec = function(stageActCont) {
	validatePlayerAction(stageActCont);
	dumpPlayerAction(stageActCont);
	stageActCont.curStageAction().clearOutFields();

	var questEvent = this.toQuestEvent(stageActCont.curStageAction());
	dumpQuestEvent(questEvent);
	var questNode =
		this.questInterpr.step(stageActCont.curStageName, questEvent);
	dumpQuestNode(questNode);

	this.fillStageAction(stageActCont.curStageAction(), questNode);
	validateUIAction(stageActCont);
	dumpUIAction(stageActCont);
}

QuestEngine.prototype.toQuestEvent = function(stageAct) {
	var questEvent = null;

	switch(stageAct.lastPlayerAction) {
		case _PLAYER_ACTION_PLAYER_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_OBJECT_CLICKED, { id : _QUEST_PLAYER_ID });
		break;
		case _PLAYER_ACTION_NPC_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_OBJECT_CLICKED, { id : stageAct.lastActionTargetId });
		break;
		case  _PLAYER_ACTION_ANSWER1_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_ANSWER_1_CLICKED,
				{ id : stageAct.lastActionTargetId });
		break;
		case _PLAYER_ACTION_ANSWER2_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_ANSWER_2_CLICKED,
				{ id : stageAct.lastActionTargetId });
		break;
		case _PLAYER_ACTION_ANSWER3_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_ANSWER_3_CLICKED,
				{ id : stageAct.lastActionTargetId });
		break;
		case _PLAYER_ACTION_ANSWER4_CLICKED:
			questEvent = new QuestEvent(_QUEST_EV_ANSWER_4_CLICKED,
				{ id : stageAct.lastActionTargetId });
		break;
		case  _PLAYER_ACTION_CONTINUE:
			questEvent = new QuestEvent(_QUEST_COND_CONTINUE);
		break;
		default:
			console.log("Error. Invalid player stage action type type: " + stageAct.lastPlayerAction);
	}
	return questEvent;
}

QuestEngine.prototype.fillStageAction = function(stageAct, questNode) {
	var setActorInfo = false;
	switch(questNode.type) {
		case _QUEST_NODE_NONE:
		case _QUEST_NODE_STORYLINE:
			stageAct.action = _UI_ACTION_NONE;
		break;
		case _QUEST_NODE_PHRASE:
			stageAct.action = _UI_ACTION_PHRASE;
			stageAct.text = questNode.priv.text;
			setActorInfo = true;
		break;
		case _QUEST_NODE_QUIZ:
			stageAct.action = _UI_ACTION_QUIZ;
			stageAct.text = questNode.priv.text;
			stageAct.answer1Text = questNode.priv.ans[0];
			stageAct.answer2Text = questNode.priv.ans[1];
			stageAct.answer3Text = questNode.priv.ans[2];
			stageAct.answer4Text = questNode.priv.ans[3];
			stageAct.rightAnswerIx = 0;
			setActorInfo = true;
		break;
		case _QUEST_NODE_ANIM:
			stageAct.action = _UI_ACTION_ANIMATION;	
			stageAct.animationName = questNode.priv.name;
			setActorInfo = true;
		break;
		case _QUEST_NODE_WAIT:
			stageAct.action = _UI_ACTION_DELAY;
			stageAct.delay = questNode.priv.secs;
		break;
		case _QUEST_NODE_STAGE_CLEAR:
			stageAct.action = _UI_ACTION_STAGE_CLEAR;
		break;
		default:
			console.log("Error. Invalid quest node type: " + questNode.type);
			stageAct.action = _PLAYER_ACTION_INVALID;
	}
	if (setActorInfo) {
		stageAct.actor = questNode.priv.id === _QUEST_PLAYER_ID ? "PLAYER" : "NPC";
		stageAct.npcActorUID = questNode.priv.id !== _QUEST_PLAYER_ID ?
			this.npcUID(stageAct.stageName, questNode.priv.id) : null;
	}
	stageAct.continue = questNode.continue === true ? 1 : 0;
}