function LevelGameplayRecorder(levelSctiptExec) {
    this.levelSctiptExec = levelSctiptExec;
    this.gameplayHistory = new LevelGameplayHistory();
};

LevelGameplayRecorder.prototype.getGameplayHistory = function() {
    return this.gameplayHistory;
};

LevelGameplayRecorder.prototype.addRecord = function(rec) {
    this.gameplayHistory.addRecord(rec);
};
