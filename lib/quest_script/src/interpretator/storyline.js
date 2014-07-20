function StoryLineInterpretator(storyLineNode) {
    this.events = {
        nodeEnter : new SEEvent(/*node*/),
        condEnter : new SEEvent(/*cond*/)
    };
	this.storyLineNode = storyLineNode;
    this.currentNode = storyLineNode;
}

StoryLineInterpretator.prototype.setCurrentNode = function(node) {
    this.currentNode = node;
};

StoryLineInterpretator.prototype.getCurrentNode = function() {
    return this.currentNode;
};

StoryLineInterpretator.prototype.getStorylineNode = function() {
    return this.storyLineNode;
};

StoryLineInterpretator.prototype.setNextNodeByCond = function(condType, condProps) {
    var srcNode = this.getCurrentNode();
	var node = null;
    var cond = null;
	$.each(srcNode.getOutConds(), function(ix, outCond) {
		if (condType !== outCond.getType())
			return true;

		if (condType === _QUEST_CONDS.OBJECT_CLICKED &&
			condProps.id !== outCond.getProp("id"))
			return true;

        if (condType === _QUEST_CONDS.CUSTOM_EVENT &&
			condProps.name !== outCond.getProp("name"))
			return true;

        cond = outCond;
		node = outCond.getDstNode();
		return false;
	});
    if (node !== null) {
        this.events.condEnter.publish(cond);
        this.events.nodeEnter.publish(node);
        this.setCurrentNode(node);
    }
	return node !== null;
};

StoryLineInterpretator.questEventTypeToCondType = function(questEvenType) {
    /*
     * Assign value not interpretable by direct condition type
     * comparasion for events that need special non nextNodeByCond
     * handling.
     */
    var condType = _QUEST_CONDS.LAST;
    switch(questEvenType) {
        case _QUEST_EVENTS.OBJECT_CLICKED:
            condType = _QUEST_CONDS.OBJECT_CLICKED;
            break;
        case _QUEST_EVENTS.ANSWER_1_CLICKED:
            condType = _QUEST_CONDS.ANSWER_1_CLICKED;
            break;
        case _QUEST_EVENTS.ANSWER_2_CLICKED:
            condType = _QUEST_CONDS.ANSWER_2_CLICKED;
            break;
        case _QUEST_EVENTS.ANSWER_3_CLICKED:
            condType = _QUEST_CONDS.ANSWER_3_CLICKED;
            break;
        case _QUEST_EVENTS.ANSWER_4_CLICKED:
            condType = _QUEST_CONDS.ANSWER_4_CLICKED;
            break;
        case _QUEST_EVENTS.CONTINUE:
            condType = _QUEST_CONDS.CONTINUE;
            break;
        case _QUEST_EVENTS.CUSTOM_EVENT:
            condType = _QUEST_CONDS.CUSTOM_EVENT;
            break;
        case _QUEST_EVENTS.NEXT:
            condType = _QUEST_CONDS.NEXT;
            break;
    }
    return condType;
};

StoryLineInterpretator.prototype.step = function(questEvent) {
    var eventCondType =
        StoryLineInterpretator.questEventTypeToCondType(questEvent.getType());

    if (this.setNextNodeByCond(eventCondType, questEvent.getProps()))
		return;

	if ($.inArray(questEvent.getType(),
		[_QUEST_EVENTS.ANSWER_1_CLICKED,
		_QUEST_EVENTS.ANSWER_2_CLICKED,
		_QUEST_EVENTS.ANSWER_3_CLICKED,
		_QUEST_EVENTS.ANSWER_4_CLICKED]) !== -1) {
		if (this.setNextNodeByCond(_QUEST_CONDS.ANSWER_OTHER_CLICKED, null))
			return;
	}

	if (this.setNextNodeByCond(_QUEST_CONDS.NONE, null)) {
		this.step(questEvent);
		return;
	}

    if (this.setNextNodeByCond(_QUEST_CONDS.DEFAULT, null))
		return;

	//No suitable condition for event - stay in current node
};
