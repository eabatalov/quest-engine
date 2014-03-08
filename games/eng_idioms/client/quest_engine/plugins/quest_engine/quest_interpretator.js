_QUEST_EVENTS = {
	/* Similar to QuestCond*/
	//Values are equal for interpretation simplification
	OBJECT_CLICKED :_QUEST_CONDS.OBJECT_CLICKED, // priv : { id : String }
	ANSWER_1_CLICKED : _QUEST_CONDS.ANSWER_1_CLICKED, // priv : { id : String }
	ANSWER_2_CLICKED : _QUEST_CONDS.ANSWER_2_CLICKED, // priv : { id : String }
	ANSWER_3_CLICKED : _QUEST_CONDS.ANSWER_3_CLICKED, // priv : { id : String }
	ANSWER_4_CLICKED : _QUEST_CONDS.ANSWER_4_CLICKED, // priv : { id : String }
	CONTINUE : _QUEST_CONDS.CONTINUE
};
_QUEST_EVENTS_SET = {};
$.each(_QUEST_EVENTS, function(name, value) {
	_QUEST_EVENTS_SET[value] = true;
});

function QuestEvent(/* _QUEST_EVENTS.* */ type, priv) {
	this.type = type;
	this.priv = (priv !== null && priv !== undefined) ? priv : null;
}

function StoryLineState(storyLineNode) {
	this.storyLineNode = storyLineNode;
	this.currentNode = storyLineNode;
}

StoryLineState.prototype.nodeForCondType = function(type, priv, /* [ QuestCond ] */ conds) {
	var node = null;
	$.each(conds, function(ix, cond) {
		if (type !== cond.type)
			return true;
		if (type === _QUEST_CONDS.OBJECT_CLICKED &&
			priv.id !== cond.priv.id)
			return true;

		node = cond.node;
		return false;
	});
	return node;
}

StoryLineState.prototype.setCurrentNode = function(questNode) {
	this.currentNode = questNode;
}

StoryLineState.prototype.step = function(questEvent) {
	var nextNode = this.nodeForCondType(questEvent.type, questEvent.priv, this.currentNode.conds);
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		return;
	}

	if ($.inArray(questEvent.type,
		[_QUEST_EVENTS.ANSWER_1_CLICKED,
		_QUEST_EVENTS.ANSWER_2_CLICKED,
		_QUEST_EVENTS.ANSWER_3_CLICKED,
		_QUEST_EVENTS.ANSWER_4_CLICKED]) !== -1) {
		nextNode = this.nodeForCondType(_QUEST_CONDS.ANSWER_OTHER_CLICKED, null, this.currentNode.conds);
		if (nextNode !== null) {
			this.setCurrentNode(nextNode);
			return;
		}
	}

	nextNode = this.nodeForCondType(_QUEST_CONDS.NONE, null, this.currentNode.conds);
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		this.step(questEvent);
		return;
	}

	nextNode = this.nodeForCondType(_QUEST_CONDS.DEFAULT, null, this.currentNode.conds);
	if (nextNode !== null) {
		this.setCurrentNode(nextNode);
		return;
	}

	//No suitable condition for event - stay in current node
}

function StageState(questStageNode) {
	var stageState = this;
	stageState.storyLines = [];
	$.each(questStageNode.conds, function(ix, questCond) {
		if (questCond.type !== _QUEST_CONDS.NONE &&
			questCond.node.type !== _QUEST_NODES.STORYLINE) {
			showValidationError("Invalid outer edge from quest stage node: "
				+ questCond.type.toString() + " " + questCond.node.type.toString());
			return true;
		}

		stageState.storyLines.push(new StoryLineState(questCond.node));
	});
}

StageState.prototype.eventStoryLine = function(questEvent) {
	var stageState = this;
	var foundStoryLineState = null;
	$.each(stageState.storyLines, function(ix, storyLineState) {
		if (questEvent.type == _QUEST_EVENTS.CONTINUE) {
			if (storyLineState.currentNode.continue) {
				foundStoryLineState = storyLineState;
				return false;
			} else {
				return true;
			}
		}
		//All other events have id priv field
		if ($.inArray(questEvent.priv.id, storyLineState.storyLineNode.priv.objs) >= 0) {
			foundStoryLineState = storyLineState;
			return false;	
		}
	});
	return foundStoryLineState;
}

StageState.prototype.step = function(questEvent) {
	var eventStoryLine = this.eventStoryLine(questEvent);
	eventStoryLine.step(questEvent);
	return eventStoryLine.currentNode;
}

function QuestInterpretator(questScript) {
	var interpretator = this;
	interpretator.questScript = questScript;
	interpretator.stageStates = {};
	$.each(this.questScript.stages, function(stageName, questStageNode) {
		interpretator.stageStates[stageName] = new StageState(questStageNode);
	});
}

//Returns QuestNode which we moved to after the step
QuestInterpretator.prototype.step = function(/* string */ stageName, /* QuestEvent */ questEvent) {
	return this.stageStates[stageName].step(questEvent);
}
