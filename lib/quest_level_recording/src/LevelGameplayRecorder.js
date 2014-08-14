function LevelGameplayRecorder(levelGameplayHistory) {
    this.gameplayHistory = levelGameplayHistory;

    this.isRecording = false;
};

LevelGameplayRecorder.prototype.addRecord = function(rec) {
    if (!this.isRecording)
        return;
    this.gameplayHistory.addRecord(rec);
};

LevelGameplayRecorder.prototype.startRecording = function() {
    this.isRecording = true;
};

LevelGameplayRecorder.prototype.stopRecording = function() {
    this.isRecording = false;
};
