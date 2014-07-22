function QRActionExecUI(npcUID) {
    this.npcUID = npcUID;
}

QRActionExecUI.prototype.exec = function(qrAction, uiStageActionOut) {
    this.qrActionToUIStageActionOut(qrAction, uiStageActionOut);
    return true;
};

QRActionExecUI.prototype.qrActionToUIStageActionOut =
function(qrAction, uiStageActionOut) {
    var setActorInfo = false;
	switch(qrAction.getType()) {
		case _QR_ACTION_TYPES.NONE:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
		break;
		case _QR_ACTION_TYPES.PHRASE:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PHRASE);
			uiStageActionOut.setText(qrAction.text);
			uiStageActionOut.setPhraseType(qrAction.phraseType);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.QUIZ:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.QUIZ);
			uiStageActionOut.setText(qrAction.text);
			uiStageActionOut.setPhraseType(qrAction.phraseType);
            uiStageActionOut.setAnswer1Text(qrAction.ans1);
            uiStageActionOut.setAnswer2Text(qrAction.ans2);
            uiStageActionOut.setAnswer3Text(qrAction.ans3);
            uiStageActionOut.setAnswer4Text(qrAction.ans4);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.ANIM:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.ANIMATION);
			uiStageActionOut.setAnimationName(qrAction.name);
			setActorInfo = true;
		break;
		case _QR_ACTION_TYPES.WAIT:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.DELAY);
			uiStageActionOut.setDelaySec(qrAction.secs);
		break;
		case _QR_ACTION_TYPES.STAGE_CLEAR:
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.STAGE_CLEAR);
		break;
		case _QR_ACTION_TYPES.FUNC_CALL:
            if (qrAction.source === SEFuncCallNode.sources.c2) {
			    uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.FUNC_CALL);
                var funcName = qrAction.name;
			    uiStageActionOut.setFuncName(funcName);
            } else {
                uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
            }
		break;
        case _QR_ACTION_TYPES.NOTIFICATION:
            uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NOTIFICATION);
            uiStageActionOut.setText(qrAction.text);
        break;
        case _QR_ACTION_TYPES.PLAYER_MOVEMENT:
            uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.PLAYER_MOVEMENT);
            uiStageActionOut.setEnabled(qrAction.enabled === true ? 1 : 0);
        break;
		default:
			console.error("Error. Invalid QRAction node type: " +
                qrAction.getType().toString());
			uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
	}

	if (setActorInfo) {
		uiStageActionOut.setActorType(
            qrAction.id === _QUEST_PLAYER_ID ? "PLAYER" : "NPC"
        );
		uiStageActionOut.setNPCActorUID(
            qrAction.id !== _QUEST_PLAYER_ID ?
			    this.npcUID(uiStageActionOut.getStageName(), qrAction.id)
                : null
        );
	}
    uiStageActionOut.setHasNext(qrAction.getHasNext() ? 1 : 0);
    uiStageActionOut.setCanReverse(qrAction.getCanReverse() ? 1 : 0);
    uiStageActionOut.setContinuation(qrAction.getContinuation());
};
