//Global quest script consts
_PLAYER_ACTIONS = {
	PLAYER_CLICKED : "PLAYER_CLICKED",
	NPC_CLICKED : "NPC_CLICKED",
	ANSWER1_CLICKED : "ANSWER1_CLICKED",
	ANSWER2_CLICKED : "ANSWER2_CLICKED",
	ANSWER3_CLICKED : "ANSWER3_CLICKED",
	ANSWER4_CLICKED : "ANSWER4_CLICKED",
	CONTINUE : "CONTINUE",
};

_PLAYER_ACTIONS_SET = {};
$.each(_PLAYER_ACTIONS, function(name, value) {
	_PLAYER_ACTIONS_SET[value] = true;
});
//=============================
_UI_ACTIONS = {
	NONE : "NONE",
	PHRASE : "PHRASE",
	QUIZ : "QUIZ",
	ANIMATION : "ANIMATION",
	STAGE_CLEAR : "STAGE_CLEAR",
	DELAY : "DELAY"
};

_UI_ACTIONS_SET = {};
$.each(_UI_ACTIONS, function(name, value) {
	_UI_ACTIONS_SET[value] = true;
});
//=============================
_UI_ACTORS = {
	PLAYER : "PLAYER",
	NPC : "NPC"
};

_UI_ACTORS_SET = {};
$.each(_UI_ACTORS, function(name, value) {
	_UI_ACTORS_SET[value] = true;
});
//=============================
_UI_PHRASE_TYPES = {
	SPEAK : "SPEAK",
	THINK : "THINK"
};

_UI_PHRASE_TYPES_SET = {};
$.each(_UI_PHRASE_TYPES, function(name, value) {
	_UI_PHRASE_TYPES_SET[value] = true;
});
//=============================
