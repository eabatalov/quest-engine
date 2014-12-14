function StageInterpretator(questStageNode) {
    this.stageName = questStageNode.getProp("name");
	this.storyLineInterps = [];

	$.each(questStageNode.getOutConds(), function(ix, cond) {
		if (cond.getType() !== _QUEST_CONDS.NONE &&
			cond.getDstNode().getType() !== _QUEST_NODES.STORYLINE) {
			console.error("Invalid outer edge from quest stage node: "
				+ cond.getType().toString() + " " + cond.getDstNode().getType().toString());
			return true;
		}

		this.storyLineInterps.push(new StoryLineInterpretator(cond.getDstNode()));
	}.bind(this));
}

StageInterpretator.prototype.getStageName = function() {
    return this.stageName;
};

StageInterpretator.prototype._storyLineByObjectId = function(id) {
    var foundStoryLineInterp = null;
    jQuery.each(this.storyLineInterps, function(ix, storyLineInterp) {
		if ($.inArray(id, storyLineInterp.getStorylineNode().getProp("objs")) >= 0) {
			foundStoryLineInterp = storyLineInterp;
			return false;
		}
	});
    return foundStoryLineInterp;
};

StageInterpretator.prototype.eventStoryLineInterp = function(questEvent) {
    if (questEvent.getType() === _QUEST_EVENTS.CONTINUE ||
        questEvent.getType() === _QUEST_EVENTS.NEXT) {
        //Also applies to storyline rollingback
        return this._storyLineByObjectId(_QUEST_PLAYER_ID);
    }
    //All other events have id props field
    return this._storyLineByObjectId(questEvent.getProp("id"));
};

StageInterpretator.prototype.step = function(questEvent) {
	var eventStoryLineInterp = this.eventStoryLineInterp(questEvent);
    if (eventStoryLineInterp === null) {
        console.error("Couldn't find storyline for event:\n" + JSON.stringify(questEvent));
    }
    var prevNode = eventStoryLineInterp.getCurrentNode();
	eventStoryLineInterp.step(questEvent);
    var result = new InterpretatorStepResult(
        eventStoryLineInterp.getCurrentNode(),
        eventStoryLineInterp.getCurrentCond(),
        prevNode
    );
	return result;
};

StageInterpretator.prototype.forEachStorylineInterp = function(callback/*(storylineInterp)*/) {
    for (var i = 0; i < this.storyLineInterps.length; ++i) {
        callback(this.storyLineInterps[i]);
    }
};
