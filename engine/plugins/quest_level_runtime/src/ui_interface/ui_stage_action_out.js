function UIStageActionOut(stageName) {
	this.stageName = stageName;
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
    this.continuation = "";

    this.funcName = "";
    this.enabled = 0; // 0 or 1
    this.hasNext = 0; //0 or 1
    this.canReverse = 0; //0 or 1
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

UIStageActionOut.prototype.setContinuation = function(val) {
    this.continuation = val;
};

UIStageActionOut.prototype.getContinuation = function() {
    return this.continuation;
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

UIStageActionOut.prototype.getCanReverse = function() {
    return this.canReverse;
};

UIStageActionOut.prototype.setCanReverse = function(canReverse) {
    this.canReverse = canReverse;
};

UIStageActionOut.prototype.toString = function() {
    return JSON.stringify(this, null, '\t');
};

UIStageActionOut.prototype.fillFromQRAction = function(qrAction, npcUID) {
    var setActorInfo = false;
	switch(qrAction.getType()) {
		case _QR_ACTION_TYPES.NONE:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
		break;
		case _QR_ACTION_TYPES.PHRASE:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE);
			this.setText(qrAction.text);
			this.setPhraseType(qrAction.phraseType);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.QUIZ:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ);
			this.setText(qrAction.text);
			this.setPhraseType(qrAction.phraseType);
            this.setAnswer1Text(qrAction.ans1);
            this.setAnswer2Text(qrAction.ans2);
            this.setAnswer3Text(qrAction.ans3);
            this.setAnswer4Text(qrAction.ans4);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.ANIM:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.ANIMATION);
			this.setAnimationName(qrAction.name);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.WAIT:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.DELAY);
			this.setDelaySec(qrAction.secs);
		break;
		case _QR_ACTION_TYPES.STAGE_CLEAR:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
		break;
		case _QR_ACTION_TYPES.FUNC_CALL:
            if (qrAction.source === SEFuncCallNode.sources.c2) {
			    this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.FUNC_CALL);
			    this.setFuncName(qrAction.name);
            } else {
                this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
            }
		break;
        case _QR_ACTION_TYPES.NOTIFICATION:
            this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NOTIFICATION);
            this.setText(qrAction.text);
        break;
        case _QR_ACTION_TYPES.PLAYER_MOVEMENT:
            this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PLAYER_MOVEMENT);
            this.setEnabled(qrAction.enabled === true ? 1 : 0);
        break;
		default:
			console.error("Error. Invalid QRAction node type: " +
                qrAction.getType().toString());
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
	}

	if (setActorInfo) {
		this.setActorType(
            qrAction.id === _QUEST_PLAYER_ID ? "PLAYER" : "NPC"
        );
		this.setNPCActorUID(
            qrAction.id !== _QUEST_PLAYER_ID ?
			    npcUID(this.getStageName(), qrAction.id)
                : null
        );
	}
    this.setHasNext(qrAction.getHasNext() ? 1 : 0);
    this.setCanReverse(qrAction.getCanReverse() ? 1 : 0);
    this.setContinuation(qrAction.getContinuation());
};
