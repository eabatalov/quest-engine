function ScriptInterpretator(questScript) {
	this.questScript = questScript;
	this.stageInterps = {};

	$.each(this.questScript.getStages(), function(ix, stage) {
        var stageNode = stage.getStageNode();
		this.stageInterps[stageNode.getProp("name")] = new StageInterpretator(stageNode);
	}.bind(this));
    this.runScriptInitStage();
}

ScriptInterpretator.prototype.runScriptInitStage = function() {
    var INIT_STAGE_NAME = 'init';
    if (!this.stageInterps[INIT_STAGE_NAME])
        return;

    var initStepEvent = new QuestEvent(INIT_STAGE_NAME, _QUEST_EVENTS.CONTINUE);
    var currentInitNode = null;

    do {
        var currentInitNode = this.step(initStepEvent);
    } while(currentInitNode.getType() !== _QUEST_NODES.NONE);

    console.log('Init stage ', INIT_STAGE_NAME, ' is completed');
};

//Returns QuestNode which we moved to after the step
ScriptInterpretator.prototype.step = function(questEvent) {
    var stageInterp = this.stageInterps[questEvent.getStageName()];
    assert(stageInterp);
	return stageInterp.step(questEvent);
};
