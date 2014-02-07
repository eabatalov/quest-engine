/*
	This class contains all the quest game engine logic and state.
*/
function QuestEngine() {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
}

QuestEngine.prototype.npcUID = function(stageName, npcIDInStage) {
	return this.stageNPCs[stageName][npcIDInStage];
}

QuestEngine.prototype.prepareNextAction = function(stageActCont) {
	this.questStageActionExec(stageActCont);
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
	//Temporarely disable
	/*jQuery.getScript(scriptURL, function( data, textStatus, jqxhr ) {
		console.log("Quest script load was performed");
		console.log("Script URL: " + scriptURL);
		//console.log(data); // Data returned
		console.log(textStatus); // Success
		console.log(jqxhr.status); // 200
	});*/
}

function dumpCurrentAction(stageActCont) {
	console.log(
		"Current stage: " + stageActCont.curStageName + "\n"
		+ "Last player action: " + stageActCont.curStageAction().lastPlayerAction + "\n"
		+ "Last action target id" + stageActCont.curStageAction().lastActionTargetId + "\n"
	);
}

/* 
 * Reads INs parameters, modifies OUTs parameters to specify new action.
 * Works accorind to current stage quest script
 */
QuestEngine.prototype.questStageActionExec = function(stageActCont) {
	dumpCurrentAction(stageActCont);
	stageActCont.curStageAction().clearOutFields();
	//TODO execute quest script list
	QuestStageActionExec(stageActCont, this);
}

//Global quest script consts
_PLAYER_ACTION_PLAYER_AVATAR_CLICKED = "PLAYER_AVATAR_CLICKED";
_PLAYER_ACTION_NPC_CLICKED = "NPC_CLICKED";
_PLAYER_ACTION_ANSWER_CLICKED = "ANSWER_CLICKED";

_ACTOR_TYPE_PLAYER = "PLAYER";
_ACTOR_TYPE_NPC = "NPC";

_ACTION_TYPE_PHRASE ="PHRASE";
_ACTION_TYPE_QUIZ = "QUIZ";
_ACTION_TYPE_ANIMATION = "ANIMATION";
_ACTION_TYPE_NOP = "NOP";
_ACTION_TYPE_DELAY = "DELAY";