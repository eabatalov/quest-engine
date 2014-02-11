//API for javascript based quest scripting
_QUEST_UI_ACTION_NONE = -1;
_QUEST_UI_ACTION_PHRASE = 1; // priv : { id : String, text : String }
_QUEST_UI_ACTION_QUIZ = 3; // priv : { id : String, text : String, ans : [String] }
_QUEST_UI_ACTION_ANIMATION = 5; // priv : { id : String, name : String }
_QUEST_UI_ACTION_WAIT = 6; // priv : { secs : int }
_QUEST_UI_ACTION_STAGE_CLEAR = 7;

function QuestUIAction(type, isContinue, priv) {
	this.type = type;
	this.priv = (priv !== null && priv !== undefined) ?
		priv : null;
	this.continue = (isContinue !== null && isContinue !== undefined) ?
		isContinue : false;
}

_QUEST_NODE_STAGE = -2; // priv : { name : String }
_QUEST_NODE_STORYLINE = -1; // priv : { objs : [/*id*/String] }
_QUEST_NODE_OBJECT_CLICKED = 2; // priv : { id : String }
_QUEST_NODE_ANSWER_1_CLICKED = 3;
_QUEST_NODE_ANSWER_2_CLICKED = 4;
_QUEST_NODE_ANSWER_3_CLICKED = 5;
_QUEST_NODE_ANSWER_4_CLICKED = 6;
_QUEST_NODE_ANSWER_OTHER_CLICKED = 7;
_QUEST_NODE_CONTINUE = 8;
_QUEST_NODE_DEFAULT = 9;
_QUEST_NODE_TRANSFER = 10;

function QuestNode(/* _QUEST_NODE_* */ type, /*QuestUIAction* */ action, /*[QuestNode*]*/ next, priv) {
	this.type = type;
	this.action = action;
	this.priv = (priv !== null && priv !== undefined) ?
		priv : null;
	this.next = (next !== null && next !== undefined) ?
		next : null;
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