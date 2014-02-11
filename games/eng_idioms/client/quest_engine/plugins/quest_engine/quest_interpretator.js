function QuestInterpretator(questScript) {
	/* Can't dump cause questScript is circular now.
		alert(JSON.stringify(this.questScript));
	*/
	this.questScript = questScript;
}

QuestInterpretator.prototype.Step = function(stageName, playerAction) {

}

QuestInterpretator.prototype.UIAction = function(stageName) {
	return null;
}