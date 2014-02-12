/* Similar to QuestCond*/
function QuestEvent(/* _QUEST_COND_* */ type, priv) {
	this.type = type;
	this.priv = (priv !== null && priv !== undefined) ? priv : null;
}

function QuestInterpretator(questScript) {
	/* Can't dump cause questScript is circular now.
		alert(JSON.stringify(this.questScript));
	*/
	this.questScript = questScript;
}

QuestInterpretator.prototype.step = function(/* string */ stageName, /* QuestEvent */ questEvent) {
	return null;
}

QuestInterpretator.prototype.node = function(/* string */ stageName) {
	return this.questScript[stageName];
}