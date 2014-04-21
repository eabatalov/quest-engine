//Quest specific consts
_DEMO_QUEST_SITUATION1 = "Stage1";
_DEMO_QUEST_SITUATION1_NPC1_ID = "firstLantern";
_DEMO_QUEST_SITUATION1_NPC2_ID = "secondLantern";
_DEMO_QUEST_SITUATION1_NPC3_ID = "older";
_DEMO_QUEST_SITUATION2 = "Stage1";
_DEMO_QUEST_SITUATION2_NPC1_ID = "0";

function getQuestScript() {
	var stage1Node =
		new QuestNode(_QUEST_NODES.STAGE, false, { name : _DEMO_QUEST_SITUATION1 }, []);

	var stage1StoryLinePlayerNPC2Cond = new QuestCond(_QUEST_CONDS.NONE, null,
		new QuestNode(_QUEST_NODES.STORYLINE, false,
			{ objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION1_NPC2_ID] }, [])
	);
	var stage1StoryLineNPC1NPC3Cond = new QuestCond(_QUEST_CONDS.NONE, null,
		new QuestNode(_QUEST_NODES.STORYLINE, false,
			{ objs : [_DEMO_QUEST_SITUATION1_NPC1_ID, _DEMO_QUEST_SITUATION1_NPC3_ID] }, [])
	);
	$.merge(stage1Node.conds, [stage1StoryLinePlayerNPC2Cond, stage1StoryLineNPC1NPC3Cond]);

	$.merge(stage1StoryLinePlayerNPC2Cond.node.conds, [
		new QuestCond(_QUEST_CONDS.OBJECT_CLICKED, { id : _QUEST_PLAYER_ID },
			new QuestNode(_QUEST_NODES.PHRASE, false, { id : _QUEST_PLAYER_ID, text : "I know nothing, Jon Snow", phraseType : _UI_PHRASE_TYPE_SPEAK },
				[stage1StoryLinePlayerNPC2Cond])
			),   

		new QuestCond(_QUEST_CONDS.OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION1_NPC2_ID },
			new QuestNode(_QUEST_NODES.QUIZ, false,
				{ id : _DEMO_QUEST_SITUATION1_NPC2_ID, text : _DEMO_QUEST_SITUATION1_NPC2_ID + ": What size are a your girl's boobs?!",
					ans : ["WOW", "Not Bad!", "OMG", "WTF"],
					phraseType : _UI_PHRASE_TYPE_SPEAK
				},
				[
					new QuestCond(_QUEST_CONDS.ANSWER_1_CLICKED, null,
						new QuestNode(_QUEST_NODES.PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 1",
								phraseType : _UI_PHRASE_TYPE_SPEAK
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_CONDS.ANSWER_2_CLICKED, null,
						new QuestNode(_QUEST_NODES.PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 2",
								phraseType : _UI_PHRASE_TYPE_SPEAK
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_CONDS.ANSWER_3_CLICKED, null,
						new QuestNode(_QUEST_NODES.PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 3",
								phraseType : _UI_PHRASE_TYPE_SPEAK
							}, [stage1StoryLinePlayerNPC2Cond])
						),

					new QuestCond(_QUEST_CONDS.ANSWER_4_CLICKED, null,
						new QuestNode(_QUEST_NODES.PHRASE, false,
							{
								id : _DEMO_QUEST_SITUATION1_NPC2_ID,
								text : "Ok, you said 4",
								phraseType : _UI_PHRASE_TYPE_SPEAK
							}, [stage1StoryLinePlayerNPC2Cond])
						)
				])
			)
	]);

	$.merge(stage1StoryLineNPC1NPC3Cond.node.conds, [
		new QuestCond(_QUEST_CONDS.OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION1_NPC1_ID },
			new QuestNode(_QUEST_NODES.ANIM, true,
				{ id : _DEMO_QUEST_SITUATION1_NPC1_ID, name : "DemoAnimation" },
				[
					new QuestCond(_QUEST_CONDS.CONTINUE, null,
						new QuestNode(_QUEST_NODES.PHRASE, true,
							{ id : _DEMO_QUEST_SITUATION1_NPC3_ID,
								text : "My brake warning light is on.\nWhat does it mean?",
								phraseType : _UI_PHRASE_TYPE_SPEAK
							},
							[
								new QuestCond(_QUEST_CONDS.CONTINUE, null,
									new QuestNode(_QUEST_NODES.WAIT, true,
										{ secs : 5 },
										[
											new QuestCond(_QUEST_CONDS.CONTINUE, null,
												new QuestNode(_QUEST_NODES.ANIM, true,
													{ id : _DEMO_QUEST_SITUATION1_NPC1_ID, name : "NPCYellow" },
													[
														new QuestCond(_QUEST_CONDS.CONTINUE, null,
															new QuestNode(_QUEST_NODES.STAGE_CLEAR, false, null,
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
				])
			)
	]);

	var stage2Node = new QuestNode(_QUEST_NODES.STAGE, false, { name : _DEMO_QUEST_SITUATION2 }, []);
	var stage2StoryLinePlayerNPC1Cond = new QuestCond(_QUEST_CONDS.NONE, null,
		new QuestNode(_QUEST_NODES.STORYLINE, false, { objs : [_QUEST_PLAYER_ID, _DEMO_QUEST_SITUATION2_NPC1_ID] }, [])
	);
	$.merge(stage2Node.conds, [stage2StoryLinePlayerNPC1Cond]);

	var stage2PlayerPhraseNode = new QuestNode(_QUEST_NODES.PHRASE, false,
		{ id : _QUEST_PLAYER_ID, text: "I don't wanna interact with this strange guy!", phraseType : _UI_PHRASE_TYPE_SPEAK },
		[stage2StoryLinePlayerNPC1Cond]);
	$.merge(stage2StoryLinePlayerNPC1Cond.node.conds, [
		new QuestCond(_QUEST_CONDS.OBJECT_CLICKED, { id : _QUEST_PLAYER_ID }, stage2PlayerPhraseNode),
		new QuestCond(_QUEST_CONDS.OBJECT_CLICKED, { id : _DEMO_QUEST_SITUATION2_NPC1_ID}, stage2PlayerPhraseNode)
	]);

	return new QuestScript([stage1Node, stage2Node]);
}
