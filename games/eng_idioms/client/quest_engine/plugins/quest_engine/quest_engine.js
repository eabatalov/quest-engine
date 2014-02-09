/*
	This class contains all the quest game engine logic and state.
*/
function QuestEngine() {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
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
	dumpCurrentPlayerAction(stageActCont);
	stageActCont.curStageAction().clearOutFields();
	//TODO execute quest script list
	QuestStageActionExec(stageActCont, this);
	dumpCurrentUIAction(stageActCont);
}