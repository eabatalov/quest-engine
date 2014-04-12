function SEScript(name) {
    this.name = name;
    this.stages = [];

    this.events = {
        stageAdded : new SEEvent(), /* function(stage) */
        stageDeleted : new SEEvent(), /* function(stage) */
        stagesReordered : new SEEvent() /* function() */
    };
}

SEScript.prototype.save = function() {
    savedData = {
        ver : 1,
        name : this.name,
        stages : []
    };
    for (var i = 0; i < this.stages.length; ++i) {
        var stage = this.stages[i];
        savedData.stages.push(stage.save());
    }
    return savedData;
};

SEScript.load = function(savedData) {
    assert(savedData.ver === 1);
    var script = new SEScript();
    script.name = savedData.name;
    for (var i = 0; i < savedData.stages.length; ++i) {
        var stage = savedData.stages[i];
        script.stages.push(SEStage.load(stage));
    }
    return script;
};

SEScript.prototype.getName = function() {
    return this.name;
};

SEScript.prototype.getStages = function() {
    return this.stages;
};

SEScript.prototype.createStage = function(name) {
    var stage = new SEStage(name);
    this.events.stageAdded.publish(stage);
    this.stages.push(stage);
    return stage;
};

SEStage.prototype.deleteStage = function(stage) {
    //TODO
    throw "Not implemented";
    this.events.stageDeleted.publish(stage);
};

SEStage.prototype.moveStageAfter = function(stageAfter, stageToMove) {
    //TODO
    throw "Not implemented";
    this.events.stagesReordered.publish();
};
