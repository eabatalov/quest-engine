//API for javascript based quest scripting
_QUEST_NODE_NONE = -1;
_QUEST_NODE_PHRASE = 1; // priv : { id : String, text : String }
_QUEST_NODE_QUIZ = 3; // priv : { id : String, text : String, ans : [String] }
_QUEST_NODE_ANIM = 5; // priv : { id : String, name : String }
_QUEST_NODE_WAIT = 6; // priv : { secs : int }
_QUEST_NODE_STAGE_CLEAR = 7;
_QUEST_NODE_STORYLINE = 8; // priv : { objs : [/*id*/String] }
_QUEST_NODE_STAGE = 9; // priv : { name : String }

function QuestNode(type, isContinue, priv, /* QuestCond */ conds) {
	this.type = type;
	this.conds = conds;
	this.priv = priv;
	this.continue = isContinue;
}

//Goes to condition node unconditionaly and doesn't consume current event
_QUEST_COND_NONE = 1;
//All the next consume current event
_QUEST_COND_OBJECT_CLICKED = 2; // priv : { id : String }
_QUEST_COND_ANSWER_1_CLICKED = 3;
_QUEST_COND_ANSWER_2_CLICKED = 4;
_QUEST_COND_ANSWER_3_CLICKED = 5;
_QUEST_COND_ANSWER_4_CLICKED = 6;
_QUEST_COND_ANSWER_OTHER_CLICKED = 7;
_QUEST_COND_CONTINUE = 8;
_QUEST_COND_DEFAULT = 9;

function QuestCond(/* _QUEST_COND_* */ type, priv, /*[QuestNode*]*/ node) {
	this.type = type;
	this.node = node; //Node which will be picked if cond is met
	this.priv = (priv !== null && priv !== undefined) ?
		priv : null;
}

function QuestScript(/*[ _QUEST_NODE_STAGE ]*/ questStageNodes) {
	var script = this;
	$.each(questStageNodes, function(index, stage) {
		script[stage.priv.name] = stage;
	});
}

_QUEST_PLAYER_ID = "Player";
/*
 * Your game script should define function getQuestScript()
 * which should return QuestScript instance of your quest.
 */