function PlayerIdSearchFilter(playerId) {
    this._playerId = playerId;
}

PlayerIdSearchFilter.prototype.pass = function(replayFileInfo) {
    var replay = replayFileInfo.getReplay();
    var recHistory = replay.getGameplayHistory();
    for(var i = recHistory.recCnt() - 1; i >= 0; i--)
    {
        var rec = recHistory.recAt(i);
        if (rec.getRecordType() == CustomGameplayRecord.type &&
            rec.getCustomType() == "PLAYER_ID") {
            var playerId = rec.getCustomData();
            if (playerId == this._playerId) {
                return true;
            }
        }
    }
    return false;
};
