function StoryLineInterpretator(storyLineNode) {
	this.storyLineNode = storyLineNode;
	this.currentNode = storyLineNode;
}

StoryLineInterpretator.prototype.setCurrentNode = function(questNode) {
	this.currentNode = questNode;
};

StoryLineInterpretator.prototype.getCurrentNode = function() {
    return this.currentNode;
};

StoryLineInterpretator.prototype.getStorylineNode = function() {
    return this.storyLineNode;
};

StoryLineInterpretator.prototype.nextNodeByCond = function(srcNode, condType, condProps) {
	var node = null;
	$.each(srcNode.getOutConds(), function(ix, cond) {
		if (condType !== cond.getType())
			return true;

		if (condType === _QUEST_EVENTS.OBJECT_CLICKED &&
			condProps.id !== cond.getProp("id"))
			return true;

        if (condType === _QUEST_EVENTS.CUSTOM_EVENT &&
			condProps.name !== cond.getProp("name"))
			return true;

		node = cond.getDstNode();
		return false;
	});
	return node;
};

StoryLineInterpretator.prototype.step = function(questEvent) {
	var nextNode = this.nextNodeByCond(this.currentNode, questEvent.getType(), questEvent.getProps());
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		return;
	}

	if ($.inArray(questEvent.getType(),
		[_QUEST_EVENTS.ANSWER_1_CLICKED,
		_QUEST_EVENTS.ANSWER_2_CLICKED,
		_QUEST_EVENTS.ANSWER_3_CLICKED,
		_QUEST_EVENTS.ANSWER_4_CLICKED]) !== -1) {
		nextNode = this.nextNodeByCond(this.currentNode, _QUEST_CONDS.ANSWER_OTHER_CLICKED, null);
		if (nextNode !== null) {
			this.setCurrentNode(nextNode);
			return;
		}
	}

	nextNode = this.nextNodeByCond(this.currentNode, _QUEST_CONDS.NONE, null);
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		this.step(questEvent);
		return;
	}

	nextNode = this.nextNodeByCond(this.currentNode, _QUEST_CONDS.DEFAULT, null);
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		return;
	}

	//No suitable condition for event - stay in current node
};
