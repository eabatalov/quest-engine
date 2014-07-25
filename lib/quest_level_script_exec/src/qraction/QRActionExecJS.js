function QRActionExecJS() {
    this.jsNodeExecutor = new QuestScriptNodeExecJS();
    this.execEnv = new QuestScriptNodeExecJSEnv();
}

QRActionExecJS.prototype.exec = function(qrAction, uiStageActionOut) {
    if (qrAction.getType() !== _QR_ACTION_TYPES.FUNC_CALL ||
        qrAction.source !== SEFuncCallNode.sources.js)
        return;

    this.jsNodeExecutor.jsFuncExec(
        qrAction.name,
        qrAction.source,
        qrAction.params,
        this.execEnv
    );
    qrAction.setType(_QR_ACTION_TYPES.NONE);
};
