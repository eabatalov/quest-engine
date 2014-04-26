function UIStageActionManager() {
	this.curStageName = null;
    //stage name -> { in : UIStageActionIn, out : UIStageActionOut }
	this.uiStageActions = {};
};

UIStageActionManager.prototype.getCurrentStageUIActionIN = function() {
    return this.uiStageActions[this.curStageName].in;
};

UIStageActionManager.prototype.getCurrentStageUIActionOUT = function() {
    return this.uiStageActions[this.curStageName].out;
};

UIStageActionManager.prototype.setCurrentStageName = function(stageName) {
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
