//API for javascript based quest scripting
_QUEST_NODES = {
	NONE : -1, //For sequnce of events. Do nothing in this node.
	PHRASE : 1, // priv : { id : String, text : String }
	QUIZ : 3, // priv : { id : String, text : String, ans : [String] }
	ANIM : 5, // priv : { id : String, name : String }
	WAIT : 6, // priv : { secs : int }
	STAGE_CLEAR : 7,
	STORYLINE : 8, // priv : { objs : [/*id*/String] }
	STAGE : 9 // priv : { name : String }
};
_QUEST_NODES_SET = {};
$.each(_QUEST_NODES, function(name, value) {
	_QUEST_NODES_SET[value] = true;
});

function QuestNode(/* _QUEST_NODES.* */ type, isContinue, priv, /* [QuestCond] */ conds) {
	this.type = type;
	this.conds = conds;
	this.priv = priv;
	this.continue = isContinue;
}

_QUEST_NODE_NONE_INSTANCE = new QuestNode(_QUEST_NODES.NONE, false, null, []);

//If there is no match for current event we go this edge doesn't consume
//the event. Should be used for special nodes only.
_QUEST_CONDS = {
	NONE : 1,
	//All the next consume current event
	OBJECT_CLICKED : 2, // priv : { id : String }
	ANSWER_1_CLICKED : 3,
	ANSWER_2_CLICKED : 4,
	ANSWER_3_CLICKED : 5,
	ANSWER_4_CLICKED : 6,
	ANSWER_OTHER_CLICKED : 7,
	CONTINUE : 8,
//Go by this edge if no match for current event. Current event is consumed.
	DEFAULT : 9
};
_QUEST_CONDS_SET = {};
$.each(_QUEST_CONDS, function(name, value) {
	_QUEST_CONDS_SET[value] = true;
});

function QuestCond(/* _QUEST_CONDS.* */ type, priv, /*QuestNode */ node) {
	this.type = type;
	this.node = node; //Node which will be picked if cond is met
	this.priv = (priv !== null && priv !== undefined) ?
            priv : null;
	showValidationErrorIf(type === null || type === undefined, "Quest cond type should be defined");
	/* Commented this to simplify tree code generation in compiler
	 * showValidationErrorIf(node === null || node === undefined, "Quest cond node should be defined");
	 */
}

function QuestScript(/*[ _QUEST_NODES.STAGE ]*/ questStageNodes) {
	var script = this;
	script.stages = {};
	$.each(questStageNodes, function(index, stage) {
		script.stages[stage.priv.name] = stage;
	});
}

_QUEST_PLAYER_ID = "Player";
/*
 * Your game script should define function getQuestScript()
 * which should return QuestScript instance of your quest.
 */
