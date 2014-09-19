function LevelReplayAnalytics(replay) {
    this._replay = replay;
    this._replayDurationMS = 0;
    this._testerId = null;
    this._coinsCollected = 0;
    this._idiomsGuessed = 0;
    this._idiomsFailed = 0;
    this._minPlayerX = 0;
    this._maxPlayerX = 0;
    this._minPlayerY = 0;
    this._maxPlayerY = 0;
    this._computeAnalytics();
}

LevelReplayAnalytics.prototype.getReplay = function() {
    return this._replay;
};

LevelReplayAnalytics.prototype.getReplayDurationMS = function() {
    return this._replayDurationMS;
};

LevelReplayAnalytics.prototype.getTesterId = function() {
    return this._testerId;
};

LevelReplayAnalytics.prototype.getCoinsCollectedNum = function() {
    return this._coinsCollected;
};

LevelReplayAnalytics.prototype.getGuessedIdiomsNum = function() {
    return this._idiomsGuessed;
};

LevelReplayAnalytics.prototype.getFailedIdiomsNum = function() {
    return this._idiomsFailed;
};

LevelReplayAnalytics.prototype.getMinPlayerX = function() {
    return this._minPlayerX;
};

LevelReplayAnalytics.prototype.getMaxPlayerX = function() {
    return this._maxPlayerX;
};

LevelReplayAnalytics.prototype.getMinPlayerY = function() {
    return this._minPlayerY;
};

LevelReplayAnalytics.prototype.getMaxPlayerY = function() {
    return this._maxPlayerY;
};

LevelReplayAnalytics.prototype._computeAnalytics = function() {
    var history = this._replay.getGameplayHistory();
    var info = this._replay.getReplayInfo();
    //Process Info
    var tidRegexp = /\?tid=(.+)$/;
    var tidMatches = tidRegexp.exec(info.getGameURL());
    this._testerId = tidMatches ? tidMatches[1] : "";

    //Process history
    for(var i = 0; i < history.recCnt(); ++i) {
        var record = history.recAt(i);
        this._replayDurationMS =
            Math.max(this._replayDurationMS, record.getTimeStampMs());
        if (record.getRecordType() === PlayerPositionRecord.type) {
            this._minPlayerX = Math.min(this._minPlayerX, record.getPlayerX());
            this._maxPlayerX = Math.max(this._maxPlayerX, record.getPlayerX());
            this._minPlayerY = Math.min(this._minPlayerY, record.getPlayerY());
            this._maxPlayerY = Math.max(this._maxPlayerY, record.getPlayerY());
        }
        /*if (record.getRecordType() === ) {
              
               this._idiomsGuessed = 0;
               this._idiomsFailed = 0;
        }*/
        if (record.getRecordType() === PlatformerCoinCollectedRecord.type) {
            this._coinsCollected += 1;
        }
    }
};
