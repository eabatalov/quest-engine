function QRActionExecJS() {
    this.jsNodeExecutor = new QuestScriptNodeExecJS();
    this.execEnv = new QuestScriptNodeExecJSEnv();
}

QRActionExecJS.prototype.exec = function(qrAction, uiStageActionOut) {
    this.execEnv.isReverseExec = qrAction.getIsReverse();

    if (qrAction.getType() === _QR_ACTION_TYPES.FUNC_CALL &&
        qrAction.source === SEFuncCallNode.sources.js) {
        this.jsNodeExecutor.jsFuncExec(
            qrAction.name,
            qrAction.source,
            qrAction.params,
            this.execEnv
        );
        uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
        uiStageActionOut.setHasNext(qrAction.getHasNext() ? 1 : 0);
        uiStageActionOut.setCanReverse(qrAction.getCanReverse() ? 1 : 0);
        uiStageActionOut.setContinuation(qrAction.getContinuation());
        return true;
    } else return false;
};
