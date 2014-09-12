ReplayServerSession.ReplayCollector = function(replayInfo) {
    this.replayInfo = replayInfo;
    this.history = new LevelGameplayHistory();
};

ReplayServerSession.ReplayCollector.prototype.replayRecordListReady = function(recordList) {
    //logger.info(JSON.stringify(recordList, null, 4));
    for (var i = 0; i < recordList.length; ++i) {
        var record = recordList[i];
        this.history.addRecord(record);
    }
};

ReplayServerSession.ReplayCollector.prototype.mkReplayFileName = function() {
    var crypto = require('crypto');

    var replayFileName = 'replay_'
        + this.replayInfo.getLevelName() + '_'
        + this.replayInfo.getTimeStampStr() + '_'
        + crypto.randomBytes(3)
            .toString('hex')
            .slice(0, 6)
        + ".json";
    return replayFileName;
};

ReplayServerSession.ReplayCollector.prototype.finish = function() {
    var fs = require('fs');

    this.replayInfo.setTimeStampStr(null);

    var replay = new LevelReplay(this.history, this.replayInfo);
    var replaySaved = replay.save();
    var replaySavedStr = JSON.stringify(replaySaved);
    var replayFilePath = REPLAY_SERVER_CONFIG.REPLAY_DIR + this.mkReplayFileName();

    var replayFile = fs.openSync(replayFilePath, 'w');
    var replayFileContentBuffer = new Buffer(replaySavedStr);
    fs.writeSync(replayFile, replayFileContentBuffer,
        0, replayFileContentBuffer.length, null);
    fs.closeSync(replayFile);
};
