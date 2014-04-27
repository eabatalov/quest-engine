/*
 * QuestEvent contains information about event happend
 * on stage which will be matched against conditions
 * outgoing from current node on stage.
 */

_QUEST_EVENTS = {
	/* Similar to QuestCond*/
	//Values are equal for interpretation simplification
	OBJECT_CLICKED :_QUEST_CONDS.OBJECT_CLICKED, // props : { id : String }
	ANSWER_1_CLICKED : _QUEST_CONDS.ANSWER_1_CLICKED, // props : { id : String }
	ANSWER_2_CLICKED : _QUEST_CONDS.ANSWER_2_CLICKED, // props : { id : String }
	ANSWER_3_CLICKED : _QUEST_CONDS.ANSWER_3_CLICKED, // props : { id : String }
	ANSWER_4_CLICKED : _QUEST_CONDS.ANSWER_4_CLICKED, // props : { id : String }
	CONTINUE : _QUEST_CONDS.CONTINUE
};
_QUEST_EVENTS_SET = {};

$.each(_QUEST_EVENTS, function(name, value) {
	_QUEST_EVENTS_SET[value] = true;
});

function QuestEvent(stageName, /* _QUEST_EVENTS.* */ type, props) {
    this.stageName = stageName;
	this.type = type;
    //Event dependant properties
	this.props = (props !== null && props !== undefined) ? props : null;
}

QuestEvent.prototype.getStageName = function() {
    return this.stageName;
};

QuestEvent.prototype.getType = function() {
    return this.type;
};

QuestEvent.prototype.getProps = function() {
    return this.props;
};

QuestEvent.prototype.getProp = function(propName) {
    return this.props[propName];
};
