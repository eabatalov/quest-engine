function LevelGameplayPlayer() {
    this.levelGameplayHist = null;
    this.playbackSpeed = 1;
    this.playbackEmuTimeMs = 0;
    this.lastMsToNextRecord = 0;
    this.currentRecordIx = 0; //Points to the first not played record
    this.isPlaying = false;

    this.onPlayCurrentRecordFunc = this._onPlayCurrentRecord.bind(this);
}

LevelGameplayPlayer.prototype.setLevelHist = function(levelGameplayHist) {
    this.currentRecordIx = 0;
    this.playbackEmuTimeMs = 0;
    this.levelGameplayHist = levelGameplayHist;
    this.stop();
};

LevelGameplayPlayer.prototype.stop = function() {
    this.isPlaying = false;
};

LevelGameplayPlayer.prototype.play = function() {
    this.isPlaying = true;
    this._scheduleCurrentRecord();
};

LevelGameplayPlayer.prototype.speedUp = function() {
    this._setSpeed(this.playbackSpeed * 1.2);
};

LevelGameplayPlayer.prototype.speedDown = function() {
    this._setSpeed(this.playbackSpeed / 1.2);
};

LevelGameplayPlayer.prototype._setSpeed = function(newSpeed) {
    this.playbackSpeed = newSpeed;
    console.log('Current playback speed: ', this.playbackSpeed,
        "Speed won't change untill next event is played with current speed");
};

LevelGameplayPlayer.prototype._scheduleCurrentRecord = function() {
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

LevelGameplayPlayer.prototype._onPlayCurrentRecord = function() {
    if (!this.isPlaying)
        return;

    this.playbackEmuTimeMs += this.lastMsToNextRecord;
    this.lastMsToNextRecord = 0;
    var currentRecord = this.levelGameplayHist.recAt(this.currentRecordIx);

    this._playRecord(currentRecord);

    ++this.currentRecordIx;
    this._scheduleCurrentRecord();
};
