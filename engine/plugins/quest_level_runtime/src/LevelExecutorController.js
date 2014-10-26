function LevelExecutorController(levelExecutor) {
	this.stageNPCs = {}; //Stage name => NPC id in stage => uid
    this.npcUIDFunc = this._npcUID.bind(this);
    this.levelExecutor = levelExecutor;
    this.levelExecutor.events.
        qrActionPending.subscribe(this, this._onQRActionPending.bind(this));

    this.uiActionIn = new UIStageActionIn();
    this.uiActionOut = new UIStageActionOut();

    this.events = {
        uiActionPending : new SEEvent(/*UIStageActionOut*/)
    };
}

LevelExecutorController.prototype.getUIActionIn = function() {
    return this.uiActionIn;
};

LevelExecutorController.prototype.getUIActionOut = function() {
    return this.uiActionOut;
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
LevelExecutorController.prototype.uiActionInExec = function() {
	validateUIStageActionIN(this.uiActionIn);
	dumpUIStageActionIn(this.uiActionIn);

	var questEvent = uiStageActionInToQuestEvent(this.uiActionIn);
	validateQuestEvent(questEvent);
	dumpQuestEvent(questEvent);

    this.levelExecutor.questEventExec(questEvent);
};

//Called by UI when current uiActionOut was processed
LevelExecutorController.prototype.currentUIActionProcCompleted = function() {
    this.levelExecutor.currentQRActionProcCompleted();
};

LevelExecutorController.prototype._onQRActionPending = function(nextQRAction) {
    this._fillUIActionOut(nextQRAction);
    this.events.uiActionPending.publish(this.uiActionOut);
};

LevelExecutorController.prototype._npcUID = function(stageName, npcIDInStage) {
	return this.stageNPCs[stageName][npcIDInStage];
};

LevelExecutorController.prototype._fillUIActionOut = function(qrAction) {
    this.uiActionOut.clearFields();
    this.uiActionOut.fillFromQRAction(qrAction, this.npcUIDFunc);
    validateUIStageActionOut(this.uiActionOut);
    dumpUIStageActionOut(this.uiActionOut);
};
