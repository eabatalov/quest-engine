function LevelGameplayRecorder(levelSctiptExec) {
    this.levelSctiptExec = levelSctiptExec;
    this.gameplayHistory = new LevelGameplayHistory();

    this.levelSctiptExec.events.questEventExec.subscribe(this, this.onQuestEventExec);
};

LevelGameplayRecorder.prototype.getGameplayHistory = function() {
    return this.gameplayHistory;
};

LevelGameplayRecorder.prototype.addRecord = function(rec) {
    this.gameplayHistory.addRecord(rec);
};

LevelGameplayRecorder.prototype.onQuestEventExec = function(questEvent) {
    this.addRecord(new QuestEventRecord(questEvent));
};
