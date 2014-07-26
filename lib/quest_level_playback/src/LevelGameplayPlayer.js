function LevelGameplayPlayer(scriptExec) {
    this.scriptExec = scriptExec;
    this.levelGameplayHist = null;
    this.playbackEmuTimeMs = 0;
    this.lastMsToNextRecord = 0;
    this.currentRecordIx = 0; //Points to the first not played record
    this.isPlaying = false;

    this.onPlayCurrentRecordFunc = this._onPlayCurrentRecord.bind(this);

    this.events = {
        changePlayerPos : new SEEvent(/*x, y*/)
    };
}

//Only one call per instance is allowed
LevelGameplayPlayer.prototype.setLevelHist = function(levelGameplayHist) {
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
    setTimeout(this.onPlayCurrentRecordFunc, this.lastMsToNextRecord);
};

LevelGameplayPlayer.prototype._onPlayCurrentRecord = function() {
    if (!this.isPlaying)
        return;

    this.playbackEmuTimeMs += this.lastMsToNextRecord;
    this.lastMsToNextRecord = 0;
    var currentRecord = this.levelGameplayHist.recAt(this.currentRecordIx);
    switch(currentRecord.getRecordType()) {
        case LevelGameplayRecord.TYPES.PLAYER_POSITION:
            this.events.changePlayerPos.publish(
                currentRecord.getPlayerX(),
                currentRecord.getPlayerY()
            );
        break;
        case LevelGameplayRecord.TYPES.QUEST_EVENT:
            this.scriptExec.questEventExec(currentRecord.getQuestEvent());
        break;
        default:
            assert(false, "Unknown record type");
    }
    ++this.currentRecordIx;
    this._scheduleCurrentRecord();
};
