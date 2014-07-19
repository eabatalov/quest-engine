/*
 * QuestEvent contains information about event happend
 * on stage which will be matched against conditions
 * outgoing from current node on stage.
 */

_QUEST_EVENTS = {
	OBJECT_CLICKED : 1, // props : { id : String }
	ANSWER_1_CLICKED : 2, // props : { id : String }
	ANSWER_2_CLICKED : 3, // props : { id : String }
	ANSWER_3_CLICKED : 4, // props : { id : String }
	ANSWER_4_CLICKED : 5, // props : { id : String }
	CONTINUE : 6,
    CUSTOM_EVENT : 7, // props : { name : String }
    NEXT : 8, // props : { id : String }
    BACK : 9 // props : { id : String }
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
