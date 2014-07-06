function UIStageActionIn(name) {
	this.stageName = name;
    this.clearFields();
};

UIStageActionIn.prototype.clearFields = function() {
	this.actionType = "";
	this.targetId = "";
    this.name = ""; //only for CUSTOM_EVENT for now
};

UIStageActionIn.prototype.getStageName = function() {
    return this.stageName;
};

UIStageActionIn.prototype.setActionType = function(actionType) {
    this.actionType = actionType;
};

UIStageActionIn.prototype.getActionType = function() {
    return this.actionType;
};

UIStageActionIn.prototype.setTargetId = function(targetId) {
    this.targetId = targetId;
};

UIStageActionIn.prototype.getTargetId = function() {
    return this.targetId;
};

UIStageActionIn.prototype.setName = function(name) {
    this.name = name;
};

UIStageActionIn.prototype.getName = function() {
    return this.name;
};

UIStageActionIn.prototype.toString = function() {
    return JSON.stringify(this, null, '\t');
};
