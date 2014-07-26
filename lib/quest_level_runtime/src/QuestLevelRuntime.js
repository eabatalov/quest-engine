function QuestLevelRuntime(questLevel) {
    this.level = questLevel;
    this.levelExecutor = new QuestLevelScriptExecutor(questLevel);
    this.gamePlayRecorder = new LevelGameplayRecorder(this.levelExecutor);
    this.gamePlayPlayer = new LevelGameplayPlayer(this.levelExecutor);
}

QuestLevelRuntime.prototype.getLevel = function() {
    return this.level;
};

QuestLevelRuntime.prototype.getLevelExecutor = function() {
    return this.levelExecutor;
};

QuestLevelRuntime.prototype.getLevelGameplayRecorder = function() {
    return this.gamePlayRecorder;
};

QuestLevelRuntime.prototype.getLevelGameplayPlayer = function() {
    return this.gamePlayPlayer;
};