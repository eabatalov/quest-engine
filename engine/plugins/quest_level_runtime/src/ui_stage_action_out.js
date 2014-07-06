function UIStageActionOut(name) {
	this.stageName = name;
    this.clearFields();
};

UIStageActionOut.prototype.clearFields = function() {
    this.actorType = "";
    this.actionType = "";
    this.npcActorUID = 0;

    this.animationName = "";

    this.text = "";
    this.answer1Text = "";
    this.answer2Text = "";
    this.answer3Text = "";
    this.answer4Text = "";
    this.phraseType = "";

    this.delaySec = 0;
    this.isContinue = 0; //0 or 1

    this.funcName = "";
    this.enabled = 0; // 0 or 1
    this.hasNext = 0; //0 or 1
};

UIStageActionOut.prototype.getStageName = function() {
    return this.stageName;
};

UIStageActionOut.prototype.setActorType = function(actorType) {
    this.actorType = actorType;
};

UIStageActionOut.prototype.getActorType = function() {
    return this.actorType;
};

UIStageActionOut.prototype.setNPCActorUID = function(npcActorUID) {
    this.npcActorUID = npcActorUID;
};

UIStageActionOut.prototype.getNPCActorUID = function() {
    return this.npcActorUID;
};

UIStageActionOut.prototype.setActionType = function(actionType) {
    this.actionType = actionType;
};

UIStageActionOut.prototype.getActionType = function() {
    return this.actionType;
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

UIStageActionOut.prototype.setAnswer3Text = function(text) {
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
    this.delaySec = delaySec;
};

UIStageActionOut.prototype.getDelaySec = function() {
    return this.delaySec;
};

UIStageActionOut.prototype.setIsContinue = function(isContinue) {
    this.isContinue = isContinue;
};

UIStageActionOut.prototype.getIsContinue = function() {
    return this.isContinue;
};

UIStageActionOut.prototype.getFuncName = function() {
    return this.funcName;
};

UIStageActionOut.prototype.setFuncName = function(funcName) {
    this.funcName = funcName;
};

UIStageActionOut.prototype.getEnabled = function() {
    return this.enabled;
};

UIStageActionOut.prototype.setEnabled = function(enabled) {
    this.enabled = enabled;
};

UIStageActionOut.prototype.getHasNext = function() {
    return this.hasNext;
};

UIStageActionOut.prototype.setHasNext = function(hasNext) {
    this.hasNext = hasNext;
};

UIStageActionOut.prototype.toString = function() {
    return JSON.stringify(this, null, '\t');
};
