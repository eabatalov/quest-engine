ReplayServerSession.ReplayCollector = function(clientInfo) {
    this.clientInfo = clientInfo;
};

ReplayServerSession.ReplayCollector.prototype.replayRecordListReady = function(recordList) {
    logger.info(JSON.stringify(recordList, null, 4));
};

//Also saves the replay to FS
ReplayServerSession.ReplayCollector.prototype.finish = function() {

};
