function LevelExecutorController(levelExecutor) {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
    this.npcUIDFunc = this.npcUID.bind(this);
    this.levelExecutor = levelExecutor;
}

LevelExecutorController.prototype.npcUID = function(stageName, npcIDInStage) {
	return this.stageNPCs[stageName][npcIDInStage];
};

_NPC_INST_PROP_STAGE_IX = 0;
_NPC_INST_PROP_NPC_ID_ON_STAGE_IX = 1;
LevelExecutorController.prototype.setupObjects = function(NPCType) {
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
LevelExecutorController.prototype.uiActionExec = function(uiInAction, uiOutAction) {
    uiOutAction.clearFields();

	validateUIStageActionIN(uiInAction);
	dumpUIStageActionIn(uiInAction);

	var questEvent = uiStageActionInToQuestEvent(uiInAction);
	validateQuestEvent(questEvent);
	dumpQuestEvent(questEvent);

    var nextQRAction = this.levelExecutor.questEventExec(questEvent);

    uiOutAction.fillFromQRAction(nextQRAction, this.npcUIDFunc);

	validateUIStageActionOut(uiOutAction);
	dumpUIStageActionOut(uiOutAction);
};
