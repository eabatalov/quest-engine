function SEScript(name) {
    this.name = name;
    this.stages = [];
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

SEScript.prototype.newStage = function(name) {
    return this.stages.push(new SEStage(name));
};
