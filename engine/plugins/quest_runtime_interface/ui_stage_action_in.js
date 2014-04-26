function UIStageActionIn(name) {
	this.stageName = name;
    this.clearFields();
};

UIStageActionIn.prototype.clearFields = function() {
	this.lastPlayerAction = "";
	this.lastActionTargetId = "";
};

UIStageActionIn.prototype.setActionType = function(actionType) {
    this.lastPlayerAction = actionType;
};

UIStageActionIn.prototype.getActionType = function() {
    return this.lastPlayerAction;
};

UIStageActionIn.prototype.setTargetId = function(targetId) {
    this.lastActionTargetId = targetId;
};

UIStageActionIn.prototype.getTargetId = function() {
    return this.lastActionTargetId;
};


