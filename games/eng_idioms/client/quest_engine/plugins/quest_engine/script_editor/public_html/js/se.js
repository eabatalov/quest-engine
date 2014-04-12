function ScriptEditor(seEventRouter, mouseWheelManager) {
    this.inputManager = new SEInputManager(seEventRouter);

    //At this point we always create script editor with default contents
    this.script = new SEScript("Default script name"); 
    this.script.newStage("Stage 1");

    this.stageEditors = [];
    for (var i = 0; i < this.script.getStages().length; ++i) {
        var stage = this.script.getStages()[i];
        this.stageEditors.push(
            new SEStageEditor(stage, seEventRouter, mouseWheelManager)
        );
    }
    seEventRouter.setCurrentStageAddr(this.stageEditors[0].getAddr());
}

ScriptEditor.prototype.save = function() {
    var savedData = {};
    return savedData;
};

ScriptEditor.load = function(savedData) {
    return null;
};

function ScriptEditorStaticConstructor(completionCB) {
    completionCB();
}

function ScriptEditorFactory(events, mouseWheelManager) {
    return new ScriptEditor(events, mouseWheelManager);
}
