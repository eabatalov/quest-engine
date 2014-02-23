//API for javascript based quest scripting
_QUEST_NODE_NONE = -1; //For sequnce of events. Do nothing in this node.
_QUEST_NODE_PHRASE = 1; // priv : { id : String, text : String }
_QUEST_NODE_QUIZ = 3; // priv : { id : String, text : String, ans : [String] }
_QUEST_NODE_ANIM = 5; // priv : { id : String, name : String }
_QUEST_NODE_WAIT = 6; // priv : { secs : int }
_QUEST_NODE_STAGE_CLEAR = 7;
_QUEST_NODE_STORYLINE = 8; // priv : { objs : [/*id*/String] }
_QUEST_NODE_STAGE = 9; // priv : { name : String }

function QuestNode(/* _QUEST_NODE_* */ type, isContinue, priv, /* [QuestCond] */ conds) {
	this.type = type;
	this.conds = conds;
	this.priv = priv;
	this.continue = isContinue;
}

_QUEST_NODE_NONE_INSTANCE = new QuestNode(_QUEST_NODE_NONE, false, null, []);

//If there is no match for current event we go this edge doesn't consume
//the event. Should be used for special nodes only.
_QUEST_COND_NONE = 1;
//All the next consume current event
_QUEST_COND_OBJECT_CLICKED = 2; // priv : { id : String }
_QUEST_COND_ANSWER_1_CLICKED = 3;
_QUEST_COND_ANSWER_2_CLICKED = 4;
_QUEST_COND_ANSWER_3_CLICKED = 5;
_QUEST_COND_ANSWER_4_CLICKED = 6;
_QUEST_COND_ANSWER_OTHER_CLICKED = 7;
_QUEST_COND_CONTINUE = 8;
//Go by this edge if no match for current event. Current event is consumed.
_QUEST_COND_DEFAULT = 9;

function QuestCond(/* _QUEST_COND_* */ type, priv, /*QuestNode */ node) {
	this.type = type;
	this.node = node; //Node which will be picked if cond is met
	this.priv = (priv !== null && priv !== undefined) ?
            priv : null;
	showValidationErrorIf(type === null || type === undefined, "Quest cond type should be defined");
	//showValidationErrorIf(node === null || node === undefined, "Quest cond node should be defined");
}

function QuestScript(/*[ _QUEST_NODE_STAGE ]*/ questStageNodes) {
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