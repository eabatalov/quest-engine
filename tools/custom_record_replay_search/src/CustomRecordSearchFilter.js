function CustomRecordSearchFilter(recordType) {
    this._recordType = recordType;
}

CustomRecordSearchFilter.prototype.process = function(replayFileInfo) {
    var isRecordFoundInReplay = false;
    var replay = replayFileInfo.getReplay();
    var recHistory = replay.getGameplayHistory();
    for(var i = recHistory.recCnt() - 1; i >= 0; i--)
    {
        var rec = recHistory.recAt(i);
        if (rec.getRecordType() == CustomGameplayRecord.type &&
            rec.getCustomType() == this._recordType) {
            if (!isRecordFoundInReplay) {
                isRecordFoundInReplay = true;
                console.log();
                console.log(replayFileInfo.getFilePath());
            }
            console.log("Custom type:", rec.getCustomType());
            console.log("Custom data:", rec.getCustomData());
        }
    }
    return isRecordFoundInReplay;
};
