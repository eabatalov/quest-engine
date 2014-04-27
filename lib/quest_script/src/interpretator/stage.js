function StageInterpretator(questStageNode) {
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

StageInterpretator.prototype.eventStoryLine = function(questEvent) {
	var foundStoryLineInterp = null;
	$.each(this.storyLineInterps, function(ix, storyLineInterp) {
		if (questEvent.getType() == _QUEST_EVENTS.CONTINUE) {
			if (storyLineInterp.getCurrentNode().getContinue()) {
				foundStoryLineInterp = storyLineInterp;
				return false;
			} else {
				return true;
			}
		}
		//All other events have id props field
		if ($.inArray(questEvent.getProp("id"), storyLineInterp.getStorylineNode().getProp("objs")) >= 0) {
			foundStoryLineInterp = storyLineInterp;
			return false;
		}
	});
	return foundStoryLineInterp;
};

StageInterpretator.prototype.step = function(questEvent) {
	var eventStoryLine = this.eventStoryLine(questEvent);
	eventStoryLine.step(questEvent);
	return eventStoryLine.getCurrentNode();
};
