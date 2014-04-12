/*
 * Persistent singleton service running all the lifetime of script editor application
 */
function ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager) {
    this.userInteractionManager = userInteractionManager;
    this.mouseWheelManager = mouseWheelManager;
    this.seEventRouter = seEventRouter;

    //On application bootstrap we always create script editor with default contents
    this.script = new SEScript("Default script name"); 
    this.script.createStage("New stage");

    this.scriptEditor = new ScriptEditor(this.script, this.seEventRouter, this.mouseWheelManager);
};

ScriptEditorService.prototype.getSE = function() {
    return this.scriptEditor;
};

function ScriptEditorServiceFactory(seEventRouter, mouseWheelManager, userInteractionManager) {
    return new ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager);
}
