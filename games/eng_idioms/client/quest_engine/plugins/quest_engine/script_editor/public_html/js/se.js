function ScriptEditor(seEventRouter, mouseWheelManager) {
    this.inputManager = new SEInputManager(seEventRouter);
    this.stage1Editor = new SEStageEditor(seEventRouter, mouseWheelManager);
}

function ScriptEditorStaticConstructor(completionCB) {
    completionCB();
}

function ScriptEditorFactory($rootScope, events, mouseWheelManager) {
    return new ScriptEditor($rootScope, events, mouseWheelManager);
}
