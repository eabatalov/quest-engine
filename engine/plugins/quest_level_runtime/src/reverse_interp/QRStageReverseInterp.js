function QRStageReverseInterp(stageInterp) {
    this.stageInterp = stageInterp;
    this.storyLineRevInterps = [];
};

QRStageReverseInterp.prototype.addStorylineInterp = function(storyLineInterp) {
    this.storyLineRevInterps.push(new QRStoryLineReverseInterp(storyLineInterp));
};

QRStageReverseInterp.prototype.eventStoryLineRevInterp = function(questEvent) {
    var result = null;
    var storyLineInterp = this.stageInterp.eventStoryLineInterp(questEvent);
    for (var i = 0; i < this.storyLineRevInterps.length; ++i) {
        var storyLineRevInterp = this.storyLineRevInterps[i];
        if (storyLineRevInterp.getStoryLineNodeId() === storyLineInterp.getStorylineNode().getId()) {
            result = storyLineRevInterp;
            break;
        }
    }
    return result;
};
