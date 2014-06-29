/*
 * Persistent singleton service running all the lifetime of script editor application
 */
function ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager) {
    this.userInteractionManager = userInteractionManager;
    this.mouseWheelManager = mouseWheelManager;
    this.seEventRouter = seEventRouter;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);
    this.projectSaver = new SEProjectSaveService(this, seEventRouter);
    this.projectOpener = new SEProjectOpenService(this, seEventRouter);
    this.scriptCompiler = new SEScriptCompiler(this, seEventRouter);

    this.script = new SEScript("story");
    this.scriptEditor = new ScriptEditor(this.script, this.seEventRouter, this.mouseWheelManager);
};

ScriptEditorService.prototype.getSE = function() {
    return this.scriptEditor;
};

ScriptEditorService.prototype.newProject = function() {
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name: "SCRIPT_CHANGED" });
    this.scriptEditor.newStage();
};

ScriptEditorService.prototype.testSaveLoad = testSaveLoad;

function ScriptEditorServiceFactory(seEventRouter, mouseWheelManager, userInteractionManager) {
    return new ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager);
}
