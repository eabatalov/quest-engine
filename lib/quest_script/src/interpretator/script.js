function ScriptInterpretator(questScript) {
	this.questScript = questScript;
	this.stageInterps = {};

	$.each(this.questScript.getStages(), function(ix, stage) {
        var stageNode = stage.getStageNode();
		this.stageInterps[stageNode.getProp("name")] = new StageInterpretator(stageNode);
	}.bind(this));
}

//Returns QuestNode which we moved to after the step
ScriptInterpretator.prototype.step = function(questEvent) {
	return this.stageInterps[questEvent.getStageName()].step(questEvent);
};
