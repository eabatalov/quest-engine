function QRActionExecJS() {
    this.jsNodeExecutor = new QuestScriptNodeExecJS();
    this.execEnv = new QuestScriptNodeExecJSEnv();
}

QRActionExecJS.prototype.exec = function(qrAction, uiStageActionOut) {
    var node = qrAction.getNode();
    this.execEnv.isRollbackExec = qrAction.getIsRollback();

    if (this.jsNodeExecutor.exec(node, this.execEnv)) {
        uiStageActionOut.setActionType(_UI_STAGE_ACTION_OUT.ACTION_TYPES.NONE);
        return true;
    } else return false;
}
