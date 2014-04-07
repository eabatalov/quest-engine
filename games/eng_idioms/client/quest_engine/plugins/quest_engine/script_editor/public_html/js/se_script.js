function SEScript() {
    this.stages = [];
    this.variables = [];
    this.notifications = [];
}

SEScript.prototype.getStages = function() {
    return this.stages;
};

SEScript.prototype.newStage = function(name) {
    return this.stages.push(new SEStage(name));
};
