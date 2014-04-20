function ScriptEditor(script, seEventRouter, mouseWheelManager, /* internal use */ load) {
    this.seEventRouter = seEventRouter;
    this.mouseWheelManager = mouseWheelManager;
    this.seEvents = this.seEventRouter.createEP(SE_ROUTER_EP_ADDR.CONTROLS_GROUP_SCRIPT_EDTIOR);
    this.seEvHandler = this.seEvents.on(this.onSeEvent, this);
    this.script = script;
    this.stageEditors = {};
    this.currentStage = null;

    if (load)
        return;

    for (var i = 0; i < this.script.getStages().length; ++i) {
        var stage = this.script.getStages()[i];
        this.stageEditors[stage.getId()] =
            new SEStageEditor(stage, this.seEventRouter, this.mouseWheelManager);
        this.stageEditors[stage.getId()].setEnable(false);
    }

    if (this.script.getStages().length > 0)
        this.setCurrentStage(this.script.getStages()[0]);
}

ScriptEditor.prototype.save = function() {
    var savedData = {
        ver : 1,
        currentStageId : this.currentStage.getId(),
        stageEditors : [],
        stageIds : []
    };
    jQuery.each(this.stageEditors, function(ix, stageEditor) {
        savedData.stageEditors.push(stageEditor.save());
        savedData.stageIds.push(stageEditor.getStage().getId());
    });
    return savedData;
};

ScriptEditor.load = function(script, seEventRouter, mouseWheelManager, savedData) {
    assert(savedData.ver === 1);
    var scriptEditor = new ScriptEditor(script, seEventRouter, mouseWheelManager, true);
    for (var i = 0; i < savedData.stageEditors.length; ++i) {
        var savedStageEditor = savedData.stageEditors[i];
        var stage = script.getStageById(savedData.stageIds[i]);
        var stageEditor = SEStageEditor.load(stage, seEventRouter, mouseWheelManager, savedStageEditor);
        scriptEditor.stageEditors[stage.getId()] = stageEditor;
        stageEditor.setEnable(false);
    }
    return scriptEditor;
};

ScriptEditor.prototype.delete = function() {
    this.seEvHandler.delete();
    delete this.seEvHandler;
    this.seEvents.delete();
    delete this.seEvents;
    jQuery.each(this.stageEditors, function(ix, stageEditor) {
        stageEditor.delete();
    });
    delete this.stageEditors;
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
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_CHANGED", stage : stage});
};

ScriptEditor.prototype.getCurrentStage = function() {
    return this.currentStage;
};

ScriptEditor.prototype.newStage = function(stageName) {
    stageName = stageName || "New stage";

    var stage = this.script.createStage(stageName);
    var stageEditor = new SEStageEditor(stage, this.seEventRouter, this.mouseWheelManager);
    this.stageEditors[stage.getId()] = stageEditor;
    stageEditor.setEnable(false);
    this.seEvents.send(SE_ROUTER_EP_ADDR.CONTROLS_GROUP, { name : "STAGE_CREATED", stage : stage });
    this.setCurrentStage(stage);
};

ScriptEditor.prototype.onSeEvent = function(args) {
    if (args.name === "NEW_STAGE") {
        this.newStage();
        return;
    }

    if (args.name === "DEL_STAGE") {

    }

    if (args.name === "STAGE_CHANGE") {
        if (args.fromStage && this.currentStage)
            assert(this.currentStage.getId() === args.fromStage.getId());
        var toStage = args.toStage || this.script.getStages()[0];
        this.setCurrentStage(toStage);
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
