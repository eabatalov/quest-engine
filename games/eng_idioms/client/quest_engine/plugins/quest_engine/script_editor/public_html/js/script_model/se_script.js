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
    var script = new SEScript(savedData.name);
    for (var i = 0; i < savedData.stages.length; ++i) {
        var stage = savedData.stages[i];
        script.stages.push(SEStage.load(stage));
    }
    return script;
};

SEScript.prototype.delete = function() {
    for (var i = 0; i < this.stages.length; ++i) {
        var stage = this.stages[i];
        this.deleteStage(stage);
    }
    delete this.stages;
    jQuery.each(this.events, function(ix, ev) {
        ev.delete();
    });
    delete this.events;
    delete this.name;
};

SEScript.prototype.getName = function() {
    return this.name;
};

SEScript.prototype.getStages = function() {
    return this.stages;
};

SEScript.prototype.getStageById = function(stageId) {
    return jQuery.grep(this.stages, function(stage, ix) {
        return stage.getId() === stageId;
    })[0];
};

SEScript.prototype.createStage = function(name) {
    var stage = new SEStage(name);
    this.events.stageAdded.publish(stage);
    this.stages.push(stage);
    return stage;
};

SEScript.prototype.deleteStage = function(delStage) {
    for (var i = 0; i < this.stages.length; ++i) {
        var stage = this.stages[i];
        if (stage.getId() === delStage.getId()) {
            this.stages.splice(i, 1);
            this.events.stageDeleted.publish(stage);
        }
    }
};

SEScript.prototype.moveStageAfter = function(stageAfter, stageToMove) {
    //TODO
    throw "Not implemented";
    this.events.stagesReordered.publish();
};
