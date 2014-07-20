function ScriptInterpretator(questScript) {
	this.questScript = questScript;
	this.stageInterps = {};

	$.each(this.questScript.getStages(), function(ix, stage) {
        var stageNode = stage.getStageNode();
		this.stageInterps[stageNode.getProp("name")] = new StageInterpretator(stageNode);
	}.bind(this));
}

/*
 * Perform stepping on @stageNode
 * following 'continue' conditions and stop on
 * the first 'none' node. Call callback on each node enter.
 */
ScriptInterpretator.prototype.execStage = function(stageName, callback) {
    if (!this.stageInterps[stageName]) {
        console.warn('Execute stage: stage "' + stageName + '" is not found!');
        return;
    }

    var stepEvent = new QuestEvent(stageName, _QUEST_EVENTS.CONTINUE);
    var currentInitNode = null;

    do {
        var node = this.step(stepEvent);
        callback(node);
    } while(node.getType() !== _QUEST_NODES.NONE);
};

//Returns NodeExecInfo which we moved to after the step
ScriptInterpretator.prototype.step = function(questEvent) {
    var stageInterp = this.stageInterps[questEvent.getStageName()];
    assert(stageInterp);
	return stageInterp.step(questEvent);
};

ScriptInterpretator.prototype.forEachStageInterp = function(callback) {
    jQuery.each(this.stageInterps, function(stageName, stageInterp) {
        callback(stageInterp);
    });
};
