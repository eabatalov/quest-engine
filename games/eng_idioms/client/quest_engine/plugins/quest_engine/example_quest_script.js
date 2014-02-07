//Quest specific consts
_DEMO_QUEST_SITUATION1 = "Stage1";
_DEMO_QUEST_SITUATION1_NPC1_ID = "odnako0";
_DEMO_QUEST_SITUATION1_NPC2_ID = "1blahblah";
_DEMO_QUEST_SITUATION1_NPC3_ID = "2blahblah2";
_DEMO_QUEST_SITUATION2 = "Stage2";
_DEMO_QUEST_SITUATION2_NPC1_ID = "0";
//TODO Make cool script syntax
stage1npc1Cnt = 0;
function QuestStageActionExec(stageActCont, questEngine) {
	var curStageName = stageActCont.curStageName;
	var action = stageActCont.curStageAction();

	if (curStageName === _DEMO_QUEST_SITUATION1) {
		if (action.lastPlayerAction === _PLAYER_ACTION_PLAYER_AVATAR_CLICKED) {
			action.actorType = _ACTOR_TYPE_NPC;
			action.npcActorUID = questEngine.npcUID(curStageName, _DEMO_QUEST_SITUATION1_NPC2_ID);
			action.actionType = _ACTION_TYPE_QUIZ;
			action.text = "Player was clicked and NPC with id " +
				action.npcActorUID +" decided to ask a quiz.";
			action.answer1Text = "Answer 1";
			action.answer2Text = "Answer 2";
			action.answer3Text = "Answer 3";
			action.answer4Text = "Answer 4";
			action.rightAnswerIx = 3;
		} else if (action.lastPlayerAction === _PLAYER_ACTION_NPC_CLICKED) {
			if (action.lastActionTargetId === _DEMO_QUEST_SITUATION1_NPC1_ID) {
				if (stage1npc1Cnt === 0) {
					action.actorType = _ACTOR_TYPE_NPC;
					action.actionType = _ACTION_TYPE_ANIMATION;
					action.npcActorUID = questEngine.npcUID(curStageName, _DEMO_QUEST_SITUATION1_NPC1_ID);
					action.animationName = "DemoAnimation";
					action.continue = 1;
				} else if (stage1npc1Cnt === 1) {
					action.actionType = _ACTION_TYPE_DELAY;
					action.delay = 5;
					action.continue = 1;
				} else if (stage1npc1Cnt === 2) {
					action.actorType = _ACTOR_TYPE_NPC;
					action.actionType = _ACTION_TYPE_ANIMATION;
					action.npcActorUID = questEngine.npcUID(curStageName, _DEMO_QUEST_SITUATION1_NPC1_ID);
					action.animationName = "NPCYellow";
					action.continue = 1;
				} else { //3
					action.actionType = _ACTION_TYPE_NOP;
				}
				stage1npc1Cnt = (stage1npc1Cnt + 1) % 4;
			} else {
				action.actorType = _ACTOR_TYPE_NPC;
				action.npcActorUID = questEngine.npcUID(curStageName, action.lastActionTargetId);
				action.actionType = _ACTION_TYPE_PHRASE;
				action.text = "NPC " + action.npcActorUID + " was clicked and it decided to answer.";
			}
		} else if (action.lastPlayerAction === _PLAYER_ACTION_ANSWER_CLICKED) {
			action.actorType = _ACTOR_TYPE_NPC;
			action.npcActorUID = questEngine.npcUID(curStageName, _DEMO_QUEST_SITUATION1_NPC2_ID);
			action.actionType = _ACTION_TYPE_PHRASE;
			action.text = "Ok, you said " + action.lastActionTargetId;
		}
	} else if (curStageName === _DEMO_QUEST_SITUATION2) {
		action.actorType = _ACTOR_TYPE_PLAYER;
		action.actionType = _ACTION_TYPE_PHRASE;
		action.text = "I don't wanna interact with this strange guy!";
	} else {
		alert("Invalid stage name!!!");
	}
};