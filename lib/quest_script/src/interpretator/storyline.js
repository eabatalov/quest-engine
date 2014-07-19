function StoryLineInterpretator(storyLineNode) {
    this.events = {
        nodeEnter : new SEEvent(/*node*/),
        condEnter : new SEEvent(/*cond*/)
    };
	this.storyLineNode = storyLineNode;
    this.currentNodeExecInfo = new NodeExecInfo(storyLineNode);
    this.nextNodeRollbacker = new StoryLineNextNodeRollbacker(this);
    this.nextCondSearch = new NextCondSearch();
}

StoryLineInterpretator.prototype.setCurrentNode = function(node) {
	this.currentNodeExecInfo = new NodeExecInfo(node);
    this.currentNodeExecInfo.setHasBack(
        this.nextNodeRollbacker.getIsRollbackAvail()
    );
    this.currentNodeExecInfo.setHasNext(
        this.nextCondSearch.get(node) !== null
    );
};

StoryLineInterpretator.prototype.getCurrentNodeExecInfo = function() {
    return this.currentNodeExecInfo;
};

StoryLineInterpretator.prototype.getStorylineNode = function() {
    return this.storyLineNode;
};

StoryLineInterpretator.prototype.setNextNodeByCond = function(condType, condProps) {
    var srcNode = this.currentNodeExecInfo.getNode();
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
        this.setCurrentNode(node);
        this.procNextNodeEnter(node);
        this.events.nodeEnter.publish(node);
        this.events.condEnter.publish(cond);
    }
	return node !== null;
};

StoryLineInterpretator.questEventTypeToCondType = function(questEvenType) {
    /*
     * Assign value not interpretable by direct condition type
     * comparasion for events that need special non nextNodeByCond
     * handling.
     */
    var contType = _QUEST_CONDS.LAST;
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


    if (this.nextNodeRollbacker.getIsInProgress()) {
        this.nextNodeRollbacker.step();
        //We don't generate 'enter' events on moving back
        this.setCurrentNode(this.nextNodeRollbacker.getCurNode());
        return;
    }

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

    if (questEvent.getType() === _QUEST_EVENTS.BACK
        && this.nextNodeRollbacker.getIsRollbackAvail()) {
        this.nextNodeRollbacker.startNextRollbackFrom(this.currentNode);
        nextNode = this.nextNodeRollbacker.getCurNode();
        if (nextNode !== null) {
            //We don't generate 'enter' events on moving back
            this.setCurrentNode(nextNode);
            return;
        }
    }

	if (this.setNextNodeByCond(_QUEST_CONDS.NONE, null)) {
		this.step(questEvent);
		return;
	}

    if (this.setNextNodeByCond(_QUEST_CONDS.DEFAULT, null))
		return;

	//No suitable condition for event - stay in current node
};

StoryLineInterpretator.prototype.jsFuncNodeExec = function(node) {
    assert(node.getProp('source') === SEFuncCallNode.sources.js);
    var funcName = node.getProp('name');
    var params = {};
    jQuery.each(node.getProp('params'), function(ix, param) {
        var value = param.value;
        if (param.type === SEFuncCallNodeParameter.types.num) {
            if (value.indexOf(".") !== -1) {
                value = parseInt(value, 10);
            } else {
                value = parseFloat(value);
            }
        }
        params[param.name] = value;
    });

    window[funcName](params);
};

StoryLineInterpretator.prototype.procNextNodeEnter = function(node) {
    if (node.getType() === _QUEST_NODES.FUNC_CALL &&
        node.getProp('source') === SEFuncCallNode.sources.js) {
        this.jsFuncNodeExec(node);
    }
};
