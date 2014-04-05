function SEStage(name) {
    this.id = SEStage.stageIDCounter++;
    this.name = name;
}

SEStage.prototype.getName = function() {
    return this.name;
};

SEStage.prototype.getID = function() {
    return this.id;
};

SEStage.prototype.setName = function(val) {
    this.name = val;
};

SEStage.stageIDCounter = 0;
