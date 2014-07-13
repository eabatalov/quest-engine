function ScriptInterpretator(questScript) {
	this.questScript = questScript;
	this.stageInterps = {};

	$.each(this.questScript.getStages(), function(ix, stage) {
        var stageNode = stage.getStageNode();
		this.stageInterps[stageNode.getProp("name")] = new StageInterpretator(stageNode);
	}.bind(this));
}

/*
 * Execute stage with name @stageNode
 * following 'continue' conditions and stop on
 * the first 'none' node
 */
ScriptInterpretator.prototype.execStage = function(stageName) {
    if (!this.stageInterps[stageName]) {
        console.warn('Execute stage: stage "' + stageName + '" is not found!');
        return;
    }

    var initStepEvent = new QuestEvent(stageName, _QUEST_EVENTS.CONTINUE);
    var currentInitNode = null;

    do {
        var currentInitNode = this.step(initStepEvent);
    } while(currentInitNode.getType() !== _QUEST_NODES.NONE);
};

//Returns QuestNode which we moved to after the step
ScriptInterpretator.prototype.step = function(questEvent) {
    var stageInterp = this.stageInterps[questEvent.getStageName()];
    assert(stageInterp);
	return stageInterp.step(questEvent);
};
