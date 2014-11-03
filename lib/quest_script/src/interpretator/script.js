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
 * the first 'none' node. Call callback on each
 * InterpretatorStepResult entery.
 */
ScriptInterpretator.prototype.execStage = function(stageName, callback) {
    if (!this.stageInterps[stageName]) {
        console.warn('Execute stage: stage "' + stageName + '" is not found!');
        return;
    }

    var stepEvent = new QuestEvent(stageName, _QUEST_EVENTS.CONTINUE);
    var currentInitNode = null;

    do {
        var stepResult = this.step(stepEvent);
        var node = stepResult.getNode();
        callback(stepResult);
    } while(node.getType() !== _QUEST_NODES.NONE);
};

//Returns InterpretatorStepResult
ScriptInterpretator.prototype.step = function(questEvent) {
	return this._questEventStageInterp(questEvent).step(questEvent);
};

/*
 * Determines node where to check sequence by quest event.
 */
ScriptInterpretator.prototype.isSeqInProgress = function(questEvent) {
    return this._questEventStageInterp(questEvent).
        eventStoryLineInterp(questEvent).isSeqInProgress();
};

ScriptInterpretator.prototype.forEachStageInterp = function(callback) {
    jQuery.each(this.stageInterps, function(stageName, stageInterp) {
        callback(stageInterp);
    });
};

ScriptInterpretator.prototype._questEventStageInterp = function(questEvent) {
    var stageInterp = this.stageInterps[questEvent.getStageName()];
    assert(stageInterp);
    return stageInterp;
};
