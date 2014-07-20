function QRActionExecJS() {
    this.jsNodeExecutor = new QuestScriptNodeExecJS();
    this.execEnv = new QuestScriptNodeExecJSEnv();
}

QRActionExecJS.prototype.exec = function(qrAction, uiStageActionOut) {
    this.execEnv.isRollbackExec = qrAction.getIsRollback();

    if (qrAction.getType() === _QR_ACTION_TYPES.FUNC_CALL &&
        qrAction.source === SEFuncCallNode.sources.js) {
        this.jsNodeExecutor.jsFuncExec(
            qrAction.name,
            qrAction.rollbackName,
            qrAction.source,
            qrAction.params,
            this.execEnv
        );
        uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
        uiStageActionOut.setHasNext(qrAction.getHasNext() ? 1 : 0);
        uiStageActionOut.setHasBack(qrAction.getCanRollback() ? 1 : 0);
        uiStageActionOut.setIsContinue(qrAction.getContinue() ? 1 : 0);
        return true;
    } else return false;
};
