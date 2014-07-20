//API for javascript based quest scripting
_QUEST_NODES = {
	NONE : -1, //For sequnce of events. Do nothing in this node.
	PHRASE : 1, /* priv : {
        id : String, text : String,
        phraseType : _QUEST_PHRASE_TYPES 
    } */
	QUIZ : 3, /* priv : {
        id : String, text : String, ans1 : String,
        ans2 : String, ans3 : String, ans4 : String
    } */
	ANIM : 5, // priv : { id : String, name : String }
	WAIT : 6, // priv : { secs : int }
	STAGE_CLEAR : 7,
	STORYLINE : 8, // priv : { objs : [/*id*/String] }
	STAGE : 9, // priv : { name : String }
    FUNC_CALL : 10, /* priv : {
        name : String, rollbackName : String,
        source : SEFuncCallNode.sources, params : [SEFuncCallNodeParameter]
    } */
    NOTIFICATION : 11, // priv : { text : String }
    PLAYER_MOVEMENT : 12 // priv : { enabled : bool }
};
_QUEST_NODES_SET = {};
$.each(_QUEST_NODES, function(name, value) {
	_QUEST_NODES_SET[value] = true;
});

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
	CONTINUE : 8, //Automatical continuation of script execution
//Go by this edge if no match for current event. Current event is consumed.
	DEFAULT : 9,
    CUSTOM_EVENT : 10,//priv : { name : String }
    NEXT : 11, //Not automatical "CONTINUE" usually requested by player
    LAST : 12 //Helper value. Don't use it in persistent data. It may change!!!
};
_QUEST_CONDS_SET = {};
$.each(_QUEST_CONDS, function(name, value) {
	_QUEST_CONDS_SET[value] = true;
});

_QUEST_PLAYER_ID = "Player";

_QUEST_PHRASE_TYPES = {
	SPEAK : "SPEAK",
	THINK : "THINK"
};
