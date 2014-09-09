ReplayServerSession.ReplayCollector = function(replayInfo) {
    this.replayInfo = replayInfo;
    //TODO assign hostname here
};

ReplayServerSession.ReplayCollector.prototype.replayRecordListReady = function(recordList) {
    logger.info(JSON.stringify(recordList, null, 4));
};

//Also saves the replay to FS
ReplayServerSession.ReplayCollector.prototype.finish = function() {

};
