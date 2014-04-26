function UIStageActionOut(name) {
	this.stageName = name;
    this.clearFields();
};

UIStageActionOut.prototype.clearFields = function() {
    this.actor = "";
    this.action = "";
    this.npcActorUID = 0;

    this.animationName = "";

    this.text = "";
    this.answer1Text = "";
    this.answer2Text = "";
    this.answer3Text = "";
    this.answer4Text = "";
    this.phraseType = "";

    this.delay = 0;
    this.continue = 0;
};

UIStageActionOut.prototype.setActorType = function(actorType) {
    this.actor = actorType;
};

UIStageActionOut.prototype.getActorType = function() {
    return this.actor;
};

UIStageActionOut.prototype.setNPCActorUID = function(npcActorUID) {
    this.npcActorUID = npcActorUID;
};

UIStageActionOut.prototype.getNPCActorUID = function() {
    return this.npcActorUID;
};

UIStageActionOut.prototype.setActionType = function(actionType) {
    this.action = actionType;
};

UIStageActionOut.prototype.getActionType = function() {
    return this.action;
};

UIStageActionOut.prototype.setAnimationName = function(animName) {
    this.animationName = animName;
};

UIStageActionOut.prototype.getAnimationName = function() {
    return this.animationName
};

UIStageActionOut.prototype.setText = function(text) {
    this.text = text;
};

UIStageActionOut.prototype.getText = function() {
    return this.text;
};

UIStageActionOut.prototype.setAnswer1Text = function(text) {
    this.answer1Text = text;
};

UIStageActionOut.prototype.getAnswer1Text = function() {
    return this.answer1Text;
};

UIStageActionOut.prototype.setAnswer2Text = function(text) {
    this.answer2Text = text;
};

UIStageActionOut.prototype.getAnswer2Text = function() {
    return this.answer2Text;
};

UIStageActionOut.prototype.setAnswer1Text = function(text) {
    this.answer3Text = text;
};

UIStageActionOut.prototype.getAnswer3Text = function() {
    return this.answer3Text;
};

UIStageActionOut.prototype.setAnswer4Text = function(text) {
    this.answer4Text = text;
};

UIStageActionOut.prototype.getAnswer4Text = function() {
    return this.answer4Text;
};

UIStageActionOut.prototype.setPhraseType = function(phraseType) {
    this.phraseType = phraseType;
};

UIStageActionOut.prototype.getPhraseType = function() {
    return this.phraseType;
};

UIStageActionOut.prototype.setDelaySec = function(delaySec) {
    this.delay = delaySec;
};

UIStageActionOut.prototype.getDelaySec = function() {
    return this.delay;
};

UIStageActionOut.prototype.setIsContinue = function(isContinue) {
    this.continue = isContinue;
};

UIStageActionOut.prototype.getIsContinue = function() {
    return this.continue;
};
