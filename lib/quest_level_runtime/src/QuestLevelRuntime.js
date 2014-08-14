function QuestLevelRuntime(questLevel) {
    this.level = questLevel;
    this.levelExecutor = new QuestLevelScriptExecutor(questLevel);
    this.gamePlayHistory = new LevelGameplayHistory();
}

QuestLevelRuntime.prototype.getLevel = function() {
    return this.level;
};

QuestLevelRuntime.prototype.getLevelExecutor = function() {
    return this.levelExecutor;
};

QuestLevelRuntime.prototype.getLevelGameplayHistory = function() {
    return this.gamePlayHistory;
};
