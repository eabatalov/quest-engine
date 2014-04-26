function UIStageActionManager() {
	this.curStageName = null;
    //stage name -> { in : UIStageActionIn, out : UIStageActionOut }
	this.uiStageActions = {};
};

UIStageAction.prototype.getCurrentStageUIActionIN = function() {
    return this.uiStageActions[this.curStageName].in;
};

UIStageAction.prototype.getCurrentStageUIActionOUT = function() {
    return this.uiStageActions[this.curStageName].out;
};

UIStageActionManager.prototype.setCurrentStageName(stageName) {
    if (!(stageName in this.uiStageActions)) {
        this.uiStageActions[stageName] = {
            in : new UIStageActionIn(stageName),
            out : new UIStageActionOut(stageName)
        };
    }
	this.curStageName = stageName;
};

UIStageActionManager.prototype.getCurrentStageName = function() {
    return this.curStageName;
};
