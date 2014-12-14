function UIStageActionOut() {
    this.clearFields();
};

UIStageActionOut.prototype.clearFields = function() {
    this.stageName = "";
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
    this.phraseSize = "";

    this.durationSec = 0;

    this.funcName = "";
    this.enabled = 0; // 0 or 1
    this.hasNext = 0; //0 or 1
    this.canReverse = 0; //0 or 1
    this.allowAnimated = 0; //0 or 1
    this.clearStage = 0;
};

UIStageActionOut.prototype.getStageName = function() {
    return this.stageName;
};

UIStageActionOut.prototype.setStageName = function(stageName) {
    this.stageName = stageName;
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

UIStageActionOut.prototype.setPhraseSize = function(phraseSize) {
    this.phraseSize = phraseSize;
};

UIStageActionOut.prototype.getPhraseSize = function() {
    return this.phraseSize;
};

UIStageActionOut.prototype.setDurationSec = function(durationSec) {
    this.durationSec = durationSec;
};

UIStageActionOut.prototype.getDurationSec = function() {
    return this.durationSec;
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

UIStageActionOut.prototype.setAllowAnimated = function(allowAnimated) {
    this.allowAnimated = allowAnimated;
};

UIStageActionOut.prototype.getAllowAnimated = function() {
    return this.allowAnimated;
};

UIStageActionOut.prototype.setClearStage = function(clearStage) {
    this.clearStage = clearStage;
};

UIStageActionOut.prototype.getClearStage = function() {
    return this.clearStage;
};

UIStageActionOut.prototype.toString = function() {
    return JSON.stringify(this, null, '\t');
};

UIStageActionOut.prototype.fillFromQRAction = function(qrAction, npcUID) {
    var setActorInfo = false;
	switch(qrAction.getType()) {
		case _QR_ACTION_TYPES.PHRASE:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE);
			this.setText(qrAction.text);
			this.setPhraseType(qrAction.phraseType);
            this.setPhraseSize(qrAction.phraseSize);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.QUIZ:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ);
			this.setText(qrAction.text);
			this.setPhraseType(qrAction.phraseType);
            this.setPhraseSize(qrAction.phraseSize);
            this.setAnswer1Text(qrAction.ans1);
            this.setAnswer2Text(qrAction.ans2);
            this.setAnswer3Text(qrAction.ans3);
            this.setAnswer4Text(qrAction.ans4);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.ANIM:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.ANIMATION);
			this.setAnimationName(qrAction.name);
			this.setDurationSec(qrAction.secs);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.STAGE_CLEAR:
			this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
            this.setAllowAnimated(1);
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
        case _QR_ACTION_TYPES.CMD_SEQUENCE_STARTED:
            this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.CMD_SEQUENCE_STARTED);
        break;
        case _QR_ACTION_TYPES.CMD_SEQUENCE_FINISHED:
            this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.CMD_SEQUENCE_FINISHED);
        break;
        case _QR_ACTION_TYPES.NO_ACTION:
            this.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NO_UI_ACTION_REQUIRED);
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
			    npcUID(qrAction.getStageName(), qrAction.id)
                : null
        );
	}
    this.setStageName(qrAction.getStageName());
    this.setHasNext(qrAction.getHasNext() ? 1 : 0);
    this.setCanReverse(qrAction.getCanReverse() ? 1 : 0);
    this.setClearStage(qrAction.getClearStage() ? 1 : 0);
};
