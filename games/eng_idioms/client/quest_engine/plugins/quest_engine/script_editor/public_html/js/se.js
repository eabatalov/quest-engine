function ScriptEditor(script, seEventRouter, mouseWheelManager) {
    this.seEventRouter = seEventRouter;
    this.mouseWheelManager = mouseWheelManager;
    this.seEvents = this.seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP_SCRIPT_EDTIOR);
    this.seEvents.on(this.onSeEvent, this);

    this.script = script;

    this.stageEditors = {};
    for (var i = 0; i < this.script.getStages().length; ++i) {
        var stage = this.script.getStages()[i];
        this.stageEditors[stage.getId()] =
            new SEStageEditor(stage, this.seEventRouter, this.mouseWheelManager);
        this.stageEditors[stage.getId()].setEnable(false);
    }
    this.currentStage = null;

    if (this.script.getStages().length > 0)
        this.setCurrentStage(this.script.getStages()[0]);
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

ScriptEditor.prototype.setCurrentStage = function(stage) {
    if (this.currentStage) {
        this.stageEditors[this.currentStage.getId()].setEnable(false);
    }
    this.currentStage = stage;
    this.seEventRouter.setCurrentStageAddr(this.stageEditors[stage.getId()].getAddr());
    this.stageEditors[this.currentStage.getId()].setEnable(true);
};

ScriptEditor.prototype.getCurrentStage = function() {
    return this.currentStage;
};

ScriptEditor.prototype.onSeEvent = function(args) {
    if (args.name === "NEW_STAGE") {
        var stage = this.script.createStage("New stage");
        var stageEditor = new SEStageEditor(stage, this.seEventRouter, this.mouseWheelManager);
        this.stageEditors[stage.getId()] = stageEditor;
        stageEditor.setEnable(false);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_CREATED", stage : stage });
        return;
    }

    if (args.name === "DEL_STAGE") {

    }

    if (args.name === "STAGE_CHANGE") {
        assert(this.getCurrentStage().getId() === args.fromStage.getId());
        this.setCurrentStage(args.toStage);
        this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_CHANGED", stage : args.toStage});
        return;
    }

    if (args.name === "MOVE_STAGE_AFTER") {
        return;
    }
};

function ScriptEditorStaticConstructor(completionCB) {
    completionCB();
}

function ScriptEditorFactory(events, mouseWheelManager) {
    return new ScriptEditor(events, mouseWheelManager);
}
