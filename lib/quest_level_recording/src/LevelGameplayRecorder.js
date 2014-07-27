function LevelGameplayRecorder(levelSctiptExec) {
    this.levelSctiptExec = levelSctiptExec;
    this.gameplayHistory = new LevelGameplayHistory();

    this.isRecording = false;
    this.qeExecHandler = null;
};

LevelGameplayRecorder.prototype.getGameplayHistory = function() {
    return this.gameplayHistory;
};

LevelGameplayRecorder.prototype.addRecord = function(rec) {
    assert(this.isRecording, "addRecord: is recording allowed");
    this.gameplayHistory.addRecord(rec);
};

LevelGameplayRecorder.prototype.startRecording = function() {
    this.isRecording = true;
    this.qeExecHandler = this.levelSctiptExec.events.
        questEventExec.subscribe(this, this._onQuestEventExec);
};

LevelGameplayRecorder.prototype.stopRecording = function() {
    this.qeExecHandler.delete();
    this.isRecording = false;
};

LevelGameplayRecorder.prototype._onQuestEventExec = function(questEvent) {
    this.addRecord(new QuestEventRecord(questEvent));
};
