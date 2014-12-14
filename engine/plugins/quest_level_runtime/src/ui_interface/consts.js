/* Global quest script consts */
_UI_STAGE_ACTION_IN = {};
_UI_STAGE_ACTION_IN.ACTION_TYPES = {
	PLAYER_CLICKED : "PLAYER_CLICKED",
	NPC_CLICKED : "NPC_CLICKED",
	ANSWER1_CLICKED : "ANSWER1_CLICKED",
	ANSWER2_CLICKED : "ANSWER2_CLICKED",
	ANSWER3_CLICKED : "ANSWER3_CLICKED",
	ANSWER4_CLICKED : "ANSWER4_CLICKED",
    CUSTOM_EVENT : "CUSTOM_EVENT",
    NEXT : "NEXT",
    BACK : "BACK",
    RECALL_LAST_UI_CMD : "RECALL_LAST_UI_CMD"
};
_UI_STAGE_ACTION_IN.ACTION_TYPES_SET = {};
$.each(_UI_STAGE_ACTION_IN.ACTION_TYPES, function(name, value) {
	_UI_STAGE_ACTION_IN.ACTION_TYPES_SET[value] = true;
});

//=============================

_UI_STAGE_ACTION_OUT = {};
_UI_STAGE_ACTION_OUT.ACTION_TYPES = {
    CMD_SEQUENCE_STARTED : "CMD_SEQUENCE_STARTED",
    CMD_SEQUENCE_FINISHED : "CMD_SEQUENCE_FINISHED",
	PHRASE : "PHRASE",
	QUIZ : "QUIZ",
	ANIMATION : "ANIMATION",
	STAGE_CLEAR : "STAGE_CLEAR",
    FUNC_CALL : "FUNC_CALL",
    NOTIFICATION : "NOTIFICATION",
    PLAYER_MOVEMENT : "PLAYER_MOVEMENT",
    NO_UI_ACTION_REQUIRED : "NO_UI_ACTION_REQUIRED"
};

_UI_STAGE_ACTION_OUT.ACTION_TYPES_SET = {};
$.each(_UI_STAGE_ACTION_OUT.ACTION_TYPES, function(name, value) {
	_UI_STAGE_ACTION_OUT.ACTION_TYPES_SET[value] = true;
});

_UI_STAGE_ACTION_OUT.ACTORS = {
	PLAYER : "PLAYER",
	NPC : "NPC"
};

_UI_STAGE_ACTION_OUT.ACTORS_SET = {};
$.each(_UI_STAGE_ACTION_OUT.ACTORS, function(name, value) {
	_UI_STAGE_ACTION_OUT.ACTORS_SET[value] = true;
});

_UI_STAGE_ACTION_OUT.PHRASE_TYPES = {
	SPEAK : "SPEAK",
	THINK : "THINK"
};

_UI_STAGE_ACTION_OUT.PHRASE_TYPES_SET = {};
$.each(_UI_STAGE_ACTION_OUT.PHRASE_TYPES, function(name, value) {
	_UI_STAGE_ACTION_OUT.PHRASE_TYPES_SET[value] = true;
});

_UI_STAGE_ACTION_OUT.PHRASE_SIZES = {
	SMALL : "SMALL",
	MEDIUM : "MEDIUM",
    LARGE : "LARGE"
};

_UI_STAGE_ACTION_OUT.PHRASE_SIZES_SET = {};
$.each(_UI_STAGE_ACTION_OUT.PHRASE_SIZES, function(name, value) {
	_UI_STAGE_ACTION_OUT.PHRASE_SIZES_SET[value] = true;
});
