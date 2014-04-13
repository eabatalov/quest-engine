/*
 * Persistent singleton service running all the lifetime of script editor application
 */
function ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager) {
    this.userInteractionManager = userInteractionManager;
    this.mouseWheelManager = mouseWheelManager;
    this.seEventRouter = seEventRouter;
    this.seEvents = seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP);

    //On application bootstrap we always create script editor with default contents
    this.script = new SEScript("Default script name"); 
    this.script.createStage("New stage");

    this.scriptEditor = new ScriptEditor(this.script, this.seEventRouter, this.mouseWheelManager);

    //Saving/loading inline testing
    /*var scriptSavedJSON = JSON.stringify(this.script.save(), null, '\t');
    console.log(scriptSavedJSON);
    var scriptEditorSavedJSON = JSON.stringify(this.scriptEditor.save(), null, '\t');
    console.log(scriptEditorSavedJSON);
    this.scriptEditor.delete();
    this.script.delete();
    this.script = SEScript.load(JSON.parse(scriptSavedJSON));
    this.scriptEditor = ScriptEditor.load(
        this.script,
        this.seEventRouter,
        this.mouseWheelManager,
        JSON.parse(scriptEditorSavedJSON)
    );
    var scriptEditorSavedJSONAfterLoad = JSON.stringify(this.scriptEditor.save(), null, '\t');
    var scriptSavedJSONAfterLoad = JSON.stringify(this.script.save(), null, '\t');
    console.log(scriptEditorSavedJSONAfterLoad);
    console.log(scriptSavedJSONAfterLoad);
    assert(scriptEditorSavedJSON === scriptEditorSavedJSONAfterLoad);
    assert(scriptSavedJSON === scriptSavedJSONAfterLoad);*/
};

ScriptEditorService.prototype.getSE = function() {
    return this.scriptEditor;
};

function ScriptEditorServiceFactory(seEventRouter, mouseWheelManager, userInteractionManager) {
    return new ScriptEditorService(seEventRouter, mouseWheelManager, userInteractionManager);
}
