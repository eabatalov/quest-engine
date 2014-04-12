function ScriptEditor(script, seEventRouter, mouseWheelManager) {
    this.seEventRouter = seEventRouter;
    this.seEvents = this.seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP_SCRIPT_EDTIOR);
    this.seEvents.on(this.onSeEvent, this);

    this.script = script;

    this.stageEditors = [];
    for (var i = 0; i < this.script.getStages().length; ++i) {
        var stage = this.script.getStages()[i];
        this.stageEditors.push(
            new SEStageEditor(stage, seEventRouter, mouseWheelManager)
        );
    }
}

ScriptEditor.prototype.save = function() {
    var savedData = {};
    return savedData;
};

ScriptEditor.load = function(savedData) {
    return null;
};

ScriptEditor.prototype.getScript = function() {
    return this.script;
};

ScriptEditor.prototype.setCurrentStageIx = function(ix) {
    this.seEventRouter.setCurrentStageAddr(this.stageEditors[ix].getAddr());
};

ScriptEditor.prototype.onSeEvent = function(args) {
    if (args.name === "NEW_STAGE") {
        return;
    }

    if (args.name === "CHANGE_CURRENT_STAGE") {
        //stage.getScene()
        return;
    }
};

function ScriptEditorStaticConstructor(completionCB) {
    completionCB();
}

function ScriptEditorFactory(events, mouseWheelManager) {
    return new ScriptEditor(events, mouseWheelManager);
}
