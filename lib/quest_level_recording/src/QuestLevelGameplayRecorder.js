function QuestLevelGameplayRecorder(levelSctiptExec, levelGameplayHistory) {
    LevelGameplayRecorder.call(this, levelGameplayHistory);

    this.levelSctiptExec = levelSctiptExec;
    this.qeExecHandler = null;
};

QuestLevelGameplayRecorder.prototype = new LevelGameplayRecorder(null);

QuestLevelGameplayRecorder.prototype.startRecording = function() {
    LevelGameplayRecorder.prototype.startRecording.call(this);

    this.qeExecHandler = this.levelSctiptExec.events.
        questEventExec.subscribe(this, this._onQuestEventExec);
};

QuestLevelGameplayRecorder.prototype.stopRecording = function() {
    LevelGameplayRecorder.prototype.stopRecording.call(this);

    this.qeExecHandler.delete();
};

QuestLevelGameplayRecorder.prototype._onQuestEventExec = function(questEvent) {
    this.addRecord(new QuestEventRecord(questEvent));
};
