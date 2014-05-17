/* Global quest script consts */
_UI_STAGE_ACTION_IN = {};
_UI_STAGE_ACTION_IN.ACTION_TYPES = {
	PLAYER_CLICKED : "PLAYER_CLICKED",
	NPC_CLICKED : "NPC_CLICKED",
	ANSWER1_CLICKED : "ANSWER1_CLICKED",
	ANSWER2_CLICKED : "ANSWER2_CLICKED",
	ANSWER3_CLICKED : "ANSWER3_CLICKED",
	ANSWER4_CLICKED : "ANSWER4_CLICKED",
	CONTINUE : "CONTINUE",
    CUSTOM_EVENT : "CUSTOM_EVENT",
    NEXT : "NEXT"
};
_UI_STAGE_ACTION_IN.ACTION_TYPES_SET = {};
$.each(_UI_STAGE_ACTION_IN.ACTION_TYPES, function(name, value) {
	_UI_STAGE_ACTION_IN.ACTION_TYPES_SET[value] = true;
});

//=============================

_UI_STAGE_ACTION_OUT = {};
_UI_STAGE_ACTION_OUT.ACTION_TYPES = {
	NONE : "NONE",
	PHRASE : "PHRASE",
	QUIZ : "QUIZ",
	ANIMATION : "ANIMATION",
	STAGE_CLEAR : "STAGE_CLEAR",
	DELAY : "DELAY",
    FUNC_CALL : "FUNC_CALL"
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
