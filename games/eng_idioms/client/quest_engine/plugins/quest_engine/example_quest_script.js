//Quest specific consts
_DEMO_QUEST_SITUATION1 = "Stage1";
_DEMO_QUEST_SITUATION1_NPC1_ID = "odnako0";
_DEMO_QUEST_SITUATION1_NPC2_ID = "1blahblah";
_DEMO_QUEST_SITUATION1_NPC3_ID = "2blahblah2";
_DEMO_QUEST_SITUATION2 = "Stage2";
_DEMO_QUEST_SITUATION2_NPC1_ID = "0";

function getQuestScript() {
	var stage1Node =
		new QuestNode(_QUEST_NODE_STAGE, false, { name : _DEMO_QUEST_SITUATION1 }, []);

	var stage1StoryLinePlayerNPC2Cond = new QuestCond(_QUEST_COND_NONE, null,
		new QuestNode(_QUEST_NODE_STORYLINE, false,
			{ objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION1_NPC2_ID] }, [])
	);
	var stage1StoryLineNPC1NPC3Cond = new QuestCond(_QUEST_COND_NONE, null,
		new QuestNode(_QUEST_NODE_STORYLINE, false,
			{ objs : [_DEMO_QUEST_SITUATION1_NPC1_ID, _DEMO_QUEST_SITUATION1_NPC3_ID] }, [])
	);
	$.merge(stage1Node.conds, [stage1StoryLinePlayerNPC2Cond, stage1StoryLineNPC1NPC3Cond]);

	$.merge(stage1StoryLinePlayerNPC2Cond.node.conds, [
		new QuestCond(_QUEST_COND_OBJECT_CLICKED, { id : _QUEST_PLAYER_ID },
			new QuestNode(_QUEST_NODE_PHRASE, false, { id : _QUEST_PLAYER_ID, text : "Hi!" },
				[stage1StoryLinePlayerNPC2Cond])
			),

		new QuestCond(_QUEST_COND_OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION1_NPC2_ID },
			new QuestNode(_QUEST_NODE_QUIZ, false,
				{ id : _DEMO_QUEST_SITUATION1_NPC2_ID, text : "NPC " + _DEMO_QUEST_SITUATION1_NPC2_ID + " quiz!",
					ans : ["Answer1", "Answer2", "Answer3", "Answer4"]
				},
				[
					new QuestCond(_QUEST_COND_ANSWER_1_CLICKED, null,
						new QuestNode(_QUEST_NODE_PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 1",
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_COND_ANSWER_2_CLICKED, null,
						new QuestNode(_QUEST_NODE_PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 2",
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_COND_ANSWER_3_CLICKED, null,
						new QuestNode(_QUEST_NODE_PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 3",
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_COND_ANSWER_4_CLICKED, null,
						new QuestNode(_QUEST_NODE_PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 4",
							}, [stage1StoryLinePlayerNPC2Cond])
						)
				])
			)
	]);

	$.merge(stage1StoryLineNPC1NPC3Cond.node.conds, [
		new QuestCond(_QUEST_COND_OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION1_NPC1_ID },
			new QuestNode(_QUEST_NODE_ANIM, true,
				{ id : _DEMO_QUEST_SITUATION1_NPC1_ID, name : "DemoAnimation" },
				[
					new QuestCond(_QUEST_COND_CONTINUE, null,
						new QuestNode(_QUEST_NODE_PHRASE, true,
							{ id : _DEMO_QUEST_SITUATION1_NPC3_ID, text : "What da fuck?!" },
							[
								new QuestCond(_QUEST_COND_CONTINUE,
									new QuestNode(_QUEST_NODE_WAIT, true,
										{ secs : 5 },
										[
											new QuestCond(_QUEST_COND_CONTINUE,
												new QuestNode(_QUEST_NODE_STAGE_CLEAR, false,
													[
														stage1StoryLineNPC1NPC3Cond
													])
												)
										])
									)
							])
						)
				])
			)
	]);

	var stage2Node = new QuestNode(_QUEST_NODE_STAGE, false, { name : _DEMO_QUEST_SITUATION2 }, []);
	var stage2StoryLinePlayerNPC1Cond = new QuestCond(_QUEST_COND_NONE, null,
		new QuestNode(_QUEST_NODE_STORYLINE, false, { objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION2_NPC1_ID] }, [])
	);
	$.merge(stage2Node.conds, [stage2StoryLinePlayerNPC1Cond]);

	var stage2PlayerPhraseNode = new QuestNode(_QUEST_NODE_PHRASE, false,
		{ id : _QUEST_PLAYER_ID, text: "I don't wanna interact with this strange guy!" },
		[stage2StoryLinePlayerNPC1Cond]);
	$.merge(stage2StoryLinePlayerNPC1Cond.node.conds, [
		new QuestCond(_QUEST_COND_OBJECT_CLICKED, { id : _QUEST_PLAYER_ID }, [stage2PlayerPhraseNode]),
		new QuestCond(_QUEST_COND_OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION2_NPC1_ID}, [stage2PlayerPhraseNode])
	]);

	return new QuestScript([stage1Node, stage2Node]);
}