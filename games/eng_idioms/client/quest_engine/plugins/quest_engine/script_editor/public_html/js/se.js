function ScriptEditor($rootScope, seEvents, mouseWheelManager) {
    this.stage1Editor = new SEStageEditor($rootScope, seEvents, mouseWheelManager);
}

function ScriptEditorStaticConstructor(completionCB) {
    completionCB();
}

function ScriptEditorFactory($rootScope, events, mouseWheelManager) {
    return new ScriptEditor($rootScope, events, mouseWheelManager);
}
