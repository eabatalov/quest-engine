function LevelReplayPlayer() {
    this.levelGameplayHist = null;
    this.playbackSpeed = 1.0;
    this.playbackEmuTimeMs = 0;
    this.lastMsToNextRecord = 0;
    this.currentRecordIx = 0; //Points to the first not played record
    this.isPlaying = false;

    this.onPlayCurrentRecordFunc = this._onPlayCurrentRecord.bind(this);

    this.events = {
        //Subclasses fire it when needed
        recReady : new SEEvent(/*LevelGameplayHistoryRecord*/)
    };

}

LevelReplayPlayer.prototype.setReplay = function(levelReplay) {
    this.currentRecordIx = 0;
    this.playbackEmuTimeMs = 0;
    this.levelReplay = levelReplay;
    this.levelGameplayHist = levelReplay.getGameplayHistory();
    this.stop();
};

LevelReplayPlayer.prototype.stop = function() {
    this.isPlaying = false;
};

LevelReplayPlayer.prototype.play = function() {
    this.isPlaying = true;
    this._scheduleCurrentRecord();
};

LevelReplayPlayer.prototype.getPositionMs = function() {
    return this.playbackEmuTimeMs;
};

LevelReplayPlayer.prototype.speedUp = function() {
    this._setSpeed(this.playbackSpeed * 1.2);
};

LevelReplayPlayer.prototype.speedDown = function() {
    this._setSpeed(this.playbackSpeed / 1.2);
};

LevelReplayPlayer.prototype.getSpeed = function() {
    return this.playbackSpeed;
};

LevelReplayPlayer.prototype._setSpeed = function(newSpeed) {
    this.playbackSpeed = newSpeed;
    console.log('Current playback speed: ', this.playbackSpeed,
        "Speed won't change untill next event is played with current speed");
};

LevelReplayPlayer.prototype._scheduleCurrentRecord = function() {
    if (this.currentRecordIx >= this.levelGameplayHist.recCnt()) {
        this.stop();
        return;
    }
    this.lastMsToNextRecord =
        this.levelGameplayHist.recAt(this.currentRecordIx).getTimeStampMs() -
        this.playbackEmuTimeMs;
    assert(this.lastMsToNextRecord >= 0,
        "Level gameplay time emulation doesn't go faster then records are executed");
    setTimeout(this.onPlayCurrentRecordFunc,
        Math.floor(this.lastMsToNextRecord / this.playbackSpeed));
};

LevelReplayPlayer.prototype._onPlayCurrentRecord = function() {
    if (!this.isPlaying)
        return;

    this.playbackEmuTimeMs += this.lastMsToNextRecord;
    this.lastMsToNextRecord = 0;
    var currentRecord = this.levelGameplayHist.recAt(this.currentRecordIx);

    this._playRecord(currentRecord);

    ++this.currentRecordIx;
    this._scheduleCurrentRecord();
};
