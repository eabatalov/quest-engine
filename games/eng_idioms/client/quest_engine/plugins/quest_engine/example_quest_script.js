//Quest specific consts
_DEMO_QUEST_SITUATION1 = "Stage1";
_DEMO_QUEST_SITUATION1_NPC1_ID = "odnako0";
_DEMO_QUEST_SITUATION1_NPC2_ID = "1blahblah";
_DEMO_QUEST_SITUATION1_NPC3_ID = "2blahblah2";
_DEMO_QUEST_SITUATION2 = "Stage2";
_DEMO_QUEST_SITUATION2_NPC1_ID = "0";

function getQuestScript() {
	var uiActionNone = new QuestUIAction(_QUEST_UI_ACTION_NONE);

	var stage1Node = new QuestNode(_QUEST_NODE_STAGE, uiActionNone, [],
		{ name : _DEMO_QUEST_SITUATION1 });
	var stage1StoryLinePlayerNPC2 = new QuestNode(_QUEST_NODE_STORYLINE, uiActionNone, [],
		{ objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION1_NPC2_ID] });
	var stage1StoryLineNPC1NPC3 = new QuestNode(_QUEST_NODE_STORYLINE, uiActionNone, [],
		{ objs : [_DEMO_QUEST_SITUATION1_NPC1_ID, _DEMO_QUEST_SITUATION1_NPC3_ID] });
	$.merge(stage1Node.next, [stage1StoryLinePlayerNPC2, stage1StoryLineNPC1NPC3]);

	var stage1StoryLinePlayerNPC2TransferNode =
		new QuestNode(_QUEST_NODE_TRANSFER, uiActionNone, [stage1StoryLinePlayerNPC2]);
	$.merge(stage1StoryLinePlayerNPC2.next, [
		new QuestNode(_QUEST_NODE_OBJECT_CLICKED,
			new QuestUIAction(_QUEST_UI_ACTION_PHRASE, false, { id : _QUEST_PLAYER_ID, text : "Hi!" }),
			[
				stage1StoryLinePlayerNPC2
			], { id : _QUEST_PLAYER_ID }),

		new QuestNode(_QUEST_NODE_OBJECT_CLICKED,
			new QuestUIAction(_QUEST_UI_ACTION_QUIZ, false,
				{ id : _DEMO_QUEST_SITUATION1_NPC2_ID, text : "NPC " + _DEMO_QUEST_SITUATION1_NPC2_ID + " quiz!",
					ans : ["Answer1", "Answer2", "Answer3", "Answer4"]
				}),
			[
				new QuestNode(_QUEST_NODE_ANSWER_1_CLICKED,
					new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
						{
							id : _DEMO_QUEST_SITUATION1_NPC2_ID,
							text : "Ok, you said 1",
						}),
					[stage1StoryLinePlayerNPC2TransferNode]),

				new QuestNode(_QUEST_NODE_ANSWER_2_CLICKED,
					new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
						{
							id : _DEMO_QUEST_SITUATION1_NPC2_ID,
							text : "Ok, you said 2",
						}),
					[stage1StoryLinePlayerNPC2TransferNode]),

				new QuestNode(_QUEST_NODE_ANSWER_3_CLICKED,
					new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
						{
							id : _DEMO_QUEST_SITUATION1_NPC2_ID,
							text : "Ok, you said 3",
						}),
					[stage1StoryLinePlayerNPC2TransferNode]),

				new QuestNode(_QUEST_NODE_ANSWER_4_CLICKED,
					new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
						{
							id : _DEMO_QUEST_SITUATION1_NPC2_ID,
							text : "Ok, you said 4",
						}),
					[stage1StoryLinePlayerNPC2TransferNode])

			], { id : _DEMO_QUEST_SITUATION1_NPC1_ID })
	]);

	$.merge(stage1StoryLineNPC1NPC3.next, [
		new QuestNode(_QUEST_NODE_OBJECT_CLICKED,
			new QuestUIAction(_QUEST_UI_ACTION_ANIMATION, true,
				{ id : _DEMO_QUEST_SITUATION1_NPC1_ID, name : "DemoAnimation" }),
			[
				new QuestNode(_QUEST_NODE_CONTINUE,
					new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
						{ id : _DEMO_QUEST_SITUATION1_NPC3_ID, text : "What da fuck?!" }),
					[
						new QuestNode(_QUEST_NODE_CONTINUE,
							new QuestUIAction(_QUEST_UI_ACTION_WAIT, true,
								{ secs : 5 }),
							[
								new QuestNode(_QUEST_NODE_CONTINUE,
									new QuestUIAction(_QUEST_UI_ACTION_STAGE_CLEAR, true),
									[
										new QuestNode(_QUEST_NODE_TRANSFER, uiActionNone,
											[stage1StoryLineNPC1NPC3])
									])
							])
					])
			], { id : _DEMO_QUEST_SITUATION1_NPC1_ID })
	]);

	var stage2Node = new QuestNode(_QUEST_NODE_STAGE, uiActionNone, [],
		{ name : _DEMO_QUEST_SITUATION2 });
	var stage2StoryLinePlayerNPC1 = new QuestNode(_QUEST_NODE_STORYLINE, uiActionNone, [],
		{ objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION2_NPC1_ID] });
	$.merge(stage2Node.next, [stage2StoryLinePlayerNPC1]);

	var stage2PlayerPhraseUIAction = new QuestUIAction(_QUEST_UI_ACTION_PHRASE, true,
		{ id : _QUEST_PLAYER_ID, text: "I don't wanna interact with this strange guy!" });
	var stage2StoryLinePlayerNPC1TransferNode = new QuestNode(_QUEST_NODE_TRANSFER,
		uiActionNone, [stage2StoryLinePlayerNPC1]);
	$.merge(stage2StoryLinePlayerNPC1.next, [
		new QuestNode(_QUEST_NODE_OBJECT_CLICKED, stage2PlayerPhraseUIAction,
			[stage2StoryLinePlayerNPC1TransferNode], { id : _QUEST_PLAYER_ID }),
		new QuestNode(_QUEST_NODE_OBJECT_CLICKED, stage2PlayerPhraseUIAction,
			[stage2StoryLinePlayerNPC1TransferNode], { id : _DEMO_QUEST_SITUATION2_NPC1_ID})
	]);

	return new QuestScript([stage1Node, stage2Node]);
}